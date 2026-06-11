export const schoolPortalLabels = {
  productName: 'Campus One',
  publicPortal: 'School Portal',
  admissions: 'Admissions',
  student: 'Student Portal',
  faculty: 'Faculty Portal',
  alumni: 'Alumni Services',
  administration: 'School Administration',
  ownerActivation: 'Create your school owner account',
  schoolLookup: 'Find an approved school portal',
} as const;

export const legacySchoolReferenceRepos = {
  frontend: 'https://github.com/Trunks23134/CAMPUS-ONE-FE.git',
  mobile: 'https://github.com/Trunks23134/CAMPUS-ONE-MOBILE.git',
  backend: 'https://github.com/Trunks23134/CAMPUS-ONE-BE.git',
} as const;

export const schoolReferenceConcepts = {
  publicEntry: [
    'Campus One school portal positioning',
    'school registration',
    'approved school lookup',
    'portal activation',
  ],
  schoolSetup: [
    'school profile',
    'target subdomain',
    'school type',
    'setup progress',
    'fees',
    'grading scales',
    'school administrators',
  ],
  schoolOperations: [
    'student credentials',
    'staff credentials',
    'fees paid slip',
    'student records',
    'printable school documents',
  ],
} as const;
