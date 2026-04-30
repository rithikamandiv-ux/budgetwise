import { Routes, Route, Link, useLocation } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import IncomePage from "./pages/IncomePage";
import BudgetsPage from "./pages/BudgetsPage";
import "./App.css";

function App() {
  const location = useLocation();

  const linkClass = (path: string) => {
    const isActive =
      location.pathname === path ||
      (path === "/dashboard" && location.pathname === "/");

    return "sidebar-link" + (isActive ? " sidebar-link--active" : "");
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Link to="/dashboard" className="sidebar-brand">
          Budget<span>Wise</span>
        </Link>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            <span className="sidebar-icon">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </span>
            <span>Dashboard</span>
          </Link>

          <Link to="/expenses" className={linkClass("/expenses")}>
            <span className="sidebar-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>
            <span>Expenses</span>
          </Link>

          <Link to="/income" className={linkClass("/income")}>
            <span className="sidebar-icon">
              <svg viewBox="0 0 24 24">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </span>
            <span>Income</span>
          </Link>

          <Link to="/budgets" className={linkClass("/budgets")}>
            <span className="sidebar-icon">
              <svg viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="9" y1="16" x2="13" y2="16" />
              </svg>
            </span>
            <span>Budgets</span>
          </Link>
        </nav>
      </aside>

      <main className="app-content">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;