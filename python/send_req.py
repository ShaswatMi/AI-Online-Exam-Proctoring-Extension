import requests
import joblib
import pandas as pd

scaler = joblib.load("scaler.pkl")

feature_names = ["Tab Switches", "Window Focus Changes", "Copy Events", "Cut Events", "Paste Events", "Full Screen Exits"]
input_df = pd.DataFrame([[6.0, 12.0, 4.0, 2.0, 5.0, 3.0]], columns=feature_names)
scaled_input = scaler.transform(input_df)

url = "http://127.0.0.1:5000/predict"
data = {"inputs": scaled_input.tolist()}

response = requests.post(url, json=data)
print(response.json())

