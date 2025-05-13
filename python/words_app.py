from flask import Flask, request, jsonify
import numpy as np
import joblib
import pandas as pd

model = joblib.load('random_forest_classifier.pkl')

fixed_length = 600

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        if "inputs" not in data or not isinstance(data["inputs"], list):
            return jsonify({'error': 'Invalid input format. Expected a JSON object with an "inputs" key containing a list of feature arrays.'}), 400

        input_df = pd.DataFrame(data["inputs"])

        X_fixed = []

        for seq in input_df.values:
            if len(seq) < fixed_length:
                seq = np.concatenate((seq, np.zeros(fixed_length - len(seq))))
            else:
                seq = seq[:fixed_length]
            X_fixed.append(seq)

        inputs = np.array(X_fixed, dtype=np.float32)

        if inputs.shape[1] != fixed_length:
            return jsonify({'error': f'Each input must have exactly {fixed_length} features'}), 400

        predictions = model.predict(inputs)

        return jsonify({'predictions': predictions.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=6000)
