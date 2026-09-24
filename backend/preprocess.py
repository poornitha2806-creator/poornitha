"""
Image Preprocessing and Grad-CAM Utilities for Brain Tumor MRI Scans
"""

import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import (
    vgg16,
    resnet50,
    inception_v3,
    efficientnet
)

def crop_brain_contour(image: np.ndarray) -> np.ndarray:
    """
    Finds extreme contours of the brain parenchyma in MRI and crops out
    the blank black border air space.
    """
    # Convert to grayscale if RGB
    if len(image.shape) == 3 and image.shape[2] == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image.copy()

    # Gaussian blur & threshold
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    thresh = cv2.threshold(blurred, 45, 255, cv2.THRESH_BINARY)[1]
    thresh = cv2.erode(thresh, None, iterations=2)
    thresh = cv2.dilate(thresh, None, iterations=2)

    # Find contours
    contours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return image

    c = max(contours, key=cv2.contourArea)
    extLeft = tuple(c[c[:, :, 0].argmin()][0])
    extRight = tuple(c[c[:, :, 0].argmax()][0])
    extTop = tuple(c[c[:, :, 1].argmin()][0])
    extBot = tuple(c[c[:, :, 1].argmax()][0])

    # Crop
    cropped = image[extTop[1]:extBot[1], extLeft[0]:extRight[0]]
    if cropped.size == 0:
        return image
    return cropped

def apply_clahe(image: np.ndarray) -> np.ndarray:
    """
    Contrast Limited Adaptive Histogram Equalization for enhanced soft-tissue contrast.
    """
    if len(image.shape) == 3:
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl, a, b))
        return cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
    else:
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        return clahe.apply(image)

def preprocess_mri(image_bytes: bytes, model_name: str) -> np.ndarray:
    """
    Full preprocessing pipeline:
    1. Decode image from bytes
    2. Contour crop
    3. Resize according to model input size (224x224 or 299x299)
    4. Model-specific normalization
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Failed to decode uploaded MRI image bytes.")

    # Convert BGR to RGB
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # 1. Skull contour crop
    cropped = crop_brain_contour(img)

    # 2. Resize based on model
    name = model_name.lower().replace('-', '_')
    if name == 'inception_v3':
        target_size = (299, 299)
    else:
        target_size = (224, 224)

    resized = cv2.resize(cropped, target_size, interpolation=cv2.INTER_CUBIC)

    # 3. Model-specific normalization
    arr = resized.astype(np.float32)
    if name == 'cnn':
        norm = arr / 255.0
    elif name == 'efficientnet_b0':
        norm = efficientnet.preprocess_input(arr)
    elif name == 'vgg16':
        norm = vgg16.preprocess_input(arr)
    elif name == 'resnet50':
        norm = resnet50.preprocess_input(arr)
    elif name == 'inception_v3':
        norm = inception_v3.preprocess_input(arr)
    else:
        norm = arr / 255.0

    # Expand batch dimension: (1, H, W, 3)
    batch_tensor = np.expand_dims(norm, axis=0)
    return batch_tensor

def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    """
    Computes Grad-CAM class activation map for visual explanation.
    """
    grad_model = tf.keras.models.Model(
        inputs=[model.inputs],
        outputs=[model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        if pred_index is None:
            pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]

    grads = tape.gradient(class_channel, last_conv_layer_output)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()
