# 📌 Default Rule Definition

This document defines how **proxy default labels (`pdLabel`)** are generated inside the Hybrid Credit Score System using only observable behavioral features from the CSV schema.

Because real loan default history is not available in synthetic data, default labels are **bootstrapped using deterministic financial stress rules**.

---

## 🏦 What Banks Really Care About

Banks must know:

> How many customers are expected to default?

Not just:

> Who is better than whom?

That is why PD is mandatory in real banking systems.

---

## 📌 Definition

A borrower is labeled:


if **ANY** of the following conditions is true:

- `bounceCount` ≥ 3  
- `emiRatio` ≥ 0.50  
- `expenseRatio` ≥ 0.85  

Otherwise:

pdLabel = 0 (NON-DEFAULT)

---

## 📄 Columns Used (From CSV Schema)

Only these feature columns are used:

- bounceCount
- emiRatio
- expenseRatio

## 🔍 Why These Columns Were Chosen

Each column represents a **different dimension of financial stress** that directly reflects default-like behavior.

---

### 1️⃣ `bounceCount` ≥ 3  
**Payment Reliability Failure**

Column:

bounceCount → Payment failures (6–12 months)


Meaning:

Repeated payment failures indicate the borrower is already unable to honor obligations.

Interpretation:

- 1 bounce → operational mistake  
- 2 bounces → warning signal  
- 3+ bounces → behavioral pattern  

Therefore:

bounceCount ≥ 3 → pdLabel = 1


---

### 2️⃣ `emiRatio` ≥ 0.50  
**Over-Leverage**

Column:

emiRatio → EMI / income


Meaning:

If more than 50% of income goes to EMIs:

- Very little disposable income remains  
- Any unexpected expense can trigger missed payments  

Represents **debt overload**.

Therefore:

emiRatio ≥ 0.50 → pdLabel = 1


---

### 3️⃣ `expenseRatio` ≥ 0.85  
**Chronic Cash Flow Stress**

Column:

expenseRatio → Expense / income


Meaning:

Spending 85% or more of income implies:

- No savings buffer  
- No emergency capacity  
- High vulnerability  

Represents **living beyond means**.

Therefore:

expenseRatio ≥ 0.85 → pdLabel = 1


---
---
# 📌 Probability of Default (PD)

## 🧠 What Is PD?

**Probability of Default (PD)** means:

> How likely a borrower is to fail to repay a loan within a given period (usually 12 months).

If PD = **5%**, it means:

Out of 100 similar customers, about **5 may default**.

PD is a **probability value**, not a credit score.

---

## 🎯 Why PD Is Needed Even If We Have a Credit Score

A **credit score shows ranking**.  
PD shows **actual risk level**.

Think of it like this:

- Score = position in a class  
- PD = chance of failing the exam  

Two people can have the same score but very different PD.

### Example

| Person | Score | PD |
|------|------|----|
| A | 750 | 2% |
| B | 750 | 8% |

Same score → different danger level.

Only PD reveals this.

---