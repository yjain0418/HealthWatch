# System Monitor Agent

This is the **System Monitor** Python agent, a cross-platform utility that runs on client machines (Windows, Linux, macOS) to collect system health data and report it to a backend server.

## Features

- Collects system info such as disk encryption status, OS updates, antivirus status, and sleep settings.
- Detects changes and sends system snapshots periodically to a remote API.
- Supports Windows, Linux, and macOS with platform-specific checks.
- Configurable API endpoint via `.env` file.

## Installation

You can install the agent package directly from PyPI (replace `health-watch` with your package name if different):

```bash
pip install health-watch
```

Or install locally from source:

```bash
git clone https://github.com/yourusername/yourrepo.git
cd yourrepo/system-monitor
pip install .
```

## Configuration

Create a .env file in the health-watch directory with the backend API URL:

```bash
API_URL=http://your-backend-server/reports
```

This tells the agent where to send the system health reports.

## Usage
Runs the agent from the command line:
```bash
python -m health-watch.client.agent
```

The agent will:
 - Start monitoring system health.
 - Send periodic reports only if system state changes.
 - Print logs to the console.
You can stop the agent anytime with Ctrl + C.

## Development
 - All system check logic is inside health-watch/client/system_checks/
 - You can extend platform-specific checks by editing windows.py, linux.py, and macos.py
 - The main runtime script is client/agent.py

## Requirements
 - Python 3.7+
 - Dependencies are listed in requirements.txt

Install dependencies with:
```bash
pip install -r requirements.txt
```

## Troubleshooting
 - If the agent can't find system_checks, verify you installed the package correctly and run with the -m flag.
 - Ensure .env is correctly set with the API endpoint.
 - Check network connectivity to the backend server.

