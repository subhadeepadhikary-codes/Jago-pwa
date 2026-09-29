import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  History,
  Lock,
  Eye,
  FileCheck2,
  RefreshCw,
  Info,
  Database,
  ArrowRight
} from 'lucide-react';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';

export default function ConsentManager() {
  const { currentApplicant } = useAuth();
  const [consents, setConsents] = useState([]);
  const [revokedMap, setRevokedMap] = useState({});
  const [activeTab, setActiveTab] = useState('consents'); // 'consents' | 'pipeline' | 'audit'

  useEffect(() => {
    const records = apiService.getConsentRecords(currentApplicant?.id || 'DEMO-ST-2026-8471');
    setConsents(records);
  }, [currentApplicant]);

  const toggleConsent = (id) => {
    const isCurrentlyRevoked = !!revokedMap[id];
    const newRevokedState = !isCurrentlyRevoked;
    setRevokedMap(prev => ({
      ...prev,
      [id]: newRevokedState
    }));

    // Update in database and cloud vault
    const newStatus = newRevokedState ? 'REVOKED' : 'ACTIVE';
    apiService.updateConsentStatus(currentApplicant?.id || 'DEMO-ST-2026-8471', id, newStatus);
  };

  const pipelineStages = [
    { name: '1. Request', desc: 'MoTA Scheme requests specific verification parameters', icon: Database },
    { name: '2. Consent', desc: 'Student reviews purpose & grants explicit permission', icon: KeyRound },
    { name: '3. Direct Fetch', desc: 'Data fetched directly via Gov API without physical scans', icon: RefreshCw },
    { name: '4. Verify', desc: 'Deterministic engine cross-checks eligibility rules', icon: FileCheck2 },
    { name: '5. Zero-Store', desc: 'Verification status logged; zero raw documents stored', icon: Shield },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-5 pb-24"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-saffron/20 text-saffron border border-saffron/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Privacy & Consent Fabric</h1>
              <p className="text-xs text-slate-300">Consent-Driven Data Verification Protocol</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            DPDP Compliant
          </span>
        </div>

        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          You hold sole custody of your demographic and academic records. JAGO retrieves only the minimal data points required to process your scholarship, eliminating redundant physical document uploads.
        </p>

        {/* Tab switch */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl mt-4 border border-slate-700/60 text-xs">
          <button
            onClick={() => setActiveTab('consents')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'consents' ? 'bg-saffron text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Active Consents
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'pipeline' ? 'bg-saffron text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Data Pipeline
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'audit' ? 'bg-saffron text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Access Audit Log
          </button>
        </div>
      </div>

      {/* VIEW: Active Consents */}
      {activeTab === 'consents' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Connected Government Ecosystems ({consents.length})
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              Zero Unnecessary Document Storage
            </span>
          </div>

          {consents.map((consent) => {
            const isRevoked = !!revokedMap[consent.id];
            return (
              <div
                key={consent.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isRevoked
                    ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 opacity-75'
                    : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                        {consent.id}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {consent.source}
                      </h3>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {consent.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {consent.purpose}
                    </p>
                  </div>

                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => toggleConsent(consent.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${
                        isRevoked
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-white'
                          : 'bg-emerald-500 text-white hover:bg-red-500'
                      }`}
                    >
                      {isRevoked ? 'Grant Consent' : 'Active (Revoke)'}
                    </button>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {consent.grantedAt}
                    </span>
                  </div>
                </div>

                {/* Specific Fields Whitelisted */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase">
                    Whitelisted Minimal Fields (Direct Retrieval Only)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {consent.fields.map((field, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        ✓ {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: Data Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-saffron" />
              Verified Data Retrieval Architecture
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Instead of forcing tribal students to upload 10+ PDF files repeatedly across portals, JAGO communicates directly with verified registry nodes through secure, student-consented API handshakes.
            </p>

            <div className="space-y-3 pt-2">
              {pipelineStages.map((stage, i) => {
                const Icon = stage.icon;
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div className="p-2 rounded-lg bg-saffron/20 text-saffron">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{stage.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Audit Log */}
      {activeTab === 'audit' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-saffron" />
              Immutable Access Audit Log
            </h2>
            <span className="text-[10px] text-slate-400">Past 30 Days</span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { time: 'Today, 10:14 AM', actor: 'MoTA NFST Service', action: 'Direct verification of AISHE code U-0584 via APAAR Gateway', status: 'VERIFIED' },
              { time: '22 Sep 2026, 03:45 PM', actor: 'Institute Nodal Officer', action: 'Read-only view of ST Community Certificate (JH/ST/2022/88921)', status: 'ACCESSED' },
              { time: '18 Sep 2026, 11:30 AM', actor: 'State Revenue Gateway', action: 'Income slab check (Annual income <= 6.0L)', status: 'EXCEPTION FLAGGED' },
              { time: '12 Sep 2026, 09:12 AM', actor: 'Student (Sunita Soren)', action: 'Granted consent token for DigiLocker and Academic Bank of Credits', status: 'CONSENT GRANTED' },
            ].map((log, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{log.actor}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{log.action}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Policy Guarantee */}
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>Revoking consent immediately halts automatic verification. You can re-enable consent at any time without forfeiting your application progress.</span>
      </div>
    </motion.div>
  );
}
