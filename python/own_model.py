import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score
import tensorflow as tf
import numpy as np

dataset = pd.read_csv("cheating_risk_dataset_with_rules.csv")

X = dataset.drop(columns=['Risk Level'])
y = dataset['Risk Level']

X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_val_scaled = scaler.transform(X_val)
X_test_scaled = scaler.transform(X_test)

class PrintPredictionsCallback(tf.keras.callbacks.Callback):
    def __init__(self, validation_data):
        self.validation_data = validation_data

    def on_epoch_end(self, epoch, logs=None):
        X_val, y_val = self.validation_data
        predictions = self.model.predict(X_val, verbose=0)
        print(f"\nEpoch {epoch + 1}:")
        print("True Values:", np.round(y_val[:5].to_numpy(), 2))
        print("Predictions:", np.round(predictions[:5].flatten(), 2))

model = tf.keras.Sequential([
    tf.keras.layers.Dense(16, activation='relu', input_shape=(X_train_scaled.shape[1],)),
    tf.keras.layers.Dense(8, activation='relu'),
    tf.keras.layers.Dense(1)
])

model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mean_absolute_error'])

history = model.fit(
    X_train_scaled, y_train,
    validation_data=(X_val_scaled, y_val),
    epochs=400, batch_size=8, verbose=1,
    callbacks=[PrintPredictionsCallback((X_val_scaled, y_val))]
)

test_loss, test_mae = model.evaluate(X_test_scaled, y_test, verbose=0)
print(f"\nTest Mean Absolute Error: {test_mae}")

y_pred = model.predict(X_test_scaled)

r2 = r2_score(y_test, y_pred)
print(f"R² Score: {r2}")

model.export('risk_model/')

import joblib
joblib.dump(scaler, "scaler.pkl")