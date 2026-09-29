import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Globe,
  Moon,
  Sun,
  Bell,
  DownloadCloud,
  ChevronDown,
} from 'lucide-react';

export default function DesktopTopBar() {
  const {
    appLanguage,
    setAppLanguage,
    TOP_LANGUAGES,
    darkMode,
    toggleDarkMode,
    unreadCount,
    canInstallPwa,
    installPwa,
    t,
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const currentLangObj = TOP_LANGUAGES.find((l) => l.code === appLanguage) || TOP_LANGUAGES[0];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/explore');
    }
  };

  return (
    <header
      className={`h-16 px-6 border-b flex items-center justify-between sticky top-0 z-20 backdrop-blur-md transition-colors ${
        darkMode
          ? 'bg-navy/90 border-white/10 text-white'
          : 'bg-white/95 border-slate-200 text-slate-800'
      }`}
    >
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-96 max-w-sm">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchSchemesPlaceholder', 'Search scholarships, colleges, degrees...')}
          className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none border transition-colors ${
            darkMode
              ? 'bg-navy-light/60 border-white/10 text-white placeholder-gray-500 focus:border-saffron'
              : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-saffron focus:bg-white'
          }`}
        />
      </form>

      {/* Right Controls: Language, Install PWA, Dark Mode, Notifications */}
      <div className="flex items-center gap-3">

        {/* Language Dropdown (7 Indian Languages) */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              darkMode
                ? 'bg-white/5 border-white/10 hover:border-saffron/40'
                : 'bg-slate-50 border-slate-200 hover:border-saffron/40 text-slate-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-saffron" />
            <span>{currentLangObj.nativeName}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {showLangMenu && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-xl border py-2 z-50 animate-in fade-in zoom-in-95 duration-100 ${
                darkMode ? 'bg-navy-dark border-white/15 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-inherit/40 mb-1">
                Select Language
              </div>
              {TOP_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setAppLanguage(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                    appLanguage === lang.code
                      ? 'bg-saffron/15 text-saffron font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Install PWA Button */}
        <button
          onClick={installPwa}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-slate-950 font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all"
          title="Install JAGO PWA to your Desktop / Device"
        >
          <DownloadCloud className="w-3.5 h-3.5" />
          <span>Install PWA</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-xl border transition-colors ${
            darkMode ? 'bg-white/5 border-white/10 text-yellow-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => navigate('/notifications')}
          className={`p-2 rounded-xl border relative transition-colors ${
            darkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white font-extrabold text-[9px] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
