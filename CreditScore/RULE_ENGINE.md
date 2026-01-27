# 🧮 AA Rule-Based Hybrid Credit Score
*(Redefined using BankTransaction – Bank-Grade)*

**Base Score:** 500  
**Final Clamp:** 300 – 900

> All sectors **derive signals from transactions**.  
> **Nothing is stored directly** inside the transaction entity.

---

## 1️⃣ Income Strength Sector (Capacity to Earn)

### 🎯 Purpose
Can the user generate money consistently?

### 📥 Derived From Transactions
- `direction == INFLOW`
- `nature IN (SALARY, BUSINESS_INCOME)`

### 📊 Metrics
- `avgMonthlyIncome`
- `incomeCoefficientOfVariation (CV)`

### 🧠 Rules

#### Income Level

| Avg Monthly Income | Score |
|-------------------|-------|
| ≥ ₹150,000 | +120 |
| ≥ ₹100,000 | +80 |
| ≥ ₹60,000  | +40 |
| Else       | -40 |

#### Income Stability

| CV (Variation) | Score |
|---------------|-------|
| < 10% | +40 |
| < 20% | +20 |
| Else  | -30 |

📌 **Why it matters**  
Income is the **primary repayment source**.

---

## 2️⃣ Expense Discipline Sector (Spending Behavior)

### 🎯 Purpose
Is the user financially disciplined?

### 📥 Derived From Transactions
- `direction == OUTFLOW`
- `channel IN (UPI, CARD, CASH)`
- `nature NOT IN (EMI, TAX_PAYMENT)`

### 📊 Metric

### 🧠 Rules

| Expense Ratio | Score |
|--------------|-------|
| ≤ 50% | +80 |
| ≤ 65% | +40 |
| ≤ 80% | 0 |
| > 80% | -60 |

📌 **Key Insight**  
High income with poor discipline = **still risky**.

---

## 3️⃣ EMI & Debt Burden Sector (Over-Leverage)

### 🎯 Purpose
Is the user already overloaded?

### 📥 Derived From Transactions
- `direction == OUTFLOW`
- `nature == EMI`

### 📊 Metric

### 🧠 Rules

| EMI Ratio | Score |
|----------|-------|
| ≤ 30% | +70 |
| ≤ 40% | +30 |
| ≤ 50% | -20 |
| > 50% | -80 |

📌 **Banking Golden Rule**  
EMI > 50% = **danger zone**.

---

## 4️⃣ Bank Balance Health Sector (Liquidity Buffer)

### 🎯 Purpose
Does the user maintain a cash buffer?

### 📥 Derived From Transactions
- `avg(balanceAfter)` over last 12 months

### 🧠 Rules

| Avg Balance | Score |
|------------|-------|
| ≥ ₹100,000 | +60 |
| ≥ ₹50,000  | +30 |
| ≥ ₹20,000  | 0 |
| < ₹20,000  | -40 |

📌 Prevents **salary-in → salary-out** frauds.

---

## 5️⃣ Repayment Discipline Sector (Bounce Behavior)

### 🎯 Purpose
Can the user be trusted?

### 📥 Derived From Transactions
- `balanceBefore < EMI` → implied bounce
- or explicit `BANK_CHARGES` linked to EMI

### 🧠 Rules

| Bounce Count (12M) | Score |
|-------------------|-------|
| 0 | +100 |
| 1 | +40 |
| ≤ 3 | -50 |
| > 3 | -120 |

🚨 **Hard Signal**  
Too many bounces = **automatic distrust**.

---

## 6️⃣ Account Vintage Sector (Experience)

### 🎯 Purpose
Is this a seasoned or unknown borrower?

### 📥 Derived From

### 🧠 Rules

| Account Age | Score |
|------------|-------|
| ≥ 60 months | +60 |
| ≥ 36 months | +40 |
| ≥ 12 months | +20 |
| < 12 months | -30 |

📌 New accounts = **unknown behavior**.

---

## 7️⃣ Fraud / Anomaly Guardrail (AI-Driven)

### 🎯 Purpose
Kill-switch for suspicious behavior.

### 📥 Derived From ML
- Isolation Forest / heuristics detecting:
    - Sudden large INFLOW
    - Structuring (₹49,000 cash deposits)
    - Expense > Income > 150%

### 🧠 Rule

📌 **Overrides everything else**.

---

## 🧮 Final Rule-Based Score Formula

```java
ruleScore = 500
  + incomeScore
  + stabilityScore
  + expenseScore
  + emiScore
  + balanceScore
  + bounceScore
  + vintageScore
  + fraudPenalty;

