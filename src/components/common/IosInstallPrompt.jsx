import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share, PlusSquare, X, Smartphone } from 'lucide-react';
import jagoLogo from '../../assets/jago-logo.png';

export default function IosInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if running on iOS (iPhone / iPad / iPod)
    const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
    // Check if already running in standalone mode (installed as home screen app)
    const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('jago_ios_prompt_dismissed');

    if (isIos && !isStandalone && !isDismissed) {
      // Delay slightly for smooth appearance
      const timer = setTimeout(() => setShowPrompt(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('jago_ios_prompt_dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto"
      >
        <div className="rounded-2xl p-4 bg-white/95 dark:bg-navy-light/95 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-2xl text-slate-900 dark:text-white relative">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-3">
            <img
              src={jagoLogo}
              alt="Jago"
              className="w-11 h-11 rounded-xl object-contain bg-white p-0.5 border border-slate-200 shadow-xs shrink-0"
            />
            <div className="pr-4">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400">
                  APPLE iOS
                </span>
                <h4 className="font-bold text-xs">Install on your iPhone</h4>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-gray-300 leading-tight">
                Run JAGO as a fullscreen native iOS app with zero Safari URL bar:
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                1. Tap Share <Share className="w-3.5 h-3.5 inline" />
              </span>
              <span>→</span>
              <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-white">
                2. Add to Home Screen <PlusSquare className="w-3.5 h-3.5 inline" />
              </span>
            </div>

            <button
              onClick={handleDismiss}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-200 hover:bg-slate-200"
            >
              Got it
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
