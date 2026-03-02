# API Router - central route aggregator in FastAPI
# This file is the main entry point for the API

# API Router 👉 Split large applications into modules
# We can add more routers here as needed 
# For Example: In our case we have credit decision router
from fastapi import APIRouter

# Import our credit decision engine router Path: app/api/routes/credit_decision.py
from app.api.routes import credit_decision
from app.api.routes import visualizes_decision

api_router = APIRouter()

# Include Credit Decision router to the API router
api_router.include_router(credit_decision.credit_decision_router)

# Include Visualize Decision router to the API router
api_router.include_router(visualizes_decision.router)

# WorkFlow :
        # 1. Client Request : POST Request
        #       |
        #       | (Go to the FastAPI Server)
        #       |
        # 2. main.py : Entry Point of FastAPI
        #       |
        #       | (Include API Router)
        #       |
        # 3. api/routes/api_router.py : API Router , Entry Point of FastAPI
        #       |
        #       | (Include Credit Decision Router)
        #       |
        # 4. api/routes/credit_decision.py : Credit Decision Router
        #       |
        #       | (Call Credit Decision Service)
        #       |
        # 5. api/schemas/credit.py : CreditRequest and CreditDecisionResponse Schema
        #       |
        #       | (Validate Input and Output using Pydantic)
        #       |
        # 6. api/services/decision_service.py : Credit Decision Service
        #       |
        #       | (Call Credit Decision Engine)
        #       |
        # 7. app/engines/credit_decision_engine.py : Credit Decision Engine
        #       |
        #       | (Call Model Registry)
        #       |
        # 8. app/core/model_registry.py : Model Registry
        #       |
        #       | (Load Models)
        #       |
        # 9. app/core/config.py : Configuration
        #       |
        #       | (Load Configuration)
        #       |
        # 10. app/schemas/credit.py : CreditRequest and CreditDecisionResponse Schema
        #       |
        #       | (Validate Input and Output)
        #       |
        # 11. app/api/routes/credit_decision.py : Credit Decision Router
        #       |
        #       | (Call Credit Decision Service)
        #       |
        # 12. api/routes/api_router.py : API Router , Entry Point of FastAPI
        #       |
        #       | (Include Credit Decision Router)
        #       |
        # 13. Client Response
        