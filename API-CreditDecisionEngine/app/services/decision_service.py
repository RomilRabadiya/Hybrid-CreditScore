"""
Service layer for credit decision business logic.
Provides clean separation between API routes and ML engine.
"""
from app.engines.credit_decision_engine import engine


def generate_decision(input_data: dict, explain: bool = True) -> dict:
    """
    Generate credit decision with explanations.
    
    Args:
        input_data (dict): Customer financial features
        explain (bool): Whether to include SHAP explanations
        
    Returns:
        dict: Complete decision with all model outputs
    """
    result = engine.get_decision_explanation(input_data, explain=explain)
    return result
