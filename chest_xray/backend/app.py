from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from utils.preprocessing import preprocess_image
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

model = load_model("model/xray_classifier.h5")

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    image = preprocess_image(file)
    prediction = model.predict(image)
    label = "PNEUMONIA" if prediction[0][0] > 0.5 else "NORMAL"
    confidence = float(prediction[0][0]) if label == "PNEUMONIA" else float(1 - prediction[0][0])

    return jsonify({'label': label, 'confidence': confidence})

if __name__ == '__main__':
    app.run(debug=True)