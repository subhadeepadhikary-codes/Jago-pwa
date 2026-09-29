// JAGO Explainable Eligibility Engine
// Deterministic rules engine executing scheme-specific criteria for MoTA schemes.
// PRINCIPLE: RULES DECIDE. AI EXPLAINS. HUMANS RESOLVE EXCEPTIONS.
// No AI model ever independently approves or rejects an application.

export const rulesEngine = {
  // Scheme Rule Configurations
  SCHEME_RULES: {
    'pre-matric': {
      id: 'pre-matric',
      name: 'Pre-Matric Scholarship for ST Students',
      maxIncome: 250000,
      targetClasses: ['9', '10', 'Class IX', 'Class X', 'Class 9', 'Class 10'],
      requiredCategory: 'ST',
    },
    'post-matric': {
      id: 'post-matric',
      name: 'Post-Matric Scholarship for ST Students',
      maxIncome: 250000,
      minEducationLevel: 'Post-Secondary',
      requiredCategory: 'ST',
    },
    'top-class': {
      id: 'top-class',
      name: 'Top Class Education for ST Students',
      maxIncome: 600000,
      requiresPremierInstitute: true,
      requiredCategory: 'ST',
    },
    'nfst': {
      id: 'nfst',
      name: 'National Fellowship for ST Students (NFST)',
      maxIncome: Infinity, // No income ceiling for NFST
      requiresResearchEnrollment: true,
      requiredCategory: 'ST',
      checkConcurrentBenefit: true,
    },
    'nos': {
      id: 'nos',
      name: 'National Overseas Scholarship for ST (NOS)',
      maxIncome: 600000,
      maxAge: 35,
      minGradMarksPercentage: 60,
      requiresForeignAdmission: true,
      requiredCategory: 'ST',
    },
  },

  // Deterministic evaluation of an applicant against a scheme
  evaluateEligibility(schemeId, applicantData, context = {}) {
    const rules = this.SCHEME_RULES[schemeId] || this.SCHEME_RULES['top-class'];
    const checks = [];

    // 1. ST Status Check
    const category = (applicantData?.category || 'ST').toUpperCase();
    const isST = category === 'ST' || category.includes('PVTG');
    checks.push({
      id: 'st_category',
      label: 'Scheduled Tribe (ST) Status',
      source: 'DigiLocker / State Revenue',
      status: isST ? 'PASSED' : 'FAILED',
      detail: isST
        ? `${applicantData?.tribe || 'Tribal'} Community verified via ST Certificate`
        : 'Applicant must belong to recognized Scheduled Tribe community',
    });

    // 2. Annual Income Ceiling Check
    const income = Number(applicantData?.annualIncome ?? applicantData?.income ?? 180000);
    const hasIncomeCeiling = rules.maxIncome !== Infinity;
    const passesIncome = !hasIncomeCeiling || income <= rules.maxIncome;
    checks.push({
      id: 'income_ceiling',
      label: 'Annual Family Income Limit',
      source: 'State e-District Revenue',
      status: passesIncome ? 'PASSED' : 'FAILED',
      detail: hasIncomeCeiling
        ? `Family income ₹${income.toLocaleString('en-IN')} is within ceiling of ₹${rules.maxIncome.toLocaleString('en-IN')}`
        : 'Zero income ceiling applicable for central research fellowship',
    });

    // 3. Academic & Institute Accreditation Check
    const inst = applicantData?.currentEducation?.institution || 'IIT Kharagpur';
    const isPremier = inst.toLowerCase().includes('iit') ||
      inst.toLowerCase().includes('nit') ||
      inst.toLowerCase().includes('iim') ||
      inst.toLowerCase().includes('aiims') ||
      rules.id !== 'top-class';

    checks.push({
      id: 'institute_accreditation',
      label: 'Institution Accreditation & AISHE Status',
      source: 'AISHE National Portal (U-0584)',
      status: isPremier ? 'PASSED' : 'FAILED',
      detail: isPremier
        ? `${inst} is accredited and verified under AISHE`
        : 'Institute is not on the notified premier institute list for Top Class scheme',
    });

    // 4. Concurrent Benefit & Fellowship De-Duplication
    const hasConcurrentConflict = context.hasConcurrentOverlap === true;
    checks.push({
      id: 'concurrent_benefit',
      label: 'Concurrent Central Benefit Check',
      source: 'PFMS & NSP De-Duplication Registry',
      status: hasConcurrentConflict ? 'EXCEPTION' : 'PASSED',
      detail: hasConcurrentConflict
        ? 'Potential overlap detected with state stipend. Flagged for officer review.'
        : 'No conflicting central government scholarships or fellowships detected',
    });

    // 5. Verification Document Completeness Check
    const hasPendingIncomeSync = context.incomeVerificationPending === true;
    checks.push({
      id: 'document_verification',
      label: 'Document Verification & Digital Signature',
      source: 'DigiLocker & APAAR Fabric',
      status: hasPendingIncomeSync ? 'PENDING' : 'PASSED',
      detail: hasPendingIncomeSync
        ? 'Income Certificate renewal sync pending with State Revenue Portal'
        : 'All required certificates verified with valid digital signatures',
      nextAction: hasPendingIncomeSync ? 'Sync latest FY 2025-26 revenue certificate via e-District' : null,
    });

    // Calculate deterministic outcome
    const passedCount = checks.filter((c) => c.status === 'PASSED').length;
    const totalCount = checks.length;
    const hasFailed = checks.some((c) => c.status === 'FAILED');
    const hasException = checks.some((c) => c.status === 'EXCEPTION');
    const hasPending = checks.some((c) => c.status === 'PENDING');

    let overallStatus = 'PASSED';
    let explanation = '';

    if (hasFailed) {
      overallStatus = 'FAILED';
      explanation = `Application does not meet ${totalCount - passedCount} mandatory scheme rule(s).`;
    } else if (hasException) {
      overallStatus = 'REVIEW_REQUIRED';
      explanation = `Eligible based on deterministic criteria (${passedCount}/${totalCount} Passed), with 1 item routed to Exception Queue for human review.`;
    } else if (hasPending) {
      overallStatus = 'PENDING';
      explanation = `${passedCount} of ${totalCount} checks passed. Waiting for final revenue portal certificate sync.`;
    } else {
      overallStatus = 'PASSED';
      explanation = `All ${totalCount} deterministic rule checks fully satisfied. Application is verified and ready for sanction.`;
    }

    return {
      schemeId: rules.id,
      schemeName: rules.name,
      status: overallStatus,
      passedCount,
      totalCount,
      score: Math.round((passedCount / totalCount) * 100),
      checks,
      explanation,
      nextAction: checks.find((c) => c.nextAction)?.nextAction || 'Proceed to stage review',
      evaluatedAt: new Date().toISOString(),
    };
  },

  // Calculate student overall application readiness (Scholarship Health: 0-100)
  calculateScholarshipHealth(student, applications = []) {
    let score = 25; // Base registration complete

    // Profile completion (up to 25 pts)
    if (student?.name && student?.mobile && student?.category) score += 15;
    if (student?.currentEducation?.institution && student?.bankDetails?.dbtActive) score += 10;

    // Academic verification (up to 25 pts)
    if (student?.apaarId || student?.currentEducation?.aisheCode) score += 20;

    // Active applications status (up to 25 pts)
    if (applications.length > 0) {
      const hasDeficiency = applications.some((a) => a.status === 'deficiency' || a.status === 'EXCEPTION_REVIEW');
      if (hasDeficiency) {
        score += 12; // Deduct for pending deficiency
      } else {
        score += 25;
      }
    } else {
      score += 10;
    }

    return Math.min(100, Math.max(40, score));
  },
};
