import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building2,
  HelpCircle
} from 'lucide-react';
import { rulesEngine } from '../services/rulesEngine';
import { useAuth } from '../context/AuthContext';

export default function FindScholarship() {
  const navigate = useNavigate();
  const { currentApplicant } = useAuth();

  const [eduLevel, setEduLevel] = useState('Undergraduate (B.Tech/MBBS/B.Sc)');
  const [income, setIncome] = useState(180000);
  const [instType, setInstType] = useState('Premier (IIT / NIT / AIIMS / IIM)');
  const [expandedScheme, setExpandedScheme] = useState(null);

  const applicantMock = {
    name: currentApplicant?.name || 'Sunita Soren',
    category: 'ST',
    annualIncome: income,
    currentEducation: {
      institution: instType.includes('Premier') ? 'IIT Kharagpur' : 'State University',
      course: eduLevel,
    },
  };

  const schemeKeys = ['top-class', 'nfst', 'post-matric', 'nos', 'pre-matric'];

  const results = schemeKeys.map((key) => {
    let context = {};
    if (key === 'top-class' && !instType.includes('Premier')) {
      // Not premier
    }
    return rulesEngine.evaluateEligibility(key, applicantMock, context);
  });

  // Separate into fully eligible and review/conditional
  const eligible = results.filter((r) => r.status === 'PASSED');
  const reviewOrPartial = results.filter((r) => r.status !== 'PASSED');

  const getSchemeDetails = (id) => {
    switch (id) {
      case 'top-class':
        return {
          title: 'Top Class Education for ST Students',
          tagline: 'Full tuition fee + living allowance up to ₹2.45L/year',
          badge: 'Premier Institute Merit',
          applyId: 'top-class-st',
        };
      case 'nfst':
        return {
          title: 'National Fellowship for Higher Education (NFST)',
          tagline: '₹31,000/mo JRF/SRF fellowship for M.Phil & Ph.D. scholars',
          badge: 'Central Research Fellowship',
          applyId: 'nfst-higher-edu',
        };
      case 'post-matric':
        return {
          title: 'Post-Matric Scholarship for ST Students',
          tagline: 'Full maintenance allowance & fee coverage for class 11 to PG',
          badge: 'Universal Higher Education',
          applyId: 'post-matric-st',
        };
      case 'nos':
        return {
          title: 'National Overseas Scholarship (NOS)',
          tagline: 'Full tuition & stipend ($15,400/yr) for prestigious foreign universities',
          badge: 'Global Education',
          applyId: 'nos-tribal',
        };
      case 'pre-matric':
        return {
          title: 'Pre-Matric Scholarship for ST Students',
          tagline: 'Direct day-scholar & hosteller grant for Classes 9 & 10',
          badge: 'Schooling Foundation',
          applyId: 'pre-matric-st',
        };
      default:
        return {
          title: id,
          tagline: 'Government of India tribal scholarship scheme',
          badge: 'MoTA Scheme',
          applyId: id,
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-5 pb-24"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-navy via-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-saffron/20 text-saffron border border-saffron/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Find My Scholarship</h1>
            <p className="text-xs text-slate-300">Explainable Eligibility Engine</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mt-2">
          Discover which Ministry of Tribal Affairs (MoTA) schemes match your exact profile. Powered by deterministic scheme rules with 100% transparency.
        </p>
      </div>

      {/* Filter / Profile Customizer */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Simulate Eligibility Criteria
        </span>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Education Level
          </label>
          <select
            value={eduLevel}
            onChange={(e) => setEduLevel(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-saffron"
          >
            <option>Class 9-10 (Secondary)</option>
            <option>Class 11-12 / ITI / Polytechnic</option>
            <option>Undergraduate (B.Tech/MBBS/B.Sc)</option>
            <option>Postgraduate / M.Tech / PhD</option>
            <option>Overseas Masters / PhD</option>
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Annual Family Income</span>
            <span className="font-bold text-saffron">₹{income.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min="50000"
            max="800000"
            step="25000"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full accent-saffron h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>₹50K (Low)</span>
            <span>₹2.5L (Post-Matric Limit)</span>
            <span>₹6.0L (Top-Class Limit)</span>
            <span>₹8L+</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Institution Type
          </label>
          <select
            value={instType}
            onChange={(e) => setInstType(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-saffron"
          >
            <option>Premier (IIT / NIT / AIIMS / IIM / National Law)</option>
            <option>State University / Government College</option>
            <option>Private NAAC-A Accredited College</option>
            <option>Foreign Notified University (QS Top 500)</option>
          </select>
        </div>
      </div>

      {/* Eligible Schemes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            Eligible Schemes ({eligible.length})
          </h2>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">100% Rules Satisfied</span>
        </div>

        {eligible.map((res) => {
          const detail = getSchemeDetails(res.schemeId);
          const isExpanded = expandedScheme === res.schemeId;

          return (
            <div
              key={res.schemeId}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-300 dark:border-emerald-800/60 p-4 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                    {detail.badge}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                    {detail.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {detail.tagline}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                    {res.passedCount}/{res.totalCount} Passed
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Deterministic</span>
                </div>
              </div>

              {/* Explainable Checklist Expansion */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setExpandedScheme(isExpanded ? null : res.schemeId)}
                  className="flex items-center justify-between w-full text-xs font-bold text-saffron hover:underline"
                >
                  <span>{isExpanded ? 'Hide Rule Breakdown' : 'Why am I eligible? (View Rules)'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 mt-3 text-xs"
                  >
                    {res.checks.map((chk) => (
                      <div
                        key={chk.id}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-start gap-2 border border-slate-100 dark:border-slate-800"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white block">{chk.label}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{chk.detail}</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Apply CTA */}
              <div className="pt-2">
                <button
                  onClick={() => navigate(`/apply/${detail.applyId}`)}
                  className="w-full py-2 px-4 rounded-xl bg-saffron hover:bg-saffron-dark text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  Apply Under Zero Repetition Guarantee
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conditional / Other Schemes */}
      {reviewOrPartial.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Other MoTA Schemes ({reviewOrPartial.length})
            </h2>
            <span className="text-[10px] text-slate-400">Criteria Comparison</span>
          </div>

          {reviewOrPartial.map((res) => {
            const detail = getSchemeDetails(res.schemeId);
            return (
              <div
                key={res.schemeId}
                className="bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 text-xs space-y-1.5 opacity-80"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">{detail.title}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{detail.tagline}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {res.passedCount}/{res.totalCount} Passed
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                  {res.explanation}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* MoTA Mission Statement */}
      <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Transparent Decision Guarantee: </span>
          In JAGO, algorithmic checks are open and auditable. AI does not decide your scholarship. Human officers review any genuine edge cases.
        </div>
      </div>
    </motion.div>
  );
}
