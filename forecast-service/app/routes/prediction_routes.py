from fastapi import APIRouter
from app.models.prediction_models import (
    OverspendingPredictionRequest,
    OverspendingPredictionResponse,
)
from app.services.overspending_service import predict_overspending


router = APIRouter()


@router.post(
    "/predict-overspending",
    response_model=OverspendingPredictionResponse,
)
def predict_overspending_route(
    request: OverspendingPredictionRequest,
):
    return predict_overspending(request)