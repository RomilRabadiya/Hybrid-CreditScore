from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from io import BytesIO
import matplotlib
matplotlib.use("Agg")  # ← VERY IMPORTANT
import matplotlib.pyplot as plt
import shap
import pandas as pd

from app.schemas.credit import CreditRequest
from app.core.model_registry import registry
from app.engines.credit_decision_engine import engine, BUSINESS_MAPPING

router = APIRouter(prefix="/explain")

# Visualize Probability of Default
@router.post("/pd")
def explain_pd(req: CreditRequest):
    # Step 1: Convert to DataFrame
    df_input = pd.DataFrame([req.dict()])

    # Step 2: Feature Selection + Scaling
    X_pd = registry.pd_scaler.transform(df_input[registry.pd_features])

    # Step 3: Explain
    pd_exp = engine.pd_explainer(X_pd)

    # Step 4: Rename Features for Business
    pd_exp.feature_names = [
        BUSINESS_MAPPING.get(f, f)
        for f in registry.pd_features
    ]

    # Step 5: Create plot
    plt.figure(figsize=(10, 4)) 
    
    # Waterfall plot : shows the impact of each feature on the prediction    
    shap.plots.waterfall(pd_exp[0], show=False)

    # Step 6: Save to buffer
    buffer = BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight")
    plt.close()
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="image/png")



# Visualize Anomaly Score and Anomaly Flag
@router.post("/anomaly")
def explain_anomaly(req: CreditRequest):
    df_input = pd.DataFrame([req.dict()])

    X_if = registry.if_scaler.transform(df_input[registry.if_features])
    if_exp = engine.if_explainer(X_if)

    if_exp.feature_names = [
        BUSINESS_MAPPING.get(f, f)
        for f in registry.if_features
    ]

    plt.figure(figsize=(10, 4))
    
    # Force plot : shows the impact of each feature on the prediction    
    shap.plots.force(if_exp[0], matplotlib=True, show=False)

    buffer = BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight")
    plt.close()
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="image/png")



# Visualize Hybrid Credit Score
@router.post("/hybrid")
def explain_hybrid(req: CreditRequest):
    df_input = pd.DataFrame([req.dict()])

    X_hyb = df_input[registry.hybrid_features]
    hyb_exp = engine.hybrid_explainer(X_hyb)

    hyb_exp.feature_names = [
        BUSINESS_MAPPING.get(f, f)
        for f in registry.hybrid_features
    ]

    plt.figure(figsize=(10, 4))

    # Bar plot : shows the impact of each feature on the prediction    
    shap.plots.bar(hyb_exp[0], show=False)

    buffer = BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight")
    plt.close()
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="image/png")




# Visualize Risk Label
@router.post("/risk")
def explain_risk(req: CreditRequest):
    df_input = pd.DataFrame([req.dict()])

    # Recompute signals
    X_pd = registry.pd_scaler.transform(df_input[registry.pd_features])
    pd_val = registry.pd_model.predict_proba(X_pd)[0, 1]

    X_if = registry.if_scaler.transform(df_input[registry.if_features])
    if_score = registry.iso_model.decision_function(X_if)[0]
    anomaly_flag = 1 if if_score < -0.05 else 0

    df_risk = df_input.copy()
    df_risk["PD"] = pd_val
    df_risk["anomalyFlag"] = anomaly_flag

    X_risk = df_risk[registry.risk_features]
    risk_idx = int(registry.risk_model.predict(X_risk)[0])

    risk_exp = engine.risk_explainer(X_risk)

    if risk_exp.values.ndim == 3:
        shap_values = risk_exp.values[0, :, risk_idx]
        explanation = shap.Explanation(
            values=shap_values,
            base_values=risk_exp.base_values[0][risk_idx],
            data=X_risk.values[0],
            feature_names=registry.risk_features
        )
    else:
        explanation = risk_exp[0]

    explanation.feature_names = [
        BUSINESS_MAPPING.get(f, f)
        for f in registry.risk_features
    ]

    plt.figure(figsize=(10, 4))
    shap.plots.waterfall(explanation, show=False)

    buffer = BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight")
    plt.close()
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="image/png")