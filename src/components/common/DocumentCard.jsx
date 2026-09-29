import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DocumentCard({ doc, index = 0 }) {
  const { darkMode } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-2xl p-3.5 border transition-all shadow-xs ${
        doc.issue
          ? darkMode
            ? 'bg-red-500/10 border-red-500/40 text-white'
            : 'bg-red-50/70 border-red-300 text-slate-900'
          : darkMode
          ? 'bg-navy-light/60 border-white/10 hover:border-saffron/40 text-white'
          : 'bg-white border-slate-200 hover:border-saffron/40 text-slate-900'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
          darkMode ? 'bg-white/5' : 'bg-slate-100'
        }`}>
          {doc.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-bold truncate pr-2">{doc.name}</h3>
            {doc.verified ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-green-500 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden xs:inline">Verified</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-red-500 shrink-0">
                <AlertCircle className="w-4 h-4" />
                <span>Fix Needed</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              {doc.source}
            </span>
            <span className="opacity-40">·</span>
            <span className={`text-[11px] ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              {doc.size}
            </span>
            <span className="opacity-40">·</span>
            <span className={`text-[11px] ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              {doc.uploadDate}
            </span>
          </div>

          {doc.usedIn && doc.usedIn.length > 0 && (
            <p className="text-[11px] text-saffron font-medium mt-1">
              Attached in {doc.usedIn.length} application{doc.usedIn.length > 1 ? 's' : ''}
            </p>
          )}

          {doc.issue && (
            <p className="text-[11px] text-red-500 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {doc.issue}
            </p>
          )}
        </div>
        <ChevronRight className={`w-4 h-4 mt-2 shrink-0 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`} />
      </div>
    </motion.div>
  );
}
