import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import jagoLogo from '../../assets/jago-logo.png';
import {
  LayoutDashboard,
  Compass,
  FileCheck2,
  FolderLock,
  User,
  Bell,
  Users,
  ShieldCheck,
  Building,
  LogOut,
  Sparkles,
  Lock,
  ExternalLink,
} from 'lucide-react';

export default function DesktopSidebar() {
  const { user, unreadCount, darkMode, t } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('navDashboard', 'Dashboard'), icon: LayoutDashboard },
    { path: '/explore', label: t('navSchemes', 'Explore Schemes'), icon: Compass },
    { path: '/tracker', label: t('navTracker', 'Track Applications'), icon: FileCheck2 },
    { path: '/documents', label: t('navWallet', 'Document Wallet'), icon: FolderLock },
    { path: '/profile', label: t('navProfile', 'Student Profile'), icon: User },
    { path: '/notifications', label: t('notifications', 'Notifications'), icon: Bell, badge: unreadCount },
    { path: '/family', label: 'Family Hub', icon: Users },
  ];

  return (
    <aside
      className={`w-64 h-screen sticky top-0 shrink-0 border-r flex flex-col justify-between transition-colors z-30 select-none ${
        darkMode ? 'bg-navy-dark border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Top Branding Section */}
      <div className="p-5 border-b border-inherit">
        <div className="flex items-center gap-3">
          <img
            src={jagoLogo}
            alt="JAGO Emblem"
            className="w-11 h-11 rounded-2xl bg-white p-1 border border-slate-200 dark:border-white/10 shadow-sm object-contain"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-saffron">JAGO</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-saffron/15 text-saffron font-mono">
                PWA v1.0
              </span>
            </div>
            <p className={`text-[11px] font-semibold leading-tight ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              Unified Tribal Portal
            </p>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-inherit/60 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">MoTA, Govt of India</span>
          <span className="text-green-500 font-bold flex items-center gap-1 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Cloud Vault
          </span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-saffron to-amber-500 text-slate-950 font-bold shadow-md shadow-saffron/20'
                  : darkMode
                  ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-slate-950' : 'text-saffron'
                }`} />
                <span>{item.label}</span>
              </div>

              {item.badge > 0 && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-slate-950 text-white' : 'bg-red-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Government Console
        </div>

        <button
          onClick={() => navigate('/officer/login')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
            darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <Building className="w-4 h-4 text-emerald-500" />
            <span>Officer Console</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Security Vault Indicator & User Session */}
      <div className="p-3 border-t border-inherit space-y-2.5">
        {/* Zero-Knowledge Security Badge */}
        <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
          darkMode ? 'bg-navy/80 border-white/10' : 'bg-emerald-50/70 border-emerald-200/80'
        }`}>
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 text-[10px]">
            <p className="font-bold text-emerald-700 dark:text-emerald-400 truncate">
              AES-256-GCM Vault
            </p>
            <p className="text-slate-500 dark:text-gray-400 truncate">
              Zero-Knowledge Encrypted
            </p>
          </div>
        </div>

        {/* User Card */}
        {user ? (
          <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <div
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 min-w-0 cursor-pointer flex-1"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron to-amber-500 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0 shadow-xs">
                {(user.name || 'S').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate hover:text-saffron transition-colors">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user.subCategory || 'ST Scholar'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg hover:bg-red-500/15 hover:text-red-500 text-slate-400 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2 rounded-xl bg-saffron text-slate-950 font-bold text-xs shadow-md"
          >
            Sign In
          </button>
        )}
      </div>
    </aside>
  );
}
