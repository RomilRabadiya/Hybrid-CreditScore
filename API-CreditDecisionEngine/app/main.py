"""
FastAPI Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api_router import router as api_router

# Initialize FastAPI app
app = FastAPI(
    title="FinSight-AA Credit Decision API",
    version="1.0.0",
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
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware (configure as needed for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api")


@app.get("/", tags=["Health"])
def root():
    """Root endpoint - API health check."""
    return {
        "status": "online",
        "api": "FinSight-AA Credit Decision API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "models_loaded": True
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
