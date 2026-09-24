"""
Deep Learning Architectures for Brain Tumor Classification:
1. Custom CNN
2. EfficientNet-B0
3. VGG16
4. ResNet50
5. InceptionV3
"""

import os
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import (
    EfficientNetB0,
    VGG16,
    ResNet50,
    InceptionV3
)

NUM_CLASSES = 4
CLASS_NAMES = ['glioma', 'meningioma', 'no_tumor', 'pituitary']

def build_custom_cnn(num_classes=4, input_shape=(224, 224, 3)):
    """
    Custom 4-stage multi-layer Convolutional Neural Network baseline.
    """
    model = models.Sequential([
        layers.Input(shape=input_shape),
        
        # Stage 1
        layers.Conv2D(32, (3, 3), padding='same'),
        layers.BatchNormalization(),
        layers.ReLU(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.2),

        # Stage 2
        layers.Conv2D(64, (3, 3), padding='same'),
        layers.BatchNormalization(),
        layers.ReLU(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),

        # Stage 3
        layers.Conv2D(128, (3, 3), padding='same'),
        layers.BatchNormalization(),
        layers.ReLU(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.3),

        # Stage 4
        layers.Conv2D(256, (3, 3), padding='same'),
        layers.BatchNormalization(),
        layers.ReLU(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.35),

        # Classification Head
        layers.GlobalAveragePooling2D(),
        layers.Dense(256),
        layers.BatchNormalization(),
        layers.ReLU(),
        layers.Dropout(0.4),
        layers.Dense(num_classes, activation='softmax', name='classification_output')
    ], name='Custom_Brain_CNN')

    return model

def build_efficientnet_b0(num_classes=4, input_shape=(224, 224, 3), weights='imagenet'):
    """
    EfficientNet-B0 with ImageNet pre-training and fine-tuned classification head.
    """
    base_model = EfficientNetB0(
        include_top=False,
        weights=weights,
        input_shape=input_shape
    )
    # Freeze base model initially
    base_model.trainable = False

    inputs = layers.Input(shape=input_shape)
    x = base_model(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(128, activation='relu')(x)
    x = layers.BatchNormalization()(x)
    outputs = layers.Dense(num_classes, activation='softmax', name='classification_output')(x)

    return models.Model(inputs, outputs, name='EfficientNet_B0_Medical')

def build_vgg16(num_classes=4, input_shape=(224, 224, 3), weights='imagenet'):
    """
    VGG16 Transfer Learning architecture with 3x3 convolution stacks.
    """
    base_model = VGG16(
        include_top=False,
        weights=weights,
        input_shape=input_shape
    )
    base_model.trainable = False

    inputs = layers.Input(shape=input_shape)
    x = base_model(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(512, activation='relu')(x)
    x = layers.Dropout(0.5)(x)
    outputs = layers.Dense(num_classes, activation='softmax', name='classification_output')(x)

    return models.Model(inputs, outputs, name='VGG16_Medical')

def build_resnet50(num_classes=4, input_shape=(224, 224, 3), weights='imagenet'):
    """
    ResNet50 architecture with residual skip connections.
    """
    base_model = ResNet50(
        include_top=False,
        weights=weights,
        input_shape=input_shape
    )
    base_model.trainable = False

    inputs = layers.Input(shape=input_shape)
    x = base_model(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(256, activation='relu')(x)
    x = layers.Dropout(0.4)(x)
    outputs = layers.Dense(num_classes, activation='softmax', name='classification_output')(x)

    return models.Model(inputs, outputs, name='ResNet50_Medical')

def build_inception_v3(num_classes=4, input_shape=(299, 299, 3), weights='imagenet'):
    """
    InceptionV3 architecture with multi-scale parallel factorized convolutions.
    Requires input resolution of (299, 299, 3).
    """
    base_model = InceptionV3(
        include_top=False,
        weights=weights,
        input_shape=input_shape
    )
    base_model.trainable = False

    inputs = layers.Input(shape=input_shape)
    x = base_model(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.4)(x)
    x = layers.Dense(256, activation='relu')(x)
    outputs = layers.Dense(num_classes, activation='softmax', name='classification_output')(x)

    return models.Model(inputs, outputs, name='InceptionV3_Medical')

def get_model(model_name: str, num_classes=4, weights=None):
    """
    Factory function returning the compiled architecture.
    """
    name = model_name.lower().replace('-', '_')
    if name == 'cnn':
        return build_custom_cnn(num_classes=num_classes)
    elif name == 'efficientnet_b0':
        return build_efficientnet_b0(num_classes=num_classes, weights=weights)
    elif name == 'vgg16':
        return build_vgg16(num_classes=num_classes, weights=weights)
    elif name == 'resnet50':
        return build_resnet50(num_classes=num_classes, weights=weights)
    elif name == 'inception_v3':
        return build_inception_v3(num_classes=num_classes, weights=weights)
    else:
        raise ValueError(f"Unknown model name '{model_name}'. Choose from: cnn, efficientnet_b0, vgg16, resnet50, inception_v3")
