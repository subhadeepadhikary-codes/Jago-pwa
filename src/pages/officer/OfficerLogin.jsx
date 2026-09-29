import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import jagoLogo from '../../assets/jago-logo.png';
import { DEMO_OFFICERS } from '../../services/apiService';
import {
  Building2,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  ChevronRight,
  Sun,
  Moon,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function OfficerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { officerLogin } = useAuth();
  const { darkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await officerLogin(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/officer/dashboard');
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleSelectDemoOfficer = (officer) => {
    setEmail(officer.email);
    setPassword(officer.password);
    setError(null);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center px-4 py-8 transition-colors ${
        darkMode ? 'bg-navy text-white' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      <div className="w-full max-w-sm mx-auto">
        {/* Top bar with back to student login & theme switch */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/login')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border-2 transition-colors ${
              darkMode
                ? 'border-white/10 text-gray-300 hover:bg-white/10'
                : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-xl border-2 flex items-center justify-center border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={jagoLogo}
            alt="JAGO Logo"
            className="w-12 h-12 rounded-2xl object-contain bg-white p-1 border-2 border-slate-300 dark:border-white/20 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md">
                Administrative Gateway
              </span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
              Officer Console
            </h1>
            <p className="text-[10px] text-slate-600 dark:text-gray-400 font-semibold leading-none mt-0.5">
              Ministry of Tribal Affairs • Government of India
            </p>
          </div>
        </div>

        {/* Officer Login Form Card */}
        <div
          className={`rounded-3xl p-6 border shadow-xl transition-all mb-4 ${
            darkMode ? 'bg-navy-light/70 border-white/10' : 'bg-white border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-white/10">
            <Building2 className="w-4 h-4 text-saffron" />
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">
              Institutional & Nodal Verification Login
            </h3>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-gray-200">
                Official Email / Employee ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500 dark:text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. officer.institute@jago.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-semibold focus:outline-hidden focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-gray-200">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500 dark:text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter officer password"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-semibold focus:outline-hidden focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-saffron to-amber-500 text-white text-xs shadow-md shadow-saffron/25 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>{loading ? 'Authenticating Officer...' : 'Sign In to Officer Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 1-Tap Demo Officer Role Selector for Evaluators */}
        <div
          className={`rounded-2xl p-4 border transition-all ${
            darkMode ? 'bg-navy-light/40 border-white/10' : 'bg-slate-100 border-slate-300'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Official Demo Accounts (Click to Fill)
            </h4>
          </div>

          <div className="space-y-2">
            {DEMO_OFFICERS.map((officer) => (
              <button
                key={officer.id}
                type="button"
                onClick={() => handleSelectDemoOfficer(officer)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                  email === officer.email
                    ? 'border-saffron bg-saffron/10 text-saffron font-bold'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                      {officer.name}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-gray-300">
                      {officer.role.replace('_OFFICER', '')}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400">
                    {officer.jurisdictionName}
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
