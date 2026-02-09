# 🧮 Rule-Based Hybrid Credit Score
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
| ≥ ₹150,000 | +90 |
| ≥ ₹100,000 | +60 |
| ≥ ₹60,000  | +30 |
| Else       | -60 |

#### Income Stability

| CV (Variation) | Score |
|---------------|-------|
| < 10% | +30 |
| < 20% | +15 |
| Else  | -40 |

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
| ≤ 50% | +60 |
| ≤ 65% | +30 |
| ≤ 80% | -10 |
| > 80% | -80 |

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
| ≤ 30% | +50 |
| ≤ 40% | +20 |
| ≤ 50% | -40 |
| > 50% | -100 |

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
| ≥ ₹100,000 | +40 |
| ≥ ₹50,000  | +20 |
| ≥ ₹20,000  | -10 |
| < ₹20,000  | -60 |

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
| 0 | +70 |
| 1 | +25 |
| ≤ 3 | -80 |
| > 3 | -150 |

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
| ≥ 60 months | +40 |
| ≥ 36 months | +30 |
| ≥ 12 months | +15 |
| < 12 months | -50 |

📌 New accounts = **unknown behavior**.


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
