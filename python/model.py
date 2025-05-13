import pandas as pd
from sklearn.ensemble import IsolationForest

data = pd.DataFrame({
    "tab_switches": [2, 5, 0, 8, 1, 4, 7, 10, 3, 2, 5, 6, 1, 0, 9, 7, 4, 3, 8, 6],
    "keypress_post_tab": [10, 25, 5, 50, 8, 15, 20, 30, 10, 12, 23, 35, 7, 6, 40, 45, 30, 15, 25, 38],
    "copy_events": [0, 2, 0, 3, 0, 1, 2, 4, 0, 1, 3, 1, 2, 0, 5, 1, 3, 0, 4, 2],
    "paste_events": [0, 3, 0, 5, 1, 2, 1, 2, 0, 1, 4, 3, 2, 0, 6, 1, 2, 0, 4, 3],
    "risk_level": [0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],  # Labels
})

# Features for training
X = data[["tab_switches", "keypress_post_tab", "copy_events", "paste_events"]]

# Isolation Forest for anomaly detection
model = IsolationForest(contamination=0.2)
model.fit(X)

# Predict risk score for new data
test_data = pd.DataFrame({
    "tab_switches": [10],
    "keypress_post_tab": [0],
    "copy_events": [9],
    "paste_events": [0],
})

risk_score = model.decision_function(test_data)
print("Risk Score:", risk_score)