from fastapi import FastAPI
from app.routes.health_routes import router as health_router
from app.routes.prediction_routes import router as prediction_router
from app.routes.suggestion_routes import router as suggestion_router


app = FastAPI(
    title="BudgetWise Forecast Service",
    description="Python forecasting service for BudgetWise financial insights",
    version="1.0.0",
)


app.include_router(health_router)
app.include_router(prediction_router)
app.include_router(suggestion_router)


@app.get("/")
def root():
    return {
        "message": "BudgetWise Forecast Service is running"
    }