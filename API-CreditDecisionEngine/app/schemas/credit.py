"""
Pydantic schemas for request/response validation.
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class CreditRequest(BaseModel):
    """Request schema for credit decision endpoint."""
    avgMonthlyIncome: float = Field(..., description="Average monthly income", gt=0)
    incomeCV: float = Field(..., description="Income coefficient of variation", ge=0)
    expenseRatio: float = Field(..., description="Expense to income ratio", ge=0, le=1)
    emiRatio: float = Field(..., description="EMI to income ratio", ge=0, le=1)
    avgMonthlyBalance: float = Field(..., description="Average monthly balance", ge=0)
    bounceCount: int = Field(..., description="Number of payment bounces", ge=0)
    accountAgeMonths: int = Field(..., description="Account age in months", ge=0)
    
    class Config:
        json_schema_extra = {
            "example": {
                "avgMonthlyIncome": 150000,
                "incomeCV": 0.02,
                "expenseRatio": 0.15,
                "emiRatio": 0.05,
                "avgMonthlyBalance": 100000,
                "bounceCount": 0,
                "accountAgeMonths": 60
            }
        }


class PDResponse(BaseModel):
    """Probability of Default response."""
    value: float
    top_factors: Optional[List[str]] = None


class AnomalyResponse(BaseModel):
    """Anomaly detection response."""
    score: float
    anomalyFlag: int  # 1 = anomaly detected, 0 = normal  (threshold: if_score < -0.05)
    top_factors: Optional[List[str]] = None


class RiskLabelResponse(BaseModel):
    """Risk label classification response."""
    label: str
    drivers: Optional[List[str]] = None


class HybridScoreResponse(BaseModel):
    """Hybrid credit score response."""
    value: float
    factors: Optional[List[str]] = None


class RLRecommendationResponse(BaseModel):
    """RL-based recommendation response."""
    action: str
    rationales: Optional[List[str]] = None


class CreditDecisionResponse(BaseModel):
    """Complete credit decision response with all model outputs."""
    PD: PDResponse
    Anomaly: AnomalyResponse
    RiskLabel: RiskLabelResponse
    HybridScore: HybridScoreResponse
    RL_Recommendation: RLRecommendationResponse
    
    class Config:
        json_schema_extra = {
            "example": {
                "PD": {
                    "value": 0.0090,
                    "top_factors": [
                        "Monthly Expense Burden (-5.416)",
                        "Existing Debt Commitments (EMI) (-2.009)",
                        "Historical Payment Bounces (-0.309)"
                    ]
                },
                "Anomaly": {
                    "score": 0.0955,
                    "anomalyFlag": 0,
                    "top_factors": [
                        "Monthly Expense Burden (-1.447)",
                        "Existing Debt Commitments (EMI) (-0.774)",
                        "Liquidity Reserve (+0.350)"
                    ]
                },
                "RiskLabel": {
                    "label": "LOW",
                    "drivers": [
                        "Probability of Default Signal (+0.359)",
                        "Monthly Expense Burden (+0.113)",
                        "Existing Debt Commitments (EMI) (+0.093)"
                    ]
                },
                "HybridScore": {
                    "value": 585.6,
                    "factors": [
                        "Monthly Expense Burden (+30.536)",
                        "Existing Debt Commitments (EMI) (+27.899)",
                        "Historical Payment Bounces (+22.981)"
                    ]
                },
                "RL_Recommendation": {
                    "action": "APPROVE_HIGH",
                    "rationales": [
                        "Consolidated Credit Score (+28.286)",
                        "Probability of Default Signal (-16.373)",
                        "Anomaly Signal Intensity (+10.824)"
                    ]
                }
            }
        }
