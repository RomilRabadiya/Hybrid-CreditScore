import pandas as pd
import numpy as np
import shap
import warnings
from app.core.model_registry import registry

warnings.filterwarnings('ignore')

# Business Readable names for SHAP values
BUSINESS_MAPPING = {
    "avgMonthlyIncome": "Monthly Income Level",
    "incomeCV": "Income Volatility",
    "expenseRatio": "Monthly Expense Burden",
    "emiRatio": "Existing Debt Commitments (EMI)",
    "avgMonthlyBalance": "Liquidity Reserve",
    "bounceCount": "Historical Payment Bounces",
    "accountAgeMonths": "Banking Relationship Age",
    "PD": "Probability of Default Signal",
    "anomalyFlag": "Unusual Transaction Behavior",
    "anomaly": "Anomaly Signal Intensity",
    "HybridCreditScore": "Consolidated Credit Score"
}

# Credit Decision Engine Class
# Returns : 
# { 
#   "PD": {"value": 0.0090, "top_factors": [...]},
#   "Anomaly": {"score": 0.0955, "top_factors": [...]},
#   "RiskLabel": {"label": "LOW", "drivers": [...]},
#   "HybridScore": {"value": 585.6, "factors": [...]},
#   "RL_Recommendation": {"action": "APPROVE_HIGH", "rationales": [...]}
# }

# Top Factors 👉 Which customer details most affected this calculation of PD or Anomaly?
# (When Continuous Numeric Variables are used Top Factors are most affected variables)

# Drivers 👉 Which signals made the system label the customer as LOW, MEDIUM, or HIGH risk?
# (When Categorical Variables are used Drivers are most affected variables)

# Factors 👉 Which things changed the final credit score?   

# Rationales 👉 Why the system finally said APPROVE or REJECT.
# (Policy Justification)

class CreditDecisionEngine:
    
    def __init__(self):
        # Background matrices used by explainers
        X_pd_bg     = registry.pd_scaler.transform(registry.bg_data[registry.pd_features])
        X_hybrid_bg = registry.bg_data[registry.hybrid_features]

        # 1. PD Score ->LinearExplainer  -> logistic regression
        self.pd_explainer     = shap.LinearExplainer(registry.pd_model, X_pd_bg)
        # 2. Anomaly Score -> TreeExplainer    -> optimised for tree ensembles
        self.if_explainer     = shap.TreeExplainer(registry.iso_model)
        # 3. Risk Label -> TreeExplainer    -> optimised for tree ensembles
        self.risk_explainer   = shap.TreeExplainer(registry.risk_model)
        # 4. Hybrid Score -> Auto-backend detection for the gradient-boosting hybrid model
        self.hybrid_explainer = shap.Explainer(registry.hybrid_model, X_hybrid_bg)

        # 5. RL Recommendation -> KernelExplainer
        # KernelExplainer only needs a prototype
        # So we can send Demo 3 Rows only
        rl_bg = np.array([[0.1, 0.1, 600], [0.5, 0.5, 400], [0.1, 0.8, 400]])
        self.rl_explainer = shap.KernelExplainer(self._q_policy_func, rl_bg)
    
    # Q Policy Function : Use Q Table to get the best action
    def _q_policy_func(self, X):
        results = []
        for row in X:
            s = (np.digitize(row[0], registry.q_bins['pd']),
                 np.digitize(row[1], registry.q_bins['anom']),
                 np.digitize(row[2], registry.q_bins['cs']))
            q_vals = registry.q_table.get(s, np.zeros(4))
            results.append(np.max(q_vals))
        return np.array(results)
    # Top SHAP Features : Get the top k features with highest absolute SHAP values
    def _top_shap_features(self, values, names, k=3):
        idx = np.argsort(np.abs(values))[::-1][:k]
        return [f"{BUSINESS_MAPPING.get(names[i], names[i])} ({values[i]:+.3f})" for i in idx]
    
    def get_decision_explanation(self, input_row, explain=True):
        df_input = pd.DataFrame([input_row])
        response = {}
        
        # 1. PD Layer
        X_pd = registry.pd_scaler.transform(df_input[registry.pd_features])
        pd_val = registry.pd_model.predict_proba(X_pd)[0, 1]
        response["PD"] = {"value": round(float(pd_val), 4)}
        
        if explain:
            pd_exp = self.pd_explainer(X_pd)
            pd_shap_vals = pd_exp.values.flatten()
            response["PD"]["top_factors"] = self._top_shap_features(pd_shap_vals, registry.pd_features)
        
        # 2. Anomaly Layer
        X_if = registry.if_scaler.transform(df_input[registry.if_features])
        if_score = registry.iso_model.decision_function(X_if)[0]
        # anomalyFlag: 1 = anomaly, 0 = normal  (threshold mirrors notebook)
        anomaly_flag = 1 if if_score < -0.05 else 0
        response["Anomaly"] = {
            "score":       round(float(if_score), 4),
            "anomalyFlag": anomaly_flag,
        }

        if explain:
            if_exp = self.if_explainer(X_if)
            if_vals = if_exp.values.flatten()
            response["Anomaly"]["top_factors"] = self._top_shap_features(if_vals, registry.if_features)
        
        # 3. Risk Layer
        df_risk = df_input.copy()
        df_risk['PD']          = pd_val
        df_risk['anomalyFlag'] = anomaly_flag           # reuse already-computed flag
        X_risk     = df_risk[registry.risk_features]
        risk_idx   = int(registry.risk_model.predict(X_risk)[0])
        risk_label = ["LOW", "MEDIUM", "HIGH"][risk_idx]
        response["RiskLabel"] = {"label": risk_label}
        
        if explain:
            risk_exp = self.risk_explainer(X_risk)
            if risk_exp.values.ndim == 3:
                risk_vals = risk_exp.values[0, :, risk_idx]
            else:
                risk_vals = risk_exp.values.flatten()
            response["RiskLabel"]["drivers"] = self._top_shap_features(risk_vals, registry.risk_features)
        
        # 4. Hybrid Score Layer
        X_hyb = df_input[registry.hybrid_features]
        score_val = registry.hybrid_model.predict(X_hyb)[0]
        response["HybridScore"] = {"value": round(float(score_val), 1)}
        
        if explain:
            hyb_exp = self.hybrid_explainer(X_hyb)
            hyb_vals = hyb_exp.values.flatten()
            response["HybridScore"]["factors"] = self._top_shap_features(hyb_vals, registry.hybrid_features)
        
        # 5. RL Action Layer
        anom_norm = np.clip(1.0 - (if_score + 0.5), 0, 1)
        X_rl = np.array([[pd_val, anom_norm, score_val]])
        s = (np.digitize(X_rl[0][0], registry.q_bins['pd']),
             np.digitize(X_rl[0][1], registry.q_bins['anom']),
             np.digitize(X_rl[0][2], registry.q_bins['cs']))
        
        action_idx = int(np.argmax(registry.q_table.get(s, np.zeros(4))))
        actions = ["REJECT", "APPROVE_LOW", "APPROVE_MEDIUM", "APPROVE_HIGH"]
        response["RL_Recommendation"] = {"action": actions[action_idx]}
        
        if explain:
            rl_exp = self.rl_explainer.shap_values(X_rl, silent=True)
            rl_vals = rl_exp.flatten()
            response["RL_Recommendation"]["rationales"] = self._top_shap_features(rl_vals, registry.q_features)
        
        return response


# Global engine instance
engine = CreditDecisionEngine()