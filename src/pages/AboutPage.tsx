import React from 'react';
import { ActivePage } from '../types';
import { TUMOR_CATEGORIES } from '../data/categoriesData';
import { DEEP_LEARNING_MODELS } from '../data/modelsData';
import { 
  Brain, 
  ShieldAlert, 
  Database, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  FileCode,
  GraduationCap,
  Microscope,
  Stethoscope
} from 'lucide-react';

interface AboutPageProps {
  setActivePage: (page: ActivePage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActivePage }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Title & Abstract */}
      <div className="space-y-3 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Final-Year Engineering Project Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Brain Tumor Classification Using MRI Scan and Deep Learning
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          An automated medical computer-vision system developed to aid in neuro-oncological research. By training and benchmarking five prominent deep learning architectures on multi-sequence magnetic resonance imaging scans, this project explores automated feature representations for differential brain lesion triage.
        </p>
      </div>

      {/* Mandatory Non-Diagnostic Disclaimer Banner */}
      <div className="p-5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-xs text-amber-950">
          <h3 className="text-sm font-bold text-amber-900">
            Crucial Medical & Regulatory Notice
          </h3>
          <p className="leading-relaxed">
            This software is designed exclusively for educational, academic, and research purposes as part of a final-year undergraduate/graduate thesis. It is <strong className="underline">not approved by the FDA, CE, or any medical regulatory body</strong> and must never be utilized as a substitute for professional radiologic consultation, histopathological biopsy, or clinical diagnostic judgment.
          </p>
        </div>
      </div>

      {/* 1. Problem Statement & Motivation */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <span>1. Problem Statement & Clinical Motivation</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Primary central nervous system (CNS) tumors represent some of the most life-threatening neoplastic conditions worldwide. Traditional manual interpretation of Magnetic Resonance Imaging (MRI) scans requires extensive expertise by sub-specialized neuroradiologists and is inherently subjective, time-intensive, and susceptible to inter-observer variability, particularly in high-volume emergency trauma or resource-constrained diagnostic settings.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          The goal of this final-year research initiative is to construct an end-to-end, modular deep learning pipeline capable of classifying brain MRI slices into four mutually exclusive categories (Glioma, Meningioma, Pituitary Tumor, and Normal Healthy Parenchyma) with high sensitivity and minimal false-negative rate.
        </p>
      </section>

      {/* 2. Brain Tumor Classification Categories */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            <span>2. Classification Taxonomy & Pathological Profiles</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pathological definition, World Health Organization (WHO) grading, and diagnostic imaging signs for the four target classes:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(TUMOR_CATEGORIES).map((cat) => (
            <div key={cat.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">{cat.whoGrade}</span>
              </div>
              <p className="text-xs text-slate-500 italic">{cat.scientificName}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{cat.description}</p>
              
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Radiologic Sign</span>
                <p className="text-xs font-medium text-slate-800">{cat.radiologicSigns[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Deep Learning Architectures Comparative Methodology */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <span>3. Deep Learning Architectures & Selection Rationale</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Rather than relying on a single neural network, five distinct architectures with differing computational topologies were implemented and benchmarked:
        </p>

        <div className="space-y-3">
          {Object.values(DEEP_LEARNING_MODELS).map((m) => (
            <div key={m.id} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{m.name}</h3>
                  <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 font-mono rounded">
                    {m.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {m.parametersCount} params
                  </span>
                </div>
                <p className="text-xs text-slate-600">{m.description}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-mono font-bold text-emerald-600 block">
                  {m.metrics.accuracy}% Acc
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {m.metrics.inferenceLatencyMs} ms latency
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Dataset & Data Leakage Prevention */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          <span>4. Dataset Composition & Protocol Integrity</span>
        </h2>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            The project leverages the aggregated <strong>Kaggle / Figshare Brain Tumor MRI Dataset</strong> containing 7,023 confirmed axial and coronal T1-weighted contrast-enhanced, T2-weighted, and FLAIR slices across 233 patient cohorts.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-center pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block">TRAINING SPLIT (70%)</span>
              <span className="text-base font-bold text-slate-900">4,916 Slices</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block">VALIDATION SPLIT (15%)</span>
              <span className="text-base font-bold text-slate-900">1,053 Slices</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block">TEST SPLIT (15%)</span>
              <span className="text-base font-bold text-slate-900">1,054 Slices</span>
            </div>
          </div>

          <div className="pt-2">
            <strong className="text-slate-900 font-semibold block mb-1">
              Zero Data Leakage Protocol:
            </strong>
            <p>
              Splits were partitioned strictly at the patient volume boundary prior to applying data augmentations (random rotations between ±15°, horizontal mirroring, zoom factors 0.9–1.1, and elastic deformations). Test set evaluation never shares slices or augmented variations with the training set.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="p-6 bg-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">Ready to test the classification system?</h3>
          <p className="text-xs text-slate-300">Upload a scan or choose a pre-loaded sample MRI.</p>
        </div>
        <button
          onClick={() => setActivePage('classify')}
          className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors shadow-sm whitespace-nowrap"
        >
          Start Classification Workspace
        </button>
      </div>

    </div>
  );
};
