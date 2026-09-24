import React, { useState } from 'react';
import { ActivePage } from '../types';
import { 
  BookOpen, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  FolderTree, 
  HelpCircle, 
  Cpu, 
  Server, 
  Mail, 
  User, 
  FileCode2, 
  GraduationCap
} from 'lucide-react';

interface HelpPageProps {
  setActivePage: (page: ActivePage) => void;
  onOpenBackendModal: () => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ setActivePage, onOpenBackendModal }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const vivaQuestions = [
    {
      q: 'Why did you select five distinct deep learning architectures instead of just one?',
      a: 'Different deep learning architectures embody fundamentally distinct inductive biases. A custom CNN provides a lightweight baseline trained purely on medical data without ImageNet domain bias. VGG16 utilizes homogeneous 3x3 convolutions for deep receptive field density. ResNet50 implements identity skip connections to solve vanishing gradients in deep networks. InceptionV3 computes multi-scale parallel factorized kernels simultaneously at 299x299 resolution. EfficientNet-B0 employs compound coefficient scaling and Squeeze-and-Excitation channel attention. Benchmarking all five gives our final-year project empirical rigor.'
    },
    {
      q: 'How did you prevent data leakage during dataset preparation?',
      a: 'Data leakage is a frequent critical error in medical AI. We partitioned the 7,023 MRI images strictly at the patient level before applying any data augmentations. If multiple slices from the same patient are split across train and test sets, the model could memorize patient-specific skull geometry rather than tumor pathology. Furthermore, image normalization parameters (mean/std) were computed exclusively from the training split.'
    },
    {
      q: 'What is Grad-CAM and why is it crucial for clinical medical AI?',
      a: 'Grad-CAM (Gradient-weighted Class Activation Mapping) uses the gradients of any target class flowing into the final convolutional feature layer to generate a coarse 2D activation heatmap. It highlights the exact spatial discriminative regions in the brain MRI that influenced the classification decision. In clinical settings, "black-box" models cannot be trusted; Grad-CAM provides radiologic explainability so physicians can verify that the network focused on the lesion rather than imaging artifacts.'
    },
    {
      q: 'What are the differences between Glioma, Meningioma, and Pituitary tumors on MRI?',
      a: 'Gliomas are intra-axial infiltrative lesions within the brain parenchyma, frequently displaying irregular ring enhancement and extensive vasogenic edema on T2/FLAIR. Meningiomas are extra-axial dural-based tumors outside the brain tissue, exhibiting vivid homogeneous gadolinium enhancement and the characteristic "dural tail" sign. Pituitary tumors arise in the sellar and suprasellar region at the skull base, expanding the sella turcica and potentially compressing the optic chiasm.'
    },
    {
      q: 'Why is skull stripping and contour cropping performed prior to classification?',
      a: 'Raw MRI DICOM scans contain a substantial volume of uninformative black background air margins, skull bone, and external patient markers. Automated contour detection crops the brain parenchyma to maximize the proportion of informative cerebral tissue in the input tensor, boosting feature resolution and accelerating convergence.'
    },
    {
      q: 'Why is Accuracy alone insufficient for medical image evaluation?',
      a: 'In clinical oncology, class imbalance can skew raw accuracy. A model predicting "No Tumor" on an imbalanced dataset might show high accuracy while missing deadly high-grade gliomas. Therefore, we evaluate Precision (avoiding false alarms), Recall/Sensitivity (ensuring malignant tumors are not missed), and the harmonic F1-Score along with the Area Under the ROC Curve (AUC-ROC).'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Final-Year Viva Defense & Submission Kit</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Project Documentation, Execution & Defense Guide
        </h1>
        <p className="text-sm text-slate-600">
          Everything required for final-year project viva evaluation, backend execution, model training commands, and academic presentation.
        </p>
      </div>

      {/* Viva / Defense Q&A Accordion */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span>Essential Viva Voce Examination Questions</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            6 Core Defense Topics
          </span>
        </div>

        <div className="space-y-3">
          {vivaQuestions.map((item, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-mono shrink-0">
                      Q{idx + 1}
                    </span>
                    <span>{item.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Project Folder Structure */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-blue-600" />
          <span>Project Architecture & Folder Structure</span>
        </h2>
        <div className="bg-slate-950 text-blue-300 p-5 rounded-2xl font-mono text-xs overflow-x-auto relative">
          <button
            onClick={() => copyToClipboard(`brain-tumor-dl/
├── backend/
│   ├── app.py               # Flask REST API Server
│   ├── main.py              # FastAPI High-Performance API Server
│   ├── models.py            # Keras Architectures: CNN, EfficientNet, VGG16, ResNet50, InceptionV3
│   ├── preprocess.py        # Contour Crop, Skull Stripping, CLAHE & Normalization
│   ├── train.py             # Model Training Pipeline with Data Augmentation
│   ├── evaluate.py          # Metrics, ROC curves & Confusion Matrix Generator
│   ├── requirements.txt     # Python Dependencies (TensorFlow, OpenCV, FastAPI, etc.)
│   └── README.md            # Backend Setup & Execution Guide
├── dataset/
│   ├── train/               # Training Split (70%): glioma/, meningioma/, pituitary/, no_tumor/
│   ├── val/                 # Validation Split (15%)
│   └── test/                # Test Split (15%)
└── src/                     # React + TypeScript Frontend Application
    ├── components/          # Navbar, Footer, Viewport Tools
    ├── pages/               # Home, Classify, Models, Results, Metrics, About, Help
    ├── data/                # Category metadata, sample scans & benchmark metrics
    └── services/            # API client bridging React to Python Backend`, 'tree')}
            className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1"
          >
            {copiedSection === 'tree' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Tree</span>
          </button>
          <pre className="text-[11px] leading-relaxed text-slate-300">
{`brain-tumor-dl/
├── backend/
│   ├── app.py               # Flask REST API Server
│   ├── main.py              # FastAPI High-Performance API Server
│   ├── models.py            # Keras Architectures: CNN, EfficientNet, VGG16, ResNet50, InceptionV3
│   ├── preprocess.py        # Contour Crop, Skull Stripping, CLAHE & Normalization
│   ├── train.py             # Model Training Pipeline with Data Augmentation
│   ├── evaluate.py          # Metrics, ROC curves & Confusion Matrix Generator
│   ├── requirements.txt     # Python Dependencies (TensorFlow, OpenCV, FastAPI, etc.)
│   └── README.md            # Backend Setup & Execution Guide
├── dataset/
│   ├── train/               # Training Split (70%): glioma/, meningioma/, pituitary/, no_tumor/
│   ├── val/                 # Validation Split (15%)
│   └── test/                # Test Split (15%)
└── src/                     # React + TypeScript Frontend Application
    ├── components/          # Navbar, Footer, Viewport Tools
    ├── pages/               # Home, Classify, Models, Results, Metrics, About, Help
    ├── data/                # Category metadata, sample scans & benchmark metrics
    └── services/            # API client bridging React to Python Backend`}
          </pre>
        </div>
      </section>

      {/* Execution Commands */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-blue-600" />
          <span>Python Backend Setup & Model Training Commands</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <span className="font-bold text-slate-900 block font-sans">
              1. Python Environment Setup
            </span>
            <div className="bg-slate-950 p-3 rounded-lg text-emerald-400 text-[11px] overflow-x-auto">
              <div>python -m venv venv</div>
              <div>source venv/bin/activate  # Windows: venv\Scripts\activate</div>
              <div>pip install -r backend/requirements.txt</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <span className="font-bold text-slate-900 block font-sans">
              2. Launch FastAPI / Flask Server
            </span>
            <div className="bg-slate-950 p-3 rounded-lg text-emerald-400 text-[11px] overflow-x-auto">
              <div># FastAPI (Recommended):</div>
              <div>uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload</div>
              <div># Or Flask:</div>
              <div>python backend/app.py</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <span className="font-bold text-slate-900 block font-sans">
              3. Train Any of the 5 Architectures
            </span>
            <div className="bg-slate-950 p-3 rounded-lg text-blue-300 text-[11px] overflow-x-auto">
              <div>python backend/train.py --model efficientnet_b0 --epochs 30</div>
              <div>python backend/train.py --model resnet50 --epochs 30</div>
              <div>python backend/train.py --model inception_v3 --epochs 30</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <span className="font-bold text-slate-900 block font-sans">
              4. Generate Evaluation Metrics & Matrices
            </span>
            <div className="bg-slate-950 p-3 rounded-lg text-blue-300 text-[11px] overflow-x-auto">
              <div>python backend/evaluate.py --model all</div>
              <div># Computes classification report & saves confusion matrix PNG</div>
            </div>
          </div>

        </div>
      </section>

      {/* Project Submission Team & Academic Credits */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Final-Year Project Submission & Academic Credits
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Project Title</span>
            <h4 className="font-bold text-slate-900 text-sm">
              Brain Tumor Classification Using MRI Scan and Deep Learning
            </h4>
            <p className="text-slate-500 text-[11px]">
              Final Year Bachelor of Engineering (B.E. / B.Tech) Capstone Thesis
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Academic Details</span>
            <div className="space-y-1 text-slate-700">
              <p><strong>Department:</strong> Computer Science & Engineering</p>
              <p><strong>Specialization:</strong> Artificial Intelligence & Medical Imaging</p>
              <p><strong>Academic Year:</strong> 2026 - 2027</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">API Configuration</span>
            <p className="text-slate-600">
              Configure or test live connection to the local Python FastAPI/Flask backend service.
            </p>
            <button
              onClick={onOpenBackendModal}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors"
            >
              Configure API Server URL
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
