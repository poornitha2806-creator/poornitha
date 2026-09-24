import { ClassificationResult, ModelType, TumorClass } from '../types';
import { simulateResearchInference } from '../utils/imageProcessing';

export interface ApiStatus {
  online: boolean;
  endpoint: string;
  backendName?: string;
  loadedModels?: string[];
  error?: string;
}

// Default Python backend URL (FastAPI/Flask default)
let currentBackendUrl = 'http://localhost:8000';

export const setBackendUrl = (url: string) => {
  currentBackendUrl = url.trim().replace(/\/$/, '');
};

export const getBackendUrl = () => currentBackendUrl;

export const checkBackendHealth = async (customUrl?: string): Promise<ApiStatus> => {
  const url = (customUrl || currentBackendUrl).replace(/\/$/, '');
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(`${url}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        online: true,
        endpoint: url,
        backendName: data.backend || 'FastAPI Medical DL Engine',
        loadedModels: data.loaded_models || ['cnn', 'efficientnet_b0', 'vgg16', 'resnet50', 'inception_v3'],
      };
    }
    return {
      online: false,
      endpoint: url,
      error: `Server responded with status ${response.status}`,
    };
  } catch (err: any) {
    return {
      online: false,
      endpoint: url,
      error: err.name === 'AbortError' ? 'Connection timed out' : 'No local Python backend detected at this address.',
    };
  }
};

export const classifyMriScan = async (
  imageSource: { file?: File; dataUrl: string; fileName: string; fileSize: number; knownClass?: TumorClass },
  modelId: ModelType,
  preferRealBackend = false
): Promise<ClassificationResult> => {
  // If user requested real backend, attempt to call it
  if (preferRealBackend) {
    try {
      const health = await checkBackendHealth();
      if (health.online) {
        const formData = new FormData();
        if (imageSource.file) {
          formData.append('file', imageSource.file);
        } else {
          // Convert dataUrl to blob
          const res = await fetch(imageSource.dataUrl);
          const blob = await res.blob();
          formData.append('file', blob, imageSource.fileName);
        }
        formData.append('model_id', modelId);

        const startTime = performance.now();
        const response = await fetch(`${currentBackendUrl}/api/classify`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const latency = Math.round(performance.now() - startTime);

          return {
            id: `real-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            imageUrl: imageSource.dataUrl,
            fileName: imageSource.fileName,
            fileSize: imageSource.fileSize,
            modelId: modelId,
            modelName: data.model_name || modelId,
            predictedClass: data.predicted_class,
            predictedClassName: data.predicted_class_name,
            confidence: Number(data.confidence.toFixed(2)),
            probabilities: data.probabilities,
            isRealModel: true,
            inferenceTimeMs: data.inference_time_ms || latency,
            gradCamHeatmapUrl: data.gradcam_url,
            imageDimensions: data.dimensions || { width: 512, height: 512 },
            radiologicNotes: data.notes || [
              `Direct prediction from local Python ${data.backend || 'FastAPI'} server with trained weights.`,
              `Classified by ${modelId.toUpperCase()} deep neural network.`
            ]
          };
        }
      }
    } catch (e) {
      console.warn('Backend call failed, falling back to research demo simulation mode:', e);
    }
  }

  // Fallback / standard Research Simulation Mode:
  return await simulateResearchInference(
    imageSource.dataUrl,
    modelId,
    imageSource.fileName,
    imageSource.fileSize,
    imageSource.knownClass
  );
};
