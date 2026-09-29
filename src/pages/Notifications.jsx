import { useApp } from '../context/AppContext';
import PageTransition from '../components/layout/PageTransition';
import { motion } from 'framer-motion';
import { CheckCheck, Bell, Download, ExternalLink } from 'lucide-react';

const typeColors = {
  payment: 'border-l-emerald-500',
  verification: 'border-l-blue-500',
  deadline: 'border-l-amber-500',
  announcement: 'border-l-purple-500',
  system: 'border-l-saffron',
};

export default function Notifications() {
  const { notifications, markAsRead, markAllRead, unreadCount, darkMode } = useApp();

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <PageTransition className="pt-2 pb-20 px-4">
      {/* Header Actions */}
      <div className="mt-4 flex items-center justify-between mb-4">
        <div>
          <h2 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Notification Center
          </h2>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="flex items-center gap-1.5 text-saffron text-xs font-bold hover:underline"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-2.5">
        {sorted.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => markAsRead(notif.id)}
            className={`border rounded-2xl p-4 cursor-pointer transition-all border-l-4 shadow-xs ${
              typeColors[notif.type] || 'border-l-gray-400'
            } ${
              darkMode
                ? !notif.read
                  ? 'bg-navy-light/70 border-white/10 text-white'
                  : 'bg-navy-light/30 border-white/5 text-gray-400'
                : !notif.read
                ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0 mt-0.5">{notif.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className={`text-xs font-bold ${!notif.read ? '' : 'opacity-80'}`}>
                    {notif.title}
                  </h4>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-saffron shrink-0 mt-1" />
                  )}
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${
                  darkMode
                    ? !notif.read ? 'text-gray-200' : 'text-gray-400'
                    : !notif.read ? 'text-slate-600' : 'text-slate-500'
                }`}>
                  {notif.message}
                </p>

                {notif.downloadUrl && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-saffron font-bold">
                      Master Release Pack
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(notif.downloadUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-saffron text-white text-[11px] font-bold flex items-center gap-1 shadow-xs hover:bg-saffron-light"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download APK</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                    </button>
                  </div>
                )}

                <p className={`text-[10px] mt-2 font-medium ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                  {new Date(notif.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageTransition>
  );
}
