import requests

input_data = [[67, 39, 47, 55, 12]]

url = "http://127.0.0.1:5000/predict"

data = {"inputs": input_data}

response = requests.post(url, json=data)

if response.status_code == 200:
    print("Predictions:", response.json())
else:
    print("Error:", response.json())
