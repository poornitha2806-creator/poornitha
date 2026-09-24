"""
Evaluation Script for Brain Tumor Deep Learning Models
Computes Accuracy, Precision, Recall, F1-score, and Confusion Matrix on Test Set.
"""

import os
import argparse
import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

from models import get_model, NUM_CLASSES, CLASS_NAMES

def evaluate_model(model_name: str, dataset_dir: str):
    print(f"\nEvaluating Model: {model_name.upper()} on Unseen Test Slices")

    target_size = (299, 299) if model_name.lower() == 'inception_v3' else (224, 224)
    test_dir = os.path.join(dataset_dir, 'test')

    if not os.path.exists(test_dir):
        print(f"[-] Test directory not found at {test_dir}")
        return

    test_datagen = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1.0/255.0)
    test_gen = test_datagen.flow_from_directory(
        test_dir,
        target_size=target_size,
        batch_size=32,
        class_mode='categorical',
        classes=CLASS_NAMES,
        shuffle=False
    )

    weight_path = f"weights/{model_name.lower()}_best.keras"
    model = get_model(model_name, num_classes=NUM_CLASSES)
    if os.path.exists(weight_path):
        model.load_weights(weight_path)
        print(f"[+] Loaded weights from: {weight_path}")
    else:
        print(f"[-] Warning: {weight_path} not found. Running baseline architecture.")

    # Predict
    preds = model.predict(test_gen, verbose=1)
    y_pred = np.argmax(preds, axis=1)
    y_true = test_gen.classes

    # Classification Report
    print("\n" + "="*50)
    print(" CLASSIFICATION REPORT")
    print("="*50)
    report = classification_report(y_true, y_pred, target_names=CLASS_NAMES, digits=4)
    print(report)

    # Confusion Matrix
    cm = confusion_matrix(y_true, y_pred)
    print("\nConfusion Matrix:")
    print(cm)

    # Save Confusion Matrix Plot
    os.makedirs('reports', exist_ok=True)
    plt.figure(figsize=(7, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=CLASS_NAMES, yticklabels=CLASS_NAMES)
    plt.title(f'Confusion Matrix - {model_name.upper()}')
    plt.ylabel('Actual Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    output_png = f"reports/confusion_matrix_{model_name.lower()}.png"
    plt.savefig(output_png, dpi=300)
    print(f"\n[+] Confusion matrix heatmap saved to: {output_png}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', type=str, default='all', choices=['cnn', 'efficientnet_b0', 'vgg16', 'resnet50', 'inception_v3', 'all'])
    parser.add_argument('--dataset', type=str, default='../dataset')
    args = parser.parse_args()

    models_to_run = ['cnn', 'efficientnet_b0', 'vgg16', 'resnet50', 'inception_v3'] if args.model == 'all' else [args.model]
    for m in models_to_run:
        evaluate_model(m, args.dataset)
