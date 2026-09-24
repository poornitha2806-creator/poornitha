import { TumorCategoryInfo, TumorClass } from '../types';

export const TUMOR_CATEGORIES: Record<TumorClass, TumorCategoryInfo> = {
  glioma: {
    id: 'glioma',
    name: 'Glioma',
    scientificName: 'Neuroepithelial Glial Neoplasm',
    description: 'Gliomas are the most common primary brain tumors arising from supportive glial tissue (astrocytes, oligodendrocytes, ependymal cells). They are often infiltrative with indistinct borders and varying malignancy grades.',
    clinicalCharacteristics: [
      'Infiltrates surrounding white matter tracts',
      'Common symptoms: Seizures, focal neurological deficits, headaches',
      'Edema: Significant perifocal vasogenic edema (T2/FLAIR hyperintense)',
      'Subtypes include Astrocytoma, Oligodendroglioma, and Glioblastoma (GBM)'
    ],
    radiologicSigns: [
      'T1: Hypointense to isointense mass',
      'T1+C (Gadolinium): Ring or irregular thick peripheral enhancement',
      'T2/FLAIR: Extensive surrounding hyperintensity representing infiltrative edema',
      'Mass effect: Midline shift, ventricular effacement'
    ],
    whoGrade: 'WHO Grade II - IV',
    color: '#3B82F6' // Blue
  },
  meningioma: {
    id: 'meningioma',
    name: 'Meningioma',
    scientificName: 'Extra-Axial Meningeal Neoplasm',
    description: 'Meningiomas originate from arachnoid cap cells of the meninges covering the brain and spinal cord. Typically slow-growing, extra-axial (outside brain parenchyma), and non-infiltrative with distinct margins.',
    clinicalCharacteristics: [
      'Extra-axial location along dural surfaces (convexity, parasagittal, sphenoid wing)',
      '80-85% are benign (WHO Grade I) with high surgical cure rates',
      'Presents with progressive headaches, localized paresis, or cranial nerve palsies',
      'Frequent in adults aged 40-70, higher prevalence in females'
    ],
    radiologicSigns: [
      'T1: Isointense to slightly hypointense sharply marginated extra-axial mass',
      'T1+C: Vivid, uniform, homogeneous gadolinium enhancement',
      'Classic "Dural Tail" sign (tapering enhancement along adjacent dura)',
      'CSF cleft between tumor and compressed adjacent cerebral cortex'
    ],
    whoGrade: 'WHO Grade I (80%) to III (Atypical/Malignant)',
    color: '#0D9488' // Teal
  },
  pituitary: {
    id: 'pituitary',
    name: 'Pituitary Tumor',
    scientificName: 'Sellar Pituitary Neuroendocrine Tumor (PitNET)',
    description: 'Arising from the pituitary gland within the sella turcica at the skull base. Categorized as microadenomas (<10mm) or macroadenomas (>10mm). Can cause hormone imbalances or optic chiasm compression.',
    clinicalCharacteristics: [
      'Located in sellar and suprasellar compartments',
      'Endocrine syndromes: Hyperprolactinemia, Cushing disease, Acromegaly',
      'Optic chiasm compression leading to bitemporal hemianopsia (visual field loss)',
      'Extremely high rate of benign histological behavior'
    ],
    radiologicSigns: [
      'Expansion of sella turcica with suprasellar extension',
      'Waist appearance ("snowman" or "figure-of-eight" sign) from diaphragma sellae',
      'Displacement or compression of optic chiasm on coronal T1 views',
      'Heterogeneous enhancement with occasional cystic or hemorrhagic components'
    ],
    whoGrade: 'Benign (Usually Non-WHO Graded PitNET)',
    color: '#8B5CF6' // Purple
  },
  no_tumor: {
    id: 'no_tumor',
    name: 'No Tumor (Normal)',
    scientificName: 'Physiologically Normal Intracranial Anatomy',
    description: 'No intracranial neoplasm, mass lesion, pathological enhancement, or space-occupying abnormality detected. Symmetrical cerebral hemispheres with normal ventricular morphology.',
    clinicalCharacteristics: [
      'Normal parenchymal architecture across gray and white matter',
      'Preserved midline structures, normal sulcal and gyral patterns',
      'Symmetric lateral ventricles, 3rd and 4th ventricles without compression',
      'No signs of focal edema, midline shift, or abnormal tissue perfusion'
    ],
    radiologicSigns: [
      'Normal T1/T2 signal intensity across cerebral hemispheres and cerebellum',
      'Absence of pathological contrast uptake or dural thickening',
      'Intact grey-white matter junction differentiation',
      'Clear, patent basal cisterns and sulcal CSF spaces'
    ],
    whoGrade: 'N/A (Physiologic Baseline)',
    color: '#10B981' // Green
  }
};
