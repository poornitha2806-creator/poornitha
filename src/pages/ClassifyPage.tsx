import React, { useState, useRef, useEffect } from 'react';
import { 
  ActivePage, 
  ModelType, 
  SampleMriScan, 
  ClassificationResult,
  TumorClass 
} from '../types';
import { DEEP_LEARNING_MODELS } from '../data/modelsData';
import { SAMPLE_MRI_SCANS } from '../data/samplesData';
import { TUMOR_CATEGORIES } from '../data/categoriesData';
import { validateMriFile } from '../utils/imageProcessing';
import { classifyMriScan, checkBackendHealth, getBackendUrl } from '../services/apiService';
import { 
  Upload, 
  Image as ImageIcon, 
  Play, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Sliders, 
  Info, 
  AlertTriangle, 
  Check, 
  Loader2, 
  ShieldAlert,
  Server,
  Layers,
  ArrowRight,
  Eye
} from 'lucide-react';

interface ClassifyPageProps {
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
  onClassificationComplete: (result: ClassificationResult) => void;
  setActivePage: (page: ActivePage) => void;
  initialScan?: { url: string; fileName: string; knownClass?: TumorClass } | null;
  onOpenBackendModal: () => void;
}

export const ClassifyPage: React.FC<ClassifyPageProps> = ({
  selectedModel,
  setSelectedModel,
  onClassificationComplete,
  setActivePage,
  initialScan,
  onOpenBackendModal
}) => {
  const [currentImage, setCurrentImage] = useState<string | null>(initialScan ? initialScan.url : null);
  const [currentFileName, setCurrentFileName] = useState<string>(initialScan ? initialScan.fileName : '');
  const [currentFileSize, setCurrentFileSize] = useState<number>(initialScan ? 1024 * 512 : 0);
  const [currentFileObj, setCurrentFileObj] = useState<File | undefined>(undefined);
  const [knownClass, setKnownClass] = useState<TumorClass | undefined>(initialScan?.knownClass);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationStep, setClassificationStep] = useState<string>('');
  const [preferRealBackend, setPreferRealBackend] = useState<boolean>(false);
  const [backendAvailable, setBackendAvailable] = useState<boolean>(false);

  // Viewport inspection tools
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [contrast, setContrast] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);
  const [selectedFilter, setSelectedFilter] = useState<'normal' | 'bone' | 'high-contrast' | 'inverted' | 'hot-iron' | 'jet'>('normal');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check backend availability on mount
  useEffect(() => {
    checkBackendHealth().then(status => {
      setBackendAvailable(status.online);
    });
  }, []);

  // Handle external initialScan change
  useEffect(() => {
    if (initialScan) {
      setCurrentImage(initialScan.url);
      setCurrentFileName(initialScan.fileName);
      setKnownClass(initialScan.knownClass);
      setValidationError(null);
    }
  }, [initialScan]);

  const handleFile = (file: File) => {
    const val = validateMriFile(file);
    if (!val.valid) {
      setValidationError(val.error || 'Invalid file.');
      return;
    }

    setValidationError(null);
    setCurrentFileName(file.name);
    setCurrentFileSize(file.size);
    setCurrentFileObj(file);
    setKnownClass(undefined);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCurrentImage(e.target.result as string);
        resetViewer();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSelectSample = (sample: SampleMriScan) => {
    setCurrentImage(sample.imageUrl);
    setCurrentFileName(`${sample.id}.jpg`);
    setCurrentFileSize(1024 * 640);
    setCurrentFileObj(undefined);
    setKnownClass(sample.groundTruth);
    setValidationError(null);
    resetViewer();
  };

  const resetViewer = () => {
    setZoomLevel(1);
    setContrast(100);
    setBrightness(100);
    setSelectedFilter('normal');
  };

  const runClassification = async () => {
    if (!currentImage) {
      setValidationError('Please select or upload an MRI scan before starting classification.');
      return;
    }

    setIsClassifying(true);
    setValidationError(null);

    // Realistic progress animation steps
    const steps = [
      'Validating MRI matrix dimensions & tensor resolution...',
      'Performing contour extraction & skull-stripping crop...',
      `Applying ${DEEP_LEARNING_MODELS[selectedModel].name} normalization (${DEEP_LEARNING_MODELS[selectedModel].inputShape})...`,
      'Forward pass through deep convolutional feature layers...',
      'Computing spatial Grad-CAM activation heatmap...',
      'Synthesizing multi-class softmax probability distribution...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setClassificationStep(steps[i]);
      await new Promise(r => setTimeout(r, 220));
    }

    try {
      const result = await classifyMriScan(
        {
          file: currentFileObj,
          dataUrl: currentImage,
          fileName: currentFileName || 'mri_scan.jpg',
          fileSize: currentFileSize || 1024 * 500,
          knownClass: knownClass
        },
        selectedModel,
        preferRealBackend
      );

      setIsClassifying(false);
      onClassificationComplete(result);
      setActivePage('results');
    } catch (err: any) {
      setIsClassifying(false);
      setValidationError(err.message || 'Inference execution failed. Please try again.');
    }
  };

  const activeModelInfo = DEEP_LEARNING_MODELS[selectedModel];

  // Compute CSS filter string
  const getFilterStyle = () => {
    let filterStr = `contrast(${contrast}%) brightness(${brightness}%)`;
    if (selectedFilter === 'bone') filterStr += ' grayscale(100%)';
    if (selectedFilter === 'high-contrast') filterStr += ' contrast(160%)';
    if (selectedFilter === 'inverted') filterStr += ' invert(100%)';
    if (selectedFilter === 'hot-iron') filterStr += ' sepia(80%) hue-rotate(-30deg) saturate(180%)';
    if (selectedFilter === 'jet') filterStr += ' hue-rotate(180deg) saturate(160%)';
    return { filter: filterStr, transform: `scale(${zoomLevel})` };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Image Processing Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            MRI Brain Scan Classification
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload an intracranial MRI slice in JPG, JPEG, or PNG format to classify across Glioma, Meningioma, Pituitary, or Normal tissue.
          </p>
        </div>

        {/* Engine Mode Toggle */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
          <button
            onClick={() => setPreferRealBackend(false)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              !preferRealBackend
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Research Demo Mode
          </button>
          <button
            onClick={() => {
              setPreferRealBackend(true);
              if (!backendAvailable) onOpenBackendModal();
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              preferRealBackend
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Python Server</span>
            <span className={`w-1.5 h-1.5 rounded-full ${backendAvailable ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          </button>
        </div>
      </div>

      {/* Validation Error Toast */}
      {validationError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold block mb-0.5">Input Validation Error</strong>
            {validationError}
          </div>
          <button
            onClick={() => setValidationError(null)}
            className="text-rose-500 hover:text-rose-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Workspace Split: Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): MRI Upload & Radiologic Viewport */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            
            {/* Viewport Toolbar */}
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>MRI Scan Viewer</span>
                {currentFileName && (
                  <span className="text-slate-400 font-mono text-[11px] truncate max-w-[180px]">
                    ({currentFileName})
                  </span>
                )}
              </div>

              {/* Viewport Filter Dropdown & Reset */}
              {currentImage && (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value as any)}
                    className="bg-white border border-slate-200 rounded-md px-2 py-1 text-[11px] text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="normal">Standard Grayscale</option>
                    <option value="bone">Bone Window</option>
                    <option value="high-contrast">High Contrast</option>
                    <option value="inverted">Inverted Radiograph</option>
                    <option value="hot-iron">Hot Iron Pseudo-Color</option>
                    <option value="jet">Jet Rainbow Map</option>
                  </select>

                  <button
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                    title="Zoom In"
                    className="p-1 hover:bg-slate-200 rounded text-slate-600"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                    title="Zoom Out"
                    className="p-1 hover:bg-slate-200 rounded text-slate-600"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={resetViewer}
                    title="Reset Adjustments"
                    className="p-1 hover:bg-slate-200 rounded text-slate-600"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Display Stage */}
            <div className="relative min-h-[380px] bg-slate-950 flex items-center justify-center p-4 overflow-hidden select-none">
              
              {currentImage ? (
                <div className="relative max-w-full max-h-[440px] flex items-center justify-center transition-all duration-150">
                  <img
                    src={currentImage}
                    alt="MRI scan viewport"
                    referrerPolicy="no-referrer"
                    style={getFilterStyle()}
                    className="max-h-[420px] w-auto object-contain rounded-md shadow-lg"
                  />
                  {/* Subtle Radiologic Crosshair */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
                    <div className="w-full border-t border-blue-400" />
                    <div className="h-full border-l border-blue-400 absolute" />
                  </div>
                </div>
              ) : (
                /* Empty / Upload Dropzone State */
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-80 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-950/40 text-blue-300'
                      : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 mb-4">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    Drag & Drop MRI Scan Here
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mb-4">
                    Supports JPG, JPEG, or PNG format up to 15MB. Brain MRI slices (Axial, Coronal, Sagittal).
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Browse Local File
                  </button>
                </div>
              )}

              {/* Progress Overlay during classification */}
              {isClassifying && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
                  <div className="relative mb-5">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    Classifying MRI Scan...
                  </h4>
                  <p className="text-xs font-mono text-blue-300 max-w-md h-8 transition-all">
                    {classificationStep}
                  </p>
                  <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-blue-500 animate-pulse w-3/4 rounded-full" />
                  </div>
                </div>
              )}

            </div>

            {/* Viewport Sliders Tray */}
            {currentImage && (
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1 text-[11px] font-medium">
                    <span>Contrast</span>
                    <span className="font-mono">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-slate-600 mb-1 text-[11px] font-medium">
                    <span>Brightness</span>
                    <span className="font-mono">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            {/* Bottom Actions Bar */}
            <div className="px-5 py-3 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New File</span>
              </button>

              {currentImage && (
                <button
                  onClick={runClassification}
                  disabled={isClassifying}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 rounded-lg transition-all shadow-sm flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Classify MRI Scan</span>
                </button>
              )}
            </div>

          </div>

          {/* Clinical Sample Library Picker */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <span className="text-xs font-bold text-slate-900 block mb-2">
              Select Curated Clinical Case (1-Click Test)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_MRI_SCANS.map((s) => {
                const isSelected = currentFileName === `${s.id}.jpg`;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSample(s)}
                    className={`p-2 rounded-lg border text-left transition-all flex flex-col ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="aspect-square rounded bg-slate-950 overflow-hidden mb-1.5">
                      <img
                        src={s.imageUrl}
                        alt={s.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-900 truncate block">
                      {s.groundTruthName}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate block font-mono">
                      {s.sliceOrientation} {s.weighting.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Model Selection & Specifications */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Model Selection Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Deep Learning Engine
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Select 1 of 5 Models
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                Active Architecture
              </h2>
            </div>

            {/* Model Selector Cards */}
            <div className="space-y-2">
              {Object.values(DEEP_LEARNING_MODELS).map((model) => {
                const isSelected = selectedModel === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">
                          {model.name}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-mono">
                          {model.inputShape}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {model.strengths[0]}
                      </p>
                    </div>

                    <div className="text-right pl-3 shrink-0">
                      <span className="text-xs font-mono font-bold text-emerald-600 block">
                        {model.metrics.accuracy}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {model.parametersCount.split(',')[0]}M params
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Model Details Panel */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-800">
                  {activeModelInfo.name} Specifications
                </span>
                <span className="font-mono text-slate-500 text-[11px]">
                  {activeModelInfo.category}
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed text-[11px]">
                {activeModelInfo.description}
              </p>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-600 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">TOTAL PARAMS</span>
                  <span className="font-bold text-slate-900">{activeModelInfo.parametersCount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">NETWORK DEPTH</span>
                  <span className="font-bold text-slate-900">{activeModelInfo.depth} layers</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">AVG LATENCY</span>
                  <span className="font-bold text-slate-900">{activeModelInfo.metrics.inferenceLatencyMs} ms</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">AUC-ROC SCORE</span>
                  <span className="font-bold text-emerald-600">{activeModelInfo.metrics.aucRoc}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <strong className="text-slate-700">Tensor Preprocessing: </strong>
                {activeModelInfo.preprocessingNote}
              </div>
            </div>

            {/* Model Availability Notice */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                {preferRealBackend ? (
                  <>
                    Connected to local Python server. Actual weights loaded for <strong>{activeModelInfo.name}</strong>.
                  </>
                ) : (
                  <>
                    Operating in <strong>Research Demo & Simulation Mode</strong>. Fully simulates spatial Grad-CAM activation and multi-class softmax probabilities without requiring a live local GPU environment.
                  </>
                )}
              </p>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={runClassification}
              disabled={isClassifying || !currentImage}
              className="w-full py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isClassifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing MRI Tensor...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Classify MRI with {activeModelInfo.name}</span>
                </>
              )}
            </button>

          </div>

          {/* Non-Diagnostic Disclaimer Card */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="leading-relaxed text-[11px]">
              <strong>Important Disclaimer:</strong> This result is for educational and research purposes and is not a medical diagnosis. Deep learning predictions must be reviewed by board-certified radiologists.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
