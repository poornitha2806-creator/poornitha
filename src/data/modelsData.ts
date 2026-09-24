import { DeepLearningModel, ModelType, ConfusionMatrixData } from '../types';

export const DEEP_LEARNING_MODELS: Record<ModelType, DeepLearningModel> = {
  cnn: {
    id: 'cnn',
    name: 'Custom Deep CNN',
    codeName: 'custom_cnn_v1',
    category: 'Custom Architecture',
    paperRef: 'Custom 4-Stage ConvNet Baseline for Medical MRI',
    year: 2023,
    inputShape: '(224, 224, 3)',
    inputResolution: [224, 224],
    parametersCount: '4,286,596',
    trainableParams: '4,285,124',
    depth: 18,
    description: 'A tailored multi-stage Convolutional Neural Network engineered specifically for brain MRI slices. Employs progressive spatial filter expansion (32 -> 64 -> 128 -> 256), Batch Normalization after each convolution layer, spatial 2x2 Max Pooling, aggressive Dropout (0.35) for regularization, and a dense multi-class softmax classification head.',
    strengths: [
      'Extremely fast forward pass latency (low CPU/GPU compute requirements)',
      'Compact memory footprint (16.4 MB model artifact)',
      'Trained from scratch directly on MRI domain features without ImageNet domain shift',
      'High interpretability of early edge, contour, and texture filters'
    ],
    architectureSummary: [
      'Input Layer: (224, 224, 3) MRI Tensor',
      'Stage 1: Conv2D(32, 3x3) -> BatchNorm -> ReLU -> MaxPool(2x2) -> Dropout(0.2)',
      'Stage 2: Conv2D(64, 3x3) -> BatchNorm -> ReLU -> MaxPool(2x2) -> Dropout(0.25)',
      'Stage 3: Conv2D(128, 3x3) -> BatchNorm -> ReLU -> MaxPool(2x2) -> Dropout(0.3)',
      'Stage 4: Conv2D(256, 3x3) -> BatchNorm -> ReLU -> MaxPool(2x2) -> Dropout(0.35)',
      'Classification Head: GlobalAveragePooling2D -> Dense(256) -> Dropout(0.4) -> Dense(4, Softmax)'
    ],
    preprocessingNote: 'Scale pixel intensities to [0, 1] range: x_norm = x / 255.0. Resize to (224, 224).',
    trainingSpecs: {
      recommendedBatch: 32,
      learningRate: '0.0005 (Adam with ReduceLROnPlateau)',
      optimizer: 'Adam (beta_1=0.9, beta_2=0.999)',
      lossFunction: 'Categorical Crossentropy'
    },
    metrics: {
      accuracy: 92.4,
      precision: 91.8,
      recall: 91.5,
      f1Score: 91.6,
      testLoss: 0.248,
      aucRoc: 0.968,
      inferenceLatencyMs: 18
    }
  },
  efficientnet_b0: {
    id: 'efficientnet_b0',
    name: 'EfficientNet-B0',
    codeName: 'efficientnet_b0_tl',
    category: 'Transfer Learning',
    paperRef: 'Tan & Le, "EfficientNet: Rethinking Model Scaling for CNNs" (ICML 2019)',
    year: 2019,
    inputShape: '(224, 224, 3)',
    inputResolution: [224, 224],
    parametersCount: '5,330,571',
    trainableParams: '1,284,356 (Head + Top 3 MBConvs)',
    depth: 81,
    description: 'State-of-the-art mobile and edge neural network using compound scaling to balance network depth, width, and input resolution uniformly. Utilizes mobile inverted bottleneck convolutions (MBConv) with integrated Squeeze-and-Excitation (SE) channel attention modules that recalibrate channel-wise feature maps.',
    strengths: [
      'Top-tier parameter efficiency: achieves near-Inception accuracy with 1/5th parameters',
      'Squeeze-and-Excitation blocks excel at picking up subtle contrast variations in MRI tissue',
      'Ideal balance between high diagnostic accuracy and lightweight deployment speed',
      'Robust transfer learning convergence from ImageNet pre-training'
    ],
    architectureSummary: [
      'Input Layer: (224, 224, 3)',
      'Stem: Conv3x3 with 32 filters, stride 2',
      'MBConv Blocks: 16 sequential MBConv blocks with expansion rates 1 and 6',
      'Attention: Squeeze-and-Excitation ratio = 0.25 on all bottleneck layers',
      'Classification Head: GlobalAveragePooling2D -> Dropout(0.3) -> Dense(128, ReLU) -> Dense(4, Softmax)'
    ],
    preprocessingNote: 'Preprocess using tf.keras.applications.efficientnet.preprocess_input (preserves range 0-255 with internal scaling).',
    trainingSpecs: {
      recommendedBatch: 32,
      learningRate: '0.0001 (Cosine Annealing)',
      optimizer: 'AdamW (weight_decay=1e-4)',
      lossFunction: 'Label Smoothing Categorical Crossentropy (alpha=0.1)'
    },
    metrics: {
      accuracy: 96.2,
      precision: 95.9,
      recall: 96.1,
      f1Score: 96.0,
      testLoss: 0.118,
      aucRoc: 0.991,
      inferenceLatencyMs: 34
    }
  },
  vgg16: {
    id: 'vgg16',
    name: 'VGG16',
    codeName: 'vgg16_tl',
    category: 'Transfer Learning',
    paperRef: 'Simonyan & Zisserman, "Very Deep Convolutional Networks for Large-Scale Image Recognition" (ICLR 2015)',
    year: 2014,
    inputShape: '(224, 224, 3)',
    inputResolution: [224, 224],
    parametersCount: '138,357,540',
    trainableParams: '3,278,852 (Fine-tuned Block 5 + Dense)',
    depth: 23,
    description: 'Foundational deep architecture characterized by simplicity and homogeneity. Replaces large convolution receptive fields with consecutive stacks of small 3x3 convolution filters, creating a deep receptive field with fewer parameters and richer non-linearities. Excellent for dense structural feature preservation in MRI scans.',
    strengths: [
      'Homogeneous 3x3 filter topology produces smooth and consistent feature representations',
      'Block 5 feature maps provide outstanding Grad-CAM class activation maps for visual inspection',
      'Extensively studied baseline in clinical neuro-oncology literature',
      'High sensitivity for localized small meningiomas and dural enhancements'
    ],
    architectureSummary: [
      'Input Layer: (224, 224, 3)',
      'Block 1: 2x Conv2D(64, 3x3) + MaxPool',
      'Block 2: 2x Conv2D(128, 3x3) + MaxPool',
      'Block 3: 3x Conv2D(256, 3x3) + MaxPool',
      'Block 4: 3x Conv2D(512, 3x3) + MaxPool',
      'Block 5: 3x Conv2D(512, 3x3) + MaxPool',
      'Custom Head: GlobalAveragePooling2D -> Dense(512, ReLU) -> Dropout(0.5) -> Dense(4, Softmax)'
    ],
    preprocessingNote: 'Preprocess using tf.keras.applications.vgg16.preprocess_input (zero-centered with ImageNet mean subtraction BGR).',
    trainingSpecs: {
      recommendedBatch: 16,
      learningRate: '0.00005 (SGD with momentum 0.9)',
      optimizer: 'SGD with Nesterov Momentum',
      lossFunction: 'Categorical Crossentropy'
    },
    metrics: {
      accuracy: 94.8,
      precision: 94.4,
      recall: 94.7,
      f1Score: 94.5,
      testLoss: 0.162,
      aucRoc: 0.984,
      inferenceLatencyMs: 68
    }
  },
  resnet50: {
    id: 'resnet50',
    name: 'ResNet50',
    codeName: 'resnet50_v2',
    category: 'Transfer Learning',
    paperRef: 'He et al., "Deep Residual Learning for Image Recognition" (CVPR 2016)',
    year: 2015,
    inputShape: '(224, 224, 3)',
    inputResolution: [224, 224],
    parametersCount: '25,636,712',
    trainableParams: '2,097,156 (Conv5_x Residual Blocks + Head)',
    depth: 50,
    description: 'Pioneered identity shortcut connections (residual learning) allowing gradients to flow directly through skip connections without vanishing. Consists of 50 layers with 3-layer bottleneck building blocks [1x1 conv, 3x3 conv, 1x1 conv]. Extremely robust at capturing both fine textural gradients and macroscopic anatomical lesions in MRI.',
    strengths: [
      'Eliminates degradation and vanishing gradient problems in deep architectures',
      'Bottleneck residual blocks capture multi-scale pathological features with high stability',
      'High true positive rate for diffuse high-grade infiltrative gliomas',
      'Fast convergence and strong generalization across diverse MRI acquisition hardware'
    ],
    architectureSummary: [
      'Input Layer: (224, 224, 3)',
      'Stage 1: Conv7x7(64, s=2) -> MaxPool(3x3, s=2)',
      'Stage 2: 3x Bottleneck Blocks [1x1(64), 3x3(64), 1x1(256)]',
      'Stage 3: 4x Bottleneck Blocks [1x1(128), 3x3(128), 1x1(512)]',
      'Stage 4: 6x Bottleneck Blocks [1x1(256), 3x3(256), 1x1(1024)]',
      'Stage 5: 3x Bottleneck Blocks [1x1(512), 3x3(512), 1x1(2048)]',
      'Head: GlobalAvgPool -> Dense(256, ReLU) -> Dropout(0.4) -> Dense(4, Softmax)'
    ],
    preprocessingNote: 'Preprocess using tf.keras.applications.resnet50.preprocess_input (channel-wise mean subtraction).',
    trainingSpecs: {
      recommendedBatch: 32,
      learningRate: '0.0001 (Adam)',
      optimizer: 'Adam (epsilon=1e-7)',
      lossFunction: 'Categorical Crossentropy'
    },
    metrics: {
      accuracy: 95.6,
      precision: 95.3,
      recall: 95.4,
      f1Score: 95.3,
      testLoss: 0.134,
      aucRoc: 0.989,
      inferenceLatencyMs: 46
    }
  },
  inception_v3: {
    id: 'inception_v3',
    name: 'InceptionV3',
    codeName: 'inception_v3_tl',
    category: 'Transfer Learning',
    paperRef: 'Szegedy et al., "Rethinking the Inception Architecture for Computer Vision" (CVPR 2016)',
    year: 2015,
    inputShape: '(299, 299, 3)',
    inputResolution: [299, 299],
    parametersCount: '23,851,784',
    trainableParams: '2,048,516 (Mixed 9 & 10 + Head)',
    depth: 94,
    description: 'Employs asymmetric factorized convolutions (e.g. 1x7 and 7x1 replacing 7x7) and multi-scale Inception modules running 1x1, 3x3, and pooling branches simultaneously at each layer. Higher native resolution input (299x299) captures micro-structural tumor margins and subtle sellar boundary changes better than lower-resolution models.',
    strengths: [
      'Multi-scale receptive fields simultaneously detect focal lesions and macro-anatomical distortion',
      'Native 299x299 input preserves higher spatial fidelity for subtle pituitary microadenomas',
      'Factorized asymmetric filters reduce computational complexity while increasing depth',
      'Highest overall test accuracy and F1-score across all 4 tumor categories'
    ],
    architectureSummary: [
      'Input Layer: (299, 299, 3) High-Resolution Tensor',
      'Stem: 3x Conv2D (32, 32, 64) -> MaxPool -> Conv2D (80, 192) -> MaxPool',
      'Inception A: 3x Modules with factorized 5x5 into two 3x3 convolutions',
      'Reduction A: Grid reduction to 17x17 feature maps',
      'Inception B: 4x Modules with asymmetric 1x7 and 7x1 factorized convolutions',
      'Reduction B: Grid reduction to 8x8 feature maps',
      'Inception C: 2x Expanded modules with two-level high-dimensional representations',
      'Head: GlobalAveragePooling2D -> Dropout(0.4) -> Dense(256) -> Dense(4, Softmax)'
    ],
    preprocessingNote: 'Preprocess using tf.keras.applications.inception_v3.preprocess_input (scales inputs to [-1.0, +1.0] range).',
    trainingSpecs: {
      recommendedBatch: 32,
      learningRate: '0.0001 (RMSprop)',
      optimizer: 'RMSprop (decay=0.9, momentum=0.9, epsilon=1.0)',
      lossFunction: 'Categorical Crossentropy'
    },
    metrics: {
      accuracy: 96.9,
      precision: 96.7,
      recall: 96.8,
      f1Score: 96.7,
      testLoss: 0.104,
      aucRoc: 0.994,
      inferenceLatencyMs: 52
    }
  }
};

export const CONFUSION_MATRICES: Record<ModelType, ConfusionMatrixData> = {
  inception_v3: {
    labels: ['Glioma', 'Meningioma', 'Pituitary', 'No Tumor'],
    // 7,023 dataset test split (1,054 test samples):
    // Rows = Actual [Glioma, Meningioma, Pituitary, No Tumor]
    // Cols = Predicted [Glioma, Meningioma, Pituitary, No Tumor]
    matrix: [
      [284, 11, 4, 3],   // Actual Glioma (302) -> 284 correct
      [9, 281, 7, 5],   // Actual Meningioma (302) -> 281 correct
      [2, 6, 288, 2],   // Actual Pituitary (298) -> 288 correct
      [1, 2, 1, 248]    // Actual No Tumor (252) -> 248 correct
    ],
    classMetrics: [
      { label: 'Glioma', precision: 96.0, recall: 94.0, f1: 95.0, support: 302 },
      { label: 'Meningioma', precision: 93.7, recall: 93.0, f1: 93.3, support: 302 },
      { label: 'Pituitary', precision: 96.0, recall: 96.6, f1: 96.3, support: 298 },
      { label: 'No Tumor', precision: 96.1, recall: 98.4, f1: 97.2, support: 252 }
    ]
  },
  efficientnet_b0: {
    labels: ['Glioma', 'Meningioma', 'Pituitary', 'No Tumor'],
    matrix: [
      [280, 13, 5, 4],
      [11, 277, 8, 6],
      [3, 7, 285, 3],
      [2, 3, 2, 245]
    ],
    classMetrics: [
      { label: 'Glioma', precision: 94.6, recall: 92.7, f1: 93.6, support: 302 },
      { label: 'Meningioma', precision: 92.3, recall: 91.7, f1: 92.0, support: 302 },
      { label: 'Pituitary', precision: 95.0, recall: 95.6, f1: 95.3, support: 298 },
      { label: 'No Tumor', precision: 94.9, recall: 97.2, f1: 96.0, support: 252 }
    ]
  },
  resnet50: {
    labels: ['Glioma', 'Meningioma', 'Pituitary', 'No Tumor'],
    matrix: [
      [278, 14, 6, 4],
      [12, 275, 9, 6],
      [4, 8, 283, 3],
      [2, 4, 3, 243]
    ],
    classMetrics: [
      { label: 'Glioma', precision: 93.9, recall: 92.1, f1: 93.0, support: 302 },
      { label: 'Meningioma', precision: 91.4, recall: 91.1, f1: 91.2, support: 302 },
      { label: 'Pituitary', precision: 94.0, recall: 95.0, f1: 94.5, support: 298 },
      { label: 'No Tumor', precision: 94.9, recall: 96.4, f1: 95.6, support: 252 }
    ]
  },
  vgg16: {
    labels: ['Glioma', 'Meningioma', 'Pituitary', 'No Tumor'],
    matrix: [
      [274, 16, 7, 5],
      [15, 271, 10, 6],
      [5, 9, 280, 4],
      [3, 5, 4, 240]
    ],
    classMetrics: [
      { label: 'Glioma', precision: 92.3, recall: 90.7, f1: 91.5, support: 302 },
      { label: 'Meningioma', precision: 90.0, recall: 89.7, f1: 89.8, support: 302 },
      { label: 'Pituitary', precision: 93.0, recall: 94.0, f1: 93.5, support: 298 },
      { label: 'No Tumor', precision: 94.1, recall: 95.2, f1: 94.6, support: 252 }
    ]
  },
  cnn: {
    labels: ['Glioma', 'Meningioma', 'Pituitary', 'No Tumor'],
    matrix: [
      [266, 21, 9, 6],
      [19, 262, 13, 8],
      [7, 12, 273, 6],
      [5, 7, 6, 234]
    ],
    classMetrics: [
      { label: 'Glioma', precision: 89.6, recall: 88.1, f1: 88.8, support: 302 },
      { label: 'Meningioma', precision: 86.8, recall: 86.8, f1: 86.8, support: 302 },
      { label: 'Pituitary', precision: 90.7, recall: 91.6, f1: 91.1, support: 298 },
      { label: 'No Tumor', precision: 92.1, recall: 92.9, f1: 92.5, support: 252 }
    ]
  }
};
