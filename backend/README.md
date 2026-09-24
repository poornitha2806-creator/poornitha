# Brain Tumor Classification Deep Learning Backend

This folder contains the complete Python & TensorFlow/Keras backend pipeline for the final-year project:
**"Brain Tumor Classification Using MRI Scan and Deep Learning"**.

---

## 1. Deep Learning Architectures Included

1. **Custom CNN**: 4-stage convolutional baseline with BatchNormalization and Dropout.
2. **EfficientNet-B0**: High parameter efficiency using compound scaling and MBConv blocks.
3. **VGG16**: Deep 3×3 convolution stacks for rich structural feature maps.
4. **ResNet50**: 50-layer deep network with identity skip connections to prevent vanishing gradients.
5. **InceptionV3**: Multi-scale parallel factorized kernels at native (299×299) resolution.

---

## 2. Dataset Preparation & Folder Structure

Download the **Brain Tumor MRI Dataset** (7,023 images from Kaggle / Figshare) and organize it as follows:

```
dataset/
├── train/
│   ├── glioma/
│   ├── meningioma/
│   ├── no_tumor/
│   └── pituitary/
├── val/
│   ├── glioma/
│   ├── meningioma/
│   ├── no_tumor/
│   └── pituitary/
└── test/
    ├── glioma/
    ├── meningioma/
    ├── no_tumor/
    └── pituitary/
```

*Recommended Partition Ratio:*
- **Train (70%):** ~4,916 images
- **Validation (15%):** ~1,053 images
- **Test (15%):** ~1,054 images

---

## 3. Installation & Setup

```bash
# 1. Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt
```

---

## 4. Training Models

Train any of the five models using `train.py`:

```bash
# Train EfficientNet-B0
python train.py --model efficientnet_b0 --epochs 30 --batch-size 32

# Train ResNet50
python train.py --model resnet50 --epochs 30 --batch-size 32

# Train InceptionV3 (automatically uses 299x299 tensor shape)
python train.py --model inception_v3 --epochs 30 --batch-size 32

# Train VGG16
python train.py --model vgg16 --epochs 25 --batch-size 16

# Train Custom CNN
python train.py --model cnn --epochs 40 --batch-size 32
```

Trained weights will be automatically saved in the `weights/` folder (e.g., `weights/efficientnet_b0_best.keras`).

---

## 5. Model Evaluation & Confusion Matrix

Evaluate on the held-out test split:

```bash
# Evaluate all models
python evaluate.py --model all --dataset ../dataset

# Evaluate a specific model
python evaluate.py --model efficientnet_b0 --dataset ../dataset
```

This generates detailed classification reports (Accuracy, Precision, Recall, F1-Score) and saves confusion matrix plots in `reports/`.

---

## 6. Running the API Server

You can run either the **FastAPI** server (recommended) or the **Flask** server:

### Option A: FastAPI (Recommended)
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
- API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/api/health`

### Option B: Flask
```bash
python app.py
```

---

## 7. API Endpoints

- `GET /api/health` - Check backend status and available models.
- `GET /api/models` - List deep learning architectures.
- `POST /api/classify` - Upload image for classification:
  ```bash
  curl -X POST http://localhost:8000/api/classify \
       -F "file=@/path/to/brain_mri_scan.jpg" \
       -F "model_id=efficientnet_b0"
  ```

---

## 8. Medical & Academic Disclaimer

This project is developed solely for educational and research evaluation as an academic final-year project. It is **not a medical device** and should not be used for clinical diagnosis.
