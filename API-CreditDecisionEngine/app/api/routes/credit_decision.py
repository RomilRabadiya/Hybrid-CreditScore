"""
Credit decision API routes.
"""
from fastapi import APIRouter, Query
from app.schemas.credit import CreditRequest, CreditDecisionResponse
from app.services.decision_service import generate_decision

router = APIRouter()


@router.post(
    "/credit/decision",
    response_model=CreditDecisionResponse,
    summary="Generate Credit Decision"
)
def credit_decision(
    req: CreditRequest,
    explain: bool = Query(True, description="Include SHAP explanations in response")
):
    """
    Generate credit decision for a customer.
    
    Args:
        req: Customer financial features
        explain: Whether to include SHAP explanations
        
    Returns:
        Complete credit decision with all model outputs and explanations
    """
    result = generate_decision(req.dict(), explain=explain)
    return result
