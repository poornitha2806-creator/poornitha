import { ClassificationResult, ModelType, TumorClass, ClassProbability } from '../types';
import { DEEP_LEARNING_MODELS } from '../data/modelsData';
import { TUMOR_CATEGORIES } from '../data/categoriesData';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  file?: File;
}

export const validateMriFile = (file: File): ValidationResult => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload a standard medical MRI scan in JPG, JPEG, or PNG format.'
    };
  }

  // Max 15MB
  const maxBytes = 15 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File size exceeds the 15MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please upload an optimized MRI slice.`
    };
  }

  return { valid: true, file };
};

export const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Failed to load image for dimension verification'));
    img.src = dataUrl;
  });
};

/**
 * Generates a realistic Grad-CAM Class Activation Heatmap overlay
 * based on the image's pixel brightness distribution and detected lesion focal center.
 */
export const generateGradCamOverlay = async (
  imageUrl: string,
  tumorClass: TumorClass,
  seed = 42
): Promise<{ heatmapUrl: string; region: { x: number; y: number; width: number; height: number; severity: 'Mild' | 'Moderate' | 'Severe' | 'None' } }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const w = img.naturalWidth || 512;
      const h = img.naturalHeight || 512;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({
          heatmapUrl: imageUrl,
          region: { x: 0.3, y: 0.3, width: 0.4, height: 0.4, severity: 'None' }
        });
        return;
      }

      // Draw original image to sample pixel brightness
      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Determine focal lesion coordinates based on tumor class characteristics
      let focalX = w * 0.5;
      let focalY = h * 0.5;
      let radius = Math.min(w, h) * 0.18;
      let severity: 'Mild' | 'Moderate' | 'Severe' | 'None' = 'Moderate';

      if (tumorClass === 'glioma') {
        // Typically deep hemispheric (e.g. left fronto-parietal)
        focalX = w * 0.38;
        focalY = h * 0.42;
        radius = Math.min(w, h) * 0.22;
        severity = 'Severe';
      } else if (tumorClass === 'meningioma') {
        // Peripheral / convexity / dural border
        focalX = w * 0.68;
        focalY = h * 0.32;
        radius = Math.min(w, h) * 0.16;
        severity = 'Moderate';
      } else if (tumorClass === 'pituitary') {
        // Sellar / central skull base
        focalX = w * 0.50;
        focalY = h * 0.62;
        radius = Math.min(w, h) * 0.14;
        severity = 'Moderate';
      } else {
        // No tumor: diffuse low baseline across cortical parenchyma
        focalX = w * 0.50;
        focalY = h * 0.50;
        radius = Math.min(w, h) * 0.35;
        severity = 'None';
      }

      // Search image for brightest patch near focal region to anchor precisely on lesion
      let maxBright = 0;
      let bestX = focalX;
      let bestY = focalY;
      const searchRadius = Math.min(w, h) * 0.20;
      
      const step = 8;
      for (let y = Math.max(0, Math.floor(focalY - searchRadius)); y < Math.min(h, focalY + searchRadius); y += step) {
        for (let x = Math.max(0, Math.floor(focalX - searchRadius)); x < Math.min(w, focalX + searchRadius); x += step) {
          const idx = (y * w + x) * 4;
          const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          if (brightness > maxBright) {
            maxBright = brightness;
            bestX = x;
            bestY = y;
          }
        }
      }

      if (tumorClass !== 'no_tumor' && maxBright > 60) {
        focalX = bestX;
        focalY = bestY;
      }

      // Create Grad-CAM overlay canvas
      const camCanvas = document.createElement('canvas');
      camCanvas.width = w;
      camCanvas.height = h;
      const camCtx = camCanvas.getContext('2d');

      if (camCtx) {
        if (tumorClass === 'no_tumor') {
          // Low diffuse gradient showing normal symmetric attention
          const normalGrad = camCtx.createRadialGradient(focalX, focalY, 10, focalX, focalY, radius);
          normalGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)'); // sky blue
          normalGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.15)'); // emerald
          normalGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          camCtx.fillStyle = normalGrad;
          camCtx.fillRect(0, 0, w, h);
        } else {
          // Intense jet-like activation gradient centered on lesion
          const lesionGrad = camCtx.createRadialGradient(focalX, focalY, 0, focalX, focalY, radius);
          lesionGrad.addColorStop(0, 'rgba(239, 68, 68, 0.75)');    // Core hot red
          lesionGrad.addColorStop(0.3, 'rgba(249, 115, 22, 0.65)'); // Orange
          lesionGrad.addColorStop(0.6, 'rgba(234, 179, 8, 0.45)');  // Yellow
          lesionGrad.addColorStop(0.85, 'rgba(6, 182, 212, 0.25)'); // Cyan edge
          lesionGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');           // Fade

          camCtx.fillStyle = lesionGrad;
          camCtx.fillRect(0, 0, w, h);
        }
      }

      const heatmapUrl = camCanvas.toDataURL('image/png');
      const region = {
        x: Math.max(0, (focalX - radius) / w),
        y: Math.max(0, (focalY - radius) / h),
        width: Math.min(1, (radius * 2) / w),
        height: Math.min(1, (radius * 2) / h),
        severity
      };

      resolve({ heatmapUrl, region });
    };

    img.onerror = () => {
      resolve({
        heatmapUrl: imageUrl,
        region: { x: 0.3, y: 0.3, width: 0.4, height: 0.4, severity: 'None' }
      });
    };

    img.src = imageUrl;
  });
};

/**
 * Simulates research inference with realistic diagnostic probabilities,
 * confidence score, latency, and radiologic feature correlation.
 */
export const simulateResearchInference = async (
  imageUrl: string,
  modelId: ModelType,
  fileName: string,
  fileSize: number,
  knownClass?: TumorClass
): Promise<ClassificationResult> => {
  const model = DEEP_LEARNING_MODELS[modelId];
  const dims = await getImageDimensions(imageUrl).catch(() => ({ width: 512, height: 512 }));

  // Determine class: if knownClass is provided (from sample scan) use it;
  // otherwise, analyze image brightness/file name or default to glioma/meningioma/pituitary/no_tumor
  let detectedClass: TumorClass = 'glioma';
  if (knownClass) {
    detectedClass = knownClass;
  } else {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('mening') || lowerName.includes('case-2')) {
      detectedClass = 'meningioma';
    } else if (lowerName.includes('pituit') || lowerName.includes('case-3')) {
      detectedClass = 'pituitary';
    } else if (lowerName.includes('norm') || lowerName.includes('healthy') || lowerName.includes('case-4')) {
      detectedClass = 'no_tumor';
    } else if (lowerName.includes('glio') || lowerName.includes('case-1')) {
      detectedClass = 'glioma';
    } else {
      // Deterministic hash based on file size and dimensions
      const hash = (fileSize + dims.width * 7 + dims.height * 13) % 4;
      const classes: TumorClass[] = ['glioma', 'meningioma', 'pituitary', 'no_tumor'];
      detectedClass = classes[hash];
    }
  }

  // Model-specific confidence tuning based on benchmark test accuracies
  const baseConf = (model.metrics.accuracy / 100);
  // Add slight natural variance (0.91 to 0.98)
  const randomShift = (Math.sin(fileSize * 0.01) * 0.03);
  let mainProb = Math.min(0.985, Math.max(0.88, baseConf - 0.02 + randomShift));

  const remaining = 1.0 - mainProb;
  const otherClasses: TumorClass[] = (['glioma', 'meningioma', 'pituitary', 'no_tumor'] as TumorClass[])
    .filter(c => c !== detectedClass);

  // Distribute remaining probability realistically
  const p1 = remaining * 0.60;
  const p2 = remaining * 0.28;
  const p3 = remaining * 0.12;

  const probsMap: Record<TumorClass, number> = {
    glioma: 0,
    meningioma: 0,
    pituitary: 0,
    no_tumor: 0
  };
  probsMap[detectedClass] = mainProb;
  probsMap[otherClasses[0]] = p1;
  probsMap[otherClasses[1]] = p2;
  probsMap[otherClasses[2]] = p3;

  const probabilities: ClassProbability[] = (['glioma', 'meningioma', 'pituitary', 'no_tumor'] as TumorClass[]).map(cat => ({
    category: cat,
    label: TUMOR_CATEGORIES[cat].name,
    probability: Number(probsMap[cat].toFixed(4)),
    percentage: Number((probsMap[cat] * 100).toFixed(2))
  })).sort((a, b) => b.probability - a.probability);

  // Generate Grad-CAM attention heatmap
  const { heatmapUrl, region } = await generateGradCamOverlay(imageUrl, detectedClass);

  // Formulate radiologic observations
  const categoryInfo = TUMOR_CATEGORIES[detectedClass];
  const radiologicNotes: string[] = [
    `Model Architecture: ${model.name} (${model.category}) with ${model.parametersCount} parameters.`,
    `Input Resolution: Tensor standardized to ${model.inputShape} using ${model.preprocessingNote}`,
    detectedClass === 'no_tumor'
      ? 'Anatomical assessment shows symmetrical cerebral parenchyma without focal space-occupying lesions.'
      : `High convolutional filter activation detected corresponding to ${categoryInfo.name} radiologic characteristics (${categoryInfo.whoGrade}).`,
    `Deep neural network confidence score: ${(mainProb * 100).toFixed(2)}% under educational test mode.`
  ];

  return {
    id: `scan-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    imageUrl,
    fileName,
    fileSize,
    modelId,
    modelName: model.name,
    predictedClass: detectedClass,
    predictedClassName: categoryInfo.name,
    confidence: Number((mainProb * 100).toFixed(2)),
    probabilities,
    isRealModel: false, // Clearly labeled as Educational Demo / Simulation Mode
    inferenceTimeMs: model.metrics.inferenceLatencyMs + Math.floor(Math.random() * 12),
    gradCamHeatmapUrl: heatmapUrl,
    imageDimensions: dims,
    radiologicNotes,
    detectedRegion: region
  };
};
