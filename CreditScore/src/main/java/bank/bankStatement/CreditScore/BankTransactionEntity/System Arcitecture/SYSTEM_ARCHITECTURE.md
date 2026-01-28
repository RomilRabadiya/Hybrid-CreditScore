# 🏛️ Hybrid Credit Score System Architecture

## Overview
This document outlines the **7-Layer Architecture** of the Hybrid Credit Scoring System, designed for scalability, compliance, and explainable AI decision-making.
---

## 🔹 Layer 1: User & Input
![Layer 1 Diagram](/Users/romiljitendrabhai/Desktop/Hybrid%20Credit%20Score/System%20Arcitecture/Screenshot%202026-01-29%20at%201.56.57%E2%80%AFAM.png)
**Identity & Interaction Layer**

*   **Core Identifier**: PAN-Based Identity
*   **User Interface**:
    *   **Input**: PAN Number
    *   **Action**: "Generate Bank Statement" button
*   **Key Behavior**:
    *   Deterministic: Same PAN → Always generates the exact same bank statement.
    *   PAN is the sole identifier for the session.

---

## 🔹 Layer 2: Bank Statement Generation
![Layer 2 Diagram](/Users/romiljitendrabhai/Desktop/Hybrid%20Credit%20Score/System%20Arcitecture/Screenshot%202026-01-29%20at%201.52.29%E2%80%AFAM.png)
**Data Streaming Layer**

*   **Service**: `BankDataSimulationService`
*   **Role**: Simulates realistic banking data streams.
*   **Output**: `Stream<BankTransaction>`
*   **Volume**: 5,000 - 10,000 transactions per year.
*   **Entity: `BankTransaction`**:
    *   Date, Direction (INFLOW/OUTFLOW), Nature (SALARY, EMI, RENT...), Channel (UPI, NEFT), Amount, Balance (Before/After).
*   **Properties**: Immutable, Ledger-safe, Streaming, Low memory footprint.

---

## 🔹 Layer 3: Rule Engine
![Layer 3 Diagram](/Users/romiljitendrabhai/Desktop/Hybrid%20Credit%20Score/System%20Arcitecture/Screenshot%202026-01-29%20at%201.52.59%E2%80%AFAM.png)
**Compliance & Governance Core**

*   **Service**: `RuleBasedCreditScoreService`
*   **Purpose**: Deterministic, explainable scoring (Compliance-first).
*   **7 Core Rule Sections**:
    1.  Income Strength
    2.  Income Stability
    3.  Expense Discipline
    4.  EMI Burden
    5.  Balance Health
    6.  Bounce Discipline
    7.  Account Vintage
*   **Output**:
    *   **Rule Score**: 300 - 900
    *   **Breakdown**: Detailed contribution of each rule.
> 💡 **Note**: Rules are executed *before* any ML model to ensure regulatory compliance.

---

## 🔹 Layer 4: Feature Extraction
![Layer 4 Diagram](/Users/romiljitendrabhai/Desktop/Hybrid%20Credit%20Score/System%20Arcitecture/Screenshot%202026-01-29%20at%201.53.27%E2%80%AFAM.png)
**The "Brain" - Single Pass Accumulator**

*   **Component**: `FeatureAccumulator`
*   **Pattern**: Single-pass stream processing.
*   **Input**: Consumes `Stream<BankTransaction>`.
*   **Derived Feature Vector**:
    *   `avgMonthlyIncome`
    *   `incomeCV` (Coefficient of Variation)
    *   `expenseRatio`
    *   `emiRatio`
    *   `avgMonthlyBalance`
    *   `bounceCount`
    *   `accountAgeMonths`
    *   `anomalyFlag` (Initially false)
> ⚠️ **Critical**: ML models *never* read raw transactions. They only see this derived feature vector.

---

## 🔹 Layer 5: Machine Learning Intelligence
![Layer 5 Diagram](/Users/romiljitendrabhai/Desktop/Hybrid%20Credit%20Score/System%20Arcitecture/Screenshot%202026-01-29%20at%201.55.22%E2%80%AFAM.png)
**Multi-Model Ensemble**

| Model | Purpose | Output |
| :--- | :--- | :--- |
| **🌲 Random Forest** | Risk Classification | `LOW` / `MEDIUM` / `HIGH` Risk |
| **🚀 Gradient Boosting** | Precise Scoring | Score `300` - `900` |
| **🕵️ Isolation Forest** | Fraud/Anomaly Detection | `anomalyDetected` = `true`/`false` |
| **📉 Logistic Regression** | Baseline Validation | Probability of Default (PD) |

**Anomaly Detection Capabilities**:
*   Cash Structuring (e.g., ₹49,900 withdrawals)
*   Sudden massive inflow spikes
*   Expense > Income

---

## 🔹 Layer 6: AI Decision Strategy
![Layer 6 Diagram](/Users/romiljitendrabhai/Desktop/Hybrid%20Credit%20Score/System%20Arcitecture/Screenshot%202026-01-29%20at%201.55.33%E2%80%AFAM.png)
**Reinforcement Learning (RL) Engine**

*   **Model**: Q-Learning (Offline Trained)
*   **Inputs**:
    *   Rule Score
    *   ML Risk Bucket
    *   ML Score
    *   Anomaly Flag
*   **Actions (Outputs)**:
    1.  ✅ **APPROVE**
    2.  ⚠️ **MANUAL REVIEW**
    3.  ❌ **REJECT**
*   **Reward Function**: Optimizes for Profit, minimizes Default Loss and Fraud Penalty.
> 🔒 **Safety Notice**: RL chooses the *decision* (Action), it does **NOT** alter the calculated Credit Score.

---

## 🔹 Layer 7: AI Explanation & Summary
![Layer 7 Diagram](/Users/romiljitendrabhai/Desktop/Hybrid%20Credit%20Score/System%20Arcitecture/Screenshot%202026-01-29%20at%201.55.44%E2%80%AFAM.png)
**Trust & Transparency Layer**

*   **Powered By**: SHAP (SHapley Additive exPlanations) + Rule Logic.
*   **Final Output Panel**:
    *   Final Credit Score
    *   Risk Category
    *   Decision (Approve/Review/Reject)
*   **Explanation Examples**:
    *   "EMI ratio reduced score by -42 points"
    *   "Stable income added +35 points"
    *   "Anomaly detected → Triggered Manual Review"
*   **Visuals**:
    *   Contribution Bar Chart
    *   Feature Importance Graph
    *   Rule vs. ML Comparison
> 💡 **Goal**: Human-readable, regulator-ready explanations for every decision.
