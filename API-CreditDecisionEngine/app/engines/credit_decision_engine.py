import pandas as pd
import numpy as np
import shap
import warnings
from app.core.model_registry import registry
from app.schemas.credit import (
    CreditDecisionResponse,
    PDResponse,
    AnomalyResponse,
    RiskLabelResponse,
    HybridScoreResponse,
    RLRecommendationResponse,
)

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

# { 
#   "PD": {"Probability_of_Default": 0.0090, "top_factors": ["Monthly Income Level (+0.002)", "Income Volatility (-0.001)", "Monthly Expense Burden (+0.001)"]},
#   "Anomaly": {"Anomaly_Score": 0.0955, "Anomaly_Flag": 0, "top_factors": ["Unusual Transaction Behavior (+0.002)", "Anomaly Signal Intensity (-0.001)", "Consolidated Credit Score (+0.001)"]},
#   "RiskLabel": {"Risk_Label": "LOW", "Drivers": ["Probability_of_Default (+0.002)", "Anomaly_Score (-0.001)", "Consolidated Credit Score (+0.001)"]},
#   "HybridScore": {"Hybrid_Score": 585.6, "factors": ["Probability_of_Default (+0.002)", "Anomaly_Score (-0.001)", "Consolidated Credit Score (+0.001)"]},
#   "RL_Recommendation": {"Recommendation": "APPROVE_HIGH", "Rationales": ["Probability_of_Default (+0.002)", "Anomaly_Score (-0.001)", "Consolidated Credit Score (+0.001)"]}
# }

# Top Factors 👉 Which customer details most affected this calculation of PD or Anomaly?
# (When Continuous Numeric Variables are used Top Factors are most affected variables)

# Drivers 👉 Which signals made the system label the customer as LOW, MEDIUM, or HIGH risk?
# (When Categorical Variables are used Drivers are most affected variables)

# Factors 👉 Which things changed the final credit score?   

# Rationales 👉 Why the system finally said APPROVE or REJECT.
# (Policy Justification)

class CreditDecisionEngine:
    
    # 1. This is the constructor of the class
    # It initializes the explainers

    # 1. PD Score ->LinearExplainer  -> logistic regression
    # 2. Anomaly Score -> TreeExplainer    -> optimised for tree ensembles
    # 3. Risk Label -> TreeExplainer    -> optimised for tree ensembles
    # 4. Hybrid Score -> Auto-backend detection for the gradient-boosting hybrid model
    # 5. RL Recommendation -> KernelExplainer
    
    def __init__(self):
        # Background matrices used by explainers
        X_pd_bg     = registry.pd_scaler.transform(registry.bg_data[registry.pd_features])
        X_hybrid_bg = registry.bg_data[registry.hybrid_features]

        
        self.pd_explainer     = shap.LinearExplainer(registry.pd_model, X_pd_bg)
        self.if_explainer     = shap.TreeExplainer(registry.iso_model)
        self.risk_explainer   = shap.TreeExplainer(registry.risk_model)
        self.hybrid_explainer = shap.Explainer(registry.hybrid_model, X_hybrid_bg)

        # KernelExplainer only needs a prototype
        # So we can send Demo 3 Rows only
        rl_bg = np.array([[0.1, 0.1, 600], [0.5, 0.5, 400], [0.1, 0.8, 400]])
        self.rl_explainer = shap.KernelExplainer(self._q_policy_func, rl_bg)
    
    
    # 2. Q Policy Function : Use Q Table to get the best action
    def _q_policy_func(self, X):
        results = []
        for row in X:
            s = (np.digitize(row[0], registry.q_bins['pd']),
                 np.digitize(row[1], registry.q_bins['anom']),
                 np.digitize(row[2], registry.q_bins['cs']))
            q_vals = registry.q_table.get(s, np.zeros(4))
            results.append(np.max(q_vals))
        return np.array(results)
    
    # 3. Top SHAP Features : Get the top k features with highest absolute SHAP values
    # It take Input as SHAP values, Feature Names
    # It return Top k features with highest absolute SHAP values 
    # Example : {
    #               "Monthly Income Level (+0.002)", 
    #               "Income Volatility (-0.001)", 
    #               "Monthly Expense Burden (+0.001)"
    #           }

    def _top_shap_features(self, values, names, k=3):
        idx = np.argsort(np.abs(values))[::-1][:k]
        return [f"{BUSINESS_MAPPING.get(names[i], names[i])} ({values[i]:+.3f})" for i in idx]
    

    # 4. Get Decision call by Service Layer
    def get_decision(self, input_row):
        # Input Row : Python Dictionary
        # Convert input row to DataFrame 
        # (DataFrame : Row + Column + Values)
        df_input = pd.DataFrame([input_row])
        response = {}



        # 1. PD Layer : Logistic Regression


        # Step 1 : Feature Selection + Scaling By Calling "/ML/2* Models/2. PD_Model/artifacts/pd_scaler.joblib"
        X_pd = registry.pd_scaler.transform(df_input[registry.pd_features])
        
        # Step 2 : Call Logistic Regression Model Method predict_proba 
        # To Predict Probability of Default By Calling "/ML/2* Models/2. PD_Model/artifacts/pd_model.joblib"
        pd_val = registry.pd_model.predict_proba(X_pd)[0, 1]
        # Store Probability of Default to "response" Dictionary
        response["PD"] = {"Probability_of_Default": round(float(pd_val), 4)}
        
        # Step 3 : SHAP Explanation : Top Factors
        # Call SHAP LinearExplainer Method explainer() to get SHAP values
        pd_exp = self.pd_explainer(X_pd)
        # Get SHAP values and flatten them : (samples, features) 
        # For Example pd_exp.values[0(Sample Index)][1(Feature Index)] = 0.2
        pd_shap_vals = pd_exp.values.flatten()
        # Get Top Factors
        response["PD"]["top_factors"] = self._top_shap_features(pd_shap_vals, registry.pd_features)


    
        # 2. Anomaly Layer : Isolation Forest


        # Step 1 : Feature Selection + Scaling using "/ML/2* Models/3. Anomaly_Model/artifacts/if_scaler.joblib"
        X_if = registry.if_scaler.transform(df_input[registry.if_features])

        # Step 2 : Call Isolation Forest Model Method decision_function 
        # To Predict Anomaly Score By Calling "/ML/2* Models/3. Anomaly_Model/artifacts/iso_model.joblib"
        if_score = registry.iso_model.decision_function(X_if)[0]
        # anomalyFlag: 1 = anomaly, 0 = normal
        anomaly_flag = 1 if if_score < -0.05 else 0
        # Store Anomaly Score and Anomaly Flag to "response" Dictionary
        response["Anomaly"] = {
            "Anomaly_Score": round(float(if_score), 4),
            "Anomaly_Flag":  anomaly_flag,
        }

        # Step 3 : SHAP Explanation : Top Factors
        # Call SHAP TreeExplainer Method explainer() to get SHAP values
        if_exp = self.if_explainer(X_if)
        if_vals = if_exp.values.flatten()
        response["Anomaly"]["top_factors"] = self._top_shap_features(if_vals, registry.if_features)
        

        # 3. Risk Layer : Random Forest
        

        # Step 1 : Copy Input Data
        df_risk = df_input.copy()

        # Step 2 : Add PD and Anomaly Flag to DataFrame
        df_risk['PD']          = pd_val
        df_risk['anomalyFlag'] = anomaly_flag

        # Step 3 : Feature Selection
        X_risk     = df_risk[registry.risk_features]

        #Step 4 : Call Random Forest Model Method predict 
        # To Predict Risk Label By Calling "/ML/2* Models/4. Risk_Model/artifacts/risk_model.joblib"
        risk_idx   = int(registry.risk_model.predict(X_risk)[0])
        risk_label = ["LOW", "MEDIUM", "HIGH"][risk_idx]
        # Store Risk Label to "response" Dictionary
        response["RiskLabel"] = {"Risk_Label": risk_label}
        
        # Step 5* : SHAP Explanation : Top Factors
        # Call SHAP TreeExplainer Method explainer() to get SHAP values
        risk_exp = self.risk_explainer(X_risk)
        # Multiple classes SHAP returns 3D array : (samples, features, classes)
        # risk_exp.values[0, :, risk_idx] : First sample, all features for risk_idx class
        # First sample only because in treeexplainer we are only passing one sample
        risk_vals = risk_exp.values[0, :, risk_idx]
        #Get Top Factors
        response["RiskLabel"]["Drivers"] = self._top_shap_features(risk_vals, registry.risk_features)
        


        # 4. Hybrid Score Layer : Gradient Boosting

        # Step 1 : Feature Selection + Scaling using "/ML/2* Models/5. Hybrid_Model/artifacts/hybrid_scaler.joblib"
        X_hyb = df_input[registry.hybrid_features]
        # Step 2 : Call Gradient Boosting Model Method predict 
        # To Predict Hybrid Score By Calling "/ML/2* Models/5. Hybrid_Model/artifacts/hybrid_model.joblib"
        score_val = registry.hybrid_model.predict(X_hyb)[0]
        # Step 3 : Store Hybrid Score to "response" Dictionary
        response["HybridScore"] = {"Hybrid_Score": round(float(score_val), 1)}
        
        # Step 4 : SHAP Explanation : Top Factors
        # Call SHAP Explanation Method explainer() to get SHAP values
        hyb_exp = self.hybrid_explainer(X_hyb)
        hyb_vals = hyb_exp.values.flatten()
        # Get Top Factors
        response["HybridScore"]["factors"] = self._top_shap_features(hyb_vals, registry.hybrid_features)
        


        # 5. RL Action Layer : Q-Learning

        # Step 1 : Normalize Anomaly Score
        anom_norm = np.clip(1.0 - (if_score + 0.5), 0, 1)
        # Step 2 : Create RL Input
        X_rl = np.array([[pd_val, anom_norm, score_val]])
        # Step 3 : Discretize Input
        # Q-Learning uses discrete states
        # So you convert continuous values into bins
        s = (np.digitize(X_rl[0][0], registry.q_bins['pd']),
             np.digitize(X_rl[0][1], registry.q_bins['anom']),
             np.digitize(X_rl[0][2], registry.q_bins['cs']))
        
        # Step 4 : Get Action
        action_idx = int(np.argmax(registry.q_table.get(s, np.zeros(4))))
        # Step 5 : Get Action
        actions = ["REJECT", "APPROVE_LOW", "APPROVE_MEDIUM", "APPROVE_HIGH"]
        response["RL_Recommendation"] = {"Recommendation": actions[action_idx]}
        
        # Step 6 : SHAP Explanation : Top Factors
        rl_exp = self.rl_explainer.shap_values(X_rl, silent=True)
        rl_vals = rl_exp.flatten()
        # Get Top Factors
        response["RL_Recommendation"]["Rationales"] = self._top_shap_features(rl_vals, registry.q_features)
        
        return CreditDecisionResponse(
            PD=PDResponse(
                Probability_of_Default=round(float(pd_val), 4),
                top_factors=response["PD"]["top_factors"],
            ),
            Anomaly=AnomalyResponse(
                Anomaly_Score=round(float(if_score), 4),
                Anomaly_Flag=anomaly_flag,
                top_factors=response["Anomaly"]["top_factors"],
            ),
            RiskLabel=RiskLabelResponse(
                Risk_Label=risk_label,
                Drivers=response["RiskLabel"]["Drivers"],
            ),
            HybridScore=HybridScoreResponse(
                Hybrid_Score=round(float(score_val), 1),
                factors=response["HybridScore"]["factors"],
            ),
            RL_Recommendation=RLRecommendationResponse(
                Recommendation=actions[action_idx],
                Rationales=response["RL_Recommendation"]["Rationales"],
            ),
        )


# Global engine instance
engine = CreditDecisionEngine()