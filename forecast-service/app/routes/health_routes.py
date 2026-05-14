from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint – returns service status."""
    return {
        "status": "ok",
        "service": "BudgetWise Forecast Service",
    }
