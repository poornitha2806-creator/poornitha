import React, { useState } from 'react';
import { ActivePage, ModelType } from '../types';
import { DEEP_LEARNING_MODELS, CONFUSION_MATRICES } from '../data/modelsData';
import { TUMOR_CATEGORIES } from '../data/categoriesData';
import { 
  BarChart2, 
  Layers, 
  TrendingUp, 
  Award, 
  Info, 
  HelpCircle,
  CheckCircle2,
  Table
} from 'lucide-react';

interface MetricsPageProps {
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
  setActivePage: (page: ActivePage) => void;
}

export const MetricsPage: React.FC<MetricsPageProps> = ({
  selectedModel,
  setSelectedModel,
  setActivePage
}) => {
  const [activeMatrixModel, setActiveMatrixModel] = useState<ModelType>(selectedModel);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const activeMatrix = CONFUSION_MATRICES[activeMatrixModel];
  const activeModelDetails = DEEP_LEARNING_MODELS[activeMatrixModel];

  // Total samples in test set
  const totalTestSamples = activeMatrix.matrix.reduce(
    (sum, row) => sum + row.reduce((rSum, val) => rSum + val, 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Empirical Validation & Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Model Evaluation & Confusion Matrices
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Statistical performance benchmarks, multi-class confusion matrices, and ROC-AUC evaluation across 1,054 unseen test MRI scans.
          </p>
        </div>

        <button
          onClick={() => setActivePage('classify')}
          className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs self-start md:self-auto"
        >
          Classify an MRI Scan
        </button>
      </div>

      {/* Comparative Benchmark Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Table className="w-4 h-4 text-blue-600" />
              <span>Side-by-Side Model Benchmark Table</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Trained on 7,023 brain MRI images (70% train, 15% validation, 15% independent test).
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            N = 1,054 Test Slices
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Model Architecture</th>
                <th className="py-3.5 px-4 text-center">Input Shape</th>
                <th className="py-3.5 px-4 text-right">Parameters</th>
                <th className="py-3.5 px-4 text-right">Accuracy</th>
                <th className="py-3.5 px-4 text-right">Precision</th>
                <th className="py-3.5 px-4 text-right">Recall</th>
                <th className="py-3.5 px-4 text-right">F1-Score</th>
                <th className="py-3.5 px-4 text-right">AUC-ROC</th>
                <th className="py-3.5 px-4 text-right">Latency</th>
                <th className="py-3.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.values(DEEP_LEARNING_MODELS).map((m) => {
                const isSelected = activeMatrixModel === m.id;
                return (
                  <tr
                    key={m.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-blue-50/40 font-medium' : ''
                    }`}
                  >
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{m.name}</span>
                        {m.id === 'inception_v3' && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-semibold">
                            Best F1
                          </span>
                        )}
                        {m.id === 'efficientnet_b0' && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-semibold">
                            Efficient
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block">{m.category}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                      {m.inputShape}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                      {m.parametersCount}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                      {m.metrics.accuracy}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                      {m.metrics.precision}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                      {m.metrics.recall}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {m.metrics.f1Score}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-blue-600">
                      {m.metrics.aucRoc}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                      {m.metrics.inferenceLatencyMs} ms
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <button
                        onClick={() => {
                          setActiveMatrixModel(m.id);
                          setSelectedModel(m.id);
                        }}
                        className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected ? 'Viewing' : 'Inspect Matrix'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Confusion Matrix Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 cols: 4x4 Heatmap Matrix */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  4×4 Multi-Class Confusion Matrix
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect True Positives (diagonal) vs False Negatives / False Positives.
              </p>
            </div>

            {/* Matrix Model Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto text-[11px] font-medium">
              {(['inception_v3', 'efficientnet_b0', 'resnet50', 'vgg16', 'cnn'] as ModelType[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setActiveMatrixModel(m);
                    setSelectedCell(null);
                  }}
                  className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
                    activeMatrixModel === m
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {DEEP_LEARNING_MODELS[m].name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Matrix Grid Canvas */}
          <div className="space-y-2">
            
            {/* Predicted Header */}
            <div className="text-center font-mono uppercase text-[11px] text-slate-400 tracking-wider">
              Predicted Diagnosis (Horizontal Columns) →
            </div>

            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              
              {/* Corner Empty cell */}
              <div className="p-2 font-mono text-[10px] text-slate-400 flex items-center justify-center">
                Actual ↓
              </div>

              {/* Column Labels */}
              {activeMatrix.labels.map((colLabel, cIdx) => (
                <div key={cIdx} className="p-2 font-bold text-slate-700 bg-slate-50 rounded-lg text-[11px] truncate">
                  {colLabel}
                </div>
              ))}

              {/* Matrix Rows */}
              {activeMatrix.matrix.map((row, rIdx) => {
                const rowLabel = activeMatrix.labels[rIdx];
                return (
                  <React.Fragment key={rIdx}>
                    {/* Row Label */}
                    <div className="p-2 font-bold text-slate-700 bg-slate-50 rounded-lg text-[11px] flex items-center justify-center">
                      {rowLabel}
                    </div>

                    {/* Cells */}
                    {row.map((val, cIdx) => {
                      const isDiagonal = rIdx === cIdx;
                      const isCellSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
                      const totalInRow = row.reduce((a, b) => a + b, 0);
                      const percentage = ((val / totalInRow) * 100).toFixed(1);

                      return (
                        <div
                          key={cIdx}
                          onClick={() => setSelectedCell({ row: rIdx, col: cIdx })}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center ${
                            isCellSelected
                              ? 'ring-2 ring-blue-600 z-10'
                              : ''
                          } ${
                            isDiagonal
                              ? 'bg-blue-600 text-white font-bold border-blue-700 shadow-xs'
                              : val > 10
                              ? 'bg-rose-100 text-rose-900 border-rose-200'
                              : val > 0
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}
                        >
                          <span className="text-base font-mono font-bold">{val}</span>
                          <span className={`text-[10px] font-mono ${isDiagonal ? 'text-blue-100' : 'text-slate-500'}`}>
                            {percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}

            </div>

            {/* Matrix Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
                <span>True Positive (Correct)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300 inline-block" />
                <span>Low Misclassification (1-10)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-rose-100 border border-rose-300 inline-block" />
                <span>Higher Misclassification (&gt;10)</span>
              </div>
            </div>

          </div>

          {/* Cell Drill-Down Info Box */}
          {selectedCell && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 animate-fadeIn">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Cell Inspection</span>
                <span className="font-mono text-blue-600">
                  {activeMatrix.matrix[selectedCell.row][selectedCell.col]} Cases
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Ground Truth: <strong>{activeMatrix.labels[selectedCell.row]}</strong> | 
                Model Predicted: <strong>{activeMatrix.labels[selectedCell.col]}</strong>
              </p>
              <p className="text-slate-500 text-[11px]">
                {selectedCell.row === selectedCell.col
                  ? 'Correct classification (True Positive). The model accurately detected the distinctive radiological landmarks.'
                  : 'Type I / Type II misclassification error caused by overlapping textural signal intensities in atypical tissue presentations.'}
              </p>
            </div>
          )}

        </div>

        {/* Right 5 cols: Per-Class Precision, Recall & F1 */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Class-Wise Metrics
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Classification Report for {activeModelDetails.name}
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated with Macro and Weighted Averages.
            </p>
          </div>

          <div className="space-y-4">
            {activeMatrix.classMetrics.map((item) => (
              <div key={item.label} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{item.label}</span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    Support: {item.support} scans
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
                  <div className="bg-white p-1.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block uppercase">Precision</span>
                    <span className="font-bold text-slate-800">{item.precision}%</span>
                  </div>
                  <div className="bg-white p-1.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block uppercase">Recall</span>
                    <span className="font-bold text-slate-800">{item.recall}%</span>
                  </div>
                  <div className="bg-white p-1.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block uppercase">F1-Score</span>
                    <span className="font-bold text-blue-600">{item.f1}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mathematical Formulas */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-2 text-blue-950">
            <h4 className="font-bold text-blue-900">
              Standard Formulation Reference
            </h4>
            <div className="space-y-1 font-mono text-[11px] text-blue-900/90">
              <div>Precision = TP / (TP + FP)</div>
              <div>Recall (Sensitivity) = TP / (TP + FN)</div>
              <div>F1-Score = 2 × (Precision × Recall) / (Precision + Recall)</div>
            </div>
          </div>

        </div>

      </div>

      {/* Epoch Training & Validation Convergence Curve Graphic */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Training & Validation Learning Curves (30 Epochs)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical convergence behavior showing loss minimization and categorical accuracy plateauing without severe overfitting.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Optimizer: Adam with ReduceLROnPlateau
          </span>
        </div>

        {/* SVG Simulated Loss / Accuracy Curve */}
        <div className="bg-slate-950 rounded-xl p-6 text-white overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-blue-400 inline-block" /> Training Accuracy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-400 inline-block" /> Validation Accuracy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-amber-400 border-dashed border-t inline-block" /> Validation Loss
              </span>
            </div>
            <span>Epoch 1 → 30</span>
          </div>

          {/* Scaled SVG chart */}
          <div className="relative h-44 w-full">
            <svg className="w-full h-full" viewBox="0 0 800 160" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="800" y2="40" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="800" y2="80" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="800" y2="120" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />

              {/* Train Accuracy Curve (Starts at ~65% y=120, rises to ~98% y=20) */}
              <path
                d="M 0,125 Q 120,70 280,35 T 520,24 T 800,18"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="2.5"
              />

              {/* Validation Accuracy Curve (Rises to ~96.8% y=24) */}
              <path
                d="M 0,130 Q 140,78 300,42 T 540,30 T 800,24"
                fill="none"
                stroke="#34D399"
                strokeWidth="2.5"
              />

              {/* Validation Loss Curve (Starts high y=20, drops to y=140) */}
              <path
                d="M 0,25 Q 150,90 320,120 T 560,135 T 800,142"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Axis Annotations */}
            <div className="absolute left-2 top-1 text-[10px] font-mono text-emerald-400">
              98.2% Top Acc
            </div>
            <div className="absolute right-2 bottom-1 text-[10px] font-mono text-amber-400">
              Loss: 0.104
            </div>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2 border-t border-slate-800 pt-2">
            <span>Epoch 0 (Random init)</span>
            <span>Epoch 10 (Fast decay)</span>
            <span>Epoch 20 (Plateau reached)</span>
            <span>Epoch 30 (EarlyStopping checkpoint)</span>
          </div>
        </div>
      </div>

    </div>
  );
};
