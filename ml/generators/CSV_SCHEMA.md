# 🗂 FINAL CSV SCHEMA


## 📄 Feature Columns (Model Inputs)

These are the core observable behavioral features used by all ML models:

| Column Name | Description | Purpose |
|-------------|-------------|---------|
| `avgMonthlyIncome` | Mean monthly inflow | Measures repayment capacity |
| `incomeCV` | Income volatility (std / mean) | Measures income stability |
| `expenseRatio` | Expense / income | Measures financial discipline |
| `emiRatio` | EMI / income | Measures leverage & debt burden |
| `avgMonthlyBalance` | Liquidity signal | Measures cash buffer |
| `bounceCount` | Payment failures (6–12 months) | Measures payment reliability |
| `accountAgeMonths` | Credit vintage | Measures experience & maturity |


---

## 🚨 Anomaly & Rule Signals (Non-ML Anchors)

| Column Name | Type | Range | Description |
|-------------|------|-------|-------------|
| `anomalyFlag` | Binary | 0 or 1 | Isolation Forest output |
| `ruleScore` | Integer | 0–100 | Deterministic policy score |


---

## 🎯 Label Columns (Derived AFTER Data Generation)

| Column Name | Type | Range | Target Model |
|-------------|------|-------|--------------|
| `pdLabel` | Binary | 0 or 1 | Logistic Regression |
| `riskLabel` | Categorical | LOW / MEDIUM / HIGH | Random Forest |
| `finalScore` | Continuous | 300–900 | Gradient Boosting |
| `decisionLabel` | Categorical | APPROVE / REVIEW / REJECT | Q-Learning |


---

## 🧠 MODEL-WISE COLUMN USAGE (WHY THIS WORKS)

| Model | What It Consumes | What It Learns | Why It Works |
|-------|------------------|----------------|--------------|
| **Logistic Regression** | `pdLabel` | Learns clean PD monotonicity | Binary outcome, linear relationships, interpretable coefficients |
| **Random Forest** | `riskLabel` | Learns feature interactions | Captures non-linear patterns, EMI × CV interactions, robust to outliers |
| **Gradient Boosting** | `finalScore` | Learns smooth score surface | Continuous target, sequential refinement, captures subtle gradients |
| **Isolation Forest** | Feature columns only | Detects rare behavior | Unsupervised, no labels needed, finds anomalies in feature space |
| **Q-Learning** | State → `decisionLabel` | Optimizes approval policy | Learns decision strategy, maximizes long-term reward, policy optimization |
| **SHAP** | All models | Global & local explainability | Model-agnostic, feature importance, regulatory compliance |

---

## 📊 Complete CSV Structure

```csv
avgMonthlyIncome,incomeCV,expenseRatio,emiRatio,avgMonthlyBalance,bounceCount,accountAgeMonths,anomalyFlag,ruleScore,pdLabel,riskLabel,finalScore,decisionLabel
145000,0.12,0.62,0.38,85000,1,42,0,72,0,MEDIUM,685,REVIEW
280000,0.04,0.35,0.15,220000,0,96,0,88,0,LOW,812,APPROVE
55000,0.48,0.82,0.42,12000,4,18,0,38,1,HIGH,425,REJECT
```

---
