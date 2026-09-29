import { useState } from 'react';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/layout/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  GraduationCap,
  Landmark,
  Users,
  ChevronRight,
  Shield,
  Globe,
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  Smartphone,
  X,
  CheckCircle2,
  Check,
  LogOut,
  Info,
  ShieldCheck,
  Edit3,
  Save,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/db';
import LanguageSelectModal from '../components/common/LanguageSelectModal';
import { TOP_LANGUAGES } from '../services/languageService';

export default function Profile() {
  const { logout, setCurrentUser } = useAuth();
  const {
    user,
    setUser,
    darkMode,
    toggleDarkMode,
    currentVersion,
    appLanguage,
    t,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const startEditing = () => {
    setEditForm({
      name: user?.name || '',
      fatherName: user?.fatherName || '',
      mobile: user?.mobile || '',
      email: user?.email || '',
      state: user?.state || '',
      district: user?.district || '',
      tribe: user?.tribe || '',
      income: user?.income || user?.annualIncome || 180000,
      course: user?.currentEducation?.course || '',
      institution: user?.currentEducation?.institution || '',
      aisheCode: user?.currentEducation?.aisheCode || '',
      year: user?.currentEducation?.year || '',
      rollNo: user?.currentEducation?.rollNo || '',
      bankName: user?.bankName || '',
      accountNumber: user?.accountNumber || '',
      ifsc: user?.ifsc || '',
    });
    setIsEditing(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: editForm.name,
      fatherName: editForm.fatherName,
      mobile: editForm.mobile,
      email: editForm.email,
      state: editForm.state,
      district: editForm.district,
      tribe: editForm.tribe,
      income: Number(editForm.income) || 0,
      annualIncome: Number(editForm.income) || 0,
      currentEducation: {
        ...(user?.currentEducation || {}),
        course: editForm.course,
        institution: editForm.institution,
        aisheCode: editForm.aisheCode,
        year: editForm.year,
        rollNo: editForm.rollNo,
      },
      bankName: editForm.bankName,
      accountNumber: editForm.accountNumber,
      ifsc: editForm.ifsc,
    };

    dbService.saveApplicant(updated);
    dbService.setCurrentUser(updated);
    if (setUser) setUser(updated);
    if (setCurrentUser) setCurrentUser(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const [showLangModal, setShowLangModal] = useState(false);
  const navigate = useNavigate();

  const currentLangObj = TOP_LANGUAGES.find((l) => l.code === appLanguage) || TOP_LANGUAGES[0];

  const sections = [
    {
      title: 'Personal & Demographic Details',
      items: [
        { icon: User, label: 'Full Name', value: user?.name || 'Applicant' },
        { icon: User, label: "Father's Name", value: user?.fatherName || 'Not specified' },
        { icon: Phone, label: 'Mobile (Aadhaar linked)', value: user?.mobile || 'Not specified' },
        { icon: Mail, label: 'Email', value: user?.email || 'Not specified' },
        { icon: MapPin, label: 'Permanent Domicile', value: `${user?.state || 'India'}${user?.district ? `, ${user.district}` : ''}` },
      ],
    },
    {
      title: 'Tribal & Category Verification',
      items: [
        { icon: Shield, label: 'Constitutional Category', value: `${user?.category || 'ST'} (${user?.subCategory || 'Applicant'})` },
        { icon: Users, label: 'Community / Tribe', value: user?.tribe || 'Not specified' },
        { icon: Shield, label: 'Aadhaar Verification', value: `XXXX-XXXX-${user?.aadhaarLast4 || 'XXXX'} (UIDAI Verified ✓)` },
        { icon: Landmark, label: 'Annual Parental Income', value: `₹${(user?.annualIncome || 0).toLocaleString('en-IN')} (Under Limit)` },
      ],
    },
    {
      title: 'Current Educational Enrolment',
      items: [
        { icon: GraduationCap, label: 'Course / Degree', value: user?.currentEducation?.course || 'Not specified' },
        { icon: Building2, label: 'Premier Institution', value: user?.currentEducation?.institution || 'Not specified' },
        { icon: Building2, label: 'AISHE Code', value: user?.currentEducation?.aisheCode || 'Not specified' },
        { icon: GraduationCap, label: 'Year of Study', value: user?.currentEducation?.year || 'Not specified' },
        { icon: User, label: 'Student Roll No', value: user?.currentEducation?.rollNo || 'Not specified' },
      ],
    },
    {
      title: 'Direct Benefit Transfer (DBT) Bank Account',
      items: [
        { icon: Landmark, label: 'Bank Name', value: user?.bankName || 'Aadhaar Linked Bank' },
        { icon: Landmark, label: 'Aadhaar Seeded Account', value: user?.accountNumber || '•••• •••• ••••' },
        { icon: Landmark, label: 'IFSC Code', value: user?.ifsc || 'SBIN000XXXX' },
        { icon: Shield, label: 'NPCI Mapping Status', value: 'Active & DBT Enabled ✓' },
      ],
    },
  ];

  if (!user) {
    return (
      <PageTransition className="pt-24 pb-20 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-saffron/15 text-saffron flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Applicant Profile</h2>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 mb-5">Please sign in to view and manage your profile details.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-saffron to-saffron-light text-white text-xs font-bold shadow-md shadow-saffron/20 hover:brightness-110 active:scale-95 transition-all"
        >
          Sign In Now
        </button>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="pt-2 pb-20 px-4">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-4 rounded-3xl p-5 border flex flex-col items-center text-center mb-4 shadow-sm ${
          darkMode
            ? 'bg-navy-light/60 border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron to-saffron-light flex items-center justify-center text-3xl text-white font-bold shadow-lg shadow-saffron/25 mb-3">
          {(user?.name || 'A').charAt(0).toUpperCase()}
        </div>
        <h2 className="font-bold text-lg">{user?.name || 'Applicant'}</h2>
        <p className={`text-xs font-mono mt-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
          {user?.id || 'APPL-2026-ST'}
        </p>
        <span className="mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-saffron/15 text-saffron">
          {user?.category || 'ST'} • {user?.subCategory || 'Applicant'} • {user?.tribe || 'Tribal Community'}
        </span>

        {/* Profile Completion Bar */}
        <div className="w-full max-w-xs mt-4">
          <div className="flex justify-between text-[11px] mb-1.5 font-medium">
            <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>
              Aadhaar & DigiLocker Verification
            </span>
            <span className="text-green-500 font-bold">{user?.profileCompletion || 100}%</span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-slate-100'}`}>
            <div
              className="h-full bg-gradient-to-r from-saffron to-saffron-light rounded-full"
              style={{ width: `${user?.profileCompletion || 100}%` }}
            />
          </div>
        </div>

        {/* Edit Profile Toggle Button */}
        <button
          onClick={() => (isEditing ? setIsEditing(false) : startEditing())}
          className={`mt-4 px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
            isEditing
              ? 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-gray-300 border-transparent'
              : 'bg-saffron/15 text-saffron border-saffron/30 hover:bg-saffron/25'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel Editing' : 'Edit Profile Details'}</span>
        </button>
      </motion.div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="mb-4 p-3 rounded-2xl bg-green-500/15 border border-green-500/30 text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile changes successfully updated in your permanent record!</span>
        </div>
      )}

      {/* Editable Form vs Read-only Sections */}
      {isEditing ? (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSaveProfile}
          className={`rounded-3xl p-5 border mb-5 space-y-4 shadow-sm ${
            darkMode ? 'bg-navy-light/60 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-inherit">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-saffron" />
              <span>Edit Applicant Details</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">UIDAI ST Verified</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-slate-600 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-medium focus:outline-saffron"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-gray-300">Father's Name</label>
                <input
                  type="text"
                  value={editForm.fatherName || ''}
                  onChange={(e) => setEditForm({ ...editForm, fatherName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-medium focus:outline-saffron"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-gray-300">Tribe / Community</label>
                <input
                  type="text"
                  value={editForm.tribe || ''}
                  onChange={(e) => setEditForm({ ...editForm, tribe: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-medium focus:outline-saffron"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-gray-300">Mobile (Aadhaar linked)</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={editForm.mobile || ''}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-mono focus:outline-saffron"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-gray-300">Email Address</label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-saffron"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-gray-300">State Domicile</label>
                <input
                  type="text"
                  value={editForm.state || ''}
                  onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-saffron"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-gray-300">District</label>
                <input
                  type="text"
                  value={editForm.district || ''}
                  onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-saffron"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-600 dark:text-gray-300">Annual Family Income (₹)</label>
              <input
                type="number"
                value={editForm.income || ''}
                onChange={(e) => setEditForm({ ...editForm, income: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-mono focus:outline-saffron"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-600 dark:text-gray-300">Enrolled Institution</label>
              <input
                type="text"
                value={editForm.institution || ''}
                onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-saffron"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-gray-300">Course / Degree</label>
                <input
                  type="text"
                  value={editForm.course || ''}
                  onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-saffron"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-gray-300">Student Roll No</label>
                <input
                  type="text"
                  value={editForm.rollNo || ''}
                  onChange={(e) => setEditForm({ ...editForm, rollNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-mono focus:outline-saffron"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-green-600 text-white shadow-md hover:bg-green-700 text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.form>
      ) : (
        <>
          {/* Information Sections */}
          {sections.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.06 }}
              className="mb-4"
            >
              <h3 className={`font-bold text-xs uppercase tracking-wider mb-2 ${
                darkMode ? 'text-gray-300' : 'text-slate-700'
              }`}>
                {section.title}
              </h3>
              <div className={`rounded-2xl border overflow-hidden shadow-xs ${
                darkMode ? 'bg-navy-light/40 border-white/10' : 'bg-white border-slate-200'
              }`}>
                {section.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-4 py-3 border-b border-inherit last:border-b-0 ${
                        darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-saffron shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-[10px] uppercase font-bold tracking-wider ${
                          darkMode ? 'text-gray-400' : 'text-slate-400'
                        }`}>
                          {item.label}
                        </p>
                        <p className={`text-xs font-semibold truncate ${
                          darkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </>
      )}

      {/* Family Members on Scholarship */}
      {(user?.familyMembers && user.familyMembers.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <h3 className={`font-bold text-xs uppercase tracking-wider mb-2 ${
            darkMode ? 'text-gray-300' : 'text-slate-700'
          }`}>
            Family Members Availing Scholarships
          </h3>
          {user.familyMembers.map((member, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-4 flex items-center justify-between shadow-xs ${
                darkMode ? 'bg-navy-light/40 border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs">{member.name}</p>
                  <p className={`text-[11px] ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                    {member.relation} • {member.scheme}
                  </p>
                </div>
              </div>
              <span className="text-green-500 text-xs font-bold bg-green-500/15 px-2.5 py-0.5 rounded-full">
                {member.status}
              </span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Preferences & Settings */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="space-y-2 mb-4"
      >
        <h3 className={`font-bold text-xs uppercase tracking-wider mb-2 ${
          darkMode ? 'text-gray-300' : 'text-slate-700'
        }`}>
          App Settings & Appearance
        </h3>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3.5 shadow-xs transition-colors ${
            darkMode ? 'bg-navy-light/40 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            <span className="font-semibold text-xs">App Appearance</span>
          </div>
          <span className="text-xs font-bold text-saffron">
            {darkMode ? 'Dark Mode (Active)' : 'Light Mode (White Default)'}
          </span>
        </button>

        {/* Language Selection */}
        <button
          onClick={() => setShowLangModal(true)}
          className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3.5 shadow-xs transition-colors ${
            darkMode ? 'bg-navy-light/40 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-saffron" />
            <span className="font-semibold text-xs">Language / भाषा</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="font-bold text-saffron">{currentLangObj?.nativeName || 'English'}</span>
            <span className="text-[11px]">({currentLangObj?.label || 'English'})</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </button>
      </motion.div>

      {/* Official System Information & Security Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl p-5 border space-y-3 mb-4 shadow-xs ${
          darkMode ? 'bg-navy-light/50 border-white/10' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                JAGO System Information
              </h3>
              <p className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Ministry of Tribal Affairs • Government of India
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-600 dark:text-teal-400">
            v{currentVersion} Active
          </span>
        </div>

        <div className={`p-3 rounded-2xl border text-xs space-y-1.5 ${
          darkMode ? 'bg-white/5 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">App Edition</span>
            <span className="font-semibold">MoTA Official Mobile App (v{currentVersion})</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Data Fabric Integration</span>
            <span className="font-semibold text-green-500">DigiLocker & UIDAI Active</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Security & Encryption</span>
            <span className="font-semibold">DPDP Act Compliant (AES-256)</span>
          </div>
        </div>
      </motion.div>

      {/* Sign Out Action Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 mb-8"
      >
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className={`w-full py-3.5 px-4 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            darkMode
              ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
              : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 shadow-xs'
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of JAGO Account</span>
        </button>
      </motion.div>

      {/* Top 7 Languages Selection Modal */}
      <LanguageSelectModal
        isOpen={showLangModal}
        onClose={() => setShowLangModal(false)}
      />
    </PageTransition>
  );
}
