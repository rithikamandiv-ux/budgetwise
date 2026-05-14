from fastapi import APIRouter
from app.models.suggestion_models import (
    BudgetSuggestionRequest,
    BudgetSuggestionResponse,
)
from app.services.budget_suggestion_service import suggest_budget


router = APIRouter()


@router.post(
    "/suggest-budget",
    response_model=BudgetSuggestionResponse,
)
def suggest_budget_route(
    request: BudgetSuggestionRequest,
):
    return suggest_budget(request)