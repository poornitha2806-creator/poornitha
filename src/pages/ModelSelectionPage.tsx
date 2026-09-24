import React from 'react';
import { ActivePage, ModelType } from '../types';
import { DEEP_LEARNING_MODELS } from '../data/modelsData';
import { 
  Check, 
  Layers, 
  Cpu, 
  Info, 
  ArrowRight, 
  ShieldAlert, 
  Zap, 
  ExternalLink,
  Award,
  BarChart3
} from 'lucide-react';

interface ModelSelectionPageProps {
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
  setActivePage: (page: ActivePage) => void;
}

export const ModelSelectionPage: React.FC<ModelSelectionPageProps> = ({
  selectedModel,
  setSelectedModel,
  setActivePage
}) => {
  const activeModel = DEEP_LEARNING_MODELS[selectedModel];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Architecture Benchmarking Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Deep Learning Model Selection
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Explore and select between the five deep learning neural network architectures evaluated in this final-year research project.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('metrics')}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Benchmark Metrics Table</span>
          </button>
          <button
            onClick={() => setActivePage('classify')}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>Proceed to Classify</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Model Training & Availability Advisory */}
      <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start gap-3.5 text-xs text-blue-950">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-blue-900">
            Model Integration & Availability Protocol
          </h4>
          <p className="leading-relaxed">
            In standard machine learning deployment, each model requires its pre-trained or fine-tuned weight checkpoint file (e.g. <code className="font-mono bg-blue-100/70 px-1 py-0.5 rounded text-blue-900">.h5</code> or <code className="font-mono bg-blue-100/70 px-1 py-0.5 rounded text-blue-900">.keras</code>) to be located in the backend storage directory. When running without a local GPU backend, this web application utilizes a transparent <strong>Research Demo & Simulation Mode</strong> reflecting the exact empirical validation characteristics of each architecture.
          </p>
        </div>
      </div>

      {/* 5 Model Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {Object.values(DEEP_LEARNING_MODELS).map((m) => {
          const isSelected = selectedModel === m.id;
          return (
            <div
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`rounded-2xl border p-5 cursor-pointer transition-all flex flex-col justify-between relative ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2.5 right-4 px-2 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-xs">
                  <Check className="w-3 h-3" />
                  <span>ACTIVE</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-2">
                  <span>{m.year}</span>
                  <span>{m.category === 'Custom Architecture' ? 'Custom' : 'Transfer'}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {m.name}
                </h3>
                <p className="text-[11px] font-mono text-blue-600 mt-0.5">
                  {m.inputShape}
                </p>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Test Accuracy</span>
                  <span className="font-mono font-bold text-emerald-600">{m.metrics.accuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Params</span>
                  <span className="font-mono text-slate-800">{m.parametersCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Inference Latency</span>
                  <span className="font-mono text-slate-800">{m.metrics.inferenceLatencyMs} ms</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedModel(m.id);
                  }}
                  className={`w-full py-2 mt-2 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isSelected ? 'Selected Model' : 'Select This Model'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Model Deep Dive Inspection */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
              <Cpu className="w-4 h-4" />
              <span>ACTIVE MODEL DEEP INSPECTION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {activeModel.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {activeModel.paperRef}
            </p>
          </div>

          <button
            onClick={() => setActivePage('classify')}
            className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-blue-50 rounded-xl transition-colors shadow-xs self-start md:self-auto flex items-center gap-1.5"
          >
            <span>Classify with {activeModel.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Strengths & Key Advantages */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Strengths for Brain MRI Classification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeModel.strengths.map((str, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-xs text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Layer-by-Layer Architecture Pipeline */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Computational Architecture Topology
            </h3>
            <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-blue-300 space-y-2 overflow-x-auto">
              {activeModel.architectureSummary.map((layer, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-slate-500 select-none">[{idx + 1}]</span>
                  <span className="text-slate-200">{layer}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hyperparameters & Training Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-mono text-[10px] uppercase">Recommended Batch</span>
              <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
                {activeModel.trainingSpecs.recommendedBatch} samples
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-mono text-[10px] uppercase">Learning Rate Schedule</span>
              <span className="text-xs font-bold text-slate-900 font-mono mt-0.5 block truncate">
                {activeModel.trainingSpecs.learningRate}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-mono text-[10px] uppercase">Optimizer</span>
              <span className="text-xs font-bold text-slate-900 font-mono mt-0.5 block">
                {activeModel.trainingSpecs.optimizer}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-mono text-[10px] uppercase">Loss Function</span>
              <span className="text-xs font-bold text-slate-900 font-mono mt-0.5 block">
                {activeModel.trainingSpecs.lossFunction}
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
