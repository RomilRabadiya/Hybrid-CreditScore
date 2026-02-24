"""
Configuration settings for the FastAPI application.
"""
from pathlib import Path

# Base directory: API-CreditDecisionEngine/
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# ML directory: sibling of API-CreditDecisionEngine/
ML_DIR = BASE_DIR.parent / "ML"

# Model artifact paths
MODEL_PATHS = {
    # PD Model
    "pd_model": ML_DIR / "2*. Models/2. PD_model/artifacts/pd_model.joblib",
    "pd_scaler": ML_DIR / "2*. Models/2. PD_model/artifacts/pd_scaler.joblib",
    "pd_features": ML_DIR / "2*. Models/2. PD_model/artifacts/pd_features.joblib",
    
    # Anomaly Model (Isolation Forest)
    "iso_model": ML_DIR / "2*. Models/1. Anomaly_model/artifacts/isolation_forest.joblib",
    "if_scaler": ML_DIR / "2*. Models/1. Anomaly_model/artifacts/if_scaler.joblib",
    
    # Risk Label Model
    "risk_model": ML_DIR / "2*. Models/3. Risk-Label_model/artifacts/risk_random_forest.joblib",
    "risk_features": ML_DIR / "2*. Models/3. Risk-Label_model/artifacts/risk_features.joblib",
    
    # Hybrid Credit Score Model
    "hybrid_model": ML_DIR / "2*. Models/4*. Hybrid-CreditScore_model/artifacts/hybrid_credit_score_model.joblib",
    "hybrid_features": ML_DIR / "2*. Models/4*. Hybrid-CreditScore_model/artifacts/hybrid_features.joblib",
    
    # Q-Learning RL Model
    "q_table": ML_DIR / "2*. Models/5. RL_model/artifacts/q_learning_model.joblib",
    "q_bins": ML_DIR / "2*. Models/5. RL_model/artifacts/q_learning_bins.joblib",
    "q_features": ML_DIR / "2*. Models/5. RL_model/artifacts/q_learning_features.joblib",
    
    # Background data for SHAP
    "bg_data": ML_DIR / "3. Data/1. Raw_Features/features_only.csv",
}


