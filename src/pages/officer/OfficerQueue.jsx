import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck2,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  Building2,
  Calendar,
  Send,
  RefreshCw,
} from 'lucide-react';

export default function OfficerQueue() {
  const { currentOfficer } = useAuth();
  const { darkMode } = useApp();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [successToast, setSuccessToast] = useState(null);

  useEffect(() => {
    if (!currentOfficer) {
      navigate('/officer/login');
      return;
    }
    const list = apiService.getApplicationsForOfficer(currentOfficer);
    setApplications(list);
  }, [currentOfficer, navigate]);

  const handleVerify = (decision) => {
    if (!selectedApp) return;
    const res = apiService.verifyApplicationStage(selectedApp.id, currentOfficer, decision, remarks);
    if (res.success) {
      setSuccessToast(
        decision === 'APPROVE'
          ? `Stage approved for ${selectedApp.schemeName}. Application forwarded!`
          : `Clarification request dispatched to ${selectedApp.applicantId}.`
      );
      setSelectedApp(null);
      setRemarks('');
      setApplications(apiService.getApplicationsForOfficer(currentOfficer));
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  return (
    <div
      className={`min-h-screen pb-16 transition-colors ${
        darkMode ? 'bg-navy text-white' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Top Bar */}
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
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">
            Verification Queue ({applications.length})
          </h2>
          <div className="w-8" />
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-md mx-auto px-4 pt-4 space-y-3">
        {successToast && (
          <div className="p-3 rounded-2xl bg-green-500/15 border border-green-500/30 text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        <div className="space-y-3">
          {applications.map((app) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedApp(app)}
              className={`p-4 rounded-2xl border cursor-pointer active:scale-98 transition-all ${
                darkMode
                  ? 'bg-navy-light/60 border-white/10 hover:border-saffron/40'
                  : 'bg-white border-slate-200 hover:border-saffron/40 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-500">
                      Stage {app.currentStage || 1} • {app.academicYear}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-white/10 font-mono text-slate-700 dark:text-gray-300">
                      {app.id}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                    {app.schemeName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                    Applicant: <span className="font-semibold text-slate-700 dark:text-gray-200">{app.applicantId}</span>
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-2" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected Application Verification Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6 bg-white dark:bg-navy-light border border-slate-200 dark:border-white/10 shadow-2xl text-slate-900 dark:text-white relative"
            >
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <FileCheck2 className="w-5 h-5 text-saffron" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  Stage Verification Review
                </h3>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 mb-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Scheme</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedApp.schemeName}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Application ID</span>
                    <p className="font-mono font-bold">{selectedApp.id}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Current Stage</span>
                    <p className="font-bold text-blue-500">Stage {selectedApp.currentStage} of 5</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <label className="block text-xs font-bold text-slate-800 dark:text-gray-200">
                  Officer Remarks / Justification
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter official verification remarks..."
                  className="w-full p-3 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-saffron resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleVerify('RETURN_FOR_CORRECTION')}
                  className="py-3 px-3 rounded-xl border-2 border-amber-500/40 text-amber-600 dark:text-amber-400 font-bold text-xs hover:bg-amber-500/10 active:scale-95 transition-all"
                >
                  Request Clarification
                </button>
                <button
                  onClick={() => handleVerify('APPROVE')}
                  className="py-3 px-3 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-white font-bold text-xs shadow-md shadow-saffron/25 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Stage</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
