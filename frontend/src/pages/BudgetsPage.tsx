import { useEffect, useState } from "react";
import "./BudgetsPage.css";

type Budget = {
    id: number;
    category: string;
    limit: number;
    month: number;
    year: number;
};

function BudgetsPage() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [category, setCategory] = useState("");
    const [limit, setLimit] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editCategory, setEditCategory] = useState("");
    const [editLimit, setEditLimit] = useState("");
    const [editMonth, setEditMonth] = useState("");
    const [editYear, setEditYear] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");

    const formatMonthYear = (month: number, year: number) => {
        const date = new Date(year, month - 1);
        return date.toLocaleString("en-US", {
            month: "short",
            year: "numeric"
        });
    };

    useEffect(() => {
        fetch("http://localhost:3001/budgets")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch budgets");
                }
                return response.json();
            })
            .then((data) => {
                setBudgets(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load budgets");
                setLoading(false);
            });
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        fetch("http://localhost:3001/budgets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category,
                limit: Number(limit),
                month: Number(month),
                year: Number(year)
            })
        })
            .then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to add budget");
                }

                return data;
            })
            .then((newBudget) => {
                setBudgets((prev) => [...prev, newBudget]);
                setCategory("");
                setLimit("");
                setMonth("");
                setYear("");
                setShowModal(false);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const handleDelete = (id: number) => {
        fetch(`http://localhost:3001/budgets/${id}`, {
            method: "DELETE"
        })
            .then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to delete budget");
                }

                return data;
            })
            .then(() => {
                setBudgets((prev) => prev.filter((budget) => budget.id !== id));
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const handleEditClick = (budget: Budget) => {
        setEditingId(budget.id);
        setEditCategory(budget.category);
        setEditLimit(String(budget.limit));
        setEditMonth(String(budget.month));
        setEditYear(String(budget.year));
        setModalMode("edit");
        setShowModal(true);
    };

    const handleUpdate = (id: number) => {
        fetch(`http://localhost:3001/budgets/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category: editCategory,
                limit: Number(editLimit),
                month: Number(editMonth),
                year: Number(editYear)
            })
        })
            .then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to update budget");
                }

                return data;
            })
            .then((data) => {
                setBudgets((prev) =>
                    prev.map((budget) =>
                        budget.id === id ? data.updatedBudget : budget
                    )
                );

                setEditingId(null);
                setEditCategory("");
                setEditLimit("");
                setEditMonth("");
                setEditYear("");
                setShowModal(false);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditCategory("");
        setEditLimit("");
        setEditMonth("");
        setEditYear("");
        setShowModal(false);
    };

    const openAddModal = () => {
        setModalMode("add");
        setCategory("");
        setLimit("");
        setMonth("");
        setYear("");
        setEditingId(null);
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="page-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading budgets...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="page-error">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Budgets</h1>
                    <p className="page-subtitle">Set and manage spending limits</p>
                </div>

                <button className="app-btn app-btn--primary" onClick={openAddModal}>
                    + Add Budget
                </button>
            </div>

            {budgets.length === 0 ? (
                <div className="empty-state">
                    <p>No budgets found.</p>
                </div>
            ) : (
                <div className="items-grid">
                    {budgets.map((budget) => (
                        <div className="item-card" key={budget.id}>
                            <div className="item-card-header">
                                <span className="item-card-category">{budget.category}</span>
                            </div>
                            <p className="item-card-amount">Rs. {budget.limit.toLocaleString("en-IN")}</p>
                            <p className="item-card-date">
                                {formatMonthYear(budget.month, budget.year)}
                            </p>
                            <div className="item-card-actions">
                                <button
                                    className="app-btn app-btn--small"
                                    onClick={() => handleEditClick(budget)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="app-btn app-btn--small app-btn--danger"
                                    onClick={() => handleDelete(budget.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => handleCancelEdit()}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{modalMode === "add" ? "Add Budget" : "Edit Budget"}</h2>
                            <button className="modal-close" onClick={handleCancelEdit}>×</button>
                        </div>

                        <form
                            className="modal-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (modalMode === "add") {
                                    handleSubmit(e);
                                } else if (editingId !== null) {
                                    handleUpdate(editingId);
                                }
                            }}
                        >
                            <div className="inp-border a1">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Category"
                                    value={modalMode === "add" ? category : editCategory}
                                    onChange={(e) =>
                                        modalMode === "add"
                                            ? setCategory(e.target.value)
                                            : setEditCategory(e.target.value)
                                    }
                                />
                            </div>

                            <div className="inp-border a1">
                                <input
                                    className="input"
                                    type="number"
                                    placeholder="Limit"
                                    value={modalMode === "add" ? limit : editLimit}
                                    onChange={(e) =>
                                        modalMode === "add"
                                            ? setLimit(e.target.value)
                                            : setEditLimit(e.target.value)
                                    }
                                />
                            </div>

                            <div className="inp-border a1">
                                <input
                                    className="input"
                                    type="number"
                                    placeholder="Month (1-12)"
                                    value={modalMode === "add" ? month : editMonth}
                                    onChange={(e) =>
                                        modalMode === "add"
                                            ? setMonth(e.target.value)
                                            : setEditMonth(e.target.value)
                                    }
                                    min="1"
                                    max="12"
                                />
                            </div>

                            <div className="inp-border a1">
                                <input
                                    className="input"
                                    type="number"
                                    placeholder="Year"
                                    value={modalMode === "add" ? year : editYear}
                                    onChange={(e) =>
                                        modalMode === "add"
                                            ? setYear(e.target.value)
                                            : setEditYear(e.target.value)
                                    }
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="app-btn" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                                <button type="submit" className="app-btn app-btn--primary">
                                    {modalMode === "add" ? "Add" : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BudgetsPage;