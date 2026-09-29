// JAGO Intelligent Exception Queue Service
// Implements the core concept: "MISMATCH != REJECTION"
// When data conflicts occur, cases route to human review rather than causing instant rejection.

const STORAGE_KEY = 'jago_db_exceptions_v1_5';

// Pre-seeded realistic demo exceptions for SIH prototype
const INITIAL_EXCEPTIONS = [
  {
    id: 'EX-2026-084',
    applicationId: 'NFST-2026-4421',
    applicantId: 'DEMO-ST-2026-8471',
    applicantName: 'Sunita Soren',
    mobile: '9876543210',
    schemeName: 'National Fellowship for ST Students (NFST)',
    institution: 'Indian Institute of Technology (IIT) Kharagpur',
    district: 'Ranchi',
    state: 'Jharkhand',
    exceptionType: 'CERTIFICATE_MISMATCH',
    title: 'Name Spelling Discrepancy on Caste Certificate',
    sourceA: { name: 'Aadhaar e-KYC', value: 'Sunita Soren', identifier: 'XXXX-XXXX-8471' },
    sourceB: { name: 'State Revenue Certificate', value: 'Sunita Suren', identifier: 'JH/ST/2022/88921' },
    discrepancyDetails: 'Phonetic vowel substitution ("e" vs "u") in tribal surname. Father name "Birsa Soren" matches on both records.',
    status: 'PENDING_OFFICER_REVIEW',
    assignedRole: 'DISTRICT_OFFICER',
    assignedJurisdiction: 'Ranchi',
    createdAt: '2026-09-18T10:30:00Z',
  },
  {
    id: 'EX-2026-092',
    applicationId: 'NOS-2026-8942',
    applicantId: 'DEMO-ST-2026-8471',
    applicantName: 'Sunita Soren',
    mobile: '9876543210',
    schemeName: 'National Overseas Scholarship for ST (NOS)',
    institution: 'Indian Institute of Technology (IIT) Kharagpur',
    district: 'Ranchi',
    state: 'Jharkhand',
    exceptionType: 'ACADEMIC_MISMATCH',
    title: 'Academic Score Variance between APAAR and Entered Transcripts',
    sourceA: { name: 'Self-Declared Transcripts', value: '85.0% Aggregate' },
    sourceB: { name: 'APAAR / ABC Academic Bank', value: '82.5% Aggregate' },
    discrepancyDetails: 'Semester 4 grade finalization pending in national credit bank. Both scores well above minimum 60% requirement.',
    status: 'PENDING_OFFICER_REVIEW',
    assignedRole: 'INSTITUTE_OFFICER',
    assignedJurisdiction: 'U-0584',
    createdAt: '2026-09-20T14:15:00Z',
  },
  {
    id: 'EX-2026-105',
    applicationId: 'TCE-2025-1109',
    applicantId: 'ST-2026-3104',
    applicantName: 'Birsa Munda',
    mobile: '9812345678',
    schemeName: 'Top Class Education for ST Students',
    institution: 'National Institute of Technology (NIT) Jamshedpur',
    district: 'East Singhbhum',
    state: 'Jharkhand',
    exceptionType: 'INCOME_MISMATCH',
    title: 'Self-Declared Income vs e-District Revenue Discrepancy',
    sourceA: { name: 'Self-Declaration Form', value: '₹1,80,000 p.a.' },
    sourceB: { name: 'State e-District Portal', value: '₹2,10,000 p.a.' },
    discrepancyDetails: 'Difference of ₹30,000 between self-declaration and agricultural income assessment. Both are well within ₹6,00,000 ceiling.',
    status: 'RESOLVED_APPROVED',
    assignedRole: 'STATE_OFFICER',
    assignedJurisdiction: 'Jharkhand',
    officerNotes: 'Verified with District Revenue record. Both amounts fall within eligible income slab. Exception approved.',
    resolvedBy: 'Smt. Ananya Sen (State Tribal Welfare Officer)',
    createdAt: '2026-09-12T09:00:00Z',
    resolvedAt: '2026-09-14T11:20:00Z',
  },
];

export const exceptionQueueService = {
  // Load all exceptions from persistence
  getAllExceptions() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EXCEPTIONS));
    return INITIAL_EXCEPTIONS;
  },

  // Save exceptions
  saveExceptions(exceptions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exceptions));
  },

  // Get exceptions scoped to officer role and jurisdiction
  getExceptionsForOfficer(role, jurisdictionCode) {
    const all = this.getAllExceptions();
    if (role === 'MOTA_OFFICER' || role === 'ADMIN') {
      return all; // Central ministry sees all national exceptions
    }
    return all.filter((ex) => {
      if (role === 'INSTITUTE_OFFICER') {
        return ex.assignedRole === 'INSTITUTE_OFFICER' || ex.institution?.includes(jurisdictionCode || '');
      }
      if (role === 'DISTRICT_OFFICER') {
        return ex.assignedRole === 'DISTRICT_OFFICER' || ex.district === jurisdictionCode;
      }
      if (role === 'STATE_OFFICER') {
        return ex.assignedRole === 'STATE_OFFICER' || ex.state === jurisdictionCode;
      }
      return true;
    });
  },

  // Get exception by ID
  getExceptionById(id) {
    return this.getAllExceptions().find((ex) => ex.id === id);
  },

  // Resolve an exception (Approve or Request Student Correction)
  resolveException(id, resolution, officialNotes, officerName) {
    const exceptions = this.getAllExceptions();
    const index = exceptions.findIndex((ex) => ex.id === id);
    if (index >= 0) {
      exceptions[index] = {
        ...exceptions[index],
        status: resolution === 'APPROVE' ? 'RESOLVED_APPROVED' : 'CORRECTION_REQUESTED',
        officerNotes,
        resolvedBy: officerName || 'Authorised Review Officer',
        resolvedAt: new Date().toISOString(),
      };
      this.saveExceptions(exceptions);
      return { success: true, exception: exceptions[index] };
    }
    return { success: false, error: 'Exception not found' };
  },

  // Get exceptions for a student
  getStudentExceptions(applicantId) {
    return this.getAllExceptions().filter((ex) => ex.applicantId === applicantId);
  },
};
