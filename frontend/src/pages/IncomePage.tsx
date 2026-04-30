import { useEffect, useState } from "react";
import "./IncomePage.css";

type Income = {
    id: number;
    source: string;
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

function IncomePage() {
    const [incomeList, setIncomeList] = useState<Income[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [source, setSource] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editSource, setEditSource] = useState("");
    const [editAmount, setEditAmount] = useState("");
    const [editDate, setEditDate] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        fetch("http://localhost:3001/income", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                source,
                amount: Number(amount),
                date
            })
        })
            .then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to add income");
                }

                return data;
            })
            .then((newIncome) => {
                setIncomeList((prev) => [...prev, newIncome]);
                setSource("");
                setAmount("");
                setDate("");
                setShowModal(false);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const handleDelete = (id: number) => {
        fetch(`http://localhost:3001/income/${id}`, {
            method: "DELETE"
        })
            .then((res) => res.json())
            .then(() => {
                setIncomeList((prev) => prev.filter((income) => income.id !== id));
            })
            .catch(() => {
                alert("Failed to delete income");
            });
    };

    const handleEditClick = (income: Income) => {
        setEditingId(income.id);
        setEditSource(income.source);
        setEditAmount(String(income.amount));
        setEditDate(income.date?.split("T")[0] ?? "");
        setModalMode("edit");
        setShowModal(true);
    };

    const handleUpdate = (id: number) => {
        fetch(`http://localhost:3001/income/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                source: editSource,
                amount: Number(editAmount),
                date: editDate
            })
        })
            .then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to update income");
                }

                return data;
            })
            .then((data) => {
                setIncomeList((prev) =>
                    prev.map((income) =>
                        income.id === id ? data.updatedIncome : income
                    )
                );

                setEditingId(null);
                setEditSource("");
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
        setEditSource("");
        setEditAmount("");
        setEditDate("");
        setShowModal(false);
    };

    const openAddModal = () => {
        setModalMode("add");
        setSource("");
        setAmount("");
        setDate("");
        setEditingId(null);
        setShowModal(true);
    };

    useEffect(() => {
        fetch("http://localhost:3001/income")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch income");
                }
                return response.json();
            })
            .then((data) => {
                setIncomeList(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load income");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="page-container">
                <div className="page-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading income...</p>
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
                    <h1>Income</h1>
                    <p className="page-subtitle">Track your earnings and revenue</p>
                </div>

                <button className="app-btn app-btn--primary" onClick={openAddModal}>
                    + Add Income
                </button>
            </div>

            {incomeList.length === 0 ? (
                <div className="empty-state">
                    <p>No income records found.</p>
                </div>
            ) : (
                <div className="items-grid">
                    {incomeList.map((income) => (
                        <div className="item-card" key={income.id}>
                            <div className="item-card-header">
                                <span className="item-card-category">{income.source}</span>
                            </div>
                            <p className="item-card-amount">Rs. {income.amount.toLocaleString("en-IN")}</p>
                            <p className="item-card-date">
                                {formatDate(income.date)}
                            </p>
                            <div className="item-card-actions">
                                <button
                                    className="app-btn app-btn--small"
                                    onClick={() => handleEditClick(income)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="app-btn app-btn--small app-btn--danger"
                                    onClick={() => handleDelete(income.id)}
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
                            <h2>{modalMode === "add" ? "Add Income" : "Edit Income"}</h2>
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
                                    placeholder="Source"
                                    value={modalMode === "add" ? source : editSource}
                                    onChange={(e) =>
                                        modalMode === "add"
                                            ? setSource(e.target.value)
                                            : setEditSource(e.target.value)
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

export default IncomePage;