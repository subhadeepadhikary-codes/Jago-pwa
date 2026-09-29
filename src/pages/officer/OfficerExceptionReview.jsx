import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { exceptionQueueService } from '../../services/exceptionQueueService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  X,
  FileText,
  User,
  ShieldAlert,
  Send,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function OfficerExceptionReview() {
  const { currentOfficer } = useAuth();
  const { darkMode } = useApp();
  const navigate = useNavigate();

  const [exceptions, setExceptions] = useState([]);
  const [selectedException, setSelectedException] = useState(null);
  const [officialNotes, setOfficialNotes] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (!currentOfficer) {
      navigate('/officer/login');
      return;
    }
    loadExceptions();
  }, [currentOfficer, navigate]);

  const loadExceptions = () => {
    const list = exceptionQueueService.getExceptionsForOfficer(
      currentOfficer.role,
      currentOfficer.jurisdictionCode
    );
    setExceptions(list);
  };

  const handleResolve = (resolution) => {
    if (!selectedException) return;
    const res = exceptionQueueService.resolveException(
      selectedException.id,
      resolution,
      officialNotes || (resolution === 'APPROVE' ? 'Verified with authentic collateral records. Approved.' : 'Clarification requested.'),
      currentOfficer.name
    );

    if (res.success) {
      setToastMessage(
        resolution === 'APPROVE'
          ? `Exception ${selectedException.id} resolved & approved! Application progresses.`
          : `Correction request sent to applicant.`
      );
      setSelectedException(null);
      setOfficialNotes('');
      loadExceptions();
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <div
      className={`min-h-screen pb-16 transition-colors ${
        darkMode ? 'bg-navy text-white' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Header */}
      <header
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          darkMode ? 'bg-navy/95 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="max-w-md mx-auto flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate('/officer/dashboard')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-gray-300 hover:text-saffron"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <div className="text-center">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Exception Queue
            </h2>
            <p className="text-[10px] text-amber-500 font-bold leading-none">
              Mismatch ≠ Rejection
            </p>
          </div>
          <div className="w-8" />
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-md mx-auto px-4 pt-4 space-y-3">
        {toastMessage && (
          <div className="p-3 rounded-2xl bg-green-500/15 border border-green-500/30 text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs">
          <p className="font-bold mb-0.5">Core MoTA Directive: Mismatch ≠ Rejection</p>
          <p className="text-[11px] opacity-90 leading-relaxed">
            Data discrepancies must be flagged and routed for human administrative review rather than disqualifying tribal students automatically.
          </p>
        </div>

        <div className="space-y-3">
          {exceptions.map((ex) => {
            const isResolved = ex.status === 'RESOLVED_APPROVED';
            return (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedException(ex)}
                className={`p-4 rounded-2xl border cursor-pointer active:scale-98 transition-all ${
                  isResolved
                    ? 'border-green-500/30 bg-green-500/5'
                    : darkMode
                    ? 'bg-navy-light/60 border-amber-500/30 hover:border-amber-500'
                    : 'bg-white border-amber-200 hover:border-amber-400 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        {ex.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        isResolved
                          ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      }`}>
                        {isResolved ? 'Resolved & Passed' : 'Pending Officer Review'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                      {ex.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                      Applicant: <span className="font-semibold text-slate-700 dark:text-gray-200">{ex.applicantName}</span> ({ex.applicantId})
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-2" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Exception Resolution Diff Modal */}
      <AnimatePresence>
        {selectedException && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6 bg-white dark:bg-navy-light border border-slate-200 dark:border-white/10 shadow-2xl text-slate-900 dark:text-white relative"
            >
              <button
                onClick={() => setSelectedException(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  Exception Evidence Diff Viewer
                </h3>
              </div>

              <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">
                Review the side-by-side discrepancy between submitted data and government integration responses.
              </p>

              {/* Side-by-Side Diff Box */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {selectedException.sourceA.name}
                  </span>
                  <p className="font-bold text-xs text-slate-900 dark:text-white">
                    {selectedException.sourceA.value}
                  </p>
                  {selectedException.sourceA.identifier && (
                    <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                      {selectedException.sourceA.identifier}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
                    {selectedException.sourceB.name}
                  </span>
                  <p className="font-bold text-xs text-amber-700 dark:text-amber-300">
                    {selectedException.sourceB.value}
                  </p>
                  {selectedException.sourceB.identifier && (
                    <span className="text-[9px] font-mono text-amber-600/70 block mt-0.5">
                      {selectedException.sourceB.identifier}
                    </span>
                  )}
                </div>
              </div>

              {/* Discrepancy Explanation */}
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-gray-300 mb-4">
                <span className="font-bold text-[10px] text-slate-400 uppercase block mb-0.5">
                  System Diagnosis
                </span>
                <p className="leading-relaxed">{selectedException.discrepancyDetails}</p>
              </div>

              {/* Official Review Justification */}
              {selectedException.status === 'PENDING_OFFICER_REVIEW' && (
                <>
                  <div className="space-y-1.5 mb-4">
                    <label className="block text-xs font-bold text-slate-800 dark:text-gray-200">
                      Officer Justification Note
                    </label>
                    <textarea
                      rows={2}
                      value={officialNotes}
                      onChange={(e) => setOfficialNotes(e.target.value)}
                      placeholder="e.g., Phonetic spelling verified with voter list; father name matches. Exception approved."
                      className="w-full p-2.5 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-saffron resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => handleResolve('CORRECTION_REQUEST')}
                      className="py-3 px-3 rounded-xl border-2 border-amber-500/40 text-amber-600 dark:text-amber-400 font-bold text-xs hover:bg-amber-500/10 active:scale-95 transition-all"
                    >
                      Request Correction
                    </button>
                    <button
                      onClick={() => handleResolve('APPROVE')}
                      className="py-3 px-3 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-white font-bold text-xs shadow-md shadow-saffron/25 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Exception</span>
                    </button>
                  </div>
                </>
              )}

              {selectedException.status === 'RESOLVED_APPROVED' && (
                <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-700 dark:text-green-300 text-xs">
                  <span className="font-bold">Official Resolution:</span>
                  <p className="mt-0.5">{selectedException.officerNotes}</p>
                  <p className="text-[10px] text-green-600 dark:text-green-400 mt-1">
                    Resolved by {selectedException.resolvedBy} on {new Date(selectedException.resolvedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
