import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function StepperTimeline({ stages }) {
  const { darkMode } = useApp();

  return (
    <div className="relative pl-1">
      {stages.map((stage, i) => {
        const isCompleted = stage.status === 'completed';
        const isCurrent = stage.status === 'current';
        const isPending = stage.status === 'pending';
        const isLast = i === stages.length - 1;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex gap-3"
          >
            {/* Stepper line & dot */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-all ${
                  isCompleted
                    ? 'bg-green-600 text-white'
                    : isCurrent
                    ? 'bg-saffron text-white ring-4 ring-saffron/20'
                    : darkMode
                    ? 'bg-white/10 text-gray-500'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4 animate-spin-slow" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 min-h-[36px] ${
                    isCompleted
                      ? 'bg-green-500/60'
                      : darkMode
                      ? 'bg-white/10'
                      : 'bg-slate-200'
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className={`pb-5 ${isLast ? 'pb-1' : ''}`}>
              <div className="flex items-center gap-2">
                <h4
                  className={`text-xs font-bold ${
                    isPending
                      ? darkMode
                        ? 'text-gray-500'
                        : 'text-slate-400'
                      : darkMode
                      ? 'text-white'
                      : 'text-slate-900'
                  }`}
                >
                  {stage.name}
                </h4>
                {isCompleted && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-green-500/15 text-green-600 dark:text-green-400">
                    Verified
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-saffron/15 text-saffron animate-pulse">
                    In Progress
                  </span>
                )}
              </div>

              {stage.date && (
                <p className={`text-[10px] mt-0.5 font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  {new Date(stage.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              )}

              {stage.note && (
                <p
                  className={`text-[11px] mt-1 leading-relaxed ${
                    isPending
                      ? darkMode
                        ? 'text-gray-600'
                        : 'text-slate-400'
                      : darkMode
                      ? 'text-gray-300'
                      : 'text-slate-600'
                  }`}
                >
                  {stage.note}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
