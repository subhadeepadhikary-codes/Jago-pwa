import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/layout/PageTransition';
import { motion } from 'framer-motion';
import {
  Calendar,
  FileText,
  CheckCircle2,
  IndianRupee,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Shield,
  HelpCircle,
  Download
} from 'lucide-react';

export default function ScholarshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { schemes, darkMode } = useApp();
  const scheme = schemes.find((s) => s.id === id) || schemes[0];

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(scheme.deadline) - new Date()) / (1000 * 60 * 60 * 24))
  );

  return (
    <PageTransition className="pt-2 pb-20 px-4">
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-4 rounded-3xl p-5 border shadow-sm ${
          darkMode
            ? 'bg-navy-light/60 border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-13 h-13 rounded-2xl flex items-center justify-center text-2xl shadow-xs"
            style={{ backgroundColor: scheme.color + '25' }}
          >
            {scheme.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold">{scheme.name}</h2>
            </div>
            <p className="text-xs text-saffron font-semibold mt-0.5">
              Administering Portal: {scheme.portal}
            </p>
          </div>
        </div>

        <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
          {scheme.description}
        </p>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-inherit">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-saffron" />
            <span className="text-xs font-bold text-saffron">
              {daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline passed'}
            </span>
          </div>
          <div className={`flex items-center gap-1.5 text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            <BookOpen className="w-4 h-4" />
            <span>Academic Year {scheme.academicYear}</span>
          </div>
        </div>
      </motion.div>

      {/* Benefits Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mt-4"
      >
        <h3 className={`font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
          darkMode ? 'text-gray-300' : 'text-slate-700'
        }`}>
          <IndianRupee className="w-4 h-4 text-green-500" />
          Scholarship Financial Assistance & Allowances
        </h3>
        <div className={`rounded-2xl p-4 border space-y-2.5 ${
          darkMode ? 'bg-navy-light/40 border-white/10' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {Object.entries(scheme.benefits).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center text-xs pb-1.5 border-b border-inherit last:border-b-0 last:pb-0">
              <span className={`capitalize ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="font-bold text-green-600 dark:text-green-400">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Eligibility Criteria */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="mt-4"
      >
        <h3 className={`font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
          darkMode ? 'text-gray-300' : 'text-slate-700'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-blue-500" />
          Mandatory Eligibility Norms
        </h3>
        <div className="space-y-2">
          {scheme.eligibility.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 rounded-xl p-3 border text-xs leading-relaxed ${
                darkMode ? 'bg-navy-light/30 border-white/10 text-gray-300' : 'bg-white border-slate-200 text-slate-700 shadow-xs'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                {i + 1}
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Documents Required */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="mt-4"
      >
        <h3 className={`font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
          darkMode ? 'text-gray-300' : 'text-slate-700'
        }`}>
          <FileText className="w-4 h-4 text-purple-500" />
          Documents Required (Available in Wallet)
        </h3>
        <div className={`rounded-2xl p-4 border ${
          darkMode ? 'bg-navy-light/40 border-white/10' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex flex-wrap gap-1.5">
            {scheme.documentsRequired.map((doc, i) => (
              <span
                key={i}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  darkMode
                    ? 'bg-navy/60 border-white/10 text-gray-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {doc}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Official Guidelines & Circular Links from tribal.nic.in */}
      <div className="mt-4">
        <h3 className={`font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
          darkMode ? 'text-gray-300' : 'text-slate-700'
        }`}>
          <HelpCircle className="w-4 h-4 text-saffron" />
          Official MoTA Guidelines & Notifications
        </h3>
        <div className={`rounded-2xl p-3.5 border space-y-2 text-xs ${
          darkMode ? 'bg-navy-light/40 border-white/10' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <a
            href="https://tribal.nic.in/ScholarshiP.aspx"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-2 rounded-xl bg-saffron/10 text-saffron font-bold hover:bg-saffron/20 transition-colors"
          >
            <span>Official Portal on tribal.nic.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://dbttribal.gov.in/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-500/20 transition-colors"
          >
            <span>MoTA DBT Portal (dbttribal.gov.in)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* APPLY NOW CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="mt-6"
      >
        <button
          onClick={() => navigate(`/apply/${scheme.id}`)}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-saffron to-saffron-light text-white font-bold text-base flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg shadow-saffron/25"
        >
          <span>Apply for this Scholarship</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </PageTransition>
  );
}
