def flag_issues(report):
    issues = []

    if not report.get("disk_encryption", True):
        issues.append("Disk not encrypted")

    if report.get("os_updates", False):
        issues.append("OS is outdated")

    antivirus_enabled = report.get("antivirus_status", {}).get("AntivirusEnabled", True)
    if not antivirus_enabled:
        issues.append("Antivirus not present")

    sleep = report.get("sleep_settings", {})
    ac_seconds = sleep.get("ac_time")
    dc_seconds = sleep.get("dc_time")

    if ac_seconds is not None and ac_seconds > 600:
        issues.append("Inactivity sleep timeout on AC")
    if dc_seconds is not None and dc_seconds > 600:
        issues.append("Inactivity sleep timeout on DC")

    return issues