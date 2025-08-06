Pneumonia Detection from Chest X-Rays using ResNet50 (TensorFlow/Keras)
=======================================================================

This project builds a deep learning classifier to distinguish between Normal and Pneumonia chest X-rays using TensorFlow’s ResNet50 architecture. It is a binary image classification problem where the model learns from labeled chest X-ray images and predicts whether a given image indicates pneumonia or not.

File Structure
--------------

Current file structure:

chest_xray/
├── train/                     # Training data (NORMAL / PNEUMONIA)
├── val/                       # Validation data (NORMAL / PNEUMONIA)
├── test/                      # Test data (NORMAL / PNEUMONIA)
└── scripts/                   # Contains training and prediction scripts
    ├── train_resnet50.py
    └── predict_one_xray.py

Dependencies
------------

Install the required libraries:

    pip install tensorflow numpy matplotlib

Training the Model
------------------

Navigate to the scripts/ directory and run the training script:

    cd scripts
    python train_resnet50.py

The script will:
- Load the training and validation datasets
- Build a ResNet50-based binary classifier
- Train it for 25 epochs
- Save the trained model as pneumonia_detector_resnet50.h5 in the scripts/ directory

You can tune:
- Epochs
- Learning rate
- Batch size
- Dropout or fine-tuning options

Predicting on a Single Image
----------------------------

To test the model on a single image (e.g., from the test/ folder):

    python predict_one_xray.py

Expected Output:

    Prediction: NORMAL  # or PNEUMONIA

Make sure to update the image path in predict_one_xray.py if needed.

Dataset
-------

Download the dataset from:
https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia

Place the data in the chest_xray/ folder as:

chest_xray/
├── train/
│   ├── NORMAL/
│   └── PNEUMONIA/
├── val/
│   ├── NORMAL/
│   └── PNEUMONIA/
└── test/
    ├── NORMAL/
    └── PNEUMONIA/

Model Architecture
------------------

- Base Model: ResNet50 (pre-trained on ImageNet)
- Top Layers: GlobalAveragePooling -> Dense(64) -> Dense(1, sigmoid)
- Loss Function: Binary Crossentropy
- Optimizer: Adam (Adaptive Moment Estimation)

Production Tips
---------------

- Train for 30–50 epochs with early stopping
- Fine-tune the last few ResNet layers
- Track AUC, precision, recall, and F1-score
- Use Grad-CAM for model explainability
- Export to TensorFlow Lite or ONNX for mobile deployment

Future Ideas
------------

- Streamlit or Flask app for X-ray upload and prediction
- Web-based dashboard for healthcare usage
- Cloud deployment with TensorFlow Serving or FastAPI

Disclaimer
----------

This model is for educational and research purposes only. It is not intended for medical diagnosis. Consult certified professionals for clinical use.

References
----------

- Kaggle Dataset: https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia
- ResNet Paper: https://arxiv.org/abs/1512.03385
- TensorFlow Documentation: https://www.tensorflow.org/api_docs/python/tf/keras/applications
