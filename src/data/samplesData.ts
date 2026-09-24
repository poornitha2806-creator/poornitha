import { SampleMriScan } from '../types';

import gliomaImg from '../assets/images/mri_glioma_scan_1790227407076.jpg';
import meningiomaImg from '../assets/images/mri_meningioma_scan_1790227420032.jpg';
import pituitaryImg from '../assets/images/mri_pituitary_scan_1790227430867.jpg';
import normalImg from '../assets/images/mri_normal_scan_1790227442305.jpg';

export const SAMPLE_MRI_SCANS: SampleMriScan[] = [
  {
    id: 'sample-glioma-01',
    title: 'High-Grade Intra-Axial Glioma',
    groundTruth: 'glioma',
    groundTruthName: 'Glioma',
    sliceOrientation: 'Axial',
    weighting: 'T1 Post-Contrast',
    imageUrl: gliomaImg,
    patientAgeGender: '54y / Male',
    clinicalIndication: 'Progressive right-sided hemiparesis and new-onset focal seizures for 3 weeks.',
    keyFinding: 'Irregular heterogeneous ring-enhancing mass in the left fronto-parietal parenchyma with prominent surrounding vasogenic hypodensity/edema and mild midline shift.'
  },
  {
    id: 'sample-meningioma-02',
    title: 'Parasagittal Dural Meningioma',
    groundTruth: 'meningioma',
    groundTruthName: 'Meningioma',
    sliceOrientation: 'Axial',
    weighting: 'T1 Post-Contrast',
    imageUrl: meningiomaImg,
    patientAgeGender: '61y / Female',
    clinicalIndication: 'Chronic dull morning headaches and gradual executive cognitive decline.',
    keyFinding: 'Well-circumscribed extra-axial dural-based mass along the high cerebral convexity exhibiting intense homogeneous contrast enhancement with a prominent dural tail sign.'
  },
  {
    id: 'sample-pituitary-03',
    title: 'Sellar Pituitary Macroadenoma',
    groundTruth: 'pituitary',
    groundTruthName: 'Pituitary Tumor',
    sliceOrientation: 'Coronal',
    weighting: 'T1 Post-Contrast',
    imageUrl: pituitaryImg,
    patientAgeGender: '46y / Female',
    clinicalIndication: 'Bitemporal visual field deficits, amenorrhea, and elevated serum prolactin levels.',
    keyFinding: 'Expansile sellar and suprasellar mass causing ballooning of the sella turcica, upward elevation of the optic chiasm, and mild bilateral cavernous sinus contact.'
  },
  {
    id: 'sample-normal-04',
    title: 'Normal Intracranial Brain Scan',
    groundTruth: 'no_tumor',
    groundTruthName: 'No Tumor',
    sliceOrientation: 'Axial',
    weighting: 'T2-Weighted',
    imageUrl: normalImg,
    patientAgeGender: '38y / Male',
    clinicalIndication: 'Post-concussive screen following minor sports collision; no focal deficits.',
    keyFinding: 'Normal intracranial parenchymal signal intensity without focal mass, pathological contrast enhancement, midline shift, or hydrocephalus. Intact ventricles and sulci.'
  }
];
