from pydantic import BaseModel, Field


class OverspendingPredictionRequest(BaseModel):
    category: str = Field(..., min_length=1)
    budget_limit: float = Field(..., gt=0)
    spent_so_far: float = Field(..., ge=0)
    days_passed: int = Field(..., gt=0)
    total_days_in_month: int = Field(..., gt=0)


class OverspendingPredictionResponse(BaseModel):
    category: str
    budget_limit: float
    spent_so_far: float
    predicted_monthly_spending: float
    will_overspend: bool
    predicted_overspend_amount: float
    risk_level: str
    message: str