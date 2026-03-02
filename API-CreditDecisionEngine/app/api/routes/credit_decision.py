#In this file we define the credit decision router
#This router has a POST endpoint /credit/decision
from fastapi import APIRouter
from app.schemas.credit import CreditRequest, CreditDecisionResponse
#Input Request Schema is CreditRequest => CreditRequest is a Pydantic model class
#Output Response Schema is CreditDecisionResponse => CreditDecisionResponse is a Pydantic model class

#Service Layer : In this Router Layer we will call the service layer to get the credit decision
from app.services.decision_service import generate_decision


credit_decision_router = APIRouter()


#Define POST endpoint for credit decision
@credit_decision_router.post(
    "/credit/decision",
    response_model=CreditDecisionResponse
)
def credit_decision(
    req: CreditRequest
):
    # Convert pydantic model to Standard Python Dictionary
    result = generate_decision(req.dict()) 
    return result