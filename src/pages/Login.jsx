import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Lock,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import jagoLogo from '../assets/jago-logo.png';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import AdminBroadcastModal from '../components/admin/AdminBroadcastModal';
import LanguageSelectModal from '../components/common/LanguageSelectModal';
import { TOP_LANGUAGES } from '../services/languageService';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, recoverPassword } = useAuth();
  const { darkMode, toggleDarkMode, appLanguage } = useApp();

  const [activeTab, setActiveTab] = useState(
    location.state?.initialTab === 'signup' ? 'signup' : 'signin'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const currentLangObj = TOP_LANGUAGES.find((l) => l.code === appLanguage) || TOP_LANGUAGES[0];

  // Secret Admin Portal state
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Sign In Form State (Option A)
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Forgot Password / OTP State (Option B)
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState('phone'); // phone -> otp -> newpass
  const [recoveryMobile, setRecoveryMobile] = useState('');
  const [recoveryOtp, setRecoveryOtp] = useState(['', '', '', '', '', '']);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Sign Up Form State (New Applicant with ZERO demo data)
  const [signUpData, setSignUpData] = useState({
    name: '',
    mobile: '',
    category: 'ST',
    subTribe: 'Gond',
    state: 'Jharkhand',
    district: 'Ranchi',
    income: '180000',
    password: '',
    confirmPassword: '',
  });

  // Handle Sign In (Option A with Secret Admin Trigger)
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!signInIdentifier.trim() || !signInPassword.trim()) {
      setError('Please enter your Applicant ID / Aadhaar / Mobile and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(signInIdentifier.trim(), signInPassword.trim());
      setLoading(false);

      if (res.isAdmin) {
        // Secret Admin credentials matched! Open Admin Portal
        setShowAdminModal(true);
        return;
      }

      if (res.success) {
        setSuccessMsg(res.isDemo ? `Loaded Demo Sandbox Profile (${res.user.name})!` : `Welcome, ${res.user.name}!`);
        setTimeout(() => navigate('/'), 600);
      } else {
        setError(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during authentication. Please try again.');
    }
  };

  // Handle Sign Up (Clean Slate)
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!signUpData.name.trim() || !signUpData.mobile.trim() || !signUpData.password.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (signUpData.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        name: signUpData.name,
        mobile: signUpData.mobile,
        category: signUpData.category,
        tribe: signUpData.subTribe,
        state: signUpData.state,
        district: signUpData.district,
        income: signUpData.income,
        password: signUpData.password,
      });

      setLoading(false);

      if (res.success) {
        setSuccessMsg(`Account created for ${res.user.name}! Logging you in...`);
        setTimeout(() => navigate('/'), 800);
      } else {
        setError(res.error || 'Registration failed.');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during registration.');
    }
  };

  // Handle Forgot Password OTP verification (Option B)
  const handleOtpRecovery = async (e) => {
    e.preventDefault();
    setError(null);

    if (recoveryStep === 'phone') {
      if (recoveryMobile.length !== 10) {
        setError('Please enter a valid 10-digit registered mobile number.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setRecoveryStep('otp');
        setSuccessMsg(`Simulated OTP 123456 sent to +91 ${recoveryMobile}`);
      }, 700);
      return;
    }

    if (recoveryStep === 'otp') {
      const enteredOtp = recoveryOtp.join('');
      if (enteredOtp.length !== 6) {
        setError('Please enter the 6-digit verification code.');
        return;
      }
      setRecoveryStep('newpass');
      return;
    }

    if (recoveryStep === 'newpass') {
      if (!newPasswordInput || newPasswordInput.length < 6) {
        setError('New password must be at least 6 characters.');
        return;
      }
      setLoading(true);
      const res = await recoverPassword(recoveryMobile, newPasswordInput);
      setLoading(false);

      if (res.success) {
        setSuccessMsg('Password updated successfully! Welcome back.');
        setTimeout(() => navigate('/'), 800);
      } else {
        setError(res.error || 'Password recovery failed.');
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center px-4 py-8 transition-colors ${
        darkMode ? 'bg-navy text-white' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      <div className="w-full max-w-sm mx-auto">
        {/* Top bar with theme toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <img
              src={jagoLogo}
              alt="JAGO Logo"
              className="w-11 h-11 rounded-xl object-contain bg-white p-1 border border-slate-200/90 shadow-md shadow-saffron/10"
            />
            <div>
              <span className="font-black text-2xl tracking-tight text-slate-950 dark:text-white leading-none">
                JAGO
              </span>
              <p className="text-[10px] text-slate-600 dark:text-gray-400 font-semibold leading-none mt-0.5">
                Ministry of Tribal Affairs • Govt. of India
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowLangModal(true)}
              className="px-2.5 py-1.5 rounded-xl border-2 flex items-center gap-1.5 border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-xs font-bold text-slate-800 dark:text-slate-200"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-saffron" />
              <span>{currentLangObj?.nativeName || 'English'}</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 rounded-xl border-2 flex items-center justify-center border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Auth Card Container */}
        <div
          className={`rounded-3xl p-6 border shadow-xl transition-all ${
            darkMode ? 'bg-navy-light/70 border-white/10' : 'bg-white border-slate-300'
          }`}
        >
          {/* Sign In vs Sign Up Tabs */}
          {!isForgotPassword && (
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-200/70 dark:bg-white/5 border border-slate-300 dark:border-white/10 mb-5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'signin'
                    ? 'bg-white dark:bg-navy text-saffron shadow-xs border-2 border-saffron/30'
                    : 'text-slate-700 dark:text-gray-400 hover:text-slate-950 font-bold'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'signup'
                    ? 'bg-white dark:bg-navy text-saffron shadow-xs border-2 border-saffron/30'
                    : 'text-slate-700 dark:text-gray-400 hover:text-slate-950 font-bold'
                }`}
              >
                New Applicant
              </button>
            </div>
          )}

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM (OPTION A) */}
          {activeTab === 'signin' && !isForgotPassword && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-gray-200">
                  Applicant ID / Aadhaar / Mobile
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-500 dark:text-slate-400" />
                  <input
                    type="text"
                    required
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    placeholder="e.g. ST-2026-1042 or Mobile Number"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-semibold focus:outline-hidden focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-gray-200">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] font-bold text-saffron hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500 dark:text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-semibold focus:outline-hidden focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 dark:text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-saffron to-saffron-light text-white text-xs shadow-md shadow-saffron/25 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{loading ? 'Authenticating...' : 'Sign In to JAGO'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              {/* Coder Quick Demo Fill button */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setSignInIdentifier('demo');
                    setSignInPassword('demo123');
                    setError(null);
                  }}
                  className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Fill Coder Demo Credentials (demo / demo123)</span>
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-slate-500 dark:text-gray-400">
                <span>New ST Applicant? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="font-bold text-saffron hover:underline"
                >
                  Register here
                </button>
              </div>
            </form>
          )}

          {/* 2. FORGOT PASSWORD (OPTION B - OTP BACKUP) */}
          {isForgotPassword && (
            <form onSubmit={handleOtpRecovery} className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <KeyRound className="w-4 h-4 text-saffron" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-saffron">
                  Option B: Password Recovery via OTP
                </h4>
              </div>

              {recoveryStep === 'phone' && (
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-gray-200">
                    Registered Mobile Number
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 absolute left-3 top-3 text-slate-500 dark:text-slate-400" />
                    <input
                      type="tel"
                      maxLength={10}
                      value={recoveryMobile}
                      onChange={(e) => setRecoveryMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-mono font-semibold focus:outline-hidden focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>
              )}

              {recoveryStep === 'otp' && (
                <div>
                  <label className="block text-xs font-bold mb-2 text-slate-800 dark:text-gray-200">
                    Enter 6-Digit OTP (Use: 123456)
                  </label>
                  <div className="flex justify-between gap-1">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={recoveryOtp[i]}
                        onChange={(e) => {
                          const val = e.target.value;
                          const next = [...recoveryOtp];
                          next[i] = val;
                          setRecoveryOtp(next);
                        }}
                        className="w-10 h-10 text-center rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 font-mono text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-saffron focus:ring-2 focus:ring-saffron/20 shadow-2xs"
                      />
                    ))}
                  </div>
                </div>
              )}

              {recoveryStep === 'newpass' && (
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-gray-200">
                    Set New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500 dark:text-slate-400" />
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-semibold focus:outline-hidden focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold bg-saffron text-white text-xs shadow-md shadow-saffron/25 hover:bg-saffron-light transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>
                    {recoveryStep === 'phone'
                      ? 'Send Verification OTP'
                      : recoveryStep === 'otp'
                      ? 'Verify Code'
                      : 'Save Password & Sign In'}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setRecoveryStep('phone');
                  setError(null);
                }}
                className="w-full text-center text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {/* 3. SIGN UP FORM (ZERO DEMO DATA) */}
          {activeTab === 'signup' && !isForgotPassword && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-gray-200">
                  Applicant Full Name
                </label>
                <input
                  type="text"
                  required
                  value={signUpData.name}
                  onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                  placeholder="As per Aadhaar card"
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-semibold focus:outline-hidden focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-gray-200">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={signUpData.mobile}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, mobile: e.target.value.replace(/\D/g, '') })
                  }
                  placeholder="10-digit mobile number"
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-mono font-semibold focus:outline-hidden focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-gray-200">
                    Category
                  </label>
                  <select
                    value={signUpData.category}
                    onChange={(e) => setSignUpData({ ...signUpData, category: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-navy text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all shadow-2xs"
                  >
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="PVTG">PVTG (Particularly Vulnerable)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-gray-200">
                    Sub-Tribe Community
                  </label>
                  <input
                    type="text"
                    value={signUpData.subTribe}
                    onChange={(e) => setSignUpData({ ...signUpData, subTribe: e.target.value })}
                    placeholder="e.g. Santhal, Gond"
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-semibold focus:outline-hidden focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-gray-200">
                    State
                  </label>
                  <input
                    type="text"
                    value={signUpData.state}
                    onChange={(e) => setSignUpData({ ...signUpData, state: e.target.value })}
                    placeholder="e.g. Jharkhand"
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-semibold focus:outline-hidden focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-gray-200">
                    Annual Family Income (₹)
                  </label>
                  <input
                    type="number"
                    value={signUpData.income}
                    onChange={(e) => setSignUpData({ ...signUpData, income: e.target.value })}
                    placeholder="180000"
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-mono font-semibold focus:outline-hidden focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-gray-200">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-semibold focus:outline-hidden focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-gray-200">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-semibold focus:outline-hidden focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-saffron to-saffron-light text-white text-xs shadow-md shadow-saffron/25 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{loading ? 'Creating Account...' : 'Register Applicant Account'}</span>
              </button>

              <div className="text-center text-xs text-slate-500 dark:text-gray-400">
                <span>Already have an applicant account? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="font-bold text-saffron hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Official Officer Console Switcher */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 text-center">
          <button
            type="button"
            onClick={() => navigate('/officer/login')}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span>🏛️</span>
            <span>Officer & Verification Console Login</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
            For Institute Nodal, District Welfare, State, & MoTA Central Officers
          </p>
        </div>

        {/* Security Badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
          <span>National Scholarship Portal (NSP) Unified Gateway • MoTA</span>
        </div>
      </div>

      {/* Secret Admin OTA Broadcast Modal (Triggered ONLY via Secret Credentials in Sign-In) */}
      <AdminBroadcastModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onContinueAsApplicant={() => {
          setShowAdminModal(false);
          navigate('/');
        }}
      />

      {/* Top 7 Languages Selection Modal */}
      <LanguageSelectModal
        isOpen={showLangModal}
        onClose={() => setShowLangModal(false)}
      />
    </div>
  );
}
