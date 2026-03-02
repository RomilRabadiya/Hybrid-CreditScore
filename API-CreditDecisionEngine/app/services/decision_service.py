#Import Credit Decision Engine as a => "engine"
from app.engines.credit_decision_engine import engine

#Service Layer : clean separation between API routes and ML engine

# This function is called by the API router
# It calls the credit decision engine
# It returns the decision

def generate_decision(input_data: dict) -> dict:
    #Call Credit Decision Engine method get_decision
    return engine.get_decision(input_data)
