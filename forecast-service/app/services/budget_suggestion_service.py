from fastapi import HTTPException

from app.models.suggestion_models import (
    BudgetSuggestionRequest,
    BudgetSuggestionResponse,
)


def suggest_budget(
    request: BudgetSuggestionRequest,
) -> BudgetSuggestionResponse:
    if any(amount < 0 for amount in request.past_monthly_spending):
        raise HTTPException(
            status_code=400,
            detail="Past monthly spending values cannot be negative",
        )

    total_past_spending = sum(request.past_monthly_spending)
    number_of_months = len(request.past_monthly_spending)

    average_past_spending = total_past_spending / number_of_months

    safety_margin_multiplier = 1 + (request.safety_margin_percentage / 100)

    raw_suggested_budget = average_past_spending * safety_margin_multiplier

    suggested_budget = round_to_nearest_1000(raw_suggested_budget)

    if suggested_budget < request.current_budget:
        suggested_budget = request.current_budget

    message = (
        f"Based on your past spending, a more realistic "
        f"{request.category} budget would be around Rs. {suggested_budget:,.2f}."
    )

    return BudgetSuggestionResponse(
        category=request.category,
        current_budget=request.current_budget,
        average_past_spending=round(average_past_spending, 2),
        suggested_budget=suggested_budget,
        message=message,
    )


def round_to_nearest_1000(value: float) -> float:
    return round(value / 1000) * 1000