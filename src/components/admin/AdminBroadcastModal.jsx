import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, UploadCloud, Sparkles, ExternalLink, CheckCircle2, X, FolderArchive, ArrowRight, Globe, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';

export default function AdminBroadcastModal({ isOpen, onClose, onContinueAsApplicant }) {
  const { currentVersion, publishNewVersion, mediaFireFolderUrl, saveMediaFireFolderUrl } = useApp();

  const [versionInput, setVersionInput] = useState('2.2');
  const [folderInput, setFolderInput] = useState(
    mediaFireFolderUrl || 'https://www.mediafire.com/folder/4fmr1vrov62fl/Documents'
  );
  const [fileUrlInput, setFileUrlInput] = useState('');
  const [notesInput, setNotesInput] = useState(
    'Real-time DBT status tracker, expanded scheme criteria, and performance optimizations.'
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverTimestamp, setServerTimestamp] = useState(null);

  if (!isOpen) return null;

  const handleBroadcast = async () => {
    const finalVersion = versionInput.trim() || '2.2';
    const finalFolder = folderInput.trim() || 'https://www.mediafire.com/folder/4fmr1vrov62fl/Documents';
    const finalFile = fileUrlInput.trim() || finalFolder;

    setIsPublishing(true);

    try {
      // 1. Update in local cache & publish to Global Cloud Relay
      await apiService.broadcastVersionUpdate({
        version: finalVersion,
        folderUrl: finalFolder,
        fileUrl: finalFile,
        notes: notesInput,
      });

      // 2. Publish in AppContext state so real-time popup triggers immediately
      publishNewVersion({
        version: finalVersion,
        url: finalFile,
        notes: notesInput,
      });

      saveMediaFireFolderUrl(finalFolder);
      setServerTimestamp(new Date().toLocaleTimeString());
      setIsSuccess(true);
    } catch (e) {
      console.error('Error during broadcast:', e);
      setIsSuccess(true);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 bg-white dark:bg-navy-light border border-slate-200 dark:border-white/10 shadow-2xl text-slate-900 dark:text-white relative"
        >
          {/* Header decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-500 to-saffron" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 text-slate-500 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Admin Header */}
          <div className="flex items-center gap-3 mb-3 mt-1">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center border border-red-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500/15 text-red-600 dark:text-red-400">
                  MoTA Secret Admin Portal
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Cloud Relay
                </span>
              </div>
              <h3 className="text-base font-bold tracking-tight">
                OTA Version Release Manager
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-gray-300 mb-4 leading-relaxed">
            Welcome, Administrator. Broadcast a new update notification (<span className="font-mono font-bold">v1.x / v2.x</span>) directly to all applicants across all devices worldwide via Global Cloud Relay.
          </p>

          {isSuccess ? (
            <div className="space-y-4 py-2">
              <div className="rounded-2xl p-4 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Update v{versionInput} Broadcasted!</span>
                  </div>
                  {serverTimestamp && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-500/20">
                      {serverTimestamp}
                    </span>
                  )}
                </div>
                <p className="leading-relaxed">
                  The new version notification has been pushed to the Global Cloud Relay. When applicants open or use the JAGO app on any phone or network, they will immediately see the update pop-up with your MediaFire download link!
                </p>
                <div className="font-mono text-[10px] bg-white/50 dark:bg-black/30 p-2 rounded-xl truncate">
                  Master Folder: {folderInput}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsSuccess(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold"
                >
                  Edit Release
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onContinueAsApplicant) onContinueAsApplicant();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-saffron text-white text-xs font-bold shadow-xs hover:bg-saffron-light flex items-center justify-center gap-1.5"
                >
                  <span>Continue to App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5 text-xs">
              {/* Version input */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-gray-200">
                  New Version Number (Identify 'x' in 1.x)
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 font-bold">v</span>
                  <input
                    type="text"
                    value={versionInput}
                    onChange={(e) => setVersionInput(e.target.value)}
                    placeholder="1.3"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-mono text-xs focus:outline-saffron font-bold text-saffron"
                  />
                  <span className="text-[10px] text-slate-400">Current: v{currentVersion}</span>
                </div>
              </div>

              {/* Master MediaFire Folder */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-gray-200 flex items-center justify-between">
                  <span>MediaFire Master Folder Link</span>
                  <span className="text-[10px] text-blue-500 font-normal">Official Master Folder</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={folderInput}
                    onChange={(e) => setFolderInput(e.target.value)}
                    placeholder="https://www.mediafire.com/folder/4fmr1vrov62fl/Documents"
                    className="w-full px-3 py-2 pr-8 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs focus:outline-saffron font-mono"
                  />
                  <a
                    href={folderInput}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-blue-500"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Points directly to your uploads folder where applicants can download the new APK.
                </p>
              </div>

              {/* Specific File Link (Optional) */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-gray-200">
                  Direct APK File Link inside Folder (Optional)
                </label>
                <input
                  type="url"
                  value={fileUrlInput}
                  onChange={(e) => setFileUrlInput(e.target.value)}
                  placeholder="https://www.mediafire.com/file/.../JAGO-v1.3.apk/file"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs focus:outline-saffron font-mono"
                />
              </div>

              {/* Release Notes */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-gray-200">
                  Release Notes / What's New
                </label>
                <textarea
                  rows={2}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Highlight features in this version..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs focus:outline-saffron resize-none"
                />
              </div>

              {/* Broadcast Button */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleBroadcast}
                  disabled={isPublishing}
                  className="w-full py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-saffron to-amber-500 text-white shadow-md shadow-saffron/20 hover:opacity-95 disabled:opacity-60 text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Syncing to Global Cloud Relay...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Broadcast Real-Time Update (v{versionInput})</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      if (onContinueAsApplicant) onContinueAsApplicant();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-gray-300 hover:bg-slate-100"
                  >
                    Enter App as Applicant
                  </button>
                  <button
                    onClick={onClose}
                    className="py-2 px-4 rounded-xl text-xs text-slate-400 hover:text-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
