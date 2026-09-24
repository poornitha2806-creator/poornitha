/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActivePage, ModelType, SampleMriScan, ClassificationResult } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BackendModal } from './components/BackendModal';
import { HomePage } from './pages/HomePage';
import { ClassifyPage } from './pages/ClassifyPage';
import { ModelSelectionPage } from './pages/ModelSelectionPage';
import { ResultsPage } from './pages/ResultsPage';
import { MetricsPage } from './pages/MetricsPage';
import { AboutPage } from './pages/AboutPage';
import { HelpPage } from './pages/HelpPage';
import { checkBackendHealth } from './services/apiService';
import { SAMPLE_MRI_SCANS } from './data/samplesData';
import { simulateResearchInference } from './utils/imageProcessing';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedModel, setSelectedModel] = useState<ModelType>('efficientnet_b0');
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState<boolean>(false);

  // Store pre-selected scan to load into classifier
  const [stagedScan, setStagedScan] = useState<{
    url: string;
    fileName: string;
    knownClass?: any;
  } | null>(null);

  // Periodic health check on mount
  useEffect(() => {
    checkBackendHealth().then((res) => {
      setIsBackendConnected(res.online);
    });
  }, []);

  // Scroll to top on page change
  const navigateToPage = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick 1-click test handler from home page
  const handleSelectSample = (sample: SampleMriScan) => {
    setStagedScan({
      url: sample.imageUrl,
      fileName: `${sample.id}.jpg`,
      knownClass: sample.groundTruth
    });
    navigateToPage('classify');
  };

  const handleClassificationComplete = (result: ClassificationResult) => {
    setClassificationResult(result);
    navigateToPage('results');
  };

  const handleSelectModelAndRerun = async (newModel: ModelType) => {
    setSelectedModel(newModel);
    if (classificationResult) {
      // Re-run simulation with new model
      const updated = await simulateResearchInference(
        classificationResult.imageUrl,
        newModel,
        classificationResult.fileName,
        classificationResult.fileSize,
        classificationResult.predictedClass
      );
      setClassificationResult(updated);
    } else {
      navigateToPage('classify');
    }
  };

  const handleResetClassification = () => {
    setClassificationResult(null);
    setStagedScan(null);
    navigateToPage('classify');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={navigateToPage}
        isBackendConnected={isBackendConnected}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            setActivePage={navigateToPage}
            onSelectSample={handleSelectSample}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        )}

        {activePage === 'classify' && (
          <ClassifyPage
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            onClassificationComplete={handleClassificationComplete}
            setActivePage={navigateToPage}
            initialScan={stagedScan}
            onOpenBackendModal={() => setIsBackendModalOpen(true)}
          />
        )}

        {activePage === 'models' && (
          <ModelSelectionPage
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            setActivePage={navigateToPage}
          />
        )}

        {activePage === 'results' && (
          <ResultsPage
            result={classificationResult}
            setActivePage={navigateToPage}
            onResetClassification={handleResetClassification}
            onSelectModelAndRerun={handleSelectModelAndRerun}
          />
        )}

        {activePage === 'metrics' && (
          <MetricsPage
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            setActivePage={navigateToPage}
          />
        )}

        {activePage === 'about' && (
          <AboutPage setActivePage={navigateToPage} />
        )}

        {activePage === 'contact' && (
          <HelpPage
            setActivePage={navigateToPage}
            onOpenBackendModal={() => setIsBackendModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={navigateToPage} />

      {/* Backend Configuration Modal */}
      <BackendModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        onStatusChange={(status) => setIsBackendConnected(status)}
      />

    </div>
  );
}
