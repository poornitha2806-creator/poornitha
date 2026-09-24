"""
Model Training Pipeline for Brain Tumor Classification
Supports training CNN, EfficientNet-B0, VGG16, ResNet50, and InceptionV3.
"""

import os
import argparse
import json
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import (
    ModelCheckpoint,
    EarlyStopping,
    ReduceLROnPlateau,
    CSVLogger
)

from models import get_model, NUM_CLASSES, CLASS_NAMES

def get_data_generators(dataset_dir: str, target_size=(224, 224), batch_size=32):
    train_dir = os.path.join(dataset_dir, 'train')
    val_dir = os.path.join(dataset_dir, 'val')

    # Data Augmentation strictly on training set
    train_datagen = ImageDataGenerator(
        rescale=1.0/255.0,
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        shear_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True,
        fill_mode='nearest'
    )

    # Validation generator without augmentation (pure scaling only)
    val_datagen = ImageDataGenerator(rescale=1.0/255.0)

    train_gen = train_datagen.flow_from_directory(
        train_dir,
        target_size=target_size,
        batch_size=batch_size,
        class_mode='categorical',
        classes=CLASS_NAMES,
        shuffle=True
    )

    val_gen = val_datagen.flow_from_directory(
        val_dir,
        target_size=target_size,
        batch_size=batch_size,
        class_mode='categorical',
        classes=CLASS_NAMES,
        shuffle=False
    )

    return train_gen, val_gen

def train(model_name: str, dataset_dir: str, epochs: int, batch_size: int, learning_rate: float):
    print(f"\n==========================================")
    print(f" Starting Training for: {model_name.upper()}")
    print(f" Dataset Directory:    {dataset_dir}")
    print(f" Epochs:               {epochs}")
    print(f" Batch Size:           {batch_size}")
    print(f" Initial LR:           {learning_rate}")
    print(f"==========================================\n")

    # InceptionV3 requires (299, 299)
    if model_name.lower() == 'inception_v3':
        target_size = (299, 299)
    else:
        target_size = (224, 224)

    os.makedirs('weights', exist_ok=True)
    os.makedirs('logs', exist_ok=True)

    # 1. Build Model
    weights = 'imagenet' if model_name.lower() != 'cnn' else None
    model = get_model(model_name, num_classes=NUM_CLASSES, weights=weights)

    optimizer = tf.keras.optimizers.Adam(learning_rate=learning_rate)
    model.compile(
        optimizer=optimizer,
        loss='categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.Precision(name='precision'), tf.keras.metrics.Recall(name='recall')]
    )

    # 2. Prepare Data
    if not os.path.exists(dataset_dir):
        print(f"[-] Dataset path '{dataset_dir}' not found.")
        print(f"[*] Please organize your dataset into '{dataset_dir}/train/' and '{dataset_dir}/val/'")
        return

    train_gen, val_gen = get_data_generators(dataset_dir, target_size=target_size, batch_size=batch_size)

    # 3. Callbacks
    checkpoint_path = f"weights/{model_name.lower()}_best.keras"
    callbacks = [
        ModelCheckpoint(checkpoint_path, monitor='val_accuracy', save_best_only=True, mode='max', verbose=1),
        EarlyStopping(monitor='val_loss', patience=8, restore_best_weights=True, verbose=1),
        ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, min_lr=1e-7, verbose=1),
        CSVLogger(f"logs/{model_name.lower()}_training_log.csv")
    ]

    # 4. Fit
    history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=epochs,
        callbacks=callbacks
    )

    print(f"\n[+] Training complete for {model_name}!")
    print(f"[+] Best model checkpoint saved to: {checkpoint_path}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Train Deep Learning Model for Brain Tumor MRI Classification')
    parser.add_argument('--model', type=str, default='efficientnet_b0', choices=['cnn', 'efficientnet_b0', 'vgg16', 'resnet50', 'inception_v3'])
    parser.add_argument('--dataset', type=str, default='../dataset')
    parser.add_argument('--epochs', type=int, default=30)
    parser.add_argument('--batch-size', type=int, default=32)
    parser.add_argument('--lr', type=float, default=0.0001)

    args = parser.parse_args()
    train(args.model, args.dataset, args.epochs, args.batch_size, args.lr)
