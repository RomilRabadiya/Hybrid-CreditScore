# A Pydantic model : A class that inherits from pydantic.BaseModel 
# - uses Python type annotations to define data structures
# - automatically validate data.
from pydantic import BaseModel, Field
from typing import Optional, List


# 1 . CreditRequest : Input Schema

#Define Schema For Input Request :
    # Input : 
    # avgMonthlyIncome
    # incomeCV
    # expenseRatio
    # emiRatio
    # avgMonthlyBalance
    # bounceCount
    # accountAgeMonths

# The ... means: This field is REQUIRED.
class CreditRequest(BaseModel):
    avgMonthlyIncome: float = Field(..., gt=0)
    incomeCV: float = Field(..., ge=0)
    expenseRatio: float = Field(..., ge=0)
    emiRatio: float = Field(..., ge=0)
    avgMonthlyBalance: float = Field(..., ge=0)
    bounceCount: int = Field(..., ge=0)
    accountAgeMonths: int = Field(..., ge=0)



# 2 . CreditDecisionResponse : Output Schema

#Define Schema For Output Response :
    # Output : 
    # PD
    # Anomaly
    # RiskLabel
    # HybridScore
    # RL_Recommendation

class PDResponse(BaseModel):
    Probability_of_Default: float
    top_factors: Optional[List[str]] = None # This Means Optional<List<String>>


class AnomalyResponse(BaseModel):
    Anomaly_Score: float
    Anomaly_Flag: int  # 1 = anomaly detected, 0 = normal  (threshold: if_score < -0.05)
    top_factors: Optional[List[str]] = None


class RiskLabelResponse(BaseModel):
    Risk_Label: str
    Drivers: Optional[List[str]] = None


class HybridScoreResponse(BaseModel):
    Hybrid_Score: float
    factors: Optional[List[str]] = None


class RLRecommendationResponse(BaseModel):
    Recommendation: str
    Rationales: Optional[List[str]] = None


class CreditDecisionResponse(BaseModel):
    PD: PDResponse
    Anomaly: AnomalyResponse
    RiskLabel: RiskLabelResponse
    HybridScore: HybridScoreResponse
    RL_Recommendation: RLRecommendationResponse
