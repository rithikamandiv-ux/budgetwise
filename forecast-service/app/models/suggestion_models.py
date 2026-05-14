from typing import List
from pydantic import BaseModel, Field


class BudgetSuggestionRequest(BaseModel):
    category: str = Field(..., min_length=1)
    current_budget: float = Field(..., gt=0)
    past_monthly_spending: List[float] = Field(..., min_length=1)
    safety_margin_percentage: float = Field(default=10, ge=0)


class BudgetSuggestionResponse(BaseModel):
    category: str
    current_budget: float
    average_past_spending: float
    suggested_budget: float
    message: str