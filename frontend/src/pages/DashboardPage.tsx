import { useEffect, useState } from "react";
import "./DashboardPage.css";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

type CategorySummaryItem = {
    category: string;
    budget: number;
    spent: number;
    remaining: number;
    isOverBudget: boolean;
    progressPercentage: number;
};

type Summary = {
    totalExpenses: number;
    totalIncome: number;
    totalBudgets: number;
    remainingBalance: number;
    categorySummary: CategorySummaryItem[];
};

type OverspendingPrediction = {
    category: string;
    budget_limit: number;
    spent_so_far: number;
    predicted_monthly_spending: number;
    will_overspend: boolean;
    predicted_overspend_amount: number;
    risk_level: string;
    message: string;
};

type BudgetSuggestion = {
    category: string;
    current_budget: number;
    average_past_spending: number;
    suggested_budget: number;
    message: string;
};

type ForecastItem = {
    category: string;
    currentBudget: number;
    spentSoFar: number;
    overspendingPrediction: OverspendingPrediction;
    budgetSuggestion: BudgetSuggestion;
};

type ForecastResponse = {
    month: number;
    year: number;
    daysPassed: number;
    totalDaysInMonth: number;
    forecasts: ForecastItem[];
};

function DashboardPage() {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [forecast, setForecast] = useState<ForecastResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [forecastError, setForecastError] = useState("");

    const [selectedMonth, setSelectedMonth] = useState("4");
    const [selectedYear, setSelectedYear] = useState("2026");

    const fetchSummary = (month: string, year: string) => {
        setLoading(true);
        setError("");

        fetch(`http://localhost:3001/summary?month=${month}&year=${year}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch summary");
                }

                return res.json();
            })
            .then((data) => {
                setSummary(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load dashboard summary");
                setLoading(false);
            });
    };

    const fetchForecast = (month: string, year: string) => {
        setForecastError("");

        fetch(`http://localhost:3001/forecast?month=${month}&year=${year}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch forecast");
                }

                return res.json();
            })
            .then((data) => {
                setForecast(data);
            })
            .catch(() => {
                setForecastError("Could not load forecast data");
            });
    };

    useEffect(() => {
        fetchSummary(selectedMonth, selectedYear);
        fetchForecast(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]);

    const handleRefresh = () => {
        fetchSummary(selectedMonth, selectedYear);
        fetchForecast(selectedMonth, selectedYear);
    };

    const formatCurrency = (amount: number) => {
        return "Rs. " + amount.toLocaleString("en-IN");
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-error">
                    <span className="error-icon">⚠️</span>
                    <p className="error-text">{error}</p>
                </div>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-error">
                    <p className="error-text">No summary data found.</p>
                </div>
            </div>
        );
    }

    const overviewChartData = [
        {
            name: "Overview",
            Income: summary.totalIncome,
            Expenses: summary.totalExpenses,
            Budget: summary.totalBudgets
        }
    ];

    const expenseCategoryChartData = summary.categorySummary
        .filter((item) => item.spent > 0)
        .map((item) => ({
            name: item.category,
            value: item.spent
        }));

    const topSpendingCategory = [...summary.categorySummary].sort(
        (a, b) => b.spent - a.spent
    )[0];

    const overBudgetCount = summary.categorySummary.filter(
        (item) => item.isOverBudget
    ).length;

    const savingsRate =
        summary.totalIncome > 0
            ? Math.round((summary.remainingBalance / summary.totalIncome) * 100)
            : 0;

    const PIE_COLORS = ["#d6b68a", "#22c55e", "#3b82f6", "#a855f7", "#ef4444"];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="header-top">
                    <div>
                        <h1 className="dashboard-title">Dashboard</h1>

                        <p className="selected-period">
                            Showing data for{" "}
                            <strong>
                                {new Date(
                                    Number(selectedYear),
                                    Number(selectedMonth) - 1
                                ).toLocaleString("en-US", {
                                    month: "long",
                                    year: "numeric"
                                })}
                            </strong>
                        </p>
                    </div>

                    <div className="header-controls">
                        <div className="filters-bar">
                            <select
                                className="filter-select"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                <option value="1">Jan</option>
                                <option value="2">Feb</option>
                                <option value="3">Mar</option>
                                <option value="4">Apr</option>
                                <option value="5">May</option>
                                <option value="6">Jun</option>
                                <option value="7">Jul</option>
                                <option value="8">Aug</option>
                                <option value="9">Sep</option>
                                <option value="10">Oct</option>
                                <option value="11">Nov</option>
                                <option value="12">Dec</option>
                            </select>

                            <input
                                className="filter-input"
                                type="number"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                placeholder="Year"
                            />
                        </div>

                        <button onClick={handleRefresh} className="app-btn">
                            ↻ Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <div className="card-accent card-accent--income"></div>
                    <p className="card-label">Total Income</p>
                    <p className="card-value card-value--income">
                        {formatCurrency(summary.totalIncome)}
                    </p>
                </div>

                <div className="dashboard-card">
                    <div className="card-accent card-accent--expenses"></div>
                    <p className="card-label">Total Expenses</p>
                    <p className="card-value card-value--expenses">
                        {formatCurrency(summary.totalExpenses)}
                    </p>
                </div>

                <div className="dashboard-card">
                    <div className="card-accent card-accent--budget"></div>
                    <p className="card-label">Total Budget</p>
                    <p className="card-value card-value--budget">
                        {formatCurrency(summary.totalBudgets)}
                    </p>
                </div>

                <div className="dashboard-card">
                    <div className="card-accent card-accent--balance"></div>
                    <p className="card-label">Remaining Balance</p>
                    <p
                        className={
                            "card-value " +
                            (summary.remainingBalance >= 0
                                ? "card-value--balance-positive"
                                : "card-value--balance-negative")
                        }
                    >
                        {formatCurrency(summary.remainingBalance)}
                    </p>
                </div>
            </div>

            <div className="charts-section">
                <div className="chart-card">
                    <h2>Income vs Expenses vs Budget</h2>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={overviewChartData}>
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />

                            <Tooltip
                                cursor={{ fill: "transparent" }}
                                contentStyle={{
                                    backgroundColor: "#252636",
                                    border: "1px solid #2a2b38",
                                    borderRadius: "10px",
                                    color: "#f9fafb"
                                }}
                                labelStyle={{ color: "#9ca3af" }}
                            />

                            <Legend />

                            <Bar dataKey="Income" fill="#22c55e" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="Budget" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h2>Expenses by Category</h2>

                    {expenseCategoryChartData.length === 0 ? (
                        <p className="empty-chart-text">No expense data for this month.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={expenseCategoryChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={110}
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {expenseCategoryChartData.map((entry, index) => (
                                        <Cell
                                            key={entry.name}
                                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#252636",
                                        border: "1px solid #2a2b38",
                                        borderRadius: "8px",
                                        color: "#f9fafb"
                                    }}
                                />

                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div className="insights-section">
                <h2 className="insights-title">Smart Insights</h2>

                <div className="insights-grid">
                    <div className="insight-card">
                        <p className="insight-label">Top Spending Category</p>
                        <h3>
                            {topSpendingCategory
                                ? topSpendingCategory.category
                                : "No spending yet"}
                        </h3>
                        <p>
                            {topSpendingCategory
                                ? `${formatCurrency(topSpendingCategory.spent)} spent`
                                : "Add expenses to see insights"}
                        </p>
                    </div>

                    <div className="insight-card">
                        <p className="insight-label">Budget Status</p>
                        <h3>
                            {overBudgetCount === 0
                                ? "All budgets are safe"
                                : `${overBudgetCount} over budget`}
                        </h3>
                        <p>
                            {overBudgetCount === 0
                                ? "You are staying within your planned limits"
                                : "Review overspending categories"}
                        </p>
                    </div>

                    <div className="insight-card">
                        <p className="insight-label">Savings Rate</p>
                        <h3>{savingsRate}%</h3>
                        <p>
                            {savingsRate >= 20
                                ? "Strong savings performance"
                                : "Try to reduce expenses this month"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="forecast-section">
                <h2 className="forecast-title">AI Budget Forecast</h2>

                {forecastError ? (
                    <p className="forecast-error">{forecastError}</p>
                ) : !forecast || forecast.forecasts.length === 0 ? (
                    <p className="forecast-empty">
                        No forecast data available for this month.
                    </p>
                ) : (
                    <div className="forecast-grid">
                        {forecast.forecasts.map((item) => (
                            <div className="forecast-card" key={item.category}>
                                <div className="forecast-card-header">
                                    <h3>{item.category}</h3>

                                    <span
                                        className={
                                            "risk-badge " +
                                            (item.overspendingPrediction.risk_level === "High"
                                                ? "risk-high"
                                                : item.overspendingPrediction.risk_level === "Medium"
                                                    ? "risk-medium"
                                                    : "risk-low")
                                        }
                                    >
                                        {item.overspendingPrediction.risk_level} Risk
                                    </span>
                                </div>

                                <div className="forecast-metrics">
                                    <div className="forecast-metric">
                                        <span className="forecast-metric-label">Current Budget</span>
                                        <span className="forecast-metric-value">
                                            {formatCurrency(item.currentBudget)}
                                        </span>
                                    </div>

                                    <div className="forecast-metric">
                                        <span className="forecast-metric-label">Spent So Far</span>
                                        <span className="forecast-metric-value">
                                            {formatCurrency(item.spentSoFar)}
                                        </span>
                                    </div>

                                    <div className="forecast-metric">
                                        <span className="forecast-metric-label">Predicted Spending</span>
                                        <span className="forecast-metric-value">
                                            {formatCurrency(
                                                item.overspendingPrediction.predicted_monthly_spending
                                            )}
                                        </span>
                                    </div>

                                    <div className="forecast-metric">
                                        <span className="forecast-metric-label">Suggested Budget</span>
                                        <span className="forecast-metric-value">
                                            {formatCurrency(item.budgetSuggestion.suggested_budget)}
                                        </span>
                                    </div>
                                </div>

                                <div className="forecast-divider"></div>

                                {item.overspendingPrediction.will_overspend ? (
                                    <p className="forecast-status forecast-warning">
                                        Estimated Overspend:{" "}
                                        {formatCurrency(
                                            item.overspendingPrediction.predicted_overspend_amount
                                        )}
                                    </p>
                                ) : (
                                    <p className="forecast-status forecast-safe">
                                        Budget is currently on track.
                                    </p>
                                )}

                                <p className="forecast-message">
                                    {item.overspendingPrediction.message}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="category-summary-section">
                <h2 className="category-summary-title">Category Budget Tracking</h2>

                {summary.categorySummary.length === 0 ? (
                    <p>No category summary available.</p>
                ) : (
                    <div className="category-summary-list">
                        {summary.categorySummary.map((item) => (
                            <div className="category-summary-card" key={item.category}>
                                <div className="category-summary-header">
                                    <h3>{item.category}</h3>

                                    <span
                                        className={
                                            item.isOverBudget
                                                ? "status over-budget"
                                                : "status within-budget"
                                        }
                                    >
                                        {item.isOverBudget ? "Over Budget" : "Within Budget"}
                                    </span>
                                </div>

                                <p>Budget: {formatCurrency(item.budget)}</p>
                                <p>Spent: {formatCurrency(item.spent)}</p>
                                <p>Remaining: {formatCurrency(item.remaining)}</p>

                                <div className="progress-bar-container">
                                    <div
                                        className={
                                            item.isOverBudget
                                                ? "progress-bar-fill over"
                                                : "progress-bar-fill normal"
                                        }
                                        style={{
                                            width: `${Math.min(item.progressPercentage, 100)}%`
                                        }}
                                    ></div>
                                </div>

                                <p className="progress-text">{item.progressPercentage}% used</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;