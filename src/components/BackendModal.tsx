import React, { useState, useEffect } from 'react';
import { checkBackendHealth, getBackendUrl, setBackendUrl, ApiStatus } from '../services/apiService';
import { Server, CheckCircle2, XCircle, RefreshCw, X, Terminal, ExternalLink } from 'lucide-react';

interface BackendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (isOnline: boolean) => void;
}

export const BackendModal: React.FC<BackendModalProps> = ({
  isOpen,
  onClose,
  onStatusChange
}) => {
  const [url, setUrl] = useState<string>(getBackendUrl());
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const testConnection = async () => {
    setIsChecking(true);
    setBackendUrl(url);
    const res = await checkBackendHealth(url);
    setStatus(res);
    setIsChecking(false);
    onStatusChange(res.online);
  };

  useEffect(() => {
    if (isOpen) {
      testConnection();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Python Backend API Connection
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-xs">
          
          <p className="text-slate-600 leading-relaxed">
            By default, this application includes an integrated <strong>Research Demo & Simulation Mode</strong> that performs full Grad-CAM activation and multi-class probability extraction. To connect real trained Keras weights, launch the Python backend in <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-700">/backend</code>:
          </p>

          {/* Quick command */}
          <div className="bg-slate-950 p-3 rounded-xl font-mono text-emerald-400 text-[11px] flex items-center justify-between">
            <span>uvicorn backend.main:app --port 8000 --reload</span>
            <Terminal className="w-4 h-4 text-slate-500 shrink-0" />
          </div>

          {/* URL Input */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              Backend Server Endpoint:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={testConnection}
                disabled={isChecking}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              >
                {isChecking ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Test Ping</span>
                )}
              </button>
            </div>
          </div>

          {/* Status Display */}
          {status && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                status.online
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {status.online ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <strong className="block font-bold">
                  {status.online ? 'Connected to Python Backend' : 'No Local Python Server Detected'}
                </strong>
                <p className="text-[11px] leading-relaxed">
                  {status.online
                    ? `Engine: ${status.backendName}. All 5 models ready for live inference.`
                    : 'The app will continue in Research Demo Mode with fully functional simulated inference and Grad-CAM.'}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
