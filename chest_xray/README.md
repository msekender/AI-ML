# Chest X-ray Pneumonia Classifier

This project is an end-to-end system for detecting pneumonia from chest X-ray images. It includes training scripts, a deep learning model, and a full-stack web application (Flask + React) for real-time inference.

---

## Directory Structure

```
chest_xray/
├── train/                     # Training data (NORMAL / PNEUMONIA)
├── val/                       # Validation data (NORMAL / PNEUMONIA)
├── test/                      # Test data (NORMAL / PNEUMONIA)
├── scripts/                   # Model training and CLI prediction
│   ├── train_resnet50.py
│   └── predict_one_xray.py
├── backend/                   # Flask backend for prediction API
│   ├── app.py
│   ├── requirements.txt
│   └── utils/
│       └── preprocessing.py
├── frontend/                  # React + TypeScript frontend
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── App.tsx
│       ├── api.ts
│       ├── index.tsx
│       └── styles.css
└── README.md                  # Project overview and setup instructions
```

---

## Features

- Trains a deep learning model (ResNet50) to classify X-ray images as **NORMAL** or **PNEUMONIA**.
- Exposes a Flask API (`/predict`) for real-time inference.
- Frontend React app for uploading images and displaying predictions.
- Preprocessing and inference logic separated for easy extension.

---

## Setup Instructions

### 1. Backend Setup

```bash
cd chest_xray/backend
pip install -r requirements.txt
python app.py
```

This runs the Flask API at `http://localhost:5000/predict`.

### 2. Frontend Setup

```bash
cd chest_xray/frontend
npm install
npm start
```

Runs the React app on `http://localhost:3000/` and connects to the Flask backend.

### 3. Training (Optional)

If you want to retrain the model:

```bash
cd chest_xray/scripts
python train_resnet50.py
```

To test a single image from CLI:

```bash
python predict_one_xray.py --image_path ../test/NORMAL/IM-0001-0001.jpeg
```

---

## Model

- Model: ResNet50 (transfer learning)
- Input Size: 224x224
- Output: Binary classification (NORMAL or PNEUMONIA)
- Loss: Binary cross-entropy

---

## API Endpoint

**POST** `/predict`  
Form-data: `file=<image>`  
Returns JSON: `{ "label": "PNEUMONIA", "confidence": 0.981 }`

---

## Notes

- Backend uses `CORS` to support cross-origin requests.
- All dependencies are listed in `requirements.txt` and `package.json`.
- Model must be trained and saved to `model/xray_classifier.h5` before using the API.

---

## Credits

- Dataset: [Chest X-Ray Images (Pneumonia)](https://www.kaggle.com/paultimothymooney/chest-xray-pneumonia)
- Built with TensorFlow, Flask, React, and TypeScript.