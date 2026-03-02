from fastapi import FastAPI
from app.api.api_router import api_router

# Initialize FastAPI app
app = FastAPI(
    title="FinSight-AA Credit Decision API",
    description="""
Production-grade Credit Decision API with ML-powered risk assessment.

**Features:**
- Probability of Default (PD) prediction
- Anomaly detection
- Risk label classification
- Hybrid credit score calculation
- RL-based decision recommendation
- SHAP explainability for all predictions
""",
)

# Include API router 
app.include_router(api_router, prefix="/api")