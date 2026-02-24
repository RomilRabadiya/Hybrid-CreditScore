# API Router - central route aggregator in FastAPI
# This file is the main entry point for the API
# API Router 👉 Split large applications into modules
from fastapi import APIRouter

# Import our credit decision engine
from app.api.routes import credit_decision

router = APIRouter()

# Include all route modules
router.include_router(credit_decision.router, tags=["Credit Decision"])
