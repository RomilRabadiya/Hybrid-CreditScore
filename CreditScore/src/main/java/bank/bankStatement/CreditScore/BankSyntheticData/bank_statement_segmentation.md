# 🏦 Synthetic Bank Statement Segmentation

## 🔑 Segment Design Principles (Important)
Each segment must control:
- Income level
- Income stability
- Expense discipline
- EMI burden
- Bounce probability
- Balance buffer
- Fraud likelihood

---

## 🎯 FINAL SEGMENTS

### 🟢 SEGMENT 1: PRIME / SUPER PRIME
**Credit Score:** 780 – 900

**👤 Profile**
- Salaried / Stable Business Owner
- High income, very disciplined
- No fraud, no bounces

**💰 Income**
- ₹1.8L – ₹3.5L / month
- CV < 8%
- Fixed credit date

**💸 Expenses**
- 35–50% of income
- Mostly UPI / Card
- No cash structuring

**🧾 EMI**
- 15–25% of income
- Always successful
- Never bounces

**🏦 Balance**
- Avg balance ≥ ₹1,00,000
- Healthy buffer

**🚫 Fraud / Anomaly**
- None

**🧮 Expected Rule Signals**
- IncomeScore: +120
- Stability: +40
- Expense: +80
- EMI: +70
- Bounce: +100
- Vintage: +60

**✅ Approval Probability:** ~95%

---

### 🟡 SEGMENT 2: NEAR PRIME / GOOD
**Credit Score:** 700 – 779

**👤 Profile**
- Good earners, slightly aggressive spenders

**💰 Income**
- ₹1.2L – ₹2.0L
- CV 10–15%

**💸 Expenses**
- 50–65%
- Some lifestyle spending

**🧾 EMI**
- 25–35%
- Rare bounce (≤1/year)

**🏦 Balance**
- ₹50k – ₹1L

**🚫 Fraud**
- None

**🧮 Signals**
- Minor deductions, mostly positive

**✅ Approval Probability:** ~80%

---

### 🟠 SEGMENT 3: MID-RISK / ACCEPTABLE
**Credit Score:** 650 – 699

**👤 Profile**
- MSME / Freelancers
- Irregular income

**💰 Income**
- ₹80k – ₹1.5L
- CV 20–30%

**💸 Expenses**
- 65–75%

**🧾 EMI**
- 30–45%
- 1–2 bounces possible

**🏦 Balance**
- ₹20k – ₹50k

**🚫 Fraud**
- None

**🧮 Signals**
- Neutral / slightly negative

**⚠️ Manual review recommended**

---

### 🔴 SEGMENT 4: SUB-PRIME
**Credit Score:** 550 – 649

**👤 Profile**
- Financially stressed

**💰 Income**
- ₹50k – ₹1.0L
- CV 30–45%

**💸 Expenses**
- 75–90%

**🧾 EMI**
- 45–55%
- 2–4 bounces

**🏦 Balance**
- ₹5k – ₹20k

**🚫 Fraud**
- Low-level anomalies

**🧮 Signals**
- Strong penalties

**❌ Mostly reject**

---

### 🚨 SEGMENT 5: HIGH RISK / FRAUD-PRONE
**Credit Score:** 300 – 549

**👤 Profile**
- Structuring / gaming system
- Salary-in, instant cash-out

**💰 Income**
- ₹30k – ₹80k
- CV > 50%

**💸 Expenses**
- 90%

**🧾 EMI**
- 55%
- Frequent bounces

**🏦 Balance**
- < ₹5k

**🚫 Fraud Indicators**
- Cash deposits at ₹49,000
- Sudden inflows
- Expense > Income (150%)

**🧮 Signals**
- Fraud penalty triggered

**🚫 Auto reject**

---

## 🔁 Segment → Synthetic Generator Mapping

| Segment     | Income   | CV       | EMI % | Expense % | Bounce | Fraud |
|------------|----------|----------|-------|-----------|--------|-------|
| Prime      | High     | Low      | Low   | Low       | 0      | No    |
| Near Prime | High     | Low      | Medium| Medium    | 0–1    | No    |
| Mid Risk   | Medium   | Medium   | Medium| Medium    | 1–2    | No    |
| Sub Prime  | Low      | High     | High  | High      | 2–4    | Low   |
| Fraud      | Very Low | Extreme  | Extreme| Extreme  | 4+     | Yes   |

---

## 🧠 How PAN Selects Segment (Deterministic)

```java
char lastChar = pan.charAt(pan.length() - 1);

if (lastChar in A–C) → PRIME
if (lastChar in D–F) → NEAR_PRIME
if (lastChar in G–J) → MID_RISK
if (lastChar in K–P) → SUB_PRIME
if (lastChar in Q–Z) → FRAUD