import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ministryAnalyticsService } from '../../services/ministryAnalyticsService';
import { motion } from 'framer-motion';
import {
  Radar,
  ArrowLeft,
  Users,
  Building2,
  TrendingUp,
  Download,
  Filter,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function OfficerCoverageRadar() {
  const { darkMode } = useApp();
  const navigate = useNavigate();

  const data = ministryAnalyticsService.getCoverageGapRadarData();
  const totalGap = data.reduce((sum, d) => sum + d.potentialCoverageGap, 0);

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
          <div className="text-center">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Coverage Gap Radar
            </h2>
            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold leading-none">
              Proactive Outreach
            </p>
          </div>
          <div className="w-8" />
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Banner summary */}
        <div
          className={`p-4 rounded-3xl border transition-all ${
            darkMode ? 'bg-navy-light/70 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-500 flex items-center justify-center font-bold">
              <Radar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                MoTA Proactive Intelligence
              </span>
              <h3 className="font-bold text-base leading-tight">
                {totalGap.toLocaleString('en-IN')} Potential Coverage Gaps Identified
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
            Reconciles educational enrollment records (AISHE/UDISE+) against scholarship disbursement registries to highlight unreached eligible ST students before deadlines lapse.
          </p>
        </div>

        {/* District Radar List */}
        <div className="space-y-3">
          {data.map((item, i) => (
            <motion.div
              key={item.district}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-2xl border transition-all ${
                darkMode ? 'bg-navy-light/50 border-white/10' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.district} District
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">({item.state})</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">
                    Primary: {item.primaryTribes.join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    {item.potentialCoverageGap.toLocaleString('en-IN')} Unreached
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-slate-500 dark:text-gray-400">
                    Beneficiaries: {item.scholarshipBeneficiaries.toLocaleString('en-IN')} / {item.identifiedStEnrolled.toLocaleString('en-IN')}
                  </span>
                  <span className="text-teal-600 dark:text-teal-400 font-bold">{item.coveragePercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
                    style={{ width: `${item.coveragePercentage}%` }}
                  />
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-gray-300">
                  <strong className="text-slate-900 dark:text-white">Action: </strong>
                  {item.recommendedAction}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
