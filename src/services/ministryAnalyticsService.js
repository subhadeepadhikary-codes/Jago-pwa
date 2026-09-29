// JAGO Ministry Analytics & Coverage Gap Radar Service
// Powers administrative intelligence for the Ministry of Tribal Affairs (MoTA).
// IMPORTANT: Identifies "Potential Coverage Gaps" based on aggregate educational signals,
// without falsely declaring unverified students as automatically eligible.

export const ministryAnalyticsService = {
  // National MoTA Scholarship Pipeline Overview
  getPipelineOverview() {
    return {
      totalApplications: 284520,
      underVerification: 42180,
      sanctionedApplications: 198400,
      totalDisbursedCrores: 348.5,
      activeExceptionsCount: 1842,
      averageDisbursalDays: 14.2,
      schemeDistribution: [
        { scheme: 'Post-Matric ST', count: 142000, amountCr: 156.2 },
        { scheme: 'Pre-Matric ST', count: 98000, amountCr: 48.5 },
        { scheme: 'Top Class Education', count: 18500, amountCr: 54.3 },
        { scheme: 'National Fellowship (NFST)', count: 21500, amountCr: 65.8 },
        { scheme: 'National Overseas (NOS)', count: 4520, amountCr: 23.7 },
      ],
    };
  },

  // Coverage Gap Radar: Comparing education enrollments with scholarship beneficiaries
  getCoverageGapRadarData() {
    return [
      {
        district: 'Ranchi',
        state: 'Jharkhand',
        identifiedStEnrolled: 14200,
        scholarshipBeneficiaries: 9840,
        potentialCoverageGap: 4360,
        coveragePercentage: 69.3,
        primaryTribes: ['Santhal', 'Munda', 'Oraon'],
        recommendedAction: 'Deploy Mobile Gramin Kendra for e-District revenue certificate drive.',
      },
      {
        district: 'Mayurbhanj',
        state: 'Odisha',
        identifiedStEnrolled: 18500,
        scholarshipBeneficiaries: 12100,
        potentialCoverageGap: 6400,
        coveragePercentage: 65.4,
        primaryTribes: ['Santhal', 'Kolha', 'Bhumij'],
        recommendedAction: 'Coordinate with District Welfare Officer for APAAR ID linkage at block level.',
      },
      {
        district: 'Bastar',
        state: 'Chhattisgarh',
        identifiedStEnrolled: 11800,
        scholarshipBeneficiaries: 7200,
        potentialCoverageGap: 4600,
        coveragePercentage: 61.0,
        primaryTribes: ['Gond', 'Maria', 'Muria'],
        recommendedAction: 'Schedule offline verification camps at Eklavya Model Residential Schools (EMRS).',
      },
      {
        district: 'Sundargarh',
        state: 'Odisha',
        identifiedStEnrolled: 15300,
        scholarshipBeneficiaries: 11050,
        potentialCoverageGap: 4250,
        coveragePercentage: 72.2,
        primaryTribes: ['Kisan', 'Oraon', 'Munda'],
        recommendedAction: 'Initiate bulk bank account DBT Aadhaar-seeding with Lead District Bank.',
      },
      {
        district: 'Paschim Medinipur',
        state: 'West Bengal',
        identifiedStEnrolled: 8900,
        scholarshipBeneficiaries: 6100,
        potentialCoverageGap: 2800,
        coveragePercentage: 68.5,
        primaryTribes: ['Santhal', 'Lodha (PVTG)', 'Mahali'],
        recommendedAction: 'Priority outreach for PVTG Lodha students with simplified single-window forms.',
      },
    ];
  },

  // PFMS Direct Benefit Transfer Health
  getPfmsDisbursementHealth() {
    return {
      dbtSuccessRate: 96.4,
      accountMappedPct: 98.5,
      bankBouncePct: 2.1,
      unmappedAadhaarPct: 1.5,
      totalBatchesProcessed: 840,
      activeBatch: {
        batchId: 'PFMS-MOTA-2026-B94',
        date: '2026-09-22',
        totalRecipients: 14200,
        amount: '₹ 18.4 Cr',
        status: 'DISBURSAL_IN_PROGRESS',
      },
    };
  },
};
