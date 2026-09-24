import React from 'react';
import { ActivePage } from '../types';
import { Activity, Cpu, Play } from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  isBackendConnected: boolean;
  onOpenBackendModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  isBackendConnected,
  onOpenBackendModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand Title (Single text element wordmark with icon) */}
        <div 
          onClick={() => setActivePage('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              NeuroScan <span className="text-blue-600 font-extrabold">AI</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-line, unboxed text links) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActivePage('home')}
            className={`transition-colors whitespace-nowrap ${
              activePage === 'home' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActivePage('classify')}
            className={`transition-colors whitespace-nowrap ${
              activePage === 'classify' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            MRI Classification
          </button>
          <button
            onClick={() => setActivePage('models')}
            className={`transition-colors whitespace-nowrap ${
              activePage === 'models' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Deep Models
          </button>
          <button
            onClick={() => setActivePage('metrics')}
            className={`transition-colors whitespace-nowrap ${
              activePage === 'metrics' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Evaluation & Metrics
          </button>
          <button
            onClick={() => setActivePage('about')}
            className={`transition-colors whitespace-nowrap ${
              activePage === 'about' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            About Project
          </button>
          <button
            onClick={() => setActivePage('contact')}
            className={`transition-colors whitespace-nowrap ${
              activePage === 'contact' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Viva & Docs
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Backend State */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBackendModal}
            title="Configure Local Python API connection"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 whitespace-nowrap"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="font-mono text-[11px]">
              {isBackendConnected ? 'Python API: Live' : 'Research Demo Mode'}
            </span>
          </button>

          <button
            onClick={() => setActivePage('classify')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Classify MRI</span>
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-100 gap-4 text-xs font-medium text-slate-600 scrollbar-none">
        <button
          onClick={() => setActivePage('home')}
          className={`whitespace-nowrap py-1 ${activePage === 'home' ? 'text-blue-600 font-bold' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => setActivePage('classify')}
          className={`whitespace-nowrap py-1 ${activePage === 'classify' ? 'text-blue-600 font-bold' : ''}`}
        >
          Classify
        </button>
        <button
          onClick={() => setActivePage('models')}
          className={`whitespace-nowrap py-1 ${activePage === 'models' ? 'text-blue-600 font-bold' : ''}`}
        >
          Models
        </button>
        <button
          onClick={() => setActivePage('results')}
          className={`whitespace-nowrap py-1 ${activePage === 'results' ? 'text-blue-600 font-bold' : ''}`}
        >
          Results
        </button>
        <button
          onClick={() => setActivePage('metrics')}
          className={`whitespace-nowrap py-1 ${activePage === 'metrics' ? 'text-blue-600 font-bold' : ''}`}
        >
          Metrics
        </button>
        <button
          onClick={() => setActivePage('about')}
          className={`whitespace-nowrap py-1 ${activePage === 'about' ? 'text-blue-600 font-bold' : ''}`}
        >
          About
        </button>
        <button
          onClick={() => setActivePage('contact')}
          className={`whitespace-nowrap py-1 ${activePage === 'contact' ? 'text-blue-600 font-bold' : ''}`}
        >
          Viva & Docs
        </button>
      </div>
    </header>
  );
};
