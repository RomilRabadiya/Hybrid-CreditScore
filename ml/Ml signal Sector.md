# 🧮 Ml signal Sector
## ML Signal : ML Model Outputs
*Converts ML model outputs into risk sectors (0-6 scale)*

---

## 📊 System Overview

This scoring engine transforms machine learning predictions into **7 risk bands** (0-6), where:
- **0** = Extremely Safe / Very Low Risk
- **6** = Extremely Risky / Very High Risk

### **Score Calculation Formula**

```
Final ML Score = Base Score + Σ(Sector Penalties)

Where:
├─ Base Score: 500 points
├─ Each sector contributes: -(sector_value × weight)
└─ Final range: 300-900
```

---

## 🎯 Sector Definitions

### **Sector A — PD (Probability of Default)**
*Output from PD Model (Logistic Regression)*

| PD Range | Sector | Meaning | Points Impact |
|----------|--------|---------|---------------|
| ≤ 0.05 | **0** | Extremely safe (< 5% default chance) | -0 |
| ≤ 0.10 | **1** | Very low risk (5-10%) | -15 |
| ≤ 0.20 | **2** | Low risk (10-20%) | -30 |
| ≤ 0.35 | **3** | Medium risk (20-35%) | -50 |
| ≤ 0.50 | **4** | Elevated risk (35-50%) | -75 |
| ≤ 0.70 | **5** | High risk (50-70%) | -100 |
| > 0.70 | **6** | Very high risk (> 70%) | -140 |

**Weight**: ×1.5 (Most Important)

---

### **Sector B — Anomaly Score (Isolation Forest)**
*Output from Anomaly Detection Model*

⚠️ **Note**: Lower (negative) scores indicate MORE anomalous behavior

| Anomaly Score | Sector | Meaning | Points Impact |
|---------------|--------|---------|---------------|
| ≥ 0.15 | **0** | Very normal transaction pattern | -0 |
| ≥ 0.05 | **1** | Normal behavior | -10 |
| ≥ 0.00 | **2** | Slight deviation | -20 |
| ≥ -0.05 | **3** | Mild anomaly detected | -35 |
| ≥ -0.10 | **4** | Moderate anomaly | -55 |
| ≥ -0.20 | **5** | Strong anomaly | -80 |
| < -0.20 | **6** | Extreme anomaly (fraud risk) | -120 |

**Weight**: ×1.2
---

### **Sector C — High Risk Probability**
*Output from Risk Label Model (prob_high)*

| prob_high | Sector | Meaning | Points Impact |
|-----------|--------|---------|---------------|
| ≤ 0.05 | **0** | Almost no high risk signal | -0 |
| ≤ 0.10 | **1** | Very low high-risk probability | -12 |
| ≤ 0.20 | **2** | Low high-risk probability | -25 |
| ≤ 0.35 | **3** | Medium high-risk probability | -40 |
| ≤ 0.50 | **4** | Elevated high-risk probability | -60 |
| ≤ 0.70 | **5** | High probability of high risk | -85 |
| > 0.70 | **6** | Dominant high risk (very likely) | -115 |

**Weight**: ×1.3

---

### **Sector D — Medium Risk Probability**
*Output from Risk Label Model (prob_medium)*

| prob_medium | Sector | Meaning | Points Impact |
|-------------|--------|---------|---------------|
| ≤ 0.10 | **0** | Minimal medium risk signal | -0 |
| ≤ 0.20 | **1** | Slight medium risk | -8 |
| ≤ 0.30 | **2** | Moderate medium risk | -16 |
| ≤ 0.45 | **3** | Strong medium risk signal | -28 |
| ≤ 0.60 | **4** | Dominant medium risk | -42 |
| ≤ 0.75 | **5** | Very dominant medium risk | -58 |
| > 0.75 | **6** | Extreme medium risk certainty | -75 |

**Weight**: ×0.8 (Lower weight - medium is transitional)

---

### **Sector E — Low Risk Probability**
*Output from Risk Label Model (prob_low)*

⚠️ **Note**: INVERSE logic - Higher probability = Safer customer = Lower sector

| prob_low | Sector | Meaning | Points Impact |
|----------|--------|---------|---------------|
| ≥ 0.80 | **0** | Very safe (high confidence) | -0 |
| ≥ 0.65 | **1** | Safe (good confidence) | -10 |
| ≥ 0.50 | **2** | Slightly safe (moderate) | -22 |
| ≥ 0.35 | **3** | Neutral / Uncertain | -38 |
| ≥ 0.20 | **4** | Weak low-risk signal | -56 |
| ≥ 0.10 | **5** | Risky (low confidence in safety) | -78 |
| < 0.10 | **6** | Very risky (no safety signal) | -105 |

**Weight**: ×1.1

---