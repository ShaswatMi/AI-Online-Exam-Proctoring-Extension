import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
#import xgboost as xgb
import joblib

data = pd.read_csv('typing_data_high_variance.csv')

X = data['WPM Intervals'].apply(lambda x: list(map(int, x.split()))).tolist()
y = data['Label']

fixed_length = 600

X_fixed = []
for seq in X:
    if len(seq) < fixed_length:
        seq += [0] * (fixed_length - len(seq))
    else:
        seq = seq[:fixed_length]
    X_fixed.append(seq)

X_array = np.array(X_fixed)

X_train, X_test, y_train, y_test = train_test_split(X_array, y, test_size=0.2, random_state=42)

rf_classifier = RandomForestClassifier(n_estimators=100)
rf_classifier.fit(X_train, y_train)

y_pred_rf = rf_classifier.predict(X_test)

#xgb_classifier = xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss')
#xgb_classifier.fit(X_train, y_train)

#y_pred_xgb = xgb_classifier.predict(X_test)

def accuracy(y_true, y_pred):
    return np.sum(y_true == y_pred) / len(y_true)

def specificity(y_true, y_pred):
    TN = np.sum((y_true == 0) & (y_pred == 0))
    FP = np.sum((y_true == 0) & (y_pred == 1))
    return TN / (TN + FP) if (TN + FP) > 0 else 0

print("Random Forest Results:")
print("Accuracy:", accuracy(y_test, y_pred_rf))
print("Specificity:", specificity(y_test, y_pred_rf))

"""print("\nXGBoost Results:")
print("Accuracy:", accuracy(y_test, y_pred_xgb))
print("Specificity:", specificity(y_test, y_pred_xgb))"""

sample_indices = np.random.choice(len(X_train), size=10, replace=False)
sample_X = X_train[sample_indices]
sample_y_true = y_train.iloc[sample_indices]

sample_y_pred_rf = rf_classifier.predict(sample_X)
#sample_y_pred_xgb = xgb_classifier.predict(sample_X)

print("\nSample Predictions vs Actual for Random Forest:")
for i in range(len(sample_y_true)):
    print(f"Actual: {sample_y_true.iloc[i]}, Predicted (RF): {sample_y_pred_rf[i]}")

"""print("\nSample Predictions vs Actual for XGBoost:")
for i in range(len(sample_y_true)):
    print(f"Actual: {sample_y_true.iloc[i]}, Predicted (XGB): {sample_y_pred_xgb[i]}")"""

joblib.dump(rf_classifier, 'random_forest_classifier.pkl')
