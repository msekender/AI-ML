from tensorflow.keras.preprocessing import image
import numpy as np

def preprocess_image(file):
    img = image.load_img(file, target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    return np.expand_dims(img_array, axis=0)