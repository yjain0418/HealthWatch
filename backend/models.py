from db import get_db
from datetime import datetime

def save_system_report(machine_id, report):
    db = get_db()
    print(db)
    report["machine_id"] = machine_id
    report["timestamp"] = datetime.utcnow()
    db.reports.insert_one(report)

def get_latest_reports():
    db = get_db()
    pipeline = [
        {"$sort": {"timestamp": -1}},
        {"$group": {
            "_id": "$machine_id",
            "latest_report": {"$first": "$$ROOT"}
        }}
    ]

    return [doc["latest_report"] for doc in db.reports.aggregate(pipeline)]

def get_machine_reports(machine_id):
    db = get_db()
    reports = list(db.reports.find({"machine_id": machine_id}).sort("timestamp", -1).limit(20))
    for r in reports:
        r["_id"] = str(r["_id"])
        r["timestamp"] = r["timestamp"].isoformat() + "Z"
    return reports