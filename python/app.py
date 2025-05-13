from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import pandas as pd
import joblib

model = tf.saved_model.load('risk_model/')

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse the JSON data
        data = request.json

        if "inputs" not in data or not isinstance(data["inputs"], list):
            return jsonify({'error': 'Invalid input format. Expected a JSON object with an "inputs" key containing a list of feature arrays.'}), 400

        inputs = np.array(data["inputs"], dtype=np.float32)  # Convert to NumPy array

        if inputs.shape[1] != 6:  # Validate the number of features
            return jsonify({'error': 'Each input must have exactly 6 features'}), 400

        # Load scaler and preprocess the input
        scaler = joblib.load("scaler.pkl")
        scaled_inputs = scaler.transform(inputs)

        # Convert to tensor for the TensorFlow model
        inputs_tensor = tf.convert_to_tensor(scaled_inputs)

        # Use the TensorFlow model for prediction
        prediction_fn = model.signatures['serving_default']
        predictions = prediction_fn(keras_tensor=inputs_tensor)['output_0'].numpy()

        return jsonify({'predictions': predictions.flatten().tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
