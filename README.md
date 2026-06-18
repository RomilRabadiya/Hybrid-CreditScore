# 🏗 System Architecture

<p align="center">
  <img src="https://raw.githubusercontent.com/RomilRabadiya/Hybrid-CreditScore/main/Hybrid%20Credit%20Score%20Architecture.png" width="1400">
</p>

---

# ⚙️ Backend Workflow

<p align="center">
  <img src="https://raw.githubusercontent.com/RomilRabadiya/Hybrid-CreditScore/main/Backend%20Flow.png" width="1200">
</p>

---

# 🤖 ML Workflow

<p align="center">
  <img src="https://raw.githubusercontent.com/RomilRabadiya/Hybrid-CreditScore/main/ML%20Model%20Flow.png" width="1200">
</p>

# 🏦 Hybrid Credit Score & AI Decisioning System

> A multi-model AI-powered credit scoring platform that generates synthetic banking behavior from a PAN number, extracts financial features, performs risk analysis using multiple machine learning models, and produces an explainable credit decision.

---

# 📌 Project Overview

Traditional credit scoring systems rely heavily on bureau history and static rules.

This project introduces a **Hybrid Credit Score & Decisioning System** that combines:

* Rule-Based Credit Assessment
* Anomaly Detection
* Probability of Default Prediction
* Risk Classification
* Hybrid Credit Scoring
* Reinforcement Learning Decisioning

to generate a robust and explainable lending decision.

---

# 🎯 Problem Statement

Financial institutions need to answer:

* Is this customer risky?
* What is the probability of default?
* Is there suspicious banking behavior?
* What credit score should be assigned?
* Should the loan be approved, reviewed, or rejected?

This system answers all of the above using a layered AI architecture.

---

# 🏗 System Architecture

```text
User
 │
 ▼
React Frontend
 │
 ▼
Spring Boot Backend
 │
 ▼
Bank Statement Generator
 │
 ▼
Feature Extraction Engine
 │
 ▼
Engineered Feature Vector
 │
 ├── Anomaly Model
 │
 ├── PD Model
 │
 ├── Risk Label Model
 │
 ├── Hybrid Credit Score Model
 │
 └── RL Decision Engine
 │
 ▼
FastAPI Decision Service
 │
 ▼
Final Credit Decision
```

---

# 🚀 Technology Stack

## Frontend

* React
* Vite
* Axios
* React Router
* Framer Motion

## Backend

* Spring Boot
* Java 21
* Maven
* REST APIs
* Java Stream

## Machine Learning

* Python
* Scikit-Learn
* XGBoost
* Isolation Forest
* Random Forest
* Logistic Regression

## Decision Intelligence

* Q-Learning

## API Layer

* FastAPI

---

# 🔄 Complete Workflow

---

## Step 1: User Input

User enters:

```text
PAN Number
```

Example:

```text
ABCDE1234F
```

---

## Step 2: Bank Statement Generation

Backend generates deterministic banking behavior.

Same PAN always generates:

```text
Same Customer
Same Transactions
Same Features
Same Credit Score
```

Generated transactions include:

* Salary
* Rent
* EMI
* Utilities
* UPI
* Card Payments
* Cash Withdrawals

---

## Step 3: Feature Engineering

Raw transactions are transformed into ML features.

### Extracted Features

| Feature           |
| ----------------- |
| avgMonthlyIncome  |
| incomeCV          |
| expenseRatio      |
| emiRatio          |
| avgMonthlyBalance |
| bounceCount       |
| accountAgeMonths  |

Example:

| Feature           | Value     |
| ----------------- | --------- |
| avgMonthlyIncome  | 320283.48 |
| incomeCV          | 0.03      |
| expenseRatio      | 0.485     |
| emiRatio          | 0.086     |
| avgMonthlyBalance | 82434.68  |
| bounceCount       | 0         |
| accountAgeMonths  | 72        |

---

# 🤖 Multi-Model AI Pipeline

The system uses five specialized ML models.

---

# 1️⃣ Anomaly Detection Model

### Algorithm

```text
Isolation Forest
```

### Purpose

Detect:

* Fraud patterns
* Unusual transactions
* Suspicious account behavior

### Input

```text
Engineered Feature Vector
```

### Output

```text
anomalyFlag
```

Example:

```json
{
  "anomalyFlag": 0
}
```

---

# 2️⃣ Probability of Default Model

### Algorithm

```text
Logistic Regression
```

### Purpose

Estimate default probability.

### Input

```text
Engineered Features
```

### Output

```text
pdScore
```

Example:

```json
{
  "pdScore": 0.142
}
```

---

# 3️⃣ Risk Label Model

### Algorithm

```text
Random Forest Classifier
```

### Purpose

Convert financial behavior into risk category.

### Output

```text
LOW
MEDIUM
HIGH
```

Example:

```json
{
  "riskLabel": "MODERATE"
}
```

---

# 4️⃣ Hybrid Credit Score Model

### Algorithm

```text
Gradient Boosting Regressor
```

### Purpose

Generate final credit score.

### Inputs

* Features
* Anomaly Flag
* PD Score
* Risk Label

### Output

```text
Credit Score
300 - 900
```

Example:

```json
{
  "creditScore": 742
}
```

---

# 5️⃣ RL Decision Engine

### Algorithm

```text
Q-Learning
```

### Purpose

Generate lending action.

### Inputs

* Credit Score
* Risk Label
* PD Score
* Anomaly Flag

### Output

```text
APPROVE
REVIEW
REJECT
```

Example:

```json
{
  "decision": "APPROVE"
}
```

---

# 📊 Model Flow

```text
Features
   │
   ▼

Isolation Forest
   │
   ▼
anomalyFlag

   │
   ▼

Logistic Regression
   │
   ▼
pdScore

   │
   ▼

Random Forest
   │
   ▼
riskLabel

   │
   ▼

Gradient Boosting
   │
   ▼
creditScore

   │
   ▼

Q-Learning
   │
   ▼
APPROVE / REVIEW / REJECT
```

---

# 📁 Project Structure

```text
Hybrid Credit Score
│
├── Frontend/
│   ├── React
│   ├── Components
│   └── Dashboard UI
│
├── Backend/
│   ├── Spring Boot
│   ├── Controllers
│   ├── Services
│   ├── Models
│   └── Rule Engine
│
├── ML/
│   │
│   ├── 1. Generators
│   │
│   ├── 2. Models
│   │    ├── 1. Anomaly_model
│   │    ├── 2. PD_model
│   │    ├── 3. Risk_Label_model
│   │    ├── 4. Hybrid_CreditScore_model
│   │    └── 5. RL_model
│   │
│   ├── 3. Data
│   │
│   └── 4. Decision_Engines
│
└── API-CreditDecisionEngine/
    └── FastAPI Service
```

---

# 📂 Trained Model Artifacts

Generated artifacts include:

```text
isolation_forest.joblib

pd_model.joblib

risk_model.joblib

hybrid_credit_score_model.joblib

q_learning_model.joblib

credit_decision_engine.joblib
```

---

# 🌐 API Endpoints

## Credit Decision

```http
POST /api/credit/decision
```

### Request

```json
{
  "panNumber": "ABCDE1234F"
}
```

### Response

```json
{
  "creditScore": 742,
  "pdScore": 0.142,
  "riskLabel": "MODERATE",
  "anomalyStatus": "NORMAL",
  "decision": "APPROVE"
}
```

---

## Health Check

```http
GET /health
```

---

# 📈 Sample Output

```json
{
  "creditScore": 742,
  "riskLabel": "MODERATE",
  "pdScore": 0.142,
  "anomalyStatus": "NORMAL",
  "decision": "APPROVE"
}
```

---

# ⭐ Key Features

✅ PAN-based deterministic customer generation

✅ Bank statement simulation

✅ Feature engineering pipeline

✅ Isolation Forest anomaly detection

✅ Probability of Default estimation

✅ Risk categorization

✅ Hybrid AI credit scoring

✅ Reinforcement Learning decision engine

✅ Spring Boot + FastAPI integration

✅ Explainable multi-model architecture

---

# 👨‍💻 Authors

**Romil Rabadiya**
Computer Engineering Student

**Project Type:** Major Project / FinTech AI System

**Domain:** Machine Learning, Credit Risk Analytics, Reinforcement Learning, Financial Decisioning System.
