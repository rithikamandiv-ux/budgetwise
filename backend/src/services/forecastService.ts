type OverspendingRequest = {
    category: string;
    budget_limit: number;
    spent_so_far: number;
    days_passed: number;
    total_days_in_month: number;
};

type SuggestBudgetRequest = {
    category: string;
    current_budget: number;
    past_monthly_spending: number[];
    safety_margin_percentage: number;
};

export const getOverspendingPrediction = async (
    payload: OverspendingRequest
) => {
    const response = await fetch("http://localhost:8000/predict-overspending", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("Failed to get overspending prediction");
    }

    return response.json();
};

export const getBudgetSuggestion = async (payload: SuggestBudgetRequest) => {
    const response = await fetch("http://localhost:8000/suggest-budget", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("Failed to get budget suggestion");
    }

    return response.json();
};