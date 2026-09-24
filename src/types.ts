export type ModelType = 'cnn' | 'efficientnet_b0' | 'vgg16' | 'resnet50' | 'inception_v3';

export type TumorClass = 'glioma' | 'meningioma' | 'pituitary' | 'no_tumor';

export interface TumorCategoryInfo {
  id: TumorClass;
  name: string;
  scientificName: string;
  description: string;
  clinicalCharacteristics: string[];
  radiologicSigns: string[];
  whoGrade: string;
  color: string;
}

export interface DeepLearningModel {
  id: ModelType;
  name: string;
  codeName: string;
  category: 'Custom Architecture' | 'Transfer Learning';
  paperRef: string;
  year: number;
  inputShape: string;
  inputResolution: [number, number];
  parametersCount: string;
  trainableParams: string;
  depth: number;
  description: string;
  strengths: string[];
  architectureSummary: string[];
  preprocessingNote: string;
  trainingSpecs: {
    recommendedBatch: number;
    learningRate: string;
    optimizer: string;
    lossFunction: string;
  };
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    testLoss: number;
    aucRoc: number;
    inferenceLatencyMs: number;
  };
}

export interface ClassProbability {
  category: TumorClass;
  label: string;
  probability: number; // 0 to 1
  percentage: number;  // 0 to 100
}

export interface ClassificationResult {
  id: string;
  timestamp: string;
  imageUrl: string;
  fileName: string;
  fileSize: number;
  modelId: ModelType;
  modelName: string;
  predictedClass: TumorClass;
  predictedClassName: string;
  confidence: number;
  probabilities: ClassProbability[];
  isRealModel: boolean;
  inferenceTimeMs: number;
  gradCamHeatmapUrl?: string;
  imageDimensions: { width: number; height: number };
  radiologicNotes?: string[];
  detectedRegion?: {
    x: number;
    y: number;
    width: number;
    height: number;
    severity: 'Mild' | 'Moderate' | 'Severe' | 'None';
  };
}

export interface SampleMriScan {
  id: string;
  title: string;
  groundTruth: TumorClass;
  groundTruthName: string;
  sliceOrientation: 'Axial' | 'Coronal' | 'Sagittal';
  weighting: 'T1 Post-Contrast' | 'T1 Pre-Contrast' | 'T2-Weighted' | 'FLAIR';
  imageUrl: string;
  patientAgeGender: string;
  clinicalIndication: string;
  keyFinding: string;
}

export interface ConfusionMatrixData {
  labels: string[];
  matrix: number[][]; // 4x4 matrix: rows = actual, cols = predicted
  classMetrics: {
    label: string;
    precision: number;
    recall: number;
    f1: number;
    support: number;
  }[];
}

export type ActivePage = 
  | 'home'
  | 'about'
  | 'classify'
  | 'models'
  | 'results'
  | 'metrics'
  | 'contact';
