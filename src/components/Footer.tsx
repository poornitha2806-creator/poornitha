import React from 'react';
import { ActivePage } from '../types';
import { ShieldAlert, Activity, BookOpen, GitBranch } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      {/* Disclaimer Banner */}
      <div className="bg-blue-950/60 border-b border-blue-900/50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-slate-300 text-xs leading-relaxed">
            <strong className="text-white font-semibold">Academic & Research Notice:</strong> This web application and deep learning models are developed strictly for academic, educational, and scientific research purposes as a final-year engineering project. It is <strong className="text-amber-300 underline underline-offset-2">not a certified medical device</strong> and must not be used for clinical diagnosis, patient triage, treatment planning, or commercial medical care.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Abstract */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">
                NeuroScan AI
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-lg">
              Final-Year Engineering Project: <em>"Brain Tumor Classification Using MRI Scan and Deep Learning"</em>. Comparative evaluation of Convolutional Neural Networks, EfficientNet-B0, VGG16, ResNet50, and InceptionV3 across 7,023 multicenter MRI scans.
            </p>
            <div className="flex items-center gap-4 text-slate-500 pt-2 font-mono text-[11px]">
              <span>4 Diagnostic Classes</span>
              <span aria-hidden="true">·</span>
              <span>5 DL Architectures</span>
              <span aria-hidden="true">·</span>
              <span>TensorFlow / Keras</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActivePage('classify')}
                  className="hover:text-white transition-colors"
                >
                  MRI Scan Classifier
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('models')}
                  className="hover:text-white transition-colors"
                >
                  Architecture Comparison
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('metrics')}
                  className="hover:text-white transition-colors"
                >
                  Confusion Matrices & Metrics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('about')}
                  className="hover:text-white transition-colors"
                >
                  Project & Clinical Context
                </button>
              </li>
            </ul>
          </div>

          {/* Academic Submission Info */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Project Defense Kit
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3 h-3 text-blue-400" />
                  <span>Viva Q&A Examination Guide</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <GitBranch className="w-3 h-3 text-blue-400" />
                  <span>Python Pipeline & Train Scripts</span>
                </button>
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                Department of Computer Science & Engineering
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Final Year Engineering Project. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Glioma</span>
            <span aria-hidden="true">·</span>
            <span>Meningioma</span>
            <span aria-hidden="true">·</span>
            <span>Pituitary Tumor</span>
            <span aria-hidden="true">·</span>
            <span>Healthy Parenchyma</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
