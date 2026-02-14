# 🧠 Advanced Q-Learning Credit Decision Model

This document provides a deep dive into the Reinforcement Learning (RL) system implemented in [q_learning.ipynb](file:///Users/romiljitendrabhai/Desktop/Hybrid%20Credit%20Score/ml/models/q_learning.ipynb).

## 📌 1. Pipeline Architecture
Our Q-learning implementation follows a 6-stage end-to-end pipeline:
1.  **Setup & Hyperparameters**: Configuring the agent's learning behavior.
2.  **Reward & Transition Logic**: Defining the rules of the "Credit Environment".
3.  **Data Integration**: Merging PD, Anomaly, and Score signals into a state-action dataset.
4.  **Agent Training**: Iterative learning using the Bellman Equation.
5.  **Visualization**: Monitoring reward convergence.
6.  **Policy Analysis**: Verifying decisions against specific customer segments.

---

## 🏗️ 2. State Space (Discretization)
The agent operates on a 3-dimensional state space. Continuous signals are discretized into discrete bins:

- **PD (Probability of Default)**: `[0.10, 0.30, 0.50, 0.70]`
- **Anomaly Score**: `[0.2, 0.4, 0.6]`
- **Credit Score**: `[400, 500, 600, 700]`

---

## ⚖️ 3. Outcome-Based Reward Engineering
The agent optimizes for **Net Profit**, not just accuracy.

### Approval Reward Formula:
$$Reward = TierValue \times (Margin - PD)$$
- **Tier Values**: Reject (0), Low (100), Medium (500), High (1000).
- **Margin (0.20)**: The target profitability threshold.
- **Decision Logic**: If $PD < 0.20$, the agent earns positive points proportional to the tier.

### Rejection Reward:
- **Good Decision** (Avoiding Risk): $+10$ if $PD > 0.3$.
- **Bad Decision** (Opportunity Cost): $-50$ if $PD < 0.3$.

---

## 📈 4. State Transitions
Actions change the customer's future profile:
- **Approval**: Increases Credit Score (building history) and reduces PD (proven repayment).
- **Rejection**: Causes Credit Score stagnation or slight decay.

---

## 🧠 5. Learning Parameters
- **Learning Rate ($\alpha$)**: `0.1`
- **Discount Factor ($\gamma$)**: `0.9` (Prioritizes long-term value).
- **Exploration ($\epsilon$)**: Starts at `0.5`, decaying by `0.995` per episode down to a minimum of `0.05`.

---

## 🧪 6. Policy Behavior
The trained agent demonstrates a sophisticated credit policy:
- **Elite (Low PD, High CS)**: Consistently receives `APPROVE_HIGH`.
- **Risky (High PD)**: Consistently receives `REJECT`.
- **Borderline**: Receives cautious `APPROVE_LOW` or `MEDIUM` to test repayment.

---
> [!IMPORTANT]
> This RL model acts as the final "Arbitrator" in the Hybrid model, sitting on top of supervised signals (PD, Anomaly) to make the final executive financial decision.
