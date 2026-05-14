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

```text
budgetwise/
├── frontend/            # React SPA (port 5173)
├── backend/             # Express API server (port 3001)
├── forecast-service/    # Python FastAPI microservice (port 8000)
└── README.md
```

The Node.js backend serves as the main API layer, communicating with PostgreSQL for data persistence and calling the Python forecast service over HTTP for AI-powered budget predictions.

---

## Features

### Personal Finance Tracking

- Add, view, edit, and delete expenses
- Add, view, edit, and delete income records
- Add, view, edit, and delete monthly budgets
- Store all financial records persistently using PostgreSQL
- Organize expenses and budgets by category
- Track financial data by month and year

### Dashboard

- View total income
- View total expenses
- View total budget amount
- View remaining balance
- Filter dashboard data by selected month and year
- Display category-based budget progress
- Show whether each category is within budget or over budget
- Display smart financial insights
- Display AI-powered budget forecast cards

### Data Visualization

- Bar chart for income, expenses, and budget comparison
- Pie chart for expense distribution by category
- Category progress bars for budget usage
- Dark themed chart styling
- Empty-state handling when no chart data is available

### AI-Powered Forecasting

BudgetWise includes a separate Python FastAPI forecasting service that provides intelligent finance insights.

The forecast service currently supports:

- Monthly overspending prediction
- Smart budget suggestions

The Node.js backend collects data from PostgreSQL, sends the required financial data to the Python forecast service, receives the prediction results, and returns them to the React dashboard.

### Monthly Overspending Prediction

This feature predicts whether the user may exceed a budget before the month ends.

It uses:

- budget limit
- amount spent so far
- days passed in the month
- total days in the month

Example result:

```json
{
  "category": "Food",
  "will_overspend": true,
  "predicted_monthly_spending": 44000,
  "predicted_overspend_amount": 14000,
  "risk_level": "High"
}
```

### Smart Budget Suggestions

This feature suggests a more realistic budget based on previous spending patterns.

It uses:

- current budget
- past monthly spending
- safety margin percentage

Example result:

```json
{
  "category": "Food",
  "current_budget": 30000,
  "average_past_spending": 32333.33,
  "suggested_budget": 36000
}
```

### User Interface

- Modern dark finance dashboard interface
- Left sidebar navigation
- Card-based layout
- Responsive dashboard sections
- Custom styled forms, inputs, and buttons
- Modal-based add/edit interactions
- Blurred dark background styling
- Improved spacing and readability across dashboard sections

---

## Main Pages

### Dashboard

The dashboard provides a complete overview of the selected month, including totals, charts, smart insights, AI budget forecasts, and category tracking.

### Expenses

The expenses page allows users to manage expense records with category, amount, and date information.

### Income

The income page allows users to manage income sources with amount and date information.

### Budgets

The budgets page allows users to set monthly category budgets using category, budget limit, month, and year.

---

## Backend API Overview

### Expenses

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/expenses` | Get expenses |
| POST | `/expenses` | Create expense |
| PUT | `/expenses/:id` | Update expense |
| DELETE | `/expenses/:id` | Delete expense |

### Income

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/income` | Get income records |
| POST | `/income` | Create income record |
| PUT | `/income/:id` | Update income record |
| DELETE | `/income/:id` | Delete income record |

### Budgets

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/budgets` | Get budgets |
| POST | `/budgets` | Create budget |
| PUT | `/budgets/:id` | Update budget |
| DELETE | `/budgets/:id` | Delete budget |

### Summary

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/summary?month=&year=` | Get monthly dashboard summary |

### Forecast

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/forecast?month=&year=` | Get monthly AI budget forecasts |

---

## Forecast Service API Overview

The Python FastAPI service runs separately on port `8000`.

### Health Check

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Check if forecast service is running |

### Overspending Prediction

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/predict-overspending` | Predict monthly overspending risk |

### Budget Suggestion

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/suggest-budget` | Suggest a better budget based on spending history |

FastAPI Swagger documentation is available at:

```text
http://localhost:8000/docs
```

---

## Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL 14+ running on port 5432

---

## Getting Started

### 1. Database

Ensure PostgreSQL is running on port `5432` with the BudgetWise database created and tables set up.

Recommended database name:

```sql
budgetwise
```

The project requires these main tables:

- expenses
- income
- budgets

If you are setting up the project on a new machine, create the database and required tables before running the backend.

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

The backend will start on:

```text
http://localhost:3001
```

### 3. Forecast Service

```bash
cd forecast-service

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the service
python3 -m uvicorn app.main:app --reload --port 8000
```

For Windows:

```bash
venv\Scripts\activate
```

The forecast service will start on:

```text
http://localhost:8000
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on:

```text
http://localhost:5173
```

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
# Health check - forecast service
curl http://localhost:8000/health

# Forecast endpoint - backend
curl "http://localhost:3001/forecast?month=4&year=2026"

# Dashboard - frontend
open http://localhost:5173/dashboard
```

---

## Environment Variables

Real credentials should not be committed to GitHub.

Use a local `.env` file for sensitive values such as database credentials.

Example:

```env
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/budgetwise
PORT=3001
```

The `.env` file should stay ignored by Git.

---

## Project Structure

```text
budgetwise/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       ├── db.ts
│       └── server.ts
│
├── frontend/
│   └── src/
│       ├── pages/
│       ├── App.tsx
│       └── App.css
│
├── forecast-service/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   └── requirements.txt
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## Future Improvements

- User authentication and individual user accounts
- Better historical spending analysis
- More advanced machine learning models
- Export reports as PDF or CSV
- Recurring income and recurring expenses
- Monthly savings goals
- Mobile responsiveness improvements
- Deployment with Docker or cloud hosting

---

## License

This project is licensed under the MIT License.

See the `LICENSE` file for more details.
