import { useEffect, useState } from "react";
import "./ExpensesPage.css";

type Expense = {
    id: number;
    category: string;
    amount: number;
    date: string;
};

const formatDate = (dateStr: string): string => {
    if (!dateStr) return "No date";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
};

function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editCategory, setEditCategory] = useState("");
    const [editAmount, setEditAmount] = useState("");
    const [editDate, setEditDate] = useState("");

    const [selectedMonth, setSelectedMonth] = useState("4");
    const [selectedYear, setSelectedYear] = useState("2026");

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");

    useEffect(() => {
        setLoading(true);

        fetch(
            `http://localhost:3001/expenses?month=${selectedMonth}&year=${selectedYear}`
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch expenses");
                }
                return response.json();
            })
            .then((data) => {
                setExpenses(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load expenses");
                setLoading(false);
            });
    }, [selectedMonth, selectedYear]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        fetch("http://localhost:3001/expenses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category,
                amount: Number(amount),
                date
            })
        })
            .then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to add expense");
                }

                return data;
            })
            .then((newExpense) => {
                const newExpenseMonth = new Date(newExpense.date).getMonth() + 1;
                const newExpenseYear = new Date(newExpense.date).getFullYear();

                if (
                    newExpenseMonth === Number(selectedMonth) &&
                    newExpenseYear === Number(selectedYear)
                ) {
                    setExpenses((prev) => [...prev, newExpense]);
                }

                setCategory("");
                setAmount("");
                setDate("");
                setShowModal(false);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const handleDelete = (id: number) => {
        fetch(`http://localhost:3001/expenses/${id}`, {
            method: "DELETE"
        })
            .then((res) => res.json())
            .then(() => {
                setExpenses((prev) => prev.filter((exp) => exp.id !== id));
            })
            .catch(() => {
                alert("Failed to delete expense");
            });
    };

    const handleEditClick = (expense: Expense) => {
        setEditingId(expense.id);
        setEditCategory(expense.category);
        setEditAmount(String(expense.amount));
        setEditDate(expense.date?.split("T")[0] ?? "");
        setModalMode("edit");
        setShowModal(true);
    };

    const handleUpdate = (id: number) => {
        fetch(`http://localhost:3001/expenses/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category: editCategory,
                amount: Number(editAmount),
                date: editDate
            })
        })
            .then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to update expense");
                }

                return data;
            })
            .then((data) => {
                const updatedExpense = data.updatedExpense;
                const updatedMonth = new Date(updatedExpense.date).getMonth() + 1;
                const updatedYear = new Date(updatedExpense.date).getFullYear();

                if (
                    updatedMonth === Number(selectedMonth) &&
                    updatedYear === Number(selectedYear)
                ) {
                    setExpenses((prev) =>
                        prev.map((expense) =>
                            expense.id === id ? updatedExpense : expense
                        )
                    );
                } else {
                    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
                }

                setEditingId(null);
                setEditCategory("");
                setEditAmount("");
                setEditDate("");
                setShowModal(false);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditCategory("");
        setEditAmount("");
        setEditDate("");
        setShowModal(false);
    };

    const openAddModal = () => {
        setModalMode("add");
        setCategory("");
        setAmount("");
        setDate("");
        setEditingId(null);
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="page-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading expenses...</p>
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
                    <h1>Expenses</h1>
                    <p className="page-subtitle">Track and manage your spending</p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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

                    <button className="app-btn app-btn--primary" onClick={openAddModal}>
                        + Add Expense
                    </button>
                </div>
            </div>

            {expenses.length === 0 ? (
                <div className="empty-state">
                    <p>No expenses found for this period.</p>
                </div>
            ) : (
                <div className="items-grid">
                    {expenses.map((expense) => (
                        <div className="item-card" key={expense.id}>
                            <div className="item-card-header">
                                <span className="item-card-category">{expense.category}</span>
                            </div>
                            <p className="item-card-amount">Rs. {expense.amount.toLocaleString("en-IN")}</p>
                            <p className="item-card-date">
                                {formatDate(expense.date)}
                            </p>
                            <div className="item-card-actions">
                                <button
                                    className="app-btn app-btn--small"
                                    onClick={() => handleEditClick(expense)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="app-btn app-btn--small app-btn--danger"
                                    onClick={() => handleDelete(expense.id)}
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
                            <h2>{modalMode === "add" ? "Add Expense" : "Edit Expense"}</h2>
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
                                    placeholder="Amount"
                                    value={modalMode === "add" ? amount : editAmount}
                                    onChange={(e) =>
                                        modalMode === "add"
                                            ? setAmount(e.target.value)
                                            : setEditAmount(e.target.value)
                                    }
                                />
                            </div>

                            <div className="inp-border a1">
                                <input
                                    className="input"
                                    type="date"
                                    value={modalMode === "add" ? date : editDate}
                                    onChange={(e) =>
                                        modalMode === "add"
                                            ? setDate(e.target.value)
                                            : setEditDate(e.target.value)
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

export default ExpensesPage;