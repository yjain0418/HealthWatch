# Health Watch – Cross-Platform System Monitoring Platform

**Health Watch** is a comprehensive cross-platform system monitoring solution consisting of:

- **Agent**: A Python utility that runs on client machines (Windows, Linux, macOS) to collect system health data and report it periodically.
- **Backend**: A Flask-based REST API server that receives, stores, and manages system reports.
- **Frontend**: A React/Next.js web dashboard to view, filter, and analyze all reported system data in real-time.

---

## 🚀 Features

### Agent (Client)
- Detects disk encryption status, OS updates, antivirus, and sleep settings.
- Sends system snapshots every 30 minutes only on detected changes.
- Works cross-platform (Windows, Linux, macOS).
- Configurable API endpoint via `.env` file.

### Backend (Server)
- REST API to receive system reports.
- Stores data in MongoDB for fast retrieval.
- Provides API endpoints for frontend data consumption.

### Frontend (Dashboard)
- Displays list of all registered machines.
- Shows real-time health status and last check-in time.
- Supports filtering by OS type and health issues.
- Mobile responsive and user-friendly interface.

---

## 📁 Monorepo Structure

```bash
health-watch/
├── __init__.py 
├── client/ 
│ ├── system_checks/ 
│ ├── __init__.py
│ ├── agent.py
│── requirements.txt
│
├── backend/ # Flask backend API server
│ ├── app.py
│ ├── db.py
│ ├── requirements.txt
│ ├── utils.py
│ ├── models.py
│ └── routes.py
│
├── frontend/ # React/Next.js frontend dashboard
│ ├── app/
│ ├── components/
│ ├── public/
│ ├── next.config.js
│ ├── package.json
│ └── README.md
│
└── README.md # This root README
```


---

## 📦 Installation & Setup

### 1. Agent (Client)

```bash
cd agent
pip install -r requirements.txt
pip install .
```

Create a .env file with your backend API URL:

```bash
API_URL=http://your-backend-url/reports
```

Run the agent:

```bash
python -m health_watch.client.agent
```

### 2. Backend (Server)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

Set environment variables or create .env file (e.g., MongoDB URI).

Run the server:
```bash
flask run
```

### 3. Frontend (Dashboard)
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 to view the dashboard.

## ⚙️ Usage
 - Agent reports system snapshots periodically.
 - Backend stores and exposes data via REST API.
 - Frontend visualizes system health and machine data.


## 🔧 Development Tips
 - Keep .env files out of version control.
 - Use Docker to containerize backend and frontend for easier deployment.
 - Schedule the agent with OS-specific schedulers (cron, Task Scheduler).
 - Secure your API endpoints with authentication (to be implemented).

 ## 📞 Contact & Support

 Feel free to open issues or pull requests for improvements!

