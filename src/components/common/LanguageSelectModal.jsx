import { motion, AnimatePresence } from 'framer-motion';
import { Check, Globe, X } from 'lucide-react';
import { TOP_LANGUAGES } from '../../services/languageService';
import { useApp } from '../../context/AppContext';

export default function LanguageSelectModal({ isOpen, onClose }) {
  const { appLanguage, setAppLanguage, darkMode } = useApp();

  if (!isOpen) return null;

  const handleSelect = (code) => {
    setAppLanguage(code);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border transition-colors ${
            darkMode ? 'bg-navy border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-inherit">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-saffron/15 text-saffron">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Choose Language / भाषा चुनें</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select your preferred language for JAGO
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl border transition-colors ${
                darkMode ? 'hover:bg-white/10 border-white/10' : 'hover:bg-slate-100 border-slate-200'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Languages List */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {TOP_LANGUAGES.map((lang) => {
              const isSelected = appLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-saffron/10 border-saffron text-saffron shadow-xs'
                      : darkMode
                      ? 'bg-white/5 border-white/5 hover:border-white/20 text-slate-200'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{lang.nativeName}</span>
                      <span className="text-xs text-slate-400 font-medium">({lang.label})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{lang.region}</span>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-saffron text-slate-950 flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-inherit text-center">
            <p className="text-[11px] text-slate-400">
              Language changes are saved automatically to your device.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
