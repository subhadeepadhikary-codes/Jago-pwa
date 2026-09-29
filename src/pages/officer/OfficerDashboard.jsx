import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { exceptionQueueService } from '../../services/exceptionQueueService';
import { ministryAnalyticsService } from '../../services/ministryAnalyticsService';
import { motion } from 'framer-motion';
import {
  Building2,
  Shield,
  FileCheck2,
  AlertTriangle,
  Users,
  TrendingUp,
  ArrowRight,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Radar,
  IndianRupee,
  Layers,
  ArrowLeft,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function OfficerDashboard() {
  const { currentOfficer, officerLogout } = useAuth();
  const { darkMode } = useApp();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [pipeline, setPipeline] = useState(null);

  useEffect(() => {
    if (!currentOfficer) {
      navigate('/officer/login');
      return;
    }
    const apps = apiService.getApplicationsForOfficer(currentOfficer);
    setApplications(apps);
    const exList = exceptionQueueService.getExceptionsForOfficer(
      currentOfficer.role,
      currentOfficer.jurisdictionCode
    );
    setExceptions(exList);
    setPipeline(ministryAnalyticsService.getPipelineOverview());
  }, [currentOfficer, navigate]);

  const handleLogout = () => {
    officerLogout();
    navigate('/officer/login');
  };

  if (!currentOfficer) return null;

  const pendingApps = applications.filter((a) => a.status !== 'sanctioned' && a.status !== 'disbursed');
  const pendingExceptions = exceptions.filter((e) => e.status === 'PENDING_OFFICER_REVIEW');

  return (
    <div
      className={`min-h-screen pb-16 transition-colors ${
        darkMode ? 'bg-navy text-white' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Officer Header */}
      <header
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          darkMode ? 'bg-navy/95 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="max-w-md mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-xs leading-none text-slate-900 dark:text-white">
                Officer Console
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium leading-none mt-0.5">
                {currentOfficer.jurisdictionName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              title="Switch to Student Portal"
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:text-saffron"
            >
              Student View
            </button>
            <button
              onClick={handleLogout}
              title="Logout from Officer Console"
              className="w-8 h-8 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-gray-300 hover:text-red-500"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Officer Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-3xl border shadow-sm ${
            darkMode
              ? 'bg-navy-light/70 border-white/10 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  {currentOfficer.role.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/15 text-green-600 dark:text-green-400 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Authorized Jurisdiction
                </span>
              </div>
              <h1 className="text-lg font-bold">{currentOfficer.name}</h1>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                {currentOfficer.designation} • {currentOfficer.department}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scoped Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              darkMode ? 'bg-navy-light/40 border-white/10' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <FileCheck2 className="w-4 h-4 text-blue-500" />
              <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400">
                Pending Verification
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {pendingApps.length}
            </p>
            <p className="text-[10px] text-blue-500 font-semibold mt-0.5">Requires Officer Action</p>
          </div>

          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              darkMode ? 'bg-navy-light/40 border-white/10' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400">
                Exception Queue
              </span>
            </div>
            <p className="text-2xl font-black text-amber-500">
              {pendingExceptions.length}
            </p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
              Mismatch ≠ Rejection
            </p>
          </div>
        </div>

        {/* Quick Workspaces Navigation */}
        <div className="space-y-2.5">
          <h3 className="font-bold text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider px-1">
            Officer Workspaces
          </h3>

          {/* 1. Application Queue */}
          <div
            onClick={() => navigate('/officer/queue')}
            className={`p-4 rounded-2xl border cursor-pointer active:scale-98 transition-all flex items-center justify-between ${
              darkMode
                ? 'bg-navy-light/60 border-white/10 hover:border-saffron/40'
                : 'bg-white border-slate-200 hover:border-saffron/40 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Application Verification Queue
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">
                  Review applicant bonafides, academic credits & stage approvals
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* 2. Exception Queue */}
          <div
            onClick={() => navigate('/officer/exceptions')}
            className={`p-4 rounded-2xl border cursor-pointer active:scale-98 transition-all flex items-center justify-between ${
              darkMode
                ? 'bg-navy-light/60 border-white/10 hover:border-amber-500/40'
                : 'bg-white border-slate-200 hover:border-amber-500/40 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Intelligent Exception Queue
                  </h4>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-500">
                    {pendingExceptions.length} Action
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">
                  Resolve name spelling, income & academic mismatches without rejection
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* 3. Coverage Gap Radar (MoTA / State view) */}
          {(currentOfficer.role === 'MOTA_OFFICER' || currentOfficer.role === 'STATE_OFFICER' || currentOfficer.role === 'ADMIN') && (
            <div
              onClick={() => navigate('/officer/coverage-radar')}
              className={`p-4 rounded-2xl border cursor-pointer active:scale-98 transition-all flex items-center justify-between ${
                darkMode
                  ? 'bg-navy-light/60 border-white/10 hover:border-teal-500/40'
                  : 'bg-white border-slate-200 hover:border-teal-500/40 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-500 flex items-center justify-center font-bold">
                  <Radar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Coverage Gap Radar
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400">
                    Proactive district-level intelligence for unreached eligible ST students
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
