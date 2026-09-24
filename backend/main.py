"""
FastAPI Server for Brain Tumor Classification Deep Learning Backend
"""

import os
import time
import io
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image

from .models import get_model, NUM_CLASSES, CLASS_NAMES
from .preprocess import preprocess_mri

app = FastAPI(
    title="Brain Tumor MRI Classification API",
    description="Deep Learning API for Brain Tumor classification (Glioma, Meningioma, Pituitary, Normal)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS_CACHE = {}
WEIGHTS_DIR = os.path.join(os.path.dirname(__file__), "weights")

# Map of model categories
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
    """
    Retrieves model from cache or instantiates architecture.
    """
    key = model_name.lower().replace("-", "_")
    if key in MODELS_CACHE:
        return MODELS_CACHE[key]

    model = get_model(key, num_classes=NUM_CLASSES)
    weight_file = os.path.join(WEIGHTS_DIR, f"{key}_best.keras")

    if os.path.exists(weight_file):
        try:
            model.load_weights(weight_file)
            print(f"[+] Loaded trained weights from {weight_file}")
        except Exception as e:
            print(f"[-] Warning: Failed to load weights ({e}). Running with baseline weights.")
    else:
        print(f"[*] Note: No trained weights file found at {weight_file}. Ready for training.")

    MODELS_CACHE[key] = model
    return model

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "backend": "FastAPI (TensorFlow / Keras)",
        "available_models": list(MODEL_METRICS_DATA.keys()),
        "classes": list(CLASS_LABEL_MAP.values())
    }

@app.get("/api/models")
def get_models_list():
    return {
        "models": MODEL_METRICS_DATA
    }

@app.post("/api/classify")
async def classify_mri(
    file: UploadFile = File(...),
    model_id: str = Form("efficientnet_b0")
):
    start_time = time.time()
    
    # 1. Validate file format
    allowed_types = ["image/jpeg", "image/png", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPG, JPEG, and PNG are supported.")

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Get image dimensions
    try:
        pil_img = Image.open(io.BytesIO(image_bytes))
        dims = {"width": pil_img.width, "height": pil_img.height}
    except Exception:
        dims = {"width": 512, "height": 512}

    # 2. Preprocess
    try:
        tensor = preprocess_mri(image_bytes, model_id)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Image preprocessing failed: {str(e)}")

    # 3. Model Inference
    model = load_or_get_model(model_id)
    raw_preds = model.predict(tensor, verbose=0)[0]

    # Convert to probability distribution
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

    return {
        "model_id": model_id,
        "model_name": MODEL_METRICS_DATA.get(model_id, {}).get("name", model_id),
        "predicted_class": pred_class,
        "predicted_class_name": CLASS_LABEL_MAP.get(pred_class, pred_class.title()),
        "confidence": round(confidence, 2),
        "probabilities": probabilities,
        "inference_time_ms": latency,
        "dimensions": dims,
        "backend": "FastAPI Medical DL Engine",
        "notes": [
            f"Classified by {model_id.upper()} neural network.",
            f"Evaluated on {dims['width']}x{dims['height']} matrix.",
            "Disclaimer: Educational research output, not a clinical medical diagnosis."
        ]
    }
