import { Bell, ChevronLeft, Sun, Moon, DoorOpen, Monitor } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import jagoLogo from '../../assets/jago-logo.png';

const pageTitles = {
  '/': 'JAGO',
  '/explore': 'Explore Schemes',
  '/tracker': 'My Applications',
  '/documents': 'Document Wallet',
  '/profile': 'My Profile',
  '/notifications': 'Notifications',
  '/eligibility': 'Eligibility Check',
  '/family': 'Family Scholarship Hub',
  '/consent': 'Consent & Privacy Fabric',
  '/find-scholarship': 'Find My Scholarship',
  '/officer/dashboard': 'Officer Console',
  '/officer/queue': 'Application Queue',
  '/officer/exceptions': 'Exception Review Queue',
  '/officer/coverage-radar': 'Coverage Gap Radar',
};

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount, darkMode, toggleDarkMode, aspectMode, setAspectMode, t } = useApp();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/onboarding');
  };

  const isHome = location.pathname === '/';
  const isOfficerArea = location.pathname.startsWith('/officer');
  const isDetail = location.pathname.startsWith('/scheme/') || location.pathname.startsWith('/application/');
  const isApply = location.pathname.startsWith('/apply');

  let title = pageTitles[location.pathname];
  if (isApply) title = 'Apply Scholarship';
  else if (isDetail) title = 'Scheme Details';
  else if (!title) title = 'JAGO';

  return (
    // Natural flowing header (NOT fixed) so it scrolls with the page and prevents any top text clipping
    <header
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      className={`w-full z-40 transition-colors border-b shrink-0 ${
        darkMode
          ? 'bg-navy border-white/10 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className="max-w-md mx-auto flex items-center justify-between px-4 h-14">
        {/* Left: Back button or Jago Emblem */}
        <div className="flex items-center gap-3">
          {!isHome && !isOfficerArea ? (
            <button
              onClick={() => navigate(-1)}
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors border ${
                darkMode
                  ? 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <img
                src={jagoLogo}
                alt="Jago Logo"
                className="w-9 h-9 rounded-xl object-contain shadow-md shadow-saffron/15 bg-white p-0.5 border border-slate-200 dark:border-white/20"
              />
            </div>
          )}

          <div>
            {isHome ? (
              <h1 className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                JAGO
              </h1>
            ) : (
              <h1 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">{title}</h1>
            )}
            {isHome && (
              <p className={`text-[10px] leading-none mt-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-600 font-semibold'}`}>
                {t('ministryTitle')}
              </p>
            )}
          </div>
        </div>

        {/* Right: Logout (door) + Dark Mode toggle + Notifications Bell (OFFICER CONSOLE IS STRICTLY REMOVED) */}
        <div className="flex items-center gap-1.5">
          {/* Switch to Desktop Widescreen (16:9) Mode */}
          <button
            onClick={() => setAspectMode(aspectMode === 'desktop' ? 'mobile' : 'desktop')}
            title="Switch to Desktop Widescreen (16:9) View"
            aria-label="Switch to Desktop View"
            className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-colors ${
              darkMode
                ? 'bg-white/10 border-white/10 text-saffron hover:bg-white/20'
                : 'bg-slate-100 border-slate-200 text-saffron hover:bg-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>

          {/* Logout (Door Open Icon) */}
          <button
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-colors ${
              darkMode
                ? 'bg-white/10 border-white/10 text-white hover:bg-white/20 hover:text-red-400'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-red-600'
            }`}
          >
            <DoorOpen className="w-4 h-4" />
          </button>

          {/* Dark Mode Switch */}
          <button
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-colors ${
              darkMode
                ? 'bg-white/10 border-white/10 text-amber-300 hover:bg-white/20'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => navigate('/notifications')}
            className={`relative w-8 h-8 flex items-center justify-center rounded-xl border transition-colors ${
              darkMode
                ? 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
