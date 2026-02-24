# FinSight-AA Credit Decision API

Production-grade ML prediction API for the Hybrid Credit Score system, built with FastAPI.

---

## ⚙️ Prerequisites

Before running the API, make sure the following are ready:

- Python 3.9+
- All ML models trained and saved under `../ML/2*. Models/` (run the notebooks in `ML/` first)
- The background data file exists at `../ML/3. Data/1. Raw_Features/features_only.csv`

---

## 🚀 How to Run

### Start the Server

**Using the run script (recommended):**
```bash
./run.sh
```
> `run.sh` auto-creates the venv and installs dependencies if not already done.

---

## 📡 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| `GET`  | `/` | Root health check |
| `GET`  | `/health` | Server + model status |
| `POST` | `/api/credit/decision` | Generate credit decision |
| `GET`  | `/docs` | Swagger UI (interactive) |
| `GET`  | `/redoc` | ReDoc documentation |

### POST `/api/credit/decision`

**Query param:** `?explain=true` (default) or `?explain=false` (skip SHAP explanations, faster)

**Request body:**
```json
{
  "avgMonthlyIncome": 150000,
  "incomeCV": 0.02,
  "expenseRatio": 0.15,
  "emiRatio": 0.05,
  "avgMonthlyBalance": 100000,
  "bounceCount": 0,
  "accountAgeMonths": 60
}
```

**Response:**
```json
{
  "PD":              { "value": 0.009,  "top_factors": ["..."] },
  "Anomaly":         { "score": 0.0955, "anomalyFlag": 0, "top_factors": ["..."] },
  "RiskLabel":       { "label": "LOW",  "drivers": ["..."] },
  "HybridScore":     { "value": 585.6,  "factors": ["..."] },
  "RL_Recommendation": { "action": "APPROVE_HIGH", "rationales": ["..."] }
}
```

---

## 🏗️ Project Structure

```
API-CreditDecisionEngine/
├── __init__.py
├── run.sh                        # One-click server start
├── requirements.txt
├── test_api.py                   # API test suite
├── curl_examples.sh
└── app/
    ├── __init__.py
    ├── main.py                   # FastAPI entry point
    ├── api/
    │   ├── __init__.py
    │   ├── api_router.py         # Router aggregation
    │   └── routes/
    │       ├── __init__.py
    │       └── credit_decision.py  # /api/credit/decision endpoint
    ├── core/
    │   ├── __init__.py
    │   ├── config.py             # ML model paths
    │   └── model_registry.py    # Singleton model loader
    ├── schemas/
    │   ├── __init__.py
    │   └── credit.py            # Pydantic request/response models
    ├── services/
    │   ├── __init__.py
    │   └── decision_service.py  # Service layer
    └── engines/
        ├── __init__.py
        └── credit_decision_engine.py  # Core ML decision engine
```

---

## ✨ Features

- ✅ 5 ML models: PD · Anomaly · Risk Label · Hybrid Score · RL Recommendation
- ✅ SHAP explainability for every prediction
- ✅ Type-safe with Pydantic v2
- ✅ Auto-generated Swagger + ReDoc docs
- ✅ Singleton model loading — fast after first request
- ✅ CORS enabled for frontend integration

---

## 📊 Response Time

| Request | Time |
|---------|------|
| First request (SHAP init) | ~2–3 s |
| Subsequent requests (with explain) | ~100–300 ms |
| Requests without explain (`?explain=false`) | ~10–50 ms |
