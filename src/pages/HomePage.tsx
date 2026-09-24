import React from 'react';
import { ActivePage, ModelType, SampleMriScan } from '../types';
import { DEEP_LEARNING_MODELS } from '../data/modelsData';
import { TUMOR_CATEGORIES } from '../data/categoriesData';
import { SAMPLE_MRI_SCANS } from '../data/samplesData';
import { 
  ArrowRight, 
  Brain, 
  CheckCircle2, 
  Layers, 
  Upload, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import heroBanner from '../assets/images/mri_hero_banner_1790227393753.jpg';

interface HomePageProps {
  setActivePage: (page: ActivePage) => void;
  onSelectSample: (sample: SampleMriScan) => void;
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActivePage,
  onSelectSample,
  selectedModel,
  setSelectedModel
}) => {
  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white pt-8 pb-14 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Title & Description */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                <Brain className="w-4 h-4 text-blue-600" />
                <span>Final-Year Engineering Project · Medical AI Systems</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight text-balance leading-tight">
                Brain Tumor Classification Using MRI Scan and Deep Learning
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                An intelligent medical computer-vision research platform designed to classify brain magnetic resonance imaging (MRI) scans into four distinct categories: <strong>Glioma</strong>, <strong>Meningioma</strong>, <strong>Pituitary Tumor</strong>, and <strong>No Tumor (Normal)</strong>.
              </p>

              {/* Research Scope & Disclaimer Note */}
              <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 leading-relaxed">
                  <strong>Educational & Research Project:</strong> This system evaluates five deep learning architectures (CNN, EfficientNet-B0, VGG16, ResNet50, InceptionV3) for comparative academic benchmarking and is <em>not intended for real clinical patient diagnosis</em>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActivePage('classify')}
                  className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-sm hover:shadow flex items-center gap-2 group"
                >
                  <Upload className="w-4 h-4" />
                  <span>Start MRI Classification</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => setActivePage('models')}
                  className="px-5 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-slate-500" />
                  <span>Compare 5 Deep Models</span>
                </button>

                <button
                  onClick={() => setActivePage('about')}
                  className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Read Documentation
                </button>
              </div>

              {/* Quick Spec Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-mono uppercase text-[10px]">Dataset Samples</span>
                  <span className="text-base font-bold text-slate-900 font-mono">7,023 Images</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono uppercase text-[10px]">Architectures</span>
                  <span className="text-base font-bold text-slate-900 font-mono">5 Models</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono uppercase text-[10px]">Classes</span>
                  <span className="text-base font-bold text-slate-900 font-mono">4 Categories</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono uppercase text-[10px]">Peak Validation</span>
                  <span className="text-base font-bold text-emerald-600 font-mono">96.9% (Inception)</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Graphic */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900">
                <img
                  src={heroBanner}
                  alt="Brain MRI Deep Learning Visualization"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end text-white">
                  <span className="text-[11px] font-mono text-blue-300 uppercase tracking-wider">
                    Computer Vision Inference Pipeline
                  </span>
                  <h3 className="text-lg font-bold">
                    Multi-Architecture Medical Neural Network
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    Automated contour cropping, model-specific tensor preprocessing, deep feature map extraction, and Grad-CAM spatial activation mapping.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Test: 1-Click Sample Scans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              Instant Testing
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Try Pre-Loaded MRI Scans
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Click any verified radiologic scan below to instantly inspect preprocessing, inference, and Grad-CAM activation.
            </p>
          </div>
          <button
            onClick={() => setActivePage('classify')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Custom File Upload</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SAMPLE_MRI_SCANS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-3 hover:border-blue-400 hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-950 mb-3">
                <img
                  src={sample.imageUrl}
                  alt={sample.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 backdrop-blur-sm rounded text-[10px] font-mono text-white">
                  {sample.sliceOrientation} {sample.weighting}
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[11px] font-semibold text-white shadow-sm"
                     style={{ backgroundColor: TUMOR_CATEGORIES[sample.groundTruth].color }}>
                  {sample.groundTruthName}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {sample.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {sample.clinicalIndication}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-medium">
                  <span>Run Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Tumor Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-slate-200 pt-12">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Diagnostic Taxonomy
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Brain Tumor Classification Categories
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              The neural networks are trained to detect and distinguish between three primary intracranial neoplasms and physiologically normal brain tissue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(TUMOR_CATEGORIES).map((cat) => (
              <div 
                key={cat.id} 
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-[11px] font-mono text-slate-400">
                      {cat.whoGrade}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 italic mt-0.5">
                    {cat.scientificName}
                  </p>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">
                    Key Radiologic Sign
                  </span>
                  <p className="text-xs font-medium text-slate-700 line-clamp-2">
                    {cat.radiologicSigns[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Deep Learning Architectures Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                Model Zoo & Benchmarks
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1">
                Five Deep Learning Architectures
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Trained and evaluated on Kaggle Brain Tumor MRI Dataset with standardized 70/15/15 train-validation-test partitions and data augmentation.
              </p>
            </div>
            <button
              onClick={() => setActivePage('models')}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 self-start lg:self-auto"
            >
              <span>Full Model Comparison</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.values(DEEP_LEARNING_MODELS).map((m) => {
              const isCurrent = selectedModel === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-blue-950/60 border-blue-400 ring-1 ring-blue-400'
                      : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                      <span>{m.category === 'Custom Architecture' ? 'Custom' : 'Transfer'}</span>
                      <span>{m.inputShape}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      {m.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-3">
                      {m.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Test Accuracy</span>
                      <span className="font-mono font-bold text-emerald-400">{m.metrics.accuracy}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Parameters</span>
                      <span className="font-mono text-slate-300">{m.parametersCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Latency</span>
                      <span className="font-mono text-slate-300">{m.metrics.inferenceLatencyMs} ms</span>
                    </div>

                    <div className="pt-2">
                      <span className={`block text-center py-1 rounded text-[11px] font-medium ${
                        isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}>
                        {isCurrent ? 'Active Model' : 'Select'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4-Stage DL Pipeline Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Technical Architecture
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            End-to-End Image Processing Pipeline
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            How raw DICOM/MRI scans are preprocessed, augmented, and analyzed by the convolutional feature extractors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 relative">
            <span className="text-xs font-mono font-bold text-blue-600">STAGE 01</span>
            <h3 className="text-sm font-bold text-slate-900 mt-1">MRI Scan Acquisition</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Accepts axial, coronal, and sagittal T1 post-contrast, T2-weighted, or FLAIR scans in standard image formats (JPG/PNG).
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 relative">
            <span className="text-xs font-mono font-bold text-blue-600">STAGE 02</span>
            <h3 className="text-sm font-bold text-slate-900 mt-1">Contour & Normalization</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Performs skull-stripping contour detection, eliminates blank background margins, resizes to target tensor (224x224 / 299x299), and standardizes pixel intensities.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 relative">
            <span className="text-xs font-mono font-bold text-blue-600">STAGE 03</span>
            <h3 className="text-sm font-bold text-slate-900 mt-1">Deep Feature Extraction</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Selected architecture (CNN, EfficientNet-B0, VGG16, ResNet50, InceptionV3) computes hierarchical spatial feature maps from low-level edges to tumor margins.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 relative">
            <span className="text-xs font-mono font-bold text-blue-600">STAGE 04</span>
            <h3 className="text-sm font-bold text-slate-900 mt-1">Softmax & Grad-CAM</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Computes softmax probability distribution across the 4 classes and generates gradient-weighted class activation heatmaps highlighting localized tumor regions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">
              Ready to classify a Brain MRI scan?
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
              Upload your own scan or choose from the verified clinical library to evaluate all five deep neural models.
            </p>
          </div>
          <button
            onClick={() => setActivePage('classify')}
            className="px-6 py-3 text-sm font-bold text-blue-700 bg-white rounded-lg hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap"
          >
            Launch MRI Classifier
          </button>
        </div>
      </section>

    </div>
  );
};
