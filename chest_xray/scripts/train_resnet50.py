import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.optimizers import Adam
import os

# Paths 
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
train_dir = os.path.join(base_dir, 'data', 'chest_xray', 'train')
val_dir = os.path.join(base_dir, 'data', 'chest_xray', 'val')
model_output_path = os.path.join(base_dir, 'models', 'pneumonia_detector_resnet50.h5')

# Constants
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 25

# Data Augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=15,
    zoom_range=0.1,
    width_shift_range=0.1,
    height_shift_range=0.1,
    shear_range=0.1,
    horizontal_flip=True
)
val_datagen = ImageDataGenerator(rescale=1./255)

# Data Generators
train_gen = train_datagen.flow_from_directory(
    train_dir,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='binary'
)
val_gen = val_datagen.flow_from_directory(
    val_dir,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='binary'
)

# Build Model
base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(*IMAGE_SIZE, 3))
base_model.trainable = False

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(64, activation='relu')(x)
predictions = Dense(1, activation='sigmoid')(x)

model = Model(inputs=base_model.input, outputs=predictions)

# Compile and Train
model.compile(optimizer=Adam(learning_rate=0.0001),
              loss='binary_crossentropy',
              metrics=['accuracy'])

model.fit(train_gen, validation_data=val_gen, epochs=EPOCHS)

# Save Model
os.makedirs(os.path.dirname(model_output_path), exist_ok=True)
model.save(model_output_path)
print(f"Model saved at: {model_output_path}")
