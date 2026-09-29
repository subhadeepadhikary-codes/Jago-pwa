import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import jagoLogo from '../assets/jago-logo.png';
import {
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  IndianRupee,
  Shield,
  Sparkles,
  ArrowRight,
  Building2,
  CheckCircle2,
  Users,
  KeyRound,
  WifiOff,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import StatusPill from '../components/common/StatusPill';
import QuickActionGrid from '../components/common/QuickActionGrid';
import PageTransition from '../components/layout/PageTransition';
import { offlineService } from '../services/offlineService';

export default function Dashboard({ onChatOpen }) {
  const { user, applications, documents, disbursements, darkMode, t } = useApp();
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(offlineService.isOnline());

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const totalDisbursed = applications.reduce((sum, a) => sum + (a.disbursed || 0), 0);
  const totalSanctioned = applications.reduce((sum, a) => sum + (a.amount || 0), 0);
  const deficiencyApps = applications.filter((a) => a.deficiency);

  return (
    <PageTransition className="pt-2 pb-20 md:pb-8 px-3 sm:px-4 md:px-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Offline Alert Ribbon */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span className="font-semibold">Offline Mode Active: Local Data Preserved</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded-full">
            Auto-Sync Ready
          </span>
        </motion.div>
      )}

      {/* Official App Hero Card with Logo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-3.5 rounded-3xl border relative overflow-hidden transition-all ${
          darkMode
            ? 'bg-gradient-to-br from-navy-light via-navy to-[#0F172A] border-white/10 text-white shadow-lg'
            : 'bg-gradient-to-br from-indigo-50/60 via-white to-emerald-50/60 border-slate-200/90 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <img
            src={jagoLogo}
            alt="JAGO Logo"
            className="w-14 h-14 rounded-2xl object-contain bg-white p-1 border border-slate-200/80 dark:border-white/15 shadow-md shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/15 px-2 py-0.5 rounded-md">
                MoTA Mobile App • v2.2
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight leading-none text-slate-900 dark:text-white">
              JAGO
            </h1>
            <p className={`text-[11px] font-semibold mt-0.5 leading-tight ${darkMode ? 'text-teal-300/90' : 'text-teal-800'}`}>
              One Student. One View. Zero Repetition.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Interactive Applicant Identity Card (Click to open Profile) */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/profile')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer group active:scale-[0.99] ${
            darkMode
              ? 'bg-gradient-to-br from-navy-light/80 to-navy-card/80 border-white/10 hover:border-saffron/40 hover:shadow-lg'
              : 'bg-white border-slate-200/80 shadow-xs hover:border-saffron/40 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-saffron/15 text-saffron font-mono">
                  ST • {user.subCategory || 'Applicant'}
                </span>
                <span className="text-[11px] font-bold text-green-700 dark:text-green-300 bg-green-500/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {t('verified')}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white truncate group-hover:text-saffron transition-colors">
                  {user.name}
                </h2>
                <span className="text-[11px] font-bold text-saffron opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </div>
              <p className={`text-xs mt-0.5 flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                <Building2 className="w-3.5 h-3.5" />
                {user.currentEducation?.institution ? `${user.currentEducation.institution} (${user.currentEducation.year || '3rd Year'})` : 'IIT Kharagpur (U-0584)'}
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-saffron to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-saffron/20 shrink-0 group-hover:scale-105 transition-transform">
              {(user.name || 'S').charAt(0).toUpperCase()}
            </div>
          </div>
        </motion.div>
      )}

      {/* 4-Card Responsive Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`rounded-2xl p-4 border transition-all ${
            darkMode
              ? 'bg-gradient-to-br from-green-500/15 to-green-600/5 border-green-500/30'
              : 'bg-gradient-to-br from-emerald-50 to-green-50/50 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center">
              <IndianRupee className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-[11px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
              {t('disbursed')}
            </span>
          </div>
          <p className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            ₹{totalDisbursed.toLocaleString('en-IN')}
          </p>
          <p className={`text-[10px] mt-0.5 flex items-center gap-1 ${darkMode ? 'text-green-400/80' : 'text-green-700'}`}>
            <CheckCircle2 className="w-3 h-3" />
            {t('creditedToSbi')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-4 border transition-all ${
            darkMode
              ? 'bg-gradient-to-br from-saffron/15 to-saffron/5 border-saffron/30'
              : 'bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-saffron/20 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-saffron" />
            </div>
            <span className="text-[11px] font-bold text-saffron uppercase tracking-wider">
              {t('sanctioned')}
            </span>
          </div>
          <p className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            ₹{totalSanctioned.toLocaleString('en-IN')}
          </p>
          <p className={`text-[10px] mt-0.5 ${darkMode ? 'text-saffron/80' : 'text-amber-800'}`}>
            {t('underReview')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`rounded-2xl p-4 border transition-all ${
            darkMode
              ? 'bg-gradient-to-br from-blue-500/15 to-blue-600/5 border-blue-500/30'
              : 'bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FileCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Applications
            </span>
          </div>
          <p className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {applications.length} Active
          </p>
          <p className={`text-[10px] mt-0.5 ${darkMode ? 'text-blue-400/80' : 'text-blue-700'}`}>
            Real-Time Cloud Synced
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-4 border transition-all ${
            darkMode
              ? 'bg-gradient-to-br from-purple-500/15 to-purple-600/5 border-purple-500/30'
              : 'bg-gradient-to-br from-purple-50 to-pink-50/50 border-purple-200'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Security Vault
            </span>
          </div>
          <p className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            AES-256-GCM
          </p>
          <p className={`text-[10px] mt-0.5 ${darkMode ? 'text-purple-400/80' : 'text-purple-700'}`}>
            Zero-Knowledge Active
          </p>
        </motion.div>
      </div>

      {/* Widescreen 2-Column Split: Workflow on Left (7 cols), Insights & Actions on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Deficiency Alerts, My Applications, DBT History */}
        <div className="lg:col-span-7 space-y-6">
          {/* Deficiency Action Notice Alert (If Any) */}
          {deficiencyApps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-3.5 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-xs">Action Required • Deficiency Notice</p>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400">
                    {typeof deficiencyApps[0].deficiency === 'object'
                      ? (deficiencyApps[0].deficiency.message || deficiencyApps[0].deficiency.type || 'Document deficiency requires resolution.')
                      : String(deficiencyApps[0].deficiency || 'Document deficiency requires resolution.')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/documents')}
                className="px-2.5 py-1.5 rounded-lg bg-red-500 text-white font-bold text-[10px] hover:bg-red-600 active:scale-95 transition-all shrink-0"
              >
                Fix via Wallet →
              </button>
            </motion.div>
          )}

          {/* My Applications Section */}
          <div className={`p-4 md:p-5 rounded-3xl border transition-all ${
            darkMode ? 'bg-navy-card border-white/10' : 'bg-white border-slate-200/90 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className={`font-bold text-xs uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                {t('myApplications')} ({applications.length})
              </h3>
              <button
                onClick={() => navigate('/tracker')}
                className="text-[11px] text-saffron font-bold hover:underline flex items-center gap-0.5"
              >
                <span>{t('viewTimeline')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {applications.length === 0 ? (
              <div className={`p-6 rounded-2xl border text-center ${
                darkMode ? 'bg-navy-light/40 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className="text-xs text-slate-400 mb-2">{t('noApps')}</p>
                <button
                  onClick={() => navigate('/explore')}
                  className="px-4 py-2 rounded-xl bg-saffron text-slate-950 font-bold text-xs"
                >
                  {t('exploreApply')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <motion.div
                    key={app.id}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => navigate(`/application/${app.id}`)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      darkMode
                        ? 'bg-navy-light/60 border-white/10 hover:border-saffron/40'
                        : 'bg-white border-slate-200 hover:border-saffron/40 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                          {app.id}
                        </span>
                        <h4 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white truncate">
                          {app.schemeName}
                        </h4>
                      </div>
                      <StatusPill status={app.status} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-inherit">
                      <span className="text-slate-500 dark:text-gray-400">
                        {t('appliedOn')}: {app.appliedDate}
                      </span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        ₹{(app.amount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Direct Benefit Transfer (DBT) History Chart */}
          {disbursements && disbursements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-3xl border ${
                darkMode ? 'bg-navy-card border-white/10' : 'bg-white border-slate-200/90 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t('dbtHistory')}
                  </h3>
                  <p className="text-[10px] text-slate-400">National direct credit trend to Aadhaar-seeded accounts</p>
                </div>
                <span className="text-[10px] text-saffron font-bold bg-saffron/10 px-2.5 py-1 rounded-full">Annual Trends (Cr)</span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={disbursements}>
                    <defs>
                      <linearGradient id="dbtGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#FF7A00" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#0B132B' : '#FFFFFF',
                        borderColor: '#E2E8F0',
                        borderRadius: '12px',
                        fontSize: '11px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#FF7A00"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#dbtGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column (5 cols): Quick Services, Family Hub, Consent, National Impact */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Services Section (Functional v1.4 3x2 Grid) */}
          <div className={`p-4 md:p-5 rounded-3xl border ${
            darkMode ? 'bg-navy-card border-white/10' : 'bg-white border-slate-200/90 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className={`font-bold text-xs uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                {t('quickServices')}
              </h3>
              <button
                onClick={() => navigate('/explore')}
                className="text-[11px] text-saffron font-bold hover:underline"
              >
                {t('viewAllSchemes')}
              </button>
            </div>
            <QuickActionGrid onChatOpen={onChatOpen} />
          </div>

          {/* Unified MoTA Intelligence Quick Links: Family Hub & Consent Fabric */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/family')}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] ${
                darkMode
                  ? 'bg-navy-card border-white/10 text-white hover:border-saffron/40'
                  : 'bg-white border-slate-200 text-slate-900 shadow-xs hover:border-saffron/40'
              }`}
            >
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-500 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate">Family Hub</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                  Multi-Child View
                </span>
              </div>
            </button>

            <button
              onClick={() => navigate('/consent')}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] ${
                darkMode
                  ? 'bg-navy-card border-white/10 text-white hover:border-saffron/40'
                  : 'bg-white border-slate-200 text-slate-900 shadow-xs hover:border-saffron/40'
              }`}
            >
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500 shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate">Consent Fabric</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                  DigiLocker & APAAR
                </span>
              </div>
            </button>
          </div>

          {/* MoTA National Impact Snapshot */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-3xl border ${
              darkMode ? 'bg-navy-card border-white/10' : 'bg-white border-slate-200/90 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-saffron" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  {t('nationalImpact')}
                </h3>
              </div>
              <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">
                Official Data
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-center mb-3">
              <div className={`p-3 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                <span className="text-lg font-black text-saffron block">₹2,598 Cr</span>
                <span className="text-[10px] text-slate-400 font-medium">Funds Disbursed via DBT</span>
              </div>
              <div className={`p-3 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                <span className="text-lg font-black text-green-500 block">15.75 Lakh</span>
                <span className="text-[10px] text-slate-400 font-medium">ST Students Benefited</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              Ground intelligence powered by Ministry of Tribal Affairs (tribal.nic.in)
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
