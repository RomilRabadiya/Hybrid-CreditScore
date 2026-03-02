# API-CreditDecisionEngine — WorkFlow

```
1. Client Request : POST Request
        |
        | (Go to the FastAPI Server)
        |
2. main.py : Entry Point of FastAPI
        |
        | (Include API Router)
        |
3. api/api_router.py : API Router , Entry Point of FastAPI
        |
        | (Include Credit Decision Router)
        |
4. api/routes/credit_decision.py : Credit Decision Router
        |
        | (Call Credit Decision Service)
        |
5. app/schemas/credit.py : CreditRequest and CreditDecisionResponse Schema
        |
        | (Validate Input and Output using Pydantic)
        |
6. app/services/decision_service.py : Credit Decision Service
        |
        | (Call Credit Decision Engine)
        |
7. app/engines/credit_decision_engine.py : Credit Decision Engine
        |
        | (Call Model Registry)
        |
8. app/core/model_registry.py : Model Registry
        |
        | (Load Models)
        |
9. app/core/config.py : Configuration
        |
        | (Load Configuration)
        |
10. app/schemas/credit.py : CreditRequest and CreditDecisionResponse Schema
        |
        | (Validate Input and Output)
        |
11. app/api/routes/credit_decision.py : Credit Decision Router
        |
        | (Return Response)
        |
12. app/api/api_router.py : API Router
        |
        | (Include Credit Decision Router)
        |
13. Client Response
```
---

## Step-by-Step Summary

| Step | File | Role |
|---|---|---|
| 1 | `main.py` | FastAPI app entry point, mounts router at `/api` |
| 2 | `api/api_router.py` | Aggregates all sub-routers |
| 3 | `api/routes/credit_decision.py` | Handles `POST /credit/decision` |
| 4 | `schemas/credit.py` → `CreditRequest` | Validates & parses the input body |
| 5 | `services/decision_service.py` | Thin bridge to the ML engine |
| 6 | `engines/credit_decision_engine.py` | Runs the 5-layer ML pipeline + SHAP |
| 7 | `core/model_registry.py` | Singleton — all models loaded once at startup |
| 8 | `core/config.py` | File paths to all `.joblib` model artifacts |
| 9 | `schemas/credit.py` → `CreditDecisionResponse` | Validates & serializes the output |

---

## Output Structure

```json
{
  "PD": {
    "Probability_of_Default": 0.009,
    "top_factors": ["Monthly Expense Burden (-5.416)", "..."]
  },
  "Anomaly": {
    "Anomaly_Score": 0.0955,
    "Anomaly_Flag": 0,
    "top_factors": ["Monthly Expense Burden (-1.447)", "..."]
  },
  "RiskLabel": {
    "Risk_Label": "LOW",
    "Drivers": ["Probability of Default Signal (+0.359)", "..."]
  },
  "HybridScore": {
    "Hybrid_Score": 585.6,
    "factors": ["Monthly Expense Burden (+30.536)", "..."]
  },
  "RL_Recommendation": {
    "Recommendation": "APPROVE_HIGH",
    "Rationales": ["Consolidated Credit Score (+28.286)", "..."]
  }
}