import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, FileText, FolderOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, t } = useApp();

  const tabs = [
    { path: '/', icon: Home, label: t('navHome') },
    { path: '/explore', icon: Search, label: t('navSchemes') },
    { path: '/tracker', icon: FileText, label: t('navTrack') },
    { path: '/documents', icon: FolderOpen, label: t('navDocs') },
    { path: '/profile', icon: User, label: t('navProfile') },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 transition-colors backdrop-blur-md border-t ${
      darkMode
        ? 'bg-navy/95 border-white/10'
        : 'bg-white/95 border-slate-200 shadow-lg'
    }`}>
      <div className="max-w-md mx-auto flex items-center justify-around px-2 h-16 pb-safe">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center justify-center gap-0.5 w-16 py-1 active:scale-95 transition-transform"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 w-8 h-1 rounded-full bg-saffron"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive
                    ? 'text-saffron'
                    : darkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-saffron font-bold'
                    : darkMode
                    ? 'text-gray-400'
                    : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
