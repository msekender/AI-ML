from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

# Paths 
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
model_path = os.path.join(base_dir, 'models', 'pneumonia_detector_resnet50.h5')
img_path = os.path.join(base_dir, 'data', 'chest_xray', 'test', 'NORMAL', 'IM-0001-0001.jpeg')

# Constants
IMAGE_SIZE = (224, 224)

# Load model
model = load_model(model_path)

# Preprocess image
img = image.load_img(img_path, target_size=IMAGE_SIZE)
img_array = image.img_to_array(img) / 255.0
img_array = np.expand_dims(img_array, axis=0)

# Predict
prediction = model.predict(img_array)[0][0]
print("Prediction:", "PNEUMONIA" if prediction > 0.5 else "NORMAL")
