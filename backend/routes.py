from flask import Blueprint, request, jsonify
from datetime import datetime
from models import save_system_report, get_latest_reports, get_machine_reports
from utils import flag_issues

system_routes = Blueprint("routes", __name__)

@system_routes.route('/', methods=['GET'])
def home():
    return "Backend Server is working..."

@system_routes.route("/reports", methods=["POST"])
def receive_report():
    data = request.get_json()
    machine_id = data.get("machine_id")

    if not data or "machine_id" not in data:
        return jsonify({"error": "Missing machine_id or data"}), 400

    data["timestamp"] = datetime.utcnow()
    data["issues"] = flag_issues(data)

    save_system_report(machine_id, data)
    return jsonify({"status": "Report received"}), 200


@system_routes.route("/reports", methods=["GET"])
def list_machines():
    machines = get_latest_reports()

    result = [
        {
            "machine_id": m.get("machine_id"),
            "timestamp": m["timestamp"].isoformat() + "Z",
            "os": m.get("os_type"),
            "disk_encryption": m.get("disk_encryption"),
            "issues": m.get("issues", []),
        }
        for m in machines
    ]
    return jsonify(result)


@system_routes.route("/machine/<machine_id>", methods=["GET"])
def get_machine(machine_id):
    reports = get_machine_reports(machine_id)
    return jsonify(reports)