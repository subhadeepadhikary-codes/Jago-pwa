import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FilePlus,
  Search,
  FileText,
  FolderOpen,
  CheckCircle2,
  Bot,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function QuickActionGrid({ onChatOpen }) {
  const navigate = useNavigate();
  const { darkMode, t } = useApp();

  const actions = [
    { label: t('actionApply'), icon: FilePlus, path: '/apply', color: 'from-saffron to-saffron-light' },
    { label: t('actionExplore'), icon: Search, path: '/explore', color: 'from-blue-600 to-blue-500' },
    { label: t('actionTrack'), icon: FileText, path: '/tracker', color: 'from-purple-600 to-purple-500' },
    { label: t('actionWallet'), icon: FolderOpen, path: '/documents', color: 'from-emerald-600 to-emerald-500' },
    { label: t('actionJago'), icon: Bot, path: '#jago', color: 'from-amber-600 to-amber-500' },
    { label: t('actionEligibility'), icon: CheckCircle2, path: '/eligibility', color: 'from-teal-600 to-teal-500' },
  ];

  const handleClick = (action) => {
    if (action.path === '#jago') {
      onChatOpen?.();
    } else {
      navigate(action.path);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {actions.map((action, i) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(action)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all shadow-xs ${
              darkMode
                ? 'bg-navy-light/60 border-white/10 hover:border-saffron/40 text-white'
                : 'bg-white border-slate-200/90 hover:border-saffron/40 text-slate-800 hover:shadow-md'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md text-white`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-center leading-tight">
              {action.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
