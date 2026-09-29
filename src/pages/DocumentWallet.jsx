import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { documentCategories } from '../data/documents';
import DocumentCard from '../components/common/DocumentCard';
import PageTransition from '../components/layout/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  CloudDownload,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Download,
  Eye,
  RefreshCw,
  Lock,
  Shield,
  Upload,
  Check,
  Building2,
  Sparkles
} from 'lucide-react';
import digilockerBadge from '../assets/digilocker-badge.svg';

export default function DocumentWallet() {
  const { documents, addDocument, syncDigiLockerDocs, resolveDeficiency, applications, darkMode, t } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');

  const getCatLabel = (id, fallback) => {
    switch (id) {
      case 'all': return t('catAll', fallback || 'All Documents');
      case 'Identity': return t('catIdentity', fallback || 'Identity');
      case 'Caste': return t('catCaste', fallback || 'Caste');
      case 'Income': return t('catIncome', fallback || 'Income');
      case 'Academic': return t('catAcademic', fallback || 'Academic');
      default: return fallback || id;
    }
  };

  // Modals state
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showDigiLockerModal, setShowDigiLockerModal] = useState(false);
  const [digiLockerStep, setDigiLockerStep] = useState(1); // 1: pin/auth, 2: select docs, 3: success
  const [digiPin, setDigiPin] = useState(['', '', '', '', '', '']);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New doc form state
  const [newDocForm, setNewDocForm] = useState({
    name: '',
    category: 'Identity',
    docNumber: '',
    issuer: 'State Authority',
    fileUploaded: false,
    fileName: '',
  });

  const [fixingDeficiency, setFixingDeficiency] = useState(false);

  const filtered =
    activeCategory === 'all'
      ? documents
      : documents.filter((d) => d.category === activeCategory);

  // DigiLocker mock items to fetch
  const [digiItems, setDigiItems] = useState([
    { id: 'dl-st', name: 'ST Caste Certificate', issuer: 'Jharkhand e-District Portal', size: '320 KB', selected: true },
    { id: 'dl-inc', name: 'Annual Income Certificate (2026-27)', issuer: 'Revenue Dept, Ranchi', size: '280 KB', selected: true },
    { id: 'dl-xii', name: 'Class XII Marksheet & Certificate', issuer: 'CBSE New Delhi', size: '540 KB', selected: true },
    { id: 'dl-adh', name: 'Aadhaar Card (e-Aadhaar XML)', issuer: 'UIDAI Govt of India', size: '210 KB', selected: true },
    { id: 'dl-dom', name: 'Permanent Resident / Domicile Certificate', issuer: 'Govt of Jharkhand', size: '190 KB', selected: true },
  ]);

  const toggleDigiItem = (id) => {
    setDigiItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, selected: !it.selected } : it))
    );
  };

  const handleDigiPinChange = (idx, val) => {
    if (val.length > 1) return;
    const updated = [...digiPin];
    updated[idx] = val;
    setDigiPin(updated);
  };

  const handleDigiSync = () => {
    const selectedList = digiItems
      .filter((it) => it.selected)
      .map((it) => ({
        id: `digi-${Date.now()}-${it.id}`,
        name: it.name,
        category: it.name.includes('Caste') || it.name.includes('ST')
          ? 'Caste'
          : it.name.includes('Income')
          ? 'Income'
          : it.name.includes('Class')
          ? 'Academic'
          : 'Identity',
        source: 'DigiLocker',
        verified: true,
        type: 'PDF',
        size: it.size,
        uploadDate: new Date().toISOString().split('T')[0],
        icon: it.name.includes('Caste') ? '📜' : it.name.includes('Income') ? '💵' : '🪪',
        usedIn: ['APP-2026-PM-0847', 'APP-2026-TC-0092'],
      }));

    syncDigiLockerDocs(selectedList);

    // If income certificate was synced, clear deficiency automatically
    const hasIncome = selectedList.some((d) => d.category === 'Income');
    if (hasIncome) {
      resolveDeficiency('APP-2026-TC-0092', 'Income Certificate');
    }

    setDigiLockerStep(3);
    setTimeout(() => {
      setShowDigiLockerModal(false);
      setDigiLockerStep(1);
      setDigiPin(['', '', '', '', '', '']);
    }, 1500);
  };

  const handleManualUpload = (e) => {
    e.preventDefault();
    if (!newDocForm.name) return;

    addDocument({
      name: newDocForm.name,
      category: newDocForm.category,
      source: 'Uploaded',
      verified: true,
      icon: newDocForm.category === 'Caste' ? '📜' : newDocForm.category === 'Income' ? '💵' : '📝',
      size: '420 KB',
      docNumber: newDocForm.docNumber,
      issuer: newDocForm.issuer,
    });

    // If re-uploading income certificate, clear deficiency
    if (newDocForm.name.toLowerCase().includes('income')) {
      resolveDeficiency('APP-2026-TC-0092', newDocForm.name);
    }

    setShowUploadModal(false);
    setNewDocForm({
      name: '',
      category: 'Identity',
      docNumber: '',
      issuer: 'State Authority',
      fileUploaded: false,
      fileName: '',
    });
  };

  const handleFixIncomeDeficiency = () => {
    setFixingDeficiency(true);
    setTimeout(() => {
      resolveDeficiency('APP-2026-TC-0092', 'Income Certificate (Re-verified)');
      setFixingDeficiency(false);
      setSelectedDoc((prev) => (prev ? { ...prev, verified: true, issue: null } : null));
    }, 1000);
  };

  return (
    <PageTransition className="pt-2 pb-20 md:pb-8 px-4 md:px-6 max-w-7xl mx-auto w-full">
      {/* DigiLocker Connected Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 rounded-2xl p-4 mb-4 border text-white shadow-md relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #004F98 0%, #002D58 100%)',
          borderColor: 'rgba(255,255,255,0.2)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center border border-white/30 shadow-md shrink-0">
              <img src={digilockerBadge} alt="DigiLocker" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-white text-sm font-bold tracking-tight">DigiLocker Integration</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-400/20 text-green-300 border border-green-400/30">
                  {t('verified', 'Active')}
                </span>
              </div>
              <p className="text-blue-100 text-xs mt-0.5">
                Zero repetitive document submission across all 5 schemes
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-emerald-300 font-semibold">
                <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{t('zeroKnowledgeEncrypted', 'Zero-Knowledge Encrypted (AES-256)')}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setDigiLockerStep(1);
              setShowDigiLockerModal(true);
            }}
            className="px-3.5 py-1.5 bg-white text-blue-900 rounded-xl text-xs font-bold shadow-md hover:bg-blue-50 active:scale-95 transition-all"
          >
            {t('syncDigilocker', 'Sync / Fetch')}
          </button>
        </div>
      </motion.div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {documentCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-saffron text-white shadow-sm'
                : darkMode
                ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{cat.icon}</span>
            {getCatLabel(cat.id, cat.label)}
          </button>
        ))}
      </div>

      {/* Document Grid with Clickable Items */}
      <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
        {filtered.map((doc, i) => (
          <div key={doc.id} onClick={() => setSelectedDoc(doc)} className="cursor-pointer">
            <DocumentCard doc={doc} index={i} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={`text-center py-10 rounded-2xl border ${
            darkMode ? 'bg-navy-light/30 border-white/10 text-gray-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">No documents found in this category</p>
          </div>
        )}
      </div>

      {/* Floating Action Button for Upload */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-20 left-4 z-40 px-4 h-12 rounded-2xl bg-gradient-to-r from-saffron to-saffron-light text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-saffron/30"
      >
        <Plus className="w-5 h-5" />
        <span>Upload Details & Docs</span>
      </motion.button>

      {/* ================= MODAL 1: DOCUMENT DETAILS / PREVIEW ================= */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-sm rounded-3xl p-5 border shadow-2xl relative ${
                darkMode ? 'bg-navy-light border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <button
                onClick={() => setSelectedDoc(null)}
                className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-white/10 text-gray-300' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-saffron/10 flex items-center justify-center text-2xl">
                  {selectedDoc.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight pr-6">{selectedDoc.name}</h3>
                  <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                    Category: {selectedDoc.category}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                {selectedDoc.verified ? (
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-xs text-green-500 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Digitally Verified by {selectedDoc.source}</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-medium">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Action Required: Deficiency Notice</span>
                    </div>
                    <p className="text-[11px] opacity-90">{selectedDoc.issue}</p>
                    <button
                      onClick={handleFixIncomeDeficiency}
                      disabled={fixingDeficiency}
                      className="mt-2.5 w-full py-2 rounded-lg bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
                    >
                      {fixingDeficiency ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying Document...
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" /> Re-upload & Clear Deficiency
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Document Metadata Table */}
              <div className={`rounded-xl p-3 text-xs space-y-2 mb-4 border ${
                darkMode ? 'bg-navy/60 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>File Format</span>
                  <span className="font-semibold">{selectedDoc.type || 'PDF'}</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>File Size</span>
                  <span className="font-semibold">{selectedDoc.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>Verified On</span>
                  <span className="font-semibold">{selectedDoc.uploadDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>Source Authority</span>
                  <span className="font-semibold text-blue-500">{selectedDoc.source}</span>
                </div>
              </div>

              {/* Attached Applications */}
              {selectedDoc.usedIn && selectedDoc.usedIn.length > 0 && (
                <div className="mb-4">
                  <p className={`text-[11px] font-semibold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                    Active Applications Using This Document:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDoc.usedIn.map((appId) => (
                      <span
                        key={appId}
                        className="px-2.5 py-1 rounded-lg bg-saffron/15 text-saffron text-[10px] font-mono font-bold"
                      >
                        {appId}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Previewing official cryptographic copy of ${selectedDoc.name}`)}
                  className={`flex-1 h-11 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                    darkMode ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> View Certificate
                </button>
                <button
                  onClick={() => alert(`Certificate downloaded to device storage.`)}
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-saffron to-saffron-light text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-saffron/20"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 2: AUTHENTIC DIGILOCKER SYNC MODAL ================= */}
      <AnimatePresence>
        {showDigiLockerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl bg-white text-slate-900 border border-slate-200"
            >
              {/* DigiLocker Official Blue Header */}
              <div className="bg-[#004F98] text-white p-4 relative">
                <button
                  onClick={() => setShowDigiLockerModal(false)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shrink-0">
                    <img src={digilockerBadge} alt="DigiLocker" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base tracking-tight leading-tight">DigiLocker</h3>
                    <p className="text-[10px] text-blue-200">Government of India • National Digital Locker</p>
                  </div>
                </div>
              </div>

              {/* DigiLocker Step 1: Security PIN */}
              {digiLockerStep === 1 && (
                <div className="p-5 space-y-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto mb-2">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">Enter DigiLocker 6-Digit PIN</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verify consent to fetch verified documents for ST Scholarship
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 my-4">
                    {digiPin.map((p, idx) => (
                      <input
                        key={idx}
                        type="password"
                        maxLength={1}
                        value={p}
                        onChange={(e) => handleDigiPinChange(idx, e.target.value)}
                        placeholder="•"
                        className="w-10 h-12 text-center text-lg font-bold rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none bg-slate-50"
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setDigiLockerStep(2)}
                    className="w-full h-11 rounded-xl bg-[#004F98] text-white text-xs font-bold shadow-md hover:bg-blue-800 active:scale-95 transition-all"
                  >
                    Authenticate & Fetch Documents
                  </button>

                  <p className="text-[10px] text-center text-slate-400">
                    Protected by Government of India IT Act 2000
                  </p>
                </div>
              )}

              {/* DigiLocker Step 2: Select Documents to Auto-Upload */}
              {digiLockerStep === 2 && (
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">Found {digiItems.length} Verified Certificates</h4>
                      <p className="text-[10px] text-slate-500">Auto-matched with Aadhaar: XXXX-XXXX-7823</p>
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Ready to Sync
                    </span>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                    {digiItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleDigiItem(item.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          item.selected ? 'bg-blue-50/70 border-blue-400' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                            item.selected ? 'bg-[#004F98] text-white' : 'border border-slate-300'
                          }`}>
                            {item.selected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{item.name}</p>
                            <p className="text-[10px] text-slate-500">{item.issuer} • {item.size}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleDigiSync}
                    className="w-full h-11 rounded-xl bg-[#004F98] text-white text-xs font-bold shadow-md hover:bg-blue-800 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CloudDownload className="w-4 h-4" /> Sync Selected to App Wallet
                  </button>
                </div>
              )}

              {/* DigiLocker Step 3: Success Sync */}
              {digiLockerStep === 3 && (
                <div className="p-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900">DigiLocker Synced!</h4>
                  <p className="text-xs text-slate-600">
                    All selected documents have been verified and securely loaded into your scholarship wallet.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 3: DIRECT UPLOAD ALL DETAILS & DOCS ================= */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-sm rounded-3xl p-5 border shadow-2xl relative ${
                darkMode ? 'bg-navy-light border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <button
                onClick={() => setShowUploadModal(false)}
                className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-white/10 text-gray-300' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-saffron/15 text-saffron flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Upload Details & Document</h3>
                  <p className={`text-[11px] ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                    Add certificate details directly into the app
                  </p>
                </div>
              </div>

              <form onSubmit={handleManualUpload} className="space-y-3 text-xs">
                <div>
                  <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                    Document Name / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Income Certificate 2026-27"
                    value={newDocForm.name}
                    onChange={(e) => setNewDocForm({ ...newDocForm, name: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none font-medium ${
                      darkMode ? 'bg-navy/80 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                      Category
                    </label>
                    <select
                      value={newDocForm.category}
                      onChange={(e) => setNewDocForm({ ...newDocForm, category: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border outline-none font-medium ${
                        darkMode ? 'bg-navy/80 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <option value="Identity">Identity</option>
                      <option value="Caste">Caste / ST</option>
                      <option value="Income">Income</option>
                      <option value="Academic">Academic</option>
                      <option value="Financial">Financial / Bank</option>
                      <option value="Other">Other Certificate</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                      Certificate / Roll No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JH-2026-9811"
                      value={newDocForm.docNumber}
                      onChange={(e) => setNewDocForm({ ...newDocForm, docNumber: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border outline-none font-medium ${
                        darkMode ? 'bg-navy/80 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sub-Divisional Officer, Ranchi"
                    value={newDocForm.issuer}
                    onChange={(e) => setNewDocForm({ ...newDocForm, issuer: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none font-medium ${
                      darkMode ? 'bg-navy/80 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                {/* File Attachment Dropzone Simulation */}
                <div
                  onClick={() => setNewDocForm({ ...newDocForm, fileUploaded: true, fileName: 'verified_scan_doc.pdf' })}
                  className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                    newDocForm.fileUploaded
                      ? 'border-green-500 bg-green-500/10'
                      : darkMode
                      ? 'border-white/20 hover:border-saffron bg-navy/40'
                      : 'border-slate-300 hover:border-saffron bg-slate-50'
                  }`}
                >
                  {newDocForm.fileUploaded ? (
                    <div className="flex items-center justify-center gap-2 text-green-500 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{newDocForm.fileName} (Attached)</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-6 h-6 mx-auto text-saffron mb-1" />
                      <p className="font-semibold text-xs">Tap to choose PDF / Photo</p>
                      <p className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>
                        Supports PDF, JPG, PNG up to 5 MB
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-saffron to-saffron-light text-white text-xs font-bold shadow-md active:scale-95 transition-all mt-2"
                >
                  Save to Document Wallet
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
