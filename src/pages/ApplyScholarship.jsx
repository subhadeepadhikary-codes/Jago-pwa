import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/layout/PageTransition';
import {
  User,
  Shield,
  GraduationCap,
  Landmark,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  AlertTriangle,
  Building2,
  Download,
  Calendar,
  Sparkles,
  CloudDownload,
  Clock,
  Search,
  Check,
  RotateCcw,
  Layers,
  FileText
} from 'lucide-react';

export default function ApplyScholarship() {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const { user, schemes, documents, addApplication, darkMode } = useApp();

  // Workflow phases:
  // 1: Enter Credentials
  // 2: System Eligibility Check -> Show Matching Schemes -> User clicks particular scheme
  // 3: Upload Documents & Proofs
  // 4: System Verifies Documents & Proofs
  // 5: Enqueue Application -> Waiting to be Sanctioned
  const [phase, setPhase] = useState(1);

  // Phase 1: Credentials
  const [credentials, setCredentials] = useState({
    name: user.name,
    fatherName: user.fatherName,
    state: user.state,
    district: user.district,
    category: 'ST',
    subCategory: 'PVTG',
    tribe: user.tribe,
    income: 180000,
    educationLevel: 'premier', // 'pre-matric', 'post-matric', 'premier', 'research', 'overseas'
    institution: user.currentEducation.institution,
    aisheCode: user.currentEducation.aisheCode,
    course: user.currentEducation.course,
    year: user.currentEducation.year,
    rollNo: user.currentEducation.rollNo,
    previousMarks: '84.5',
    aadhaarLast4: user.aadhaarLast4,
    bankName: user.bankName,
    accountNumber: user.accountNumber,
    ifsc: user.ifsc,
  });

  // Phase 2: Eligibility Match Calculation
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Phase 3: Document uploads
  const [uploadedDocs, setUploadedDocs] = useState({
    stCertificate: { name: 'ST Caste Certificate.pdf', status: 'ready', source: 'DigiLocker' },
    incomeCertificate: { name: 'Income Certificate (2026-27).pdf', status: 'ready', source: 'State e-District' },
    academicMarksheet: { name: 'Previous Year Marksheet.pdf', status: 'ready', source: 'DigiLocker' },
    bonafideForm: { name: 'Institute Bonafide Form.pdf', status: 'uploaded', source: 'NIT Jamshedpur' },
    bankPassbook: { name: 'Bank Passbook Copy.pdf', status: 'ready', source: 'SBI e-Passbook' },
  });

  // Phase 4: Verification Simulation
  const [verifying, setVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState([]);
  const [verificationDone, setVerificationDone] = useState(false);

  // Phase 5: Enqueued Application
  const [enqueuedApp, setEnqueuedApp] = useState(null);

  // Check eligibility rules based on credentials
  const runEligibilityCheck = () => {
    setCheckingEligibility(true);
    setTimeout(() => {
      const results = [];
      const inc = Number(credentials.income);
      const lvl = credentials.educationLevel;

      // 1. Pre-Matric
      if (lvl === 'pre-matric' && inc <= 250000) {
        results.push({
          scheme: schemes.find((s) => s.id === 'pre-matric') || schemes[0],
          matchPercent: 98,
          estAmount: 7000,
          reason: 'Class IX-X ST student with income under ₹2.5 Lakh',
        });
      }

      // 2. Post-Matric
      if (['post-matric', 'premier'].includes(lvl) && inc <= 250000) {
        results.push({
          scheme: schemes.find((s) => s.id === 'post-matric') || schemes[1],
          matchPercent: 95,
          estAmount: 42000,
          reason: 'Pursuing post-matric studies with income under ₹2.5 Lakh',
        });
      }

      // 3. Top Class Premier
      if (lvl === 'premier' && inc <= 600000) {
        results.push({
          scheme: schemes.find((s) => s.id === 'top-class') || schemes[2],
          matchPercent: 100,
          estAmount: 85000,
          reason: 'Enrolled in notified Premier Institution (NIT) with income under ₹6 Lakh',
        });
      }

      // 4. NFST (Research)
      if (lvl === 'research') {
        results.push({
          scheme: schemes.find((s) => s.id === 'nfst') || schemes[3],
          matchPercent: 90,
          estAmount: 372000,
          reason: 'Admitted to M.Phil / Ph.D research with NET qualification',
        });
      }

      // 5. NOS (Overseas)
      if (lvl === 'overseas' && inc <= 600000) {
        results.push({
          scheme: schemes.find((s) => s.id === 'nos') || schemes[4],
          matchPercent: 88,
          estAmount: 2800000,
          reason: 'Admitted to QS Top 500 foreign university with income under ₹6 Lakh',
        });
      }

      // Fallback: If no match, add Post-Matric or Top Class as option
      if (results.length === 0) {
        results.push({
          scheme: schemes.find((s) => s.id === 'top-class') || schemes[2],
          matchPercent: 85,
          estAmount: 85000,
          reason: 'Eligible under Premier Institution criteria',
        });
      }

      setEligibleSchemes(results);
      setCheckingEligibility(false);
      setPhase(2);
    }, 900);
  };

  // When user selects a particular scheme from results
  const handleSelectScheme = (schemeItem) => {
    setSelectedScheme(schemeItem.scheme);
    setPhase(3);
  };

  // Run automated document & proof verification
  const runVerification = () => {
    setVerifying(true);
    setVerificationProgress([]);

    const stepsList = [
      'Authenticating Aadhaar identity with UIDAI server...',
      'Verifying ST / Caste certificate with State e-District database...',
      'Checking Annual Income validity with Revenue Department...',
      'Matching Institute AISHE Code (U-0456) with National Portal...',
      'Validating DBT bank account seeding with NPCI Aadhaar mapper...',
      'Confirming single-scholarship compliance (no duplicate active awards)...',
    ];

    stepsList.forEach((text, index) => {
      setTimeout(() => {
        setVerificationProgress((prev) => [...prev, text]);
        if (index === stepsList.length - 1) {
          setVerifying(false);
          setVerificationDone(true);
        }
      }, (index + 1) * 450);
    });
  };

  // Enqueue application waiting for sanction
  const handleEnqueue = () => {
    const queueNumber = Math.floor(100 + Math.random() * 900);
    const newApp = addApplication({
      schemeId: selectedScheme.id,
      schemeName: selectedScheme.name,
      institution: credentials.institution,
      amount: selectedScheme.id === 'top-class' ? 85000 : selectedScheme.id === 'post-matric' ? 42000 : 35000,
      queueNumber,
      verificationStatus: 'All Proofs Verified Online',
      ...credentials,
    });

    setEnqueuedApp({
      ...newApp,
      queueNumber,
    });
    setPhase(5);
  };

  return (
    <PageTransition className="pt-2 pb-20 px-4">
      {/* Top Header */}
      <div className="mt-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (phase > 1 && phase < 5) setPhase((p) => p - 1);
              else navigate(-1);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
              darkMode ? 'bg-navy-light/50 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-saffron">
              Jago Scholarship Engine
            </span>
            <h2 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {phase === 1 && '1. Enter Student Credentials'}
              {phase === 2 && '2. System Eligibility Match'}
              {phase === 3 && '3. Upload Required Documents'}
              {phase === 4 && '4. Automated Proof Verification'}
              {phase === 5 && '5. Enqueued for Sanction'}
            </h2>
          </div>
        </div>

        {/* Phase Steps Indicator */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-[11px] mb-1.5 font-bold">
            <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>
              Phase {phase} of 5: {
                phase === 1 ? 'Credentials' :
                phase === 2 ? 'Select Scheme' :
                phase === 3 ? 'Upload Proofs' :
                phase === 4 ? 'System Verify' : 'Sanction Queue'
              }
            </span>
            <span className="text-saffron">{Math.round((phase / 5) * 100)}%</span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
            <motion.div
              className="h-full bg-gradient-to-r from-saffron to-saffron-light"
              initial={{ width: '20%' }}
              animate={{ width: `${(phase / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* ================= PHASE 1: ENTER CREDENTIALS ================= */}
      {phase === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-5 border space-y-4 shadow-xs ${
            darkMode ? 'bg-navy-light/40 border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 pb-2 border-b border-inherit">
            <User className="w-5 h-5 text-saffron" />
            <div>
              <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Enter / Confirm Your Credentials
              </h3>
              <p className={`text-[11px] ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                The Jago system will evaluate your eligibility across all 5 MoTA schemes
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={`block mb-1 font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={credentials.name}
                  onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border font-medium outline-none ${
                    darkMode ? 'bg-navy/80 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  Father's Name
                </label>
                <input
                  type="text"
                  value={credentials.fatherName}
                  onChange={(e) => setCredentials({ ...credentials, fatherName: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border font-medium outline-none ${
                    darkMode ? 'bg-navy/80 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={`block mb-1 font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  Category / Group
                </label>
                <select
                  value={credentials.category}
                  onChange={(e) => setCredentials({ ...credentials, category: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border font-medium outline-none ${
                    darkMode ? 'bg-navy/80 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="PVTG">Particularly Vulnerable (PVTG)</option>
                </select>
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  Tribe Community
                </label>
                <input
                  type="text"
                  value={credentials.tribe}
                  onChange={(e) => setCredentials({ ...credentials, tribe: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border font-medium outline-none ${
                    darkMode ? 'bg-navy/80 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block mb-1 font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                Annual Parental Family Income (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={credentials.income}
                  onChange={(e) => setCredentials({ ...credentials, income: e.target.value })}
                  className={`flex-1 p-2.5 rounded-xl border font-bold text-green-600 outline-none ${
                    darkMode ? 'bg-navy/80 border-white/10 text-green-400' : 'bg-slate-50 border-slate-200'
                  }`}
                />
                <span className="p-2.5 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-[11px] flex items-center">
                  Under ₹2.5L / ₹6L limit ✓
                </span>
              </div>
            </div>

            <div>
              <label className={`block mb-1 font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                Current Education Level & Type
              </label>
              <select
                value={credentials.educationLevel}
                onChange={(e) => setCredentials({ ...credentials, educationLevel: e.target.value })}
                className={`w-full p-3 rounded-xl border font-medium outline-none ${
                  darkMode ? 'bg-navy/80 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="premier">Degree at Notified Premier Institution (IIT, NIT, IIM, AIIMS, NLU)</option>
                <option value="post-matric">Class XI, XII or Higher Secondary (Post-Matric)</option>
                <option value="pre-matric">Class IX or X (Secondary / Pre-Matric)</option>
                <option value="research">M.Phil / Ph.D Postgraduate Research (Fellowship)</option>
                <option value="overseas">Master's / Ph.D Abroad (QS Top 500 Foreign University)</option>
              </select>
            </div>

            <div>
              <label className={`block mb-1 font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                Institution Name & AISHE Code
              </label>
              <input
                type="text"
                value={`${credentials.institution} (${credentials.aisheCode})`}
                onChange={(e) => setCredentials({ ...credentials, institution: e.target.value })}
                className={`w-full p-2.5 rounded-xl border font-medium outline-none ${
                  darkMode ? 'bg-navy/80 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={`block mb-1 font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  Enrolled Course / Degree
                </label>
                <input
                  type="text"
                  value={credentials.course}
                  onChange={(e) => setCredentials({ ...credentials, course: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border font-medium outline-none ${
                    darkMode ? 'bg-navy/80 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  Previous Year Marks (%)
                </label>
                <input
                  type="text"
                  value={credentials.previousMarks}
                  onChange={(e) => setCredentials({ ...credentials, previousMarks: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border font-bold text-saffron outline-none ${
                    darkMode ? 'bg-navy/80 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>
          </div>

          <button
            onClick={runEligibilityCheck}
            disabled={checkingEligibility}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-saffron to-saffron-light text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-saffron/20 active:scale-95 transition-all mt-3"
          >
            {checkingEligibility ? (
              <span>Evaluating MoTA Scheme Norms...</span>
            ) : (
              <>
                <Search className="w-4 h-4" /> Check System Eligibility
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* ================= PHASE 2: SYSTEM CHECKS ELIGIBILITY & USER SELECTS SCHEME ================= */}
      {phase === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className={`p-4 rounded-2xl border ${
            darkMode ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-xs mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>System Eligibility Evaluation Complete!</span>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
              Based on your credentials (<strong>{credentials.category} - {credentials.tribe}</strong>, Annual Income: <strong>₹{Number(credentials.income).toLocaleString('en-IN')}</strong>, and <strong>{credentials.institution}</strong>), you qualify for the following scheme(s):
            </p>
          </div>

          <div className="space-y-3">
            {eligibleSchemes.map((item, idx) => (
              <motion.div
                key={item.scheme.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-3xl border shadow-xs transition-all ${
                  darkMode ? 'bg-navy-light/60 border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs"
                      style={{ backgroundColor: item.scheme.color + '25' }}
                    >
                      {item.scheme.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {item.scheme.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-saffron font-semibold">
                        Portal: {item.scheme.portal}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 text-xs font-bold">
                    {item.matchPercent}% Match
                  </span>
                </div>

                <p className={`text-xs leading-relaxed mt-2 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  {item.reason}
                </p>

                <div className={`mt-3 p-2.5 rounded-xl border flex justify-between items-center text-xs ${
                  darkMode ? 'bg-navy/60 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>
                    Estimated Assistance
                  </span>
                  <span className="font-extrabold text-green-600 dark:text-green-400">
                    ₹{item.estAmount.toLocaleString('en-IN')}/year + allowances
                  </span>
                </div>

                <button
                  onClick={() => handleSelectScheme(item)}
                  className="mt-3 w-full h-11 rounded-xl bg-gradient-to-r from-saffron to-saffron-light text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-saffron/20 active:scale-95 transition-all"
                >
                  <span>Click to Select & Apply for this Scheme</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => setPhase(1)}
            className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              darkMode ? 'border-white/10 hover:bg-white/5 text-gray-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Edit Entered Credentials
          </button>
        </motion.div>
      )}

      {/* ================= PHASE 3: UPLOAD DOCUMENTS & PROOFS ================= */}
      {phase === 3 && selectedScheme && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-5 border space-y-4 shadow-xs ${
            darkMode ? 'bg-navy-light/40 border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 pb-2 border-b border-inherit">
            <Upload className="w-5 h-5 text-saffron" />
            <div>
              <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Upload Documents & Proofs
              </h3>
              <p className={`text-[11px] ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Required for: <strong>{selectedScheme.name}</strong>
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-300">
              <CloudDownload className="w-4 h-4" />
              <span>DigiLocker Digital Proofs Ready</span>
            </div>
            <span className="font-bold text-green-500">Auto-Attached ✓</span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(uploadedDocs).map(([key, doc]) => (
              <div
                key={key}
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                  darkMode ? 'bg-navy/60 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-saffron/15 text-saffron flex items-center justify-center font-bold">
                    📄
                  </div>
                  <div>
                    <p className={`font-bold text-xs ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      {doc.name}
                    </p>
                    <p className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      Source: {doc.source}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/15 text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Attached
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setPhase(4);
                runVerification();
              }}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-saffron to-saffron-light text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-saffron/20 active:scale-95 transition-all"
            >
              <span>Submit for Automated System Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ================= PHASE 4: SYSTEM VERIFIES DOCUMENTS & PROOFS ================= */}
      {phase === 4 && selectedScheme && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-5 border space-y-4 shadow-xs ${
            darkMode ? 'bg-navy-light/40 border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-center pb-2 border-b border-inherit">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 ${
              verificationDone
                ? 'bg-green-500/20 text-green-500'
                : 'bg-saffron/20 text-saffron'
            }`}>
              {verificationDone ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <Shield className="w-8 h-8 animate-pulse" />
              )}
            </div>
            <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {verificationDone
                ? 'All Documents & Proofs Verified!'
                : 'System Verifying Documents & Proofs...'}
            </h3>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              {verificationDone
                ? 'Cross-checked with UIDAI, State e-District, and AISHE databases'
                : 'Automated digital verification in progress'}
            </p>
          </div>

          {/* Verification Steps Log */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {verificationProgress.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                  darkMode ? 'bg-navy/70 border-white/10 text-gray-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <span className="text-[11px] leading-tight">{item}</span>
                <span className="font-bold text-green-500 shrink-0 text-[10px] bg-green-500/10 px-2 py-0.5 rounded-full ml-2">
                  VERIFIED ✓
                </span>
              </motion.div>
            ))}
          </div>

          {verificationDone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-2 space-y-3"
            >
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 accent-saffron w-4 h-4 rounded"
                  />
                  <span className={darkMode ? 'text-gray-300' : 'text-slate-700'}>
                    I confirm that I am applying under MoTA norms and not receiving concurrent central scholarships.
                  </span>
                </label>
              </div>

              <button
                onClick={handleEnqueue}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-95 transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>Add to Sanction Queue</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* ================= PHASE 5: ADDED TO QUEUE WAITING TO BE SANCTIONED ================= */}
      {phase === 5 && enqueuedApp && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-3xl p-6 text-center border shadow-xl ${
            darkMode ? 'bg-navy-light/60 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-saffron/20 text-saffron flex items-center justify-center mx-auto mb-3">
            <Clock className="w-9 h-9 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs mb-2">
            <Layers className="w-3.5 h-3.5" />
            In Verification Queue
          </div>

          <h2 className="text-xl font-extrabold">Application Enqueued!</h2>
          <p className={`text-xs mt-1 max-w-xs mx-auto ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
            Your application has successfully passed online proofs verification and is <strong>waiting to be sanctioned</strong> by the Ministry of Tribal Affairs.
          </p>

          <div className={`mt-5 p-4 rounded-2xl border text-left space-y-2.5 ${
            darkMode ? 'bg-navy/70 border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between items-center text-xs">
              <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>Application ID</span>
              <span className="font-mono font-bold text-saffron">{enqueuedApp.id}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>Selected Scheme</span>
              <span className="font-semibold truncate max-w-[180px]">{enqueuedApp.schemeName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>Queue Position</span>
              <span className="font-bold text-blue-500">#{enqueuedApp.queueNumber} (Batch 2026-27)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>Sanction Amount (Est.)</span>
              <span className="font-bold text-green-500">₹{enqueuedApp.amount?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>Current Status</span>
              <span className="font-bold text-amber-500">Waiting for Sanction Order</span>
            </div>
          </div>

          <div className="mt-6 space-y-2.5">
            <button
              onClick={() => navigate(`/application/${enqueuedApp.id}`)}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-saffron to-saffron-light text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-saffron/20 active:scale-95 transition-all"
            >
              <span>Track Application in Live Pipeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className={`w-full h-11 rounded-xl border text-xs font-semibold ${
                darkMode ? 'border-white/10 hover:bg-white/5 text-gray-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              Return to Jago Dashboard
            </button>
          </div>
        </motion.div>
      )}
    </PageTransition>
  );
}
