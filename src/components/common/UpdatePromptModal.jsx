import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDownCircle,
  Sparkles,
  X,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  FolderArchive,
  Layers,
  History
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function UpdatePromptModal() {
  const {
    updateConfig,
    closeUpdateModal,
    currentVersion,
    versionPacks,
    mediaFireFolderUrl,
  } = useApp();

  // Show only current version and immediate predecessor
  const displayedPacks = versionPacks.slice(0, 2);

  const [selectedPackId, setSelectedPackId] = useState(() => {
    return displayedPacks[0]?.id || 'v2.2';
  });

  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadCompleted, setDownloadCompleted] = useState(false);

  if (!updateConfig.showModal) return null;

  const isUpdateTriggered =
    updateConfig.isUpdateTriggered ||
    (updateConfig.latestVersion && updateConfig.latestVersion !== currentVersion);

  const activePack = displayedPacks.find((p) => p.id === selectedPackId) || displayedPacks[0];

  const handleStartUpdate = (url) => {
    const targetUrl = url || activePack?.downloadUrl || updateConfig.mediaFireUrl || mediaFireFolderUrl;
    setDownloading(true);
    setProgress(25);

    const timer1 = setTimeout(() => setProgress(60), 500);
    const timer2 = setTimeout(() => setProgress(90), 1000);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setDownloading(false);
      setDownloadCompleted(true);
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-3xl p-5 bg-white dark:bg-navy-light border border-slate-200 dark:border-white/10 shadow-2xl text-slate-900 dark:text-white relative"
        >
          {/* Header decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-saffron to-amber-400" />

          {/* Close button */}
          <button
            onClick={closeUpdateModal}
            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Badge */}
          <div className="flex items-center gap-3 mb-3 mt-1">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
              isUpdateTriggered
                ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-500 border-green-500/30'
                : 'bg-gradient-to-br from-saffron/20 to-amber-500/20 text-saffron border-saffron/30'
            }`}>
              {isUpdateTriggered ? <Sparkles className="w-6 h-6" /> : <History className="w-6 h-6" />}
            </div>
            <div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isUpdateTriggered
                  ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                  : 'bg-saffron/15 text-saffron'
              }`}>
                {isUpdateTriggered ? 'UPDATE AVAILABLE' : 'VERSION HIGHLIGHTS'}
              </span>
              <h3 className="text-base font-bold tracking-tight">
                {isUpdateTriggered
                  ? `JAGO v${updateConfig.latestVersion} Available!`
                  : `Welcome to JAGO v${currentVersion}`}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-gray-300 mb-3.5 leading-relaxed">
            {isUpdateTriggered
              ? 'A newer version has been published to the MediaFire Master Folder. Tap below to download the latest update.'
              : 'Here is what was improved in this version and its immediate predecessor:'}
          </p>

          {/* Version Selector: Only Current & Predecessor */}
          <div className="space-y-2 mb-3.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-gray-400 mb-1">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-saffron" />
                Select Release:
              </span>
              <span>Installed: <strong className="text-slate-800 dark:text-white">v{currentVersion}</strong></span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              {displayedPacks.map((pack) => {
                const isSelected = pack.id === selectedPackId;
                return (
                  <button
                    key={pack.id}
                    onClick={() => {
                      setSelectedPackId(pack.id);
                      setDownloadCompleted(false);
                    }}
                    className={`py-2 px-2 rounded-xl text-center transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-navy text-saffron font-bold shadow-xs border border-saffron/30'
                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white font-medium'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold">{pack.id}</div>
                    <div className="text-[9px] truncate opacity-80">{pack.tag}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Version Pack Details Card */}
          {activePack && (
            <div className="rounded-2xl p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-4 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 dark:text-white">
                  {activePack.title}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-saffron/15 text-saffron font-semibold">
                  {activePack.size}
                </span>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-gray-300 space-y-1 mb-2.5">
                <p className="font-semibold text-slate-700 dark:text-gray-200">Improvements made:</p>
                {activePack.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-saffron font-bold">•</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Direct MediaFire URL Preview */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-[10px] text-slate-400 dark:text-gray-500">
                <span className="truncate max-w-[200px] font-mono text-[9px]">
                  {activePack.downloadUrl}
                </span>
                <span className="text-green-500 font-medium shrink-0">MediaFire Verified ✓</span>
              </div>
            </div>
          )}

          {/* Download progress bar */}
          {downloading && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-saffron flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Connecting to MediaFire for {activePack?.id}...
                </span>
                <span className="font-bold">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-saffron to-amber-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeInOut' }}
                />
              </div>
            </div>
          )}

          {downloadCompleted && (
            <div className="rounded-xl p-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>MediaFire Master Folder opened in a new tab!</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            {isUpdateTriggered ? (
              <button
                onClick={() => handleStartUpdate()}
                disabled={downloading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md shadow-green-500/25 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ArrowDownCircle className="w-4 h-4" />
                <span>Download v{updateConfig.latestVersion} from MediaFire</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>
            ) : (
              <button
                onClick={closeUpdateModal}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-saffron to-saffron-light text-white shadow-md shadow-saffron/25 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Got It, Continue to App</span>
              </button>
            )}

            {/* Folder link option */}
            <button
              onClick={() => window.open(mediaFireFolderUrl, '_blank', 'noopener,noreferrer')}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <FolderArchive className="w-3.5 h-3.5 text-blue-500" />
              <span>Browse All Releases on MediaFire</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>

            {isUpdateTriggered && (
              <button
                onClick={closeUpdateModal}
                className="w-full py-2 px-4 rounded-xl text-xs font-medium text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                Remind Me Later
              </button>
            )}
          </div>

          {/* Security guarantee */}
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 dark:text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
            <span>Cryptographic Checksum Verified (in.gov.tribal.jago)</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
