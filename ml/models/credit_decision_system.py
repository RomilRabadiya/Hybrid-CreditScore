import numpy as np
import pandas as pd
import random
import matplotlib.pyplot as plt
import seaborn as sns
from collections import defaultdict

# ==========================================================
# 1. HYPERPARAMETERS
# ==========================================================
ALPHA = 0.1           # Learning Rate
GAMMA = 0.9           # Discount Factor
EPSILON = 0.5         # Initial Exploration Rate
EPSILON_DECAY = 0.995 # Decay per episode
MIN_EPSILON = 0.05    # Floor for exploration
NUM_ACTIONS = 4

# ==========================================================
# 2. ACTION SPACE
# ==========================================================
ACTIONS = {
    0: "REJECT",
    1: "APPROVE_LOW",
    2: "APPROVE_MEDIUM",
    3: "APPROVE_HIGH"
}

# ==========================================================
# 3. DISCRETIZATION BINS (Continuous -> Discrete State)
# ==========================================================
pd_bins = [0.2, 0.4, 0.6, 0.8]
anomaly_bins = [0.3, 0.6, 0.8]
emi_bins = [0.3, 0.5, 0.7]
balance_bins = [5000, 20000, 50000]
income_bins = [15000, 30000, 60000]

def discretize(val, bins):
    return np.digitize(val, bins)

def build_state(record):
    """Converts a customer record into a discrete tuple (state)."""
    return (
        discretize(record["PD"], pd_bins),
        discretize(record["anomaly"], anomaly_bins),
        discretize(record["emiRatio"], emi_bins),
        discretize(record["avgBalance"], balance_bins),
        discretize(record["avgIncome"], income_bins)
    )

# ==========================================================
# 4. Q-TABLE INITIALIZATION
# ==========================================================
# dict mapping state (tuple) -> np.array of 4 action values
Q = defaultdict(lambda: np.zeros(NUM_ACTIONS))

# ==========================================================
# 5. RL LOGIC (ACTION & REWARD)
# ==========================================================
def choose_action(state, epsilon):
    """Epsilon-greedy strategy."""
    if random.random() < epsilon:
        return random.randint(0, NUM_ACTIONS - 1)
    return np.argmax(Q[state])

def calculate_reward(action, record):
    """
    Rewards for correct rejections and profitable approvals.
    Heavy penalties for defaults.
    """
    PD = record["PD"]
    defaulted = record["default"]

    if action == 0:  # Reject
        if PD > 0.6:
            return +20  # Smart rejection
        else:
            return -20  # Missed opportunity

    if defaulted:
        # Massive penalty for approving a defaulting customer
        return -200 - (PD * 100)

    # Standard progression for successful approvals
    if action == 1: return 40   # APPROVE_LOW
    if action == 2: return 70   # APPROVE_MEDIUM
    if action == 3: return 100  # APPROVE_HIGH

    return 0

# ==========================================================
# 6. DATA SIMULATION
# ==========================================================
def generate_simulation_data(n=3000):
    data = []
    for _ in range(n):
        PD = np.random.rand()
        anomaly = np.random.rand()
        emi = np.random.rand()
        bal = np.random.randint(2000, 80000)
        inc = np.random.randint(10000, 100000)

        # Higher PD increases default chance
        default = True if PD > 0.65 and random.random() < 0.7 else False

        data.append({
            "PD": PD,
            "anomaly": anomaly,
            "emiRatio": emi,
            "avgBalance": bal,
            "avgIncome": inc,
            "default": default
        })
    return data

# ==========================================================
# 7. TRAINING LOOP
# ==========================================================
def train_agent(episodes=1000):
    global Q
    data = generate_simulation_data()
    epsilon = EPSILON
    
    print(f"Starting Training for {episodes} episodes...")
    
    for episode in range(episodes):
        random.shuffle(data)
        for record in data:
            state = build_state(record)
            action = choose_action(state, epsilon)
            reward = calculate_reward(action, record)

            next_state = state # Snapshot model
            
            old_value = Q[state][action]
            next_max = np.max(Q[next_state])

            # Bellman Equation update
            Q[state][action] = old_value + ALPHA * (reward + GAMMA * next_max - old_value)

        epsilon = max(MIN_EPSILON, epsilon * EPSILON_DECAY)
        if (episode + 1) % 100 == 0:
            print(f"Episode {episode+1}/{episodes}, Epsilon: {epsilon:.3f}, States explored: {len(Q)}")

# ==========================================================
# 8. RECOMMENDATION ENGINE
# ==========================================================
def recommend_action(record):
    state = build_state(record)
    action_idx = np.argmax(Q[state])
    return ACTIONS[action_idx]

# ==========================================================
# 9. VISUALIZATION
# ==========================================================
def plot_strategy():
    data_points = []
    for state, values in Q.items():
        pd_cat = state[0]
        for idx, q_val in enumerate(values):
            data_points.append({"PD_Category": pd_cat, "Action": ACTIONS[idx], "Q_Value": q_val})

    df = pd.DataFrame(data_points)
    if df.empty: return
    
    pivot = df.pivot_table(index="PD_Category", columns="Action", values="Q_Value", aggfunc="mean")
    order = ["REJECT", "APPROVE_LOW", "APPROVE_MEDIUM", "APPROVE_HIGH"]
    pivot = pivot.reindex(columns=[a for a in order if a in pivot.columns])

    plt.figure(figsize=(10, 5))
    sns.heatmap(pivot, annot=True, fmt=".1f", cmap="RdYlGn", center=0)
    plt.title("RL Decision Brain: Strategy Heatmap (Avg Q-Values)")
    plt.xlabel("Decision")
    plt.ylabel("PD Category (0=Safe, 4=Risky)")
    plt.show()

# ==========================================================
# 10. EXECUTION
# ==========================================================
if __name__ == "__main__":
    # 1. Train the model
    train_agent(episodes=500)
    
    # 2. Test with sample customer
    sample = {
        "PD": 0.15,
        "anomaly": 0.05,
        "emiRatio": 0.2,
        "avgBalance": 45000,
        "avgIncome": 75000,
        "default": False
    }
    print(f"\n--- Sample Customer Recommendation ---")
    print(f"Record: {sample}")
    print(f"Action: {recommend_action(sample)}")
    
    # 3. Plot the strategy
    plot_strategy()
