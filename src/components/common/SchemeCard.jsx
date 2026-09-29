import { motion } from 'framer-motion';
import { ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function SchemeCard({ scheme, index = 0 }) {
  const navigate = useNavigate();
  const { darkMode, t } = useApp();
  const daysLeft = Math.max(0, Math.ceil((new Date(scheme.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={() => navigate(`/scheme/${scheme.id}`)}
      className={`rounded-2xl p-4 cursor-pointer border transition-all active:scale-[0.98] ${
        darkMode
          ? 'bg-navy-light/60 border-white/10 hover:border-saffron/40 hover:bg-navy-light/80'
          : 'bg-white border-slate-200/90 shadow-sm hover:border-saffron/40 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-xs"
            style={{ backgroundColor: scheme.color + '25' }}
          >
            {scheme.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {scheme.shortName}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400">
                {scheme.portal}
              </span>
            </div>
            <p className={`text-xs mt-0.5 font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              {t('academicYear', 'Academic Year')} {scheme.academicYear}
            </p>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`} />
      </div>

      <p className={`text-xs mt-2.5 line-clamp-2 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
        {scheme.description}
      </p>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-inherit text-xs">
        <div className="flex items-center gap-1.5 text-saffron font-medium text-[11px]">
          <Calendar className="w-3.5 h-3.5" />
          <span>{daysLeft > 0 ? `${daysLeft} ${t('daysLeft', 'days left')}` : t('deadlinePassed', 'Deadline passed')}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/apply/${scheme.id}`);
          }}
          className="px-3 py-1 rounded-lg bg-saffron text-white text-[11px] font-bold flex items-center gap-1 shadow-xs hover:bg-saffron-dark active:scale-95 transition-all"
        >
          {t('applyNow', 'Apply Now')} <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
