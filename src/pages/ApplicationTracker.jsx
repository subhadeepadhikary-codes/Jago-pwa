import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import StatusPill from '../components/common/StatusPill';
import StepperTimeline from '../components/common/StepperTimeline';
import PageTransition from '../components/layout/PageTransition';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  AlertTriangle,
  FilePlus,
  ArrowRight,
  FileText,
  Building2,
  Calendar,
  IndianRupee,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  HelpCircle,
  Clock,
  Sparkles,
  Users,
  Compass
} from 'lucide-react';
import { rulesEngine } from '../services/rulesEngine';

export default function ApplicationTracker() {
  const { applications, darkMode, user } = useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  // Helper to ensure 6 unified stages
  const getUnifiedStages = (app) => {
    return [
      { id: 1, name: '1. Registration & Aadhaar e-KYC', status: 'completed', date: app.appliedDate || '01 Jul 2026' },
      { id: 2, name: '2. Institute AISHE Authentication (U-0584)', status: app.currentStage > 2 ? 'completed' : app.currentStage === 2 ? (app.deficiency ? 'deficiency' : 'current') : 'pending', date: '18 Sep 2026' },
      { id: 3, name: '3. District Welfare Officer (DWO) Review', status: app.currentStage > 3 ? 'completed' : app.currentStage === 3 ? 'current' : 'pending', date: app.currentStage >= 3 ? '22 Sep 2026' : null },
      { id: 4, name: '4. State Tribal Welfare Department', status: app.currentStage > 4 ? 'completed' : app.currentStage === 4 ? 'current' : 'pending', date: app.currentStage >= 4 ? 'Pending' : null },
      { id: 5, name: '5. Central MoTA Sanction Order', status: app.currentStage > 5 ? 'completed' : app.currentStage === 5 ? 'current' : 'pending', date: app.currentStage >= 5 ? 'Pending' : null },
      { id: 6, name: '6. PFMS Direct Benefit Transfer (DBT)', status: app.currentStage === 6 || app.status === 'disbursed' ? 'completed' : 'pending', date: app.status === 'disbursed' ? 'Credited' : 'Pending Sanction' },
    ];
  };

  // Detail view if ID is in params
  if (id) {
    const app = applications.find((a) => a.id === id) || applications[0];
    const unifiedStages = getUnifiedStages(app);
    const eligibilityEval = rulesEngine.evaluateEligibility(app.schemeId || 'nfst', user, {
      incomeVerificationPending: !!app.deficiency,
    });

    return (
      <PageTransition className="pt-2 pb-20 md:pb-8 px-4 md:px-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Card */}
        <div className={`rounded-3xl p-5 border shadow-sm ${
          darkMode ? 'bg-navy-light/60 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron">
                Unified Scholarship Command Center
              </span>
              <h2 className="text-base font-bold">{app.schemeName}</h2>
              <p className={`text-xs font-mono mt-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                {app.id} • AY {app.academicYear}
              </p>
            </div>
            <StatusPill status={app.status} size="md" />
          </div>

          <div className={`grid grid-cols-3 gap-2 pt-3 border-t border-inherit text-xs ${
            darkMode ? 'bg-navy/40 p-2.5 rounded-xl' : 'bg-slate-50 p-2.5 rounded-xl'
          }`}>
            <div>
              <p className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Applied On</p>
              <p className="font-semibold text-[11px]">{app.appliedDate}</p>
            </div>
            {app.amount && (
              <div>
                <p className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Sanction Est.</p>
                <p className="font-bold text-[11px] text-green-500">₹{app.amount.toLocaleString('en-IN')}</p>
              </div>
            )}
            <div>
              <p className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>DBT Disbursed</p>
              <p className="font-bold text-[11px] text-emerald-500">₹{app.disbursed.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* FEATURE: Mismatch ≠ Rejection Notice */}
        {app.deficiency && (
          <div className="rounded-2xl p-4 border bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 space-y-2">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Mismatch ≠ Rejection Guarantee
                  </h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                    Exception Queue
                  </span>
                </div>
                <p className="text-xs font-semibold mt-1">
                  Your application has NOT been rejected.
                </p>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {typeof app.deficiency === 'object' ? (app.deficiency.message || app.deficiency.type || 'Document deficiency requires resolution.') : String(app.deficiency || 'Document deficiency requires resolution.')}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => navigate('/documents')}
                className="px-3 py-1.5 rounded-xl bg-saffron hover:bg-saffron-dark text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Upload in Document Wallet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate('/consent')}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition-all"
              >
                Sync e-District
              </button>
            </div>
          </div>
        )}

        {/* FEATURE: 6-Stage Timeline */}
        <div className={`rounded-3xl p-5 border ${
          darkMode ? 'bg-navy-light/40 border-white/10' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold text-xs uppercase tracking-wider ${
              darkMode ? 'text-gray-300' : 'text-slate-700'
            }`}>
              Unified 6-Stage Verification Pipeline
            </h3>
            <span className="text-[10px] text-saffron font-bold">NSP / SFMP / NOS</span>
          </div>
          <StepperTimeline stages={unifiedStages} />
        </div>

        {/* FEATURE: Deterministic Eligibility Criteria Checklist (Explainable Engine) */}
        <div className={`rounded-3xl p-5 border space-y-3 ${
          darkMode ? 'bg-navy-light/40 border-white/10' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-bold text-xs uppercase tracking-wider ${
              darkMode ? 'text-gray-300' : 'text-slate-700'
            }`}>
              Explainable Eligibility Checklist
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {eligibilityEval.passedCount} / {eligibilityEval.totalCount} Passed
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {eligibilityEval.checks.map((chk) => (
              <div
                key={chk.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5"
              >
                {chk.status === 'PASSED' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                ) : chk.status === 'PENDING' ? (
                  <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{chk.label}</span>
                    <span className="text-[9px] font-mono text-slate-400">[{chk.source}]</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{chk.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURE: PFMS & DBT Payment Intelligence */}
        <div className={`rounded-3xl p-5 border space-y-3 ${
          darkMode ? 'bg-navy-light/40 border-white/10' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-saffron" />
            <h3 className={`font-bold text-xs uppercase tracking-wider ${
              darkMode ? 'text-gray-300' : 'text-slate-700'
            }`}>
              PFMS Disbursement & Fellowship Intelligence
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[10px] text-slate-400 block font-semibold">Aadhaar-Linked Bank</span>
              <span className="font-bold text-slate-900 dark:text-white">State Bank of India</span>
              <span className="text-[10px] text-slate-500 block font-mono">A/C: ••••••••4821</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[10px] text-slate-400 block font-semibold">NPCI DBT Status</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Active & Seeded
              </span>
              <span className="text-[10px] text-slate-500 block">Direct Account Credit</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[10px] text-slate-400 block font-semibold">PFMS Batch / UTR</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {app.status === 'disbursed' ? 'UTR-JH-99214' : 'Batch Scheduled'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[10px] text-slate-400 block font-semibold">Concurrent Duplication</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Zero Conflict</span>
              <span className="text-[10px] text-slate-500 block">No duplicate stipend</span>
            </div>
          </div>
        </div>

        {/* Back navigation button */}
        <button
          onClick={() => navigate('/tracker')}
          className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all"
        >
          ← Back to All Applications
        </button>
      </PageTransition>
    );
  }

  // List view
  return (
    <PageTransition className="pt-2 pb-20 md:pb-8 px-4 md:px-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-saffron">
            Unified Portfolio
          </span>
          <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            My Scholarship Tracker
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate('/family')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-saffron transition-all"
            title="Family Hub"
          >
            <Users className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/apply')}
            className="px-3 py-1.5 rounded-xl bg-saffron hover:bg-saffron-dark text-slate-950 text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Apply New</span>
          </button>
        </div>
      </div>

      {/* Applications list */}
      <div className="space-y-3">
        {applications.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => navigate(`/application/${app.id}`)}
            className={`rounded-2xl p-4 cursor-pointer border transition-all active:scale-[0.98] ${
              darkMode
                ? 'bg-navy-light/60 border-white/10 hover:border-saffron/40'
                : 'bg-white border-slate-200/90 shadow-xs hover:border-saffron/40 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {app.schemeName}
                </h4>
                <p className={`text-xs mt-0.5 font-mono ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  {app.id} • AY {app.academicYear}
                </p>
              </div>
              <StatusPill status={app.status} />
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[11px] mb-1.5 font-medium">
                <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>
                  Stage {app.currentStage} of 6: {app.stages[app.currentStage - 1]?.name || 'Verification'}
                </span>
                <span className="text-saffron font-bold">
                  {Math.round((app.currentStage / 6) * 100)}%
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-slate-100'}`}>
                <div
                  className="h-full bg-gradient-to-r from-saffron to-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${(app.currentStage / 6) * 100}%` }}
                />
              </div>
            </div>

            {app.deficiency && (
              <div className="mt-2.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Exception Review: Income verification notice (Mismatch ≠ Rejection)</span>
              </div>
            )}

            <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-inherit text-xs">
              <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>
                Applied on {app.appliedDate}
              </span>
              <span className="text-saffron font-bold flex items-center gap-1">
                Track Live <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Discover more schemes CTA */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-saffron/10 via-amber-500/10 to-orange-500/10 border border-saffron/20 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Looking for another grant?</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Run the Explainable Eligibility Engine</p>
        </div>
        <button
          onClick={() => navigate('/find-scholarship')}
          className="px-3 py-1.5 rounded-xl bg-saffron text-slate-950 font-bold text-xs flex items-center gap-1"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Find Schemes</span>
        </button>
      </div>
    </PageTransition>
  );
}
