import React, { useState } from 'react';
import { ActivePage, ClassificationResult, ModelType } from '../types';
import { TUMOR_CATEGORIES } from '../data/categoriesData';
import { DEEP_LEARNING_MODELS } from '../data/modelsData';
import { 
  ArrowLeft, 
  RotateCcw, 
  Download, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  BarChart2, 
  Clock, 
  Cpu,
  Share2
} from 'lucide-react';

interface ResultsPageProps {
  result: ClassificationResult | null;
  setActivePage: (page: ActivePage) => void;
  onResetClassification: () => void;
  onSelectModelAndRerun: (model: ModelType) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  result,
  setActivePage,
  onResetClassification,
  onSelectModelAndRerun
}) => {
  const [showGradCam, setShowGradCam] = useState<boolean>(true);
  const [camOpacity, setCamOpacity] = useState<number>(65);
  const [reportPrinted, setReportPrinted] = useState<boolean>(false);

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          No Classification Result Yet
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Please upload or select an MRI scan in the classification workspace to generate deep learning predictions and Grad-CAM activation maps.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setActivePage('classify')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Go to Classification Workspace
          </button>
          <button
            onClick={() => setActivePage('home')}
            className="px-4 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const categoryInfo = TUMOR_CATEGORIES[result.predictedClass];
  const modelInfo = DEEP_LEARNING_MODELS[result.modelId];

  const handlePrintReport = () => {
    window.print();
    setReportPrinted(true);
    setTimeout(() => setReportPrinted(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:m-0">
      
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('classify')}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Back to upload"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Diagnostic Inference Report
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Brain Tumor Classification Output
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export / Print Report</span>
          </button>

          <button
            onClick={() => setActivePage('classify')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Classify Another Scan</span>
          </button>
        </div>
      </div>

      {/* Prominent Required Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold text-sm text-amber-950">
            Mandatory Medical & Academic Disclaimer
          </p>
          <p className="leading-relaxed">
            This result is for educational and research purposes and is not a medical diagnosis. The classification and confidence score are calculated for academic research evaluation under controlled dataset protocols. Under no circumstances should this prediction replace histopathological biopsy, radiographic consultation, or professional clinical diagnosis by certified medical professionals.
          </p>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (6 cols): Scan Inspector with Grad-CAM */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            
            {/* Viewport Header */}
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>MRI Scan with Grad-CAM Spatial Activation</span>
              </div>

              {/* Grad-CAM Toggle Button */}
              <button
                onClick={() => setShowGradCam(!showGradCam)}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  showGradCam 
                    ? 'bg-blue-100 text-blue-700 font-semibold' 
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {showGradCam ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showGradCam ? 'Grad-CAM: ON' : 'Grad-CAM: OFF'}</span>
              </button>
            </div>

            {/* Viewport Stage */}
            <div className="relative bg-slate-950 min-h-[380px] flex items-center justify-center p-4 select-none overflow-hidden">
              
              {/* Base MRI Scan */}
              <img
                src={result.imageUrl}
                alt="Analyzed MRI Scan"
                referrerPolicy="no-referrer"
                className="max-h-[420px] w-auto object-contain rounded-md"
              />

              {/* Grad-CAM Heatmap Layer */}
              {showGradCam && result.gradCamHeatmapUrl && (
                <img
                  src={result.gradCamHeatmapUrl}
                  alt="Grad-CAM Class Activation Map"
                  referrerPolicy="no-referrer"
                  style={{ opacity: camOpacity / 100 }}
                  className="absolute inset-0 max-h-[420px] max-w-full m-auto object-contain pointer-events-none mix-blend-screen transition-opacity duration-150"
                />
              )}

              {/* Mode Watermark Tag */}
              <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 backdrop-blur-xs rounded text-[10px] font-mono text-slate-300 border border-slate-800">
                {result.isRealModel ? 'PYTHON BACKEND INFERENCE' : 'RESEARCH DEMO SIMULATION'}
              </div>

              <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 backdrop-blur-xs rounded text-[10px] font-mono text-slate-400 border border-slate-800">
                {result.imageDimensions.width} × {result.imageDimensions.height} px
              </div>
            </div>

            {/* Grad-CAM Heatmap Opacity Slider */}
            {showGradCam && (
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4 text-xs">
                <span className="text-slate-600 font-medium text-[11px] shrink-0">
                  Heatmap Intensity:
                </span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={camOpacity}
                  onChange={(e) => setCamOpacity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="font-mono text-slate-500 text-[11px] w-8 text-right">
                  {camOpacity}%
                </span>
              </div>
            )}

            {/* Scan Metadata Row */}
            <div className="px-5 py-3 bg-white border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-mono uppercase">Scan Source</span>
                <span className="font-mono font-medium text-slate-700 truncate block text-[11px]">
                  {result.fileName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-mono uppercase">Inference Time</span>
                <span className="font-mono font-medium text-slate-700 text-[11px]">
                  {result.inferenceTimeMs} ms
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-mono uppercase">Evaluation Mode</span>
                <span className="font-medium text-blue-600 text-[11px]">
                  {result.isRealModel ? 'Trained Weights' : 'Demo Verification'}
                </span>
              </div>
            </div>

          </div>

          {/* Grad-CAM Color Legend & Explanation */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">
                Grad-CAM Activation Gradient
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Conv Feature Layer
              </span>
            </div>
            
            {/* Color spectrum bar */}
            <div className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-600 w-full" />
            
            <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
              <span>Low Attention (Background)</span>
              <span>Moderate</span>
              <span>Peak Focal Activation (Tumor)</span>
            </div>
          </div>

        </div>

        {/* Right Column (6 cols): Prediction Summary & Probability Distribution */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Primary Prediction Verdict Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Predicted Pathology
              </span>
              <span className="text-xs font-mono text-slate-400">
                {result.timestamp}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: categoryInfo.color }}
                  />
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {result.predictedClassName}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 italic mt-0.5">
                  {categoryInfo.scientificName} · {categoryInfo.whoGrade}
                </p>
              </div>

              {/* Confidence Score Callout */}
              <div className="text-right shrink-0 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Model Confidence
                </span>
                <span className="text-2xl font-mono font-black text-blue-600">
                  {result.confidence}%
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              {categoryInfo.description}
            </p>

            {/* Model Badge */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-800">
                  {result.modelName}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  ({modelInfo.parametersCount} params)
                </span>
              </div>
              <button
                onClick={() => setActivePage('models')}
                className="text-blue-600 hover:text-blue-700 font-medium text-[11px]"
              >
                Inspect Architecture →
              </button>
            </div>

          </div>

          {/* Probability Distribution Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Class Probability Distribution
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Softmax Activation Output
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {result.probabilities.map((prob) => {
                const cat = TUMOR_CATEGORIES[prob.category];
                const isWinner = prob.category === result.predictedClass;
                return (
                  <div key={prob.category} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className={`font-medium ${isWinner ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                          {prob.label}
                        </span>
                        {isWinner && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded font-semibold">
                            Top Match
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-semibold text-slate-800">
                        {prob.percentage.toFixed(2)}%
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(prob.percentage, 1)}%`,
                          backgroundColor: isWinner ? cat.color : '#94A3B8'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Radiologic Observations & Educational Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Radiologic Observations & Synthesis</span>
            </h3>

            <ul className="space-y-2 text-xs text-slate-600">
              {result.radiologicNotes && result.radiologicNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">›</span>
                  <span>{note}</span>
                </li>
              ))}
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">›</span>
                <span>
                  Characteristic radiologic sign: {categoryInfo.radiologicSigns[0]}
                </span>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">
                Test with another architecture:
              </span>
              {(['cnn', 'efficientnet_b0', 'vgg16', 'resnet50', 'inception_v3'] as ModelType[])
                .filter(m => m !== result.modelId)
                .map(m => (
                  <button
                    key={m}
                    onClick={() => onSelectModelAndRerun(m)}
                    className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded text-slate-700 transition-colors"
                  >
                    {DEEP_LEARNING_MODELS[m].name}
                  </button>
                ))}
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-3 pt-2 print:hidden">
            <button
              onClick={() => setActivePage('classify')}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Classify Another MRI Scan</span>
            </button>

            <button
              onClick={() => setActivePage('metrics')}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2"
            >
              <span>View Confusion Matrix</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
