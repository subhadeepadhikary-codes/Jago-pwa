import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

const steps = [
  {
    key: 'level',
    question: 'What is your current education level?',
    options: [
      { value: 'pre-matric', label: 'Class IX - X (Secondary School)' },
      { value: 'post-matric', label: 'Class XI, XII or Higher Secondary' },
      { value: 'professional', label: 'Undergraduate / Premier Institution (NIT, IIT, IIM, etc.)' },
      { value: 'research', label: 'M.Phil / Ph.D Postgraduate Research' },
      { value: 'overseas', label: 'Master’s or Ph.D Programme Abroad (Foreign University)' },
    ],
  },
  {
    key: 'income',
    question: 'What is your family\'s total annual income from all sources?',
    options: [
      { value: 'below-2.5', label: 'Below ₹2.50 Lakh per annum' },
      { value: '2.5-6', label: 'Between ₹2.50 Lakh and ₹6.00 Lakh' },
      { value: 'above-6', label: 'Above ₹6.00 Lakh per annum' },
    ],
  },
  {
    key: 'category',
    question: 'Which affirmative action category do you belong to?',
    options: [
      { value: 'st', label: 'Scheduled Tribe (ST)' },
      { value: 'pvtg', label: 'Particularly Vulnerable Tribal Group (PVTG)' },
      { value: 'other', label: 'General / OBC / Other' },
    ],
  },
];

const getEligibleSchemes = (answers) => {
  const results = [];
  const { level, income, category } = answers;

  if (category === 'other') return [];

  if (level === 'pre-matric' && income === 'below-2.5') {
    results.push({ id: 'pre-matric', match: 98, note: 'Eligible for Day Scholar / Hosteller allowance' });
  }
  if (['post-matric', 'professional'].includes(level) && income === 'below-2.5') {
    results.push({ id: 'post-matric', match: 95, note: 'Eligible for Tuition fees + Monthly maintenance' });
  }
  if (level === 'professional' && ['below-2.5', '2.5-6'].includes(income)) {
    results.push({ id: 'top-class', match: 92, note: 'Eligible for Full fees + ₹45,000 computer grant + ₹2,220/mo living' });
  }
  if (level === 'research') {
    results.push({ id: 'nfst', match: 88, note: 'Eligible for JRF/SRF stipend ₹31,000–₹35,000/mo' });
  }
  if (level === 'overseas' && ['below-2.5', '2.5-6'].includes(income)) {
    results.push({ id: 'nos', match: 82, note: 'Eligible for Full foreign fees + $15,400/yr allowance' });
  }

  return results;
};

export default function EligibilityChecker() {
  const { schemes, darkMode } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (value) => {
    const newAnswers = { ...answers, [steps[currentStep].key]: value };
    setAnswers(newAnswers);

    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep((p) => p + 1), 250);
    } else {
      setTimeout(() => setShowResults(true), 250);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const results = showResults ? getEligibleSchemes(answers) : [];

  return (
    <PageTransition className="pt-2 pb-20 px-4">
      {!showResults ? (
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-saffron/15 text-saffron">
              MoTA Smart Assessment
            </span>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              • Quick 3-Question Check
            </span>
          </div>

          <h2 className={`font-bold text-lg mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Eligibility Evaluator
          </h2>

          {/* Progress bar */}
          <div className="flex gap-2 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all ${
                  i <= currentStep ? 'bg-saffron' : darkMode ? 'bg-white/10' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className={`rounded-3xl p-5 border shadow-sm ${
                darkMode ? 'bg-navy-light/60 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <p className="text-saffron text-xs font-bold mb-1">
                Question {currentStep + 1} of {steps.length}
              </p>
              <h3 className="font-bold text-base mb-5 leading-snug">
                {steps[currentStep].question}
              </h3>

              <div className="space-y-2.5">
                {steps[currentStep].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all active:scale-98 flex items-center justify-between ${
                      answers[steps[currentStep].key] === opt.value
                        ? 'bg-saffron/15 border-saffron text-saffron font-bold shadow-xs'
                        : darkMode
                        ? 'bg-navy/60 border-white/10 text-gray-300 hover:border-white/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-medium leading-relaxed">{opt.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className={`text-center p-5 rounded-3xl border mb-4 shadow-sm ${
            darkMode ? 'bg-navy-light/60 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="w-16 h-16 rounded-full bg-green-500/15 text-green-500 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-bold text-lg">Evaluation Complete</h2>
            <p className={`text-xs mt-1 max-w-xs mx-auto ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
              {results.length > 0
                ? `You qualify for ${results.length} MoTA scholarship program${results.length > 1 ? 's' : ''} based on your category and income criteria.`
                : 'No matching MoTA schemes found for non-ST categories or income limits above guidelines.'}
            </p>
          </div>

          <div className="space-y-3">
            {results.map((result, i) => {
              const scheme = schemes.find((s) => s.id === result.id);
              if (!scheme) return null;

              return (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-2xl p-4 border shadow-xs ${
                    darkMode ? 'bg-navy-light/60 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ backgroundColor: scheme.color + '25' }}
                      >
                        {scheme.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{scheme.shortName}</h3>
                        <p className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                          {scheme.portal}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 text-xs font-bold">
                      {result.match}% Match
                    </span>
                  </div>

                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                    {result.note}
                  </p>

                  <button
                    onClick={() => navigate(`/apply/${result.id}`)}
                    className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-saffron to-saffron-light text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <span>Proceed to Apply Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          <button
            onClick={reset}
            className={`mt-4 w-full py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              darkMode ? 'border-white/10 hover:bg-white/5 text-gray-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Restart Assessment
          </button>
        </motion.div>
      )}
    </PageTransition>
  );
}
