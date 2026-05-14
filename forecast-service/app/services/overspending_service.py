from fastapi import HTTPException
from app.models.prediction_models import (
    OverspendingPredictionRequest,
    OverspendingPredictionResponse,
)


def predict_overspending(
    request: OverspendingPredictionRequest,
) -> OverspendingPredictionResponse:
    if request.days_passed > request.total_days_in_month:
        raise HTTPException(
            status_code=400,
            detail="days_passed cannot be greater than total_days_in_month",
        )

    average_daily_spending = request.spent_so_far / request.days_passed

    predicted_monthly_spending = (
        average_daily_spending * request.total_days_in_month
    )

    predicted_overspend_amount = (
        predicted_monthly_spending - request.budget_limit
    )

    will_overspend = predicted_monthly_spending > request.budget_limit

    usage_ratio = predicted_monthly_spending / request.budget_limit

    if usage_ratio < 0.7:
        risk_level = "Low"
    elif usage_ratio <= 0.9:
        risk_level = "Medium"
    else:
        risk_level = "High"

    predicted_monthly_spending = round(predicted_monthly_spending, 2)

    predicted_overspend_amount = round(
        max(predicted_overspend_amount, 0),
        2,
    )

    message = create_prediction_message(
        category=request.category,
        will_overspend=will_overspend,
        predicted_overspend_amount=predicted_overspend_amount,
    )

    return OverspendingPredictionResponse(
        category=request.category,
        budget_limit=request.budget_limit,
        spent_so_far=request.spent_so_far,
        predicted_monthly_spending=predicted_monthly_spending,
        will_overspend=will_overspend,
        predicted_overspend_amount=predicted_overspend_amount,
        risk_level=risk_level,
        message=message,
    )


def create_prediction_message(
    category: str,
    will_overspend: bool,
    predicted_overspend_amount: float,
) -> str:
    if will_overspend:
        return (
            f"You may exceed your {category} budget by approximately "
            f"Rs. {predicted_overspend_amount:,.2f} this month."
        )

    return f"Your {category} budget is currently on track."