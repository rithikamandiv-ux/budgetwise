# BudgetWise

A full-stack personal finance management application with AI-powered budget forecasting.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React + TypeScript (Vite) |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| Forecasting | Python + FastAPI |

## Architecture

```
budgetwise/
├── frontend/            # React SPA (port 5173)
├── backend/             # Express API server (port 3001)
├── forecast-service/    # Python FastAPI microservice (port 8000)
└── README.md
```

The Node.js backend serves as the main API layer, communicating with PostgreSQL for data persistence and calling the Python forecast service over HTTP for AI-powered budget predictions.

---

## Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **PostgreSQL** 14+ (running on port 5432)

---

## Getting Started

### 1. Database

Ensure PostgreSQL is running on port **5432** with the BudgetWise database created and tables set up.

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

The backend will start on **http://localhost:3001**.

### 3. Forecast Service

```bash
cd forecast-service

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate          # Windows

# Install dependencies
pip install -r requirements.txt

# Start the service
python3 -m uvicorn app.main:app --reload --port 8000
```

The forecast service will start on **http://localhost:8000**.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on **http://localhost:5173**.

---

## Ports

| Service | Port |
| --- | --- |
| Frontend (Vite) | 5173 |
| Backend (Express) | 3001 |
| Forecast Service (FastAPI) | 8000 |
| PostgreSQL | 5432 |

---

## Verification

```bash
# Health check – forecast service
curl http://localhost:8000/health

# Forecast endpoint – backend
curl "http://localhost:3001/forecast?month=4&year=2026"

# Dashboard – frontend
open http://localhost:5173/dashboard
```
