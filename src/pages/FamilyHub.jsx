import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  CreditCard,
  GraduationCap,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
  ReceiptText
} from 'lucide-react';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';

export default function FamilyHub() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [familyData, setFamilyData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const data = apiService.getFamilyHubData(currentUser?.id || 'DEMO-ST-2026-8471');
    setFamilyData(data);
    if (data?.students?.length > 0) {
      setSelectedStudent(data.students[0]);
    }
  }, [currentUser]);

  if (!familyData) {
    return (
      <div className="p-6 text-center py-20">
        <div className="w-10 h-10 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading Family Scholarship Hub...</p>
      </div>
    );
  }

  const totalBenefits =
    (familyData.totalDisbursedToHousehold || 0) + (familyData.totalPendingSanction || 0) || 559500;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-5 pb-24 pt-2"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy via-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-saffron/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-saffron/20 text-saffron border border-saffron/30">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold">Family Scholarship Hub</h1>
              <p className="text-xs text-slate-300">MoTA Household Beneficiary Consolidation</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Family Linked
          </span>
        </div>

        {/* Household Metrics */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-700/60">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">RATION / SEED ID</span>
            <span className="text-sm font-mono font-bold text-amber-300">{familyData.householdId}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">TOTAL HOUSEHOLD SUPPORT</span>
            <span className="text-lg font-black text-white">₹{totalBenefits.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300 text-xs">
        <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Privacy-Preserved Family View: </span>
          Only authorized sibling scholarship lifecycles are consolidated to prevent redundant verifications and identify unreached children.
        </div>
      </div>

      {/* Sibling Card Carousel / List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Family Members ({familyData.students.length})
          </h2>
          <span className="text-xs text-saffron font-medium">1 Household • 3 Students</span>
        </div>

        {familyData.students.map((student) => {
          const isSelected = selectedStudent?.id === student.id;
          return (
            <motion.div
              key={student.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedStudent(student)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-800/90 border-saffron shadow-md ring-2 ring-saffron/20'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${student.color} text-white font-black text-lg flex items-center justify-center shadow-sm`}>
                    {student.avatarLetter}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {student.name}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {student.relation}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {student.educationLevel}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                    ₹{student.amount.toLocaleString('en-IN')}
                  </span>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    student.status === 'Disbursed'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                      : student.status === 'Under Review'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                      : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                  }`}>
                    {student.status}
                  </span>
                </div>
              </div>

              {/* Scheme Detail Bar */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <GraduationCap className="w-3.5 h-3.5 text-saffron" />
                  <span className="truncate max-w-[220px]">{student.activeScheme}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">{student.currentStage.split(' ')[0]}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Student Expanded Insight */}
      {selectedStudent && (
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Selected Beneficiary Audit
            </span>
            <span className="text-xs font-mono text-slate-400">{selectedStudent.id}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Current Pipeline Stage:</span>
              <span className="font-semibold text-slate-900 dark:text-white text-right max-w-[200px]">
                {selectedStudent.currentStage}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">PFMS / DBT Status:</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {selectedStudent.paymentStatus}
              </span>
            </div>
          </div>

          {selectedStudent.relation === 'Self' ? (
            <button
              onClick={() => navigate('/tracker')}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-saffron hover:bg-saffron-dark text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <ReceiptText className="w-4 h-4" />
              Open My Unified 6-Stage Timeline
            </button>
          ) : (
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 text-xs border border-blue-200 dark:border-blue-900/40">
              <div className="flex items-center gap-1.5 font-bold mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                Sibling Autonomous Verification Enabled
              </div>
              <span>Shared family income certificate and domicile proof auto-apply to {selectedStudent.name}&apos;s file without re-upload.</span>
            </div>
          )}
        </div>
      )}

      {/* Add Sibling / Link Another Beneficiary */}
      <button
        onClick={() => alert("Family member auto-discovery triggers via Ration/Aadhaar family linkages during admission.")}
        className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-saffron text-slate-600 dark:text-slate-400 hover:text-saffron text-xs font-bold flex items-center justify-center gap-2 transition-all"
      >
        <PlusCircle className="w-4 h-4" />
        Link Another Sibling via Jan-Aadhaar / Ration ID
      </button>
    </motion.div>
  );
}
