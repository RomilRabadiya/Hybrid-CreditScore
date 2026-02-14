# 🏗 SHAP Architecture for Your Entire ML Pipeline

This document outlines the end-to-end architecture for integrating SHAP (SHapley Additive exPlanations) into the Hybrid Credit Score pipeline.

---

## 🔁 1️⃣ End-to-End Data Flow Architecture

### 📥 Step A: Raw Input Features
From banking system:
- `avgMonthlyIncome`, `incomeCV`, `expenseRatio`, `emiRatio`, `avgMonthlyBalance`, `bounceCount`, `accountAgeMonths`.

These go into 3 parallel model layers.

---

## 🧠 2️⃣ Model Layer Architecture

### 🔹 Model 1: PD Model (Logistic Regression)
- **Input Features**: `avgMonthlyIncome`, `incomeCV`, `expenseRatio`, `emiRatio`, `avgMonthlyBalance`, `bounceCount`.
- **Output**: PD Probability (0–1), Default Prediction (0 or 1).
- **SHAP Use**: Explain probability of default, Identify risk drivers.
- **Example Output**: 
    - PD = 0.68
    - Top Drivers: + High EMI ratio, + High income volatility, - Strong balance.

### 🔹 Model 2: Anomaly Detection (Isolation Forest)
- **Input Features**: `avgMonthlyIncome`, `incomeCV`, `expenseRatio`, `avgMonthlyBalance`.
- **Output**: `anomaly_score`, `anomalyFlag` (0 or 1).
- **SHAP Use**: Explain unusual financial behavior, Detect suspicious income patterns.
- **Example**:
    - Anomaly Score = 0.82
    - Reason: + Sudden income spike, + Expense ratio abnormal.

### 🔹 Model 3: Risk Label Model (Random Forest)
- **Input Features**: All financial features + PD (from Model 1) + `anomalyFlag` (from Model 2) + `accountAgeMonths`.
- **Output**: `riskLabel` (Low / Medium / High), Probabilities.
- **SHAP Use**: Explain why applicant is High Risk, Show combined effect of PD + anomaly.
- **Example**:
    - Risk Label = HIGH
    - Top Drivers: + PD probability (0.68), + Bounce count, + High EMI.

---

## 🔄 3️⃣ Hybrid Credit Score Engine
After ML layers:
`Final Score = 0.6 × Rule-Based Score + 0.4 × ML Predicted Score`

SHAP here explains:
- Why ML part pushed score down.
- Which ML features reduced eligibility.

---

## 📊 4️⃣ Where SHAP Is Applied in Architecture

| Model | SHAP Type | Purpose |
| :--- | :--- | :--- |
| PD Model | LinearExplainer | Default reason |
| Anomaly Model | TreeExplainer | Behavioral deviation |
| Risk Label RF | TreeExplainer | Final risk classification |

---

## 🗂 5️⃣ Production Architecture With SHAP

**In Production Flow**:
`Input Data` → `Feature Engineering` → `PD Model → PD SHAP` → `Anomaly Model → Anomaly SHAP` → `Risk Model → Risk SHAP` → `Hybrid Score` → `Explanation Aggregator` → `API Response`

---

## 📦 6️⃣ Explanation Aggregator Layer (Important)
Instead of returning raw SHAP arrays, create:
```json
{
  "PD": {
      "value": 0.68,
      "top_factors": ["High EMI", "Income Volatility"]
  },
  "Anomaly": {
      "score": 0.82,
      "reason": ["Income spike"]
  },
  "RiskLabel": {
      "label": "High",
      "drivers": ["PD", "Bounce Count"]
  }
}
```
This makes system explainable to business users, auditors, and regulators.

---

## 🧠 Advanced Design Decision: On-demand vs Real-time

- **Option 1 — Real-time SHAP**: Compute on every request. Slower but transparent.
- **Option 2 — On-demand SHAP**: Store features, compute explanation only if needed. **Recommended for Fintech** for better scalability.

---

## 🎯 How This Fits Your Credit Scoring System
1. **Layered Approach**: Keep SHAP separate for each layer.
2. **Persistence**: Store explanations with customer ID.
3. **Purity**: Never mix SHAP values across models.
