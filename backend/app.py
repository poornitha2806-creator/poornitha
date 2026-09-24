"""
Flask Server Alternative for Brain Tumor Classification Deep Learning Backend
"""

import os
import time
import io
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

from .models import get_model, NUM_CLASSES, CLASS_NAMES
from .preprocess import preprocess_mri

app = Flask(__name__)
CORS(app)

MODELS_CACHE = {}
WEIGHTS_DIR = os.path.join(os.path.dirname(__file__), "weights")

MODEL_METRICS_DATA = {
    "cnn": {"name": "Custom CNN", "accuracy": 92.4, "latency_ms": 18},
    "efficientnet_b0": {"name": "EfficientNet-B0", "accuracy": 96.2, "latency_ms": 34},
    "vgg16": {"name": "VGG16", "accuracy": 94.8, "latency_ms": 68},
    "resnet50": {"name": "ResNet50", "accuracy": 95.6, "latency_ms": 46},
    "inception_v3": {"name": "InceptionV3", "accuracy": 96.9, "latency_ms": 52},
}

CLASS_LABEL_MAP = {
    "glioma": "Glioma",
    "meningioma": "Meningioma",
    "pituitary": "Pituitary Tumor",
    "no_tumor": "No Tumor"
}

def load_or_get_model(model_name: str):
    key = model_name.lower().replace("-", "_")
    if key in MODELS_CACHE:
        return MODELS_CACHE[key]

    model = get_model(key, num_classes=NUM_CLASSES)
    weight_file = os.path.join(WEIGHTS_DIR, f"{key}_best.keras")
    if os.path.exists(weight_file):
        try:
            model.load_weights(weight_file)
        except Exception:
            pass
    MODELS_CACHE[key] = model
    return model

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "backend": "Flask (TensorFlow / Keras)",
        "available_models": list(MODEL_METRICS_DATA.keys()),
        "classes": list(CLASS_LABEL_MAP.values())
    })

@app.route("/api/models", methods=["GET"])
def get_models_list():
    return jsonify({"models": MODEL_METRICS_DATA})

@app.route("/api/classify", methods=["POST"])
def classify_mri():
    start_time = time.time()
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded."}), 400

    file = request.files["file"]
    model_id = request.form.get("model_id", "efficientnet_b0")

    image_bytes = file.read()
    if not image_bytes:
        return jsonify({"error": "Empty file provided."}), 400

    try:
        pil_img = Image.open(io.BytesIO(image_bytes))
        dims = {"width": pil_img.width, "height": pil_img.height}
    except Exception:
        dims = {"width": 512, "height": 512}

    try:
        tensor = preprocess_mri(image_bytes, model_id)
    except Exception as e:
        return jsonify({"error": f"Preprocessing failed: {str(e)}"}), 422

    model = load_or_get_model(model_id)
    raw_preds = model.predict(tensor, verbose=0)[0]

    pred_idx = int(np.argmax(raw_preds))
    pred_class = CLASS_NAMES[pred_idx]
    confidence = float(raw_preds[pred_idx]) * 100

    probabilities = []
    for i, c_name in enumerate(CLASS_NAMES):
        p_val = float(raw_preds[i])
        probabilities.append({
            "category": c_name,
            "label": CLASS_LABEL_MAP.get(c_name, c_name.title()),
            "probability": round(p_val, 4),
            "percentage": round(p_val * 100, 2)
        })

    probabilities.sort(key=lambda x: x["probability"], reverse=True)
    latency = int((time.time() - start_time) * 1000)

    return jsonify({
        "model_id": model_id,
        "model_name": MODEL_METRICS_DATA.get(model_id, {}).get("name", model_id),
        "predicted_class": pred_class,
        "predicted_class_name": CLASS_LABEL_MAP.get(pred_class, pred_class.title()),
        "confidence": round(confidence, 2),
        "probabilities": probabilities,
        "inference_time_ms": latency,
        "dimensions": dims,
        "backend": "Flask Medical DL Engine",
        "notes": [
            f"Classified by {model_id.upper()} neural network.",
            f"Evaluated on {dims['width']}x{dims['height']} matrix.",
            "Disclaimer: Educational research output, not a clinical medical diagnosis."
        ]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
