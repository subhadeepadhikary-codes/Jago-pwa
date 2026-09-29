// JAGO Multilingual Intelligent Assistant & Scholarship Knowledge Engine
// Domain-Grounded Knowledge for Central MoTA & State Scholarship Frameworks

export const voiceService = {
  // Check if browser Speech Recognition is available
  hasSpeechRecognition() {
    return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  },

  // Check if Speech Synthesis is available
  hasSpeechSynthesis() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  },

  // Speak text in desired language using Web Speech API
  speak(text, lang = 'hi-IN') {
    if (!this.hasSpeechSynthesis()) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  },

  stopSpeaking() {
    if (this.hasSpeechSynthesis()) {
      window.speechSynthesis.cancel();
    }
  },

  // Process natural language queries with deep scholarship knowledge
  processQuery(transcript, context = {}) {
    const text = (transcript || '').toLowerCase().trim();
    const student = context.user || { name: 'Applicant' };
    const applications = context.applications || [];
    const lang = context.language || 'en';

    // -------------------------------------------------------------
    // 1. SWAMI VIVEKANANDA MERIT-CUM-MEANS (SVMCM) - WEST BENGAL
    // -------------------------------------------------------------
    if (
      text.includes('svmcm') ||
      text.includes('swami vivekananda') ||
      (text.includes('west bengal') && (text.includes('scholarship') || text.includes('apply'))) ||
      text.includes('bikash bhavan') ||
      text.includes('wbhed')
    ) {
      if (lang === 'bn') {
        return {
          intent: 'STATE_SVMCM_WB',
          text: `হ্যাঁ, আপনি পশ্চিমবঙ্গ স্বামী বিবেকানন্দ মেরিট-কাম-মিনস (SVMCM) স্কলারশিপের জন্য আবেদন করতে পারেন!\n\n📋 যোগ্যতা: পশ্চিমবঙ্গে স্থায়ী বসবাসকারী বা অনুমোদিত প্রতিষ্ঠানে (যেমন IIT Kharagpur, যাদবপুর) অধ্যয়নরত যে সকল শিক্ষার্থী শেষ পরীক্ষায় অন্তত ৬০% নম্বর পেয়েছেন এবং পরিবারের বার্ষিক আয় ₹২.৫ লক্ষের মধ্যে।\n\n🌐 অফিসিয়াল পোর্টাল: svmcm.wbhed.gov.in\n\n⚠️ গুরুত্বপূর্ণ নিয়ম: কেন্দ্রীয় সরকারের নিয়ম অনুযায়ী, একজন শিক্ষার্থী একই শিক্ষাবর্ষে কেন্দ্রীয় MoTA (যেমন Top Class বা NFST) এবং রাজ্য SVMCM থেকে একসাথে দুটি রক্ষণাবেক্ষণ ভাতা নিতে পারবেন না। কেন্দ্রীয় MoTA Top Class স্কিম সম্পূর্ণ টিউশন ফি + ₹৮৬,০০০/বছর অতিরিক্ত ভাতা দেয়, যা সাধারণত SVMCM (₹১,০০০-₹৫,০০০/মাস) এর চেয়ে বেশি সুবিধাজনক।`,
          englishTranslation: `Yes, you can apply for West Bengal SVMCM scholarship if you meet the 60% marks and <= ₹2.5 Lakh income criteria. Note that under GOI rules, students cannot receive dual maintenance allowances from both Central MoTA (Top Class) and State SVMCM simultaneously.`,
          actionRoute: '/explore',
        };
      }
      if (lang === 'hi') {
        return {
          intent: 'STATE_SVMCM_WB',
          text: `हाँ, आप पश्चिम बंगाल स्वामी विवेकानंद मेरिट-कम-मीन्स (SVMCM) स्कॉलरशिप के लिए आवेदन कर सकते हैं!\n\n📋 पात्रता मानदंड:\n1. पश्चिम बंगाल के निवासी या पश्चिम बंगाल के मान्यता प्राप्त संस्थान (जैसे IIT Kharagpur) में अध्ययनरत विद्यार्थी।\n2. पिछली योग्यता परीक्षा में न्यूनतम 60% अंक।\n3. परिवार की वार्षिक आय ₹2.5 लाख से कम होनी चाहिए।\n\n🌐 आवेदन पोर्टल: svmcm.wbhed.gov.in\n\n⚠️ दोहरी छात्रवृत्ति नियम (Dual Scholarship Rule):\nसरकारी नियमों के अनुसार, आप एक ही शैक्षणिक वर्ष के लिए केंद्र सरकार (MoTA टॉप क्लास / NFST) और राज्य सरकार (SVMCM) दोनों से एक साथ मेंटेनेंस भत्ता नहीं ले सकते।\n\n💡 सलाह: यदि आप IIT खड़गपुर जैसे प्रीमियर संस्थान में हैं, तो MoTA Top Class Education 100% ट्यूशन फीस + ₹86,000/वर्ष का जीवन-यापन भत्ता देती है, जो SVMCM से अधिक लाभदायक है।`,
          englishTranslation: `Yes, you are eligible for the West Bengal SVMCM scholarship (svmcm.wbhed.gov.in) with 60%+ marks and family income <= ₹2.5 Lakh. Note: GOI rules prohibit dual maintenance allowances from both Central MoTA and State SVMCM. Central Top Class provides higher financial coverage (full tuition + ₹86,000/yr).`,
          actionRoute: '/explore',
        };
      }
      return {
        intent: 'STATE_SVMCM_WB',
        text: `Yes, you are eligible to apply for the West Bengal Swami Vivekananda Merit-cum-Means (SVMCM) Scholarship!\n\n📋 Eligibility Criteria:\n• Domiciled in West Bengal or studying in eligible WB institutions (like IIT Kharagpur, Jadavpur, etc.).\n• Minimum 60% marks in the last qualifying examination.\n• Annual family income must not exceed ₹2,50,000.\n\n🌐 Official Portal: svmcm.wbhed.gov.in\n\n⚠️ Important Dual-Scholarship Rule:\nUnder Government of India and State financial guidelines, a student cannot simultaneously avail dual maintenance/tuition allowances for the same academic year from both Central Ministry of Tribal Affairs (MoTA Top Class / NFST) and State SVMCM.\n\n💡 Expert Guidance: As a verified student at a premier institute (like IIT Kharagpur), Central MoTA Top Class covers 100% full institute fees + ₹86,000/year living allowance + ₹45,000 computer grant. This provides significantly higher financial support than SVMCM (₹1,000–₹5,000/month).`,
        englishTranslation: `Yes, you are eligible for the West Bengal SVMCM scholarship at svmcm.wbhed.gov.in (60%+ marks, income <= ₹2.5 Lakh). Note: Dual government scholarships cannot be claimed simultaneously; Central MoTA Top Class covers full fees + ₹86,000/yr allowance.`,
        actionRoute: '/explore',
      };
    }

    // -------------------------------------------------------------
    // 2. OASIS SCHOLARSHIP (WEST BENGAL SC/ST/OBC)
    // -------------------------------------------------------------
    if (text.includes('oasis') || (text.includes('bengal') && text.includes('post matric'))) {
      return {
        intent: 'STATE_OASIS_WB',
        text: `The OASIS Scholarship (Online Application for Scholarships in Studies) is West Bengal's state portal for Post-Matric & Pre-Matric ST/SC scholarships at oasis.gov.in. If you are already receiving Central MoTA Top Class Education or NFST, you should not duplicate claims on OASIS.`,
        englishTranslation: `OASIS is the West Bengal state scholarship portal (oasis.gov.in). ST students eligible for Central MoTA Top Class receive higher benefits under the central scheme.`,
        actionRoute: '/explore',
      };
    }

    // -------------------------------------------------------------
    // 3. E-KALYAN (JHARKHAND & BIHAR)
    // -------------------------------------------------------------
    if (text.includes('ekalyan') || text.includes('e-kalyan') || text.includes('jharkhand')) {
      return {
        intent: 'STATE_EKALYAN',
        text: `E-Kalyan (ekalyan.cgg.gov.in) is the Jharkhand State Tribal Welfare Department portal for Post-Matric scholarships. JAGO coordinates with e-Kalyan to prevent document duplication by sharing verified caste and income certificates.`,
        englishTranslation: `E-Kalyan is Jharkhand's state scholarship portal. JAGO integrates with DigiLocker so your verified certificates are recognized without resubmission.`,
        actionRoute: '/explore',
      };
    }

    // -------------------------------------------------------------
    // 4. TOP CLASS EDUCATION FOR ST STUDENTS (MOTA TCE)
    // -------------------------------------------------------------
    if (
      text.includes('top class') ||
      text.includes('tce') ||
      text.includes('iit') ||
      text.includes('nit') ||
      text.includes('premier') ||
      text.includes('institution')
    ) {
      return {
        intent: 'MOTA_TOP_CLASS',
        text: `The Top Class Education Scheme for ST Students is MoTA's flagship premier scholarship for institutions like IITs, NITs, IIMs, and AIIMS.\n\n💰 Benefits:\n• 100% full non-refundable tuition fees reimbursed directly.\n• ₹86,000/year living expenses / boarding & lodging.\n• ₹45,000 one-time computer grant (laptop/desktop).\n• ₹3,000/year for books and stationery.\n\nEligibility: ST category, family income up to ₹6.0 Lakh per annum.`,
        englishTranslation: `MoTA Top Class Education covers full tuition fees + ₹86,000/yr living allowance + ₹45,000 laptop grant for ST students at premier institutes.`,
        actionRoute: '/scheme/top-class-st',
      };
    }

    // -------------------------------------------------------------
    // 5. NATIONAL FELLOWSHIP FOR ST STUDENTS (NFST)
    // -------------------------------------------------------------
    if (
      text.includes('nfst') ||
      text.includes('fellowship') ||
      text.includes('phd') ||
      text.includes('m.phil') ||
      text.includes('m.tech')
    ) {
      return {
        intent: 'MOTA_NFST',
        text: `The National Fellowship for Higher Education of ST Students (NFST) supports 750 new ST scholars annually pursuing M.Phil and Ph.D. degrees.\n\n💰 Fellowship Amount:\n• JRF: ₹37,000 per month (initial 2 years).\n• SRF: ₹42,000 per month (remaining duration).\n• Annual Contingency grant: ₹10,000–₹28,000 + HRA.`,
        englishTranslation: `NFST provides ₹37,000/mo (JRF) and ₹42,000/mo (SRF) for ST students pursuing M.Phil/Ph.D. programs.`,
        actionRoute: '/scheme/nfst-higher-edu',
      };
    }

    // -------------------------------------------------------------
    // 6. NATIONAL OVERSEAS SCHOLARSHIP (NOS)
    // -------------------------------------------------------------
    if (
      text.includes('nos') ||
      text.includes('overseas') ||
      text.includes('abroad') ||
      text.includes('foreign') ||
      text.includes('international')
    ) {
      return {
        intent: 'MOTA_NOS',
        text: `The National Overseas Scholarship (NOS) for ST Students funds 100 students every year for Master's and Ph.D. courses abroad in USA, UK, Europe, etc.\n\n💰 Coverage:\n• 100% tuition fees + medical insurance + economy airfare.\n• Annual Maintenance Allowance: US $15,400 (USA/other countries) or £9,900 (UK).`,
        englishTranslation: `NOS provides full international tuition, flights, and $15,400 / £9,900 annual living allowance for 100 ST scholars studying abroad.`,
        actionRoute: '/scheme/nos-st',
      };
    }

    // -------------------------------------------------------------
    // 7. PRE-MATRIC & POST-MATRIC ST SCHOLARSHIPS
    // -------------------------------------------------------------
    if (text.includes('pre matric') || text.includes('post matric') || text.includes('class 9') || text.includes('class 10') || text.includes('class 11') || text.includes('class 12')) {
      return {
        intent: 'MATRIC_SCHOLARSHIPS',
        text: `• Pre-Matric ST Scholarship: For ST day-scholars and hostellers in Classes IX & X with family income <= ₹2.5 Lakh.\n• Post-Matric ST Scholarship: Covers post-secondary studies from Class XI to graduate degrees across state and central colleges.`,
        englishTranslation: `Pre-Matric ST covers Classes IX-X, while Post-Matric covers Class XI through University graduation with family income <= ₹2.5 Lakh.`,
        actionRoute: '/explore',
      };
    }

    // -------------------------------------------------------------
    // 8. APPLICATION STATUS & TRACKING
    // -------------------------------------------------------------
    if (
      text.includes('kaha tak') ||
      text.includes('status') ||
      text.includes('pahucha') ||
      text.includes('where is') ||
      text.includes('track') ||
      text.includes('timeline')
    ) {
      const activeApp = applications[0] || {
        schemeName: 'Top Class Education for ST Students',
        currentStage: 2,
        status: 'deficiency',
      };
      return {
        intent: 'APPLICATION_STATUS',
        text: `Hello ${student.name}, your application for ${activeApp.schemeName} is currently at Stage ${activeApp.currentStage} (Institute AISHE Authentication & Verification). Tap 'View Tracker' to see the real-time stage progression.`,
        englishTranslation: `Hello ${student.name}, your application for ${activeApp.schemeName} is currently at Stage ${activeApp.currentStage}.`,
        actionRoute: '/tracker',
      };
    }

    // -------------------------------------------------------------
    // 9. DEFICIENCY / INCOME EXPIRY ASSISTANCE
    // -------------------------------------------------------------
    if (
      text.includes('dikkat') ||
      text.includes('deficiency') ||
      text.includes('income') ||
      text.includes('pending') ||
      text.includes('issue') ||
      text.includes('problem') ||
      text.includes('expired')
    ) {
      return {
        intent: 'DEFICIENCY_HELP',
        text: `Your application flagged a minor deficiency: Family Income Certificate for FY 2024-25 is expired. Good news: instead of rejection, MoTA Exception Routing held your place in queue. You can upload or sync your valid FY 2025-26 certificate directly in the Document Wallet to instantly clear the flag.`,
        englishTranslation: `An expired Income Certificate was flagged. Upload valid FY 2025-26 certificate via Document Wallet to instantly resolve.`,
        actionRoute: '/documents',
      };
    }

    // -------------------------------------------------------------
    // 10. AADHAAR DBT SEEDING & BANK DISBURSAL
    // -------------------------------------------------------------
    if (
      text.includes('dbt') ||
      text.includes('bank') ||
      text.includes('account') ||
      text.includes('pfms') ||
      text.includes('seed') ||
      text.includes('credited')
    ) {
      return {
        intent: 'DBT_DISBURSAL_HELP',
        text: `All MoTA scholarships are disbursed via Direct Benefit Transfer (DBT) directly into your Aadhaar-seeded bank account through the Public Financial Management System (PFMS). Ensure your bank account is active on the NPCI Aadhaar mapper.`,
        englishTranslation: `Scholarship funds are directly transferred via PFMS DBT to your Aadhaar-linked bank account.`,
        actionRoute: '/profile',
      };
    }

    // -------------------------------------------------------------
    // 11. GENERAL SMART ASSISTANCE
    // -------------------------------------------------------------
    return {
      intent: 'GENERAL_ASSISTANCE',
      text: `I am JAGO, your verified AI Scholarship Assistant. You can ask me about:\n• Central MoTA Schemes (Top Class, NFST, NOS, Pre/Post-Matric)\n• State Schemes (SVMCM West Bengal, OASIS, e-Kalyan, Medhabruti)\n• Dual Scholarship Rules & Income Limits\n• DigiLocker Verification & DBT Status`,
      englishTranslation: `I am JAGO, your verified AI Scholarship Assistant. Ask me about Central and State scholarships, eligibility, dual-scholarship rules, and DigiLocker verification.`,
      actionRoute: null,
    };
  },
};
