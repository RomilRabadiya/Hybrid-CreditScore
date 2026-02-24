"""
Model Registry - Loads all ML models once at application startup.
Singleton pattern ensures models are loaded only once and reused across requests.
"""
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from app.core.config import MODEL_PATHS


class ModelRegistry:
    """
    Centralized registry for all ML models and artifacts.
    Loads models once at startup to avoid repeated I/O operations.
    """
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelRegistry, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
            
        print("🔄 Loading ML models...")
        
        # Load PD Model artifacts
        self.pd_model = joblib.load(MODEL_PATHS["pd_model"])
        self.pd_scaler = joblib.load(MODEL_PATHS["pd_scaler"])
        self.pd_features = joblib.load(MODEL_PATHS["pd_features"])
        print("✅ PD Model loaded")
        
        # Load Anomaly Model artifacts
        self.iso_model = joblib.load(MODEL_PATHS["iso_model"])
        self.if_scaler = joblib.load(MODEL_PATHS["if_scaler"])
        self.if_features = ['avgMonthlyIncome', 'incomeCV', 'expenseRatio', 
                           'emiRatio', 'avgMonthlyBalance', 'bounceCount']
        print("✅ Isolation Forest loaded")
        
        # Load Risk Label Model artifacts
        self.risk_model = joblib.load(MODEL_PATHS["risk_model"])
        self.risk_features = joblib.load(MODEL_PATHS["risk_features"])
        print("✅ Risk Model loaded")
        
        # Load Hybrid Credit Score Model artifacts
        self.hybrid_model = joblib.load(MODEL_PATHS["hybrid_model"])
        self.hybrid_features = joblib.load(MODEL_PATHS["hybrid_features"])
        print("✅ Hybrid Credit Score Model loaded")
        
        # Load Q-Learning RL Model artifacts
        self.q_table = joblib.load(MODEL_PATHS["q_table"])
        self.q_bins = joblib.load(MODEL_PATHS["q_bins"])
        self.q_features = joblib.load(MODEL_PATHS["q_features"])
        print("✅ Q-Learning Model loaded")
        
        # Load background data for SHAP explainers
        self.bg_data = pd.read_csv(MODEL_PATHS["bg_data"])
        
        # Prepare background data with PD and anomaly flags
        X_pd_all = self.pd_scaler.transform(self.bg_data[self.pd_features])
        self.bg_data['PD'] = self.pd_model.predict_proba(X_pd_all)[:, 1]
        
        X_if_all = self.if_scaler.transform(self.bg_data[self.if_features])
        if_scores = self.iso_model.decision_function(X_if_all)
        self.bg_data['anomalyFlag'] = (if_scores < -0.05).astype(int)
        
        print("✅ Background data prepared for SHAP")
        
        self._initialized = True
        print("🎉 All models loaded successfully!\n")


# Global registry instance
registry = ModelRegistry()
