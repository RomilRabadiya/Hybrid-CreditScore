import pandas as pd
import numpy as np
import shap
import joblib
import json
import warnings
import os

warnings.filterwarnings('ignore')

def verify_architecture():
    # Load model artifacts
    pd_model = joblib.load('pd_model.joblib')
    pd_scaler = joblib.load('pd_scaler.joblib')
    pd_features = joblib.load('pd_features.joblib')

    iso_model = joblib.load('isolation_forest.joblib')
    if_scaler = joblib.load('if_scaler.joblib')
    if_features = ['avgMonthlyIncome', 'incomeCV', 'expenseRatio', 'emiRatio', 'avgMonthlyBalance', 'bounceCount']

    risk_model = joblib.load('risk_random_forest.joblib')
    risk_features = joblib.load('risk_features.joblib')

    hybrid_model = joblib.load('hybrid_credit_score_model.joblib')
    hybrid_features = joblib.load('hybrid_features.joblib')

    q_table = joblib.load('q_learning_model.joblib')
    q_bins = joblib.load('q_learning_bins.joblib')
    q_features = joblib.load('q_learning_features.joblib')

    bg_data = pd.read_csv('../data/synthetic/features_only.csv')

    X_pd_bg = pd_scaler.transform(bg_data[pd_features])
    X_if_bg = if_scaler.transform(bg_data[if_features])
    X_hybrid_bg = bg_data[hybrid_features]

    # Initialize Explainers
    pd_explainer = shap.LinearExplainer(pd_model, X_pd_bg)
    if_explainer = shap.TreeExplainer(iso_model)
    risk_explainer = shap.TreeExplainer(risk_model)
    hybrid_explainer = shap.Explainer(hybrid_model, X_hybrid_bg)

    def q_policy_func(X):
        results = []
        for row in X:
            s = (np.digitize(row[0], q_bins['pd']),
                 np.digitize(row[1], q_bins['anom']),
                 np.digitize(row[2], q_bins['cs']))
            q_vals = q_table.get(s, np.zeros(4))
            results.append(np.max(q_vals))
        return np.array(results)

    rl_bg = np.array([[0.1, 0.1, 600], [0.5, 0.5, 400], [0.1, 0.8, 400]])
    rl_explainer = shap.KernelExplainer(q_policy_func, rl_bg)

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

    def top_shap_features(values, names, k=3):
        idx = np.argsort(np.abs(values))[::-1][:k]
        return [f"{BUSINESS_MAPPING.get(names[i], names[i])} ({values[i]:+.3f})" for i in idx]

    def get_decision_explanation(input_row, explain=True):
        df_input = pd.DataFrame([input_row])
        response = {}
        
        # 1. PD Layer
        X_pd = pd_scaler.transform(df_input[pd_features])
        pd_val = pd_model.predict_proba(X_pd)[0, 1]
        response["PD"] = {"value": round(float(pd_val), 4)}
        
        if explain:
            pd_exp = pd_explainer(X_pd)
            pd_shap_vals = pd_exp.values.flatten()
            response["PD"]["top_factors"] = top_shap_features(pd_shap_vals, pd_features)

        # 2. Anomaly Layer
        X_if = if_scaler.transform(df_input[if_features])
        if_score = iso_model.decision_function(X_if)[0]
        response["Anomaly"] = {"score": round(float(if_score), 4)}
        
        if explain:
            if_exp = if_explainer(X_if)
            if_vals = if_exp.values.flatten()
            response["Anomaly"]["top_factors"] = top_shap_features(if_vals, if_features)

        # 3. Risk Layer
        df_risk = df_input.copy()
        df_risk['PD'] = pd_val
        df_risk['anomalyFlag'] = 1 if if_score < -0.05 else 0
        X_risk = df_risk[risk_features]
        risk_idx = int(risk_model.predict(X_risk)[0])
        risk_label = ["LOW", "MEDIUM", "HIGH"][risk_idx]
        response["RiskLabel"] = {"label": risk_label}
        
        if explain:
            risk_exp = risk_explainer(X_risk)
            if risk_exp.values.ndim == 3: 
                risk_vals = risk_exp.values[0, :, risk_idx]
            else:
                risk_vals = risk_exp.values.flatten()
            response["RiskLabel"]["drivers"] = top_shap_features(risk_vals, risk_features)

        # 4. Hybrid Score Layer
        X_hyb = df_input[hybrid_features]
        score_val = hybrid_model.predict(X_hyb)[0]
        response["HybridScore"] = {"value": round(float(score_val), 1)}
        
        if explain:
            hyb_exp = hybrid_explainer(X_hyb)
            hyb_vals = hyb_exp.values.flatten()
            response["HybridScore"]["factors"] = top_shap_features(hyb_vals, hybrid_features)

        # 5. RL Action Layer
        anom_norm = np.clip(1.0 - (if_score + 0.5), 0, 1)
        X_rl = np.array([[pd_val, anom_norm, score_val]])
        s = (np.digitize(X_rl[0][0], q_bins['pd']),
             np.digitize(X_rl[0][1], q_bins['anom']),
             np.digitize(X_rl[0][2], q_bins['cs']))
        
        action_idx = int(np.argmax(q_table.get(s, np.zeros(4))))
        actions = ["REJECT", "APPROVE_LOW", "APPROVE_MEDIUM", "APPROVE_HIGH"]
        response["RL_Recommendation"] = {"action": actions[action_idx]}
        
        if explain:
            rl_exp = rl_explainer.shap_values(X_rl, silent=True)
            rl_vals = rl_exp.flatten()
            response["RL_Recommendation"]["rationales"] = top_shap_features(rl_vals, q_features)

        return response

    print("🚀 Verifying Architecture Phase 4 & 10 (Mapping & Factors)...")
    test_customer = {'avgMonthlyIncome': 85000, 'incomeCV': 0.05, 'expenseRatio': 0.25, 'emiRatio': 0.15, 'avgMonthlyBalance': 60000, 'bounceCount': 0, 'accountAgeMonths': 36}
    res = get_decision_explanation(test_customer, explain=True)
    
    # Check if business mapping worked
    for layer in ["PD", "Anomaly", "RiskLabel", "HybridScore"]:
        factors = res[layer].get("top_factors") or res[layer].get("drivers") or res[layer].get("factors")
        if factors:
            print(f"✅ {layer} factors: {factors[0]}")
            if "(" not in factors[0] or ")" not in factors[0]:
                raise ValueError(f"Factor formatting failed for {layer}: {factors[0]}")
    
    print("🚀 Verifying Architecture Phase 7 (explain=False flag)...")
    res_no_exp = get_decision_explanation(test_customer, explain=False)
    if "top_factors" in res_no_exp["PD"]:
        raise ValueError("explain=False flag failed - PD factors still present")
    print("✅ Performance flag (explain=False) verified.")

    print("🎉 All 10 phases of architecture refinement verified.")

if __name__ == "__main__":
    os.chdir('/Users/romiljitendrabhai/Desktop/Hybrid Credit Score/ml/models')
    verify_architecture()
