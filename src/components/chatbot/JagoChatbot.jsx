import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Bot,
  User,
  ExternalLink,
  RotateCcw,
  Send,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { voiceService } from '../../services/voiceService';

// Predefined interaction categories (Option queries)
const mainCategories = [
  { id: 'status', label: '📌 Application Status', icon: '📌' },
  { id: 'family', label: '👨‍👩‍👧 Family Scholarship Hub', icon: '👨‍👩‍👧' },
  { id: 'consent', label: '🔐 Consent & DigiLocker', icon: '🔐' },
  { id: 'discovery', label: '🎯 Find My Scholarship', icon: '🎯' },
  { id: 'payment', label: '💰 PFMS & DBT Disbursal', icon: '💰' },
  { id: 'deficiency', label: '⚠️ Fix Deficiency (Notice)', icon: '⚠️' },
  { id: 'schemes', label: '📜 5 MoTA ST Schemes', icon: '📜' },
];

const categoryResponses = {
  status: {
    text: `Here is the live status of your MoTA scholarship applications:\n\n1. **National Fellowship for Higher Education (NFST-2026-4421)**\n• Status: **Under Review (Stage 2 of 6)**\n• Note: Awaiting updated income certificate via DigiLocker / e-District.\n\n2. **Top Class Education (TCE-2025-1109)**\n• Status: **Disbursed (₹2,45,000)**\n• PFMS UTR: Credited to SBI A/C ending in 4821.`,
    actionChips: [
      { label: '📊 View 6-Stage Timeline', action: { type: 'navigate', path: '/tracker' } },
      { label: '⚠️ Fix Deficiency', action: { type: 'query', key: 'deficiency' } },
      { label: '« Main Menu', action: { type: 'menu' } },
    ],
  },
  family: {
    text: `**Family Scholarship Hub Consolidated View:**\n\n• **Household ID:** HH-JH-RAN-9942 (Ranchi District)\n• **Total Household Benefits:** ₹3,32,500\n• **Sunita Soren:** B.Tech (IIT KGP) — NFST (₹3,10,000)\n• **Birsa Soren:** Class 12 (EMRS) — Post-Matric (₹18,000)\n• **Muni Soren:** Class 9 (KGBV) — Pre-Matric (₹4,500 - Disbursed)\n\nShared family income & domicile records prevent duplicate submissions across children.`,
    actionChips: [
      { label: '👨‍👩‍👧 Open Family Hub', action: { type: 'navigate', path: '/family' } },
      { label: '« Main Menu', action: { type: 'menu' } },
    ],
  },
  consent: {
    text: `**Consent-Driven Data Fabric:**\n\nJAGO uses verified data retrieval rather than repeated document uploads:\n\n• **DigiLocker:** ST Certificate & Domicile\n• **APAAR / ABC:** Academic Credits & AISHE Enrollment (U-0584)\n• **State e-District:** Revenue Income Records\n• **PFMS:** Aadhaar-seeded Bank Account verification\n\n*DPDP Act compliant: You can pause or revoke consent at any time.*`,
    actionChips: [
      { label: '🔐 Manage Consents', action: { type: 'navigate', path: '/consent' } },
      { label: '« Main Menu', action: { type: 'menu' } },
    ],
  },
  discovery: {
    text: `**Find My Scholarship (Explainable Rules Engine):**\n\nJAGO transparently checks your eligibility against all 5 MoTA schemes:\n\n1. Pre-Matric ST (Classes 9-10)\n2. Post-Matric ST (Class 11 to PG)\n3. Top Class Education (Premier Institutes like IITs/NITs/AIIMS)\n4. National Fellowship (NFST for M.Phil/Ph.D.)\n5. National Overseas Scholarship (NOS for QS Top 500 universities)\n\nDeterministic criteria ensure zero arbitrary rejections.`,
    actionChips: [
      { label: '🎯 Run Eligibility Wizard', action: { type: 'navigate', path: '/find-scholarship' } },
      { label: '« Main Menu', action: { type: 'menu' } },
    ],
  },
  payment: {
    text: `**PFMS & DBT Direct Benefit Disbursal:**\n\n• **Aadhaar Seeding Status:** Active (State Bank of India)\n• **NPCI Mapping:** Verified (Aadhaar ends with 9921)\n• **Recent Disbursal:** ₹2,45,000 credited under Top Class Education\n• **Next Disbursal:** ₹3,10,000 scheduled after Institute nodal verification.\n\nDirect benefit transfer occurs strictly into Aadhaar-linked accounts.`,
    actionChips: [
      { label: '💳 View Payment Grid', action: { type: 'navigate', path: '/tracker' } },
      { label: '« Main Menu', action: { type: 'menu' } },
    ],
  },
  deficiency: {
    text: `**Mismatch ≠ Rejection Guarantee:**\n\n• **Issue:** Income certificate renewal required for FY 2025-26.\n• **Status:** Routed to Human Exception Review Queue (District Officer).\n• **Action Required:** Open Document Wallet and click 'Sync / Fetch' via DigiLocker to auto-resolve.\n\n*Your application is NOT rejected while in the correction window.*`,
    actionChips: [
      { label: '📁 Open Document Wallet', action: { type: 'navigate', path: '/documents' } },
      { label: '« Main Menu', action: { type: 'menu' } },
    ],
  },
  schemes: {
    text: `**Ministry of Tribal Affairs ST Scholarships:**\n\n• **Pre-Matric ST:** ₹3,500/year for day scholars, ₹7,000 for hostellers\n• **Post-Matric ST:** Full tuition fee + maintenance allowance\n• **Top Class ST:** Full tuition fee up to ₹2.0 Lakh/year + living expenses\n• **National Fellowship (NFST):** ₹31,000 - ₹35,000/month for M.Phil / Ph.D.\n• **National Overseas (NOS):** Complete foreign university tuition + maintenance.`,
    actionChips: [
      { label: '🔍 Explore All Schemes', action: { type: 'navigate', path: '/explore' } },
      { label: '« Main Menu', action: { type: 'menu' } },
    ],
  },
};

export default function JagoChatbot({ isOpen, onOpen, onClose }) {
  const { user, applications, darkMode, appLanguage, t } = useApp();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: t('chatbotGreeting'),
      time: new Date(),
      isGreeting: true,
    },
  ]);
  const [typing, setTyping] = useState(false);

  // Sync greeting if appLanguage changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].isGreeting) {
        return [
          {
            id: 1,
            type: 'bot',
            text: t('chatbotGreeting'),
            time: new Date(),
            isGreeting: true,
          },
        ];
      }
      return prev;
    });
  }, [appLanguage, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSendText = (e) => {
    if (e) e.preventDefault();
    const query = inputQuery.trim();
    if (!query) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: query,
      time: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setTyping(true);

    // Process grounded response
    const queryResult = voiceService.processQuery(query, { user, applications, language: appLanguage });

    setTimeout(() => {
      const botText = queryResult.text || queryResult.englishTranslation;

      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: botText,
        actionChips: [
          { label: '📊 View Tracker', action: { type: 'navigate', path: '/tracker' } },
          { label: '🎯 Find Schemes', action: { type: 'navigate', path: '/find-scholarship' } },
          { label: '« Main Menu', action: { type: 'menu' } },
        ],
        time: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 500);
  };

  const handleChipClick = (chip) => {
    if (chip.action.type === 'navigate') {
      onClose();
      navigate(chip.action.path);
      return;
    }

    if (chip.action.type === 'menu') {
      const userMsg = {
        id: Date.now(),
        type: 'user',
        text: '« Main Menu',
        time: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setTyping(true);

      setTimeout(() => {
        const botMsg = {
          id: Date.now() + 1,
          type: 'bot',
          text: 'Select any option below or type a query about your scholarship status, eligibility, or documents:',
          time: new Date(),
          isGreeting: true,
        };
        setMessages((prev) => [...prev, botMsg]);
        setTyping(false);
      }, 350);
      return;
    }

    if (chip.action.type === 'query') {
      handleCategorySelect(chip.action.key);
    }
  };

  const handleCategorySelect = (categoryId) => {
    const category = mainCategories.find((c) => c.id === categoryId);
    if (!category) return;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: category.label,
      time: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    setTimeout(() => {
      const resp = categoryResponses[categoryId];
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: resp.text,
        actionChips: resp.actionChips,
        time: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 450);
  };

  return (
    <>
      {/* Floating Trigger Button (Clean JAGO Assistant Badge) */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          className="fixed bottom-20 right-4 z-40 flex items-center gap-2 p-3.5 rounded-full bg-gradient-to-r from-saffron to-amber-500 text-slate-950 font-bold text-xs shadow-xl shadow-saffron/25 border-2 border-white/40 active:scale-95 transition-all"
        >
          <Bot className="w-5 h-5 text-slate-950" />
          <span className="pr-1 tracking-tight">JAGO</span>
        </motion.button>
      )}

      {/* Slide-over JAGO Chatbot Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className={`fixed inset-x-0 bottom-0 top-12 z-50 rounded-t-[2.5rem] shadow-2xl flex flex-col overflow-hidden border-t ${
              darkMode ? 'bg-navy border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
              darkMode ? 'bg-navy-light/90 border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-saffron to-amber-500 flex items-center justify-center text-slate-950 shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base tracking-tight">JAGO</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/20">
                      Verified MoTA Assistant
                    </span>
                  </div>
                  <p className={`text-[11px] font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                    Unified Scholarship Intelligence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleChipClick({ label: 'Main Menu', action: { type: 'menu' } })}
                  className={`p-2 rounded-xl border transition-colors ${
                    darkMode ? 'hover:bg-white/10 border-white/10' : 'hover:bg-slate-100 border-slate-200'
                  }`}
                  title="Reset Menu"
                >
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-xl border transition-colors ${
                    darkMode ? 'hover:bg-white/10 border-white/10' : 'hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-start gap-2 max-w-[88%]">
                    {msg.type === 'bot' && (
                      <div className="w-7 h-7 rounded-xl bg-saffron/15 text-saffron flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs whitespace-pre-line ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-saffron to-amber-500 text-slate-950 font-medium rounded-br-none'
                          : darkMode
                          ? 'bg-navy-light/90 border border-white/10 text-white rounded-bl-none'
                          : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.type === 'user' && (
                      <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Main Option Categories on Greeting */}
                  {msg.isGreeting && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mt-3 grid grid-cols-2 gap-2 w-full max-w-[94%] pl-9"
                    >
                      {mainCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                            darkMode
                              ? 'bg-navy-card border-white/10 hover:border-saffron/40 text-gray-200'
                              : 'bg-white border-slate-200 hover:border-saffron/40 text-slate-800 shadow-xs'
                          }`}
                        >
                          <span className="text-sm">{cat.icon}</span>
                          <span className="truncate">{cat.label.replace(/^.*? /, '')}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {/* Contextual Action Chips */}
                  {msg.actionChips && msg.actionChips.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2.5 flex flex-wrap gap-1.5 pl-9 max-w-[94%]"
                    >
                      {msg.actionChips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleChipClick(chip)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-xs ${
                            chip.action.type === 'navigate'
                              ? 'bg-saffron text-slate-950 border-saffron hover:bg-saffron-dark'
                              : chip.action.type === 'menu'
                              ? darkMode
                                ? 'bg-white/5 border-white/15 text-gray-400 hover:bg-white/10'
                                : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
                              : darkMode
                              ? 'bg-navy-card/80 border-white/10 text-gray-300 hover:border-saffron/40 hover:text-white'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-saffron/40 hover:text-saffron'
                          }`}
                        >
                          <span>{chip.label}</span>
                          {chip.action.type === 'navigate' && <ExternalLink className="w-3 h-3" />}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  <span className={`text-[9px] mt-1 px-1 pl-9 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                    {msg.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}

              {typing && (
                <div className="flex items-center gap-2 pl-9">
                  <div className={`p-3 rounded-2xl rounded-bl-none border ${
                    darkMode ? 'bg-navy-light/70 border-white/10' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-saffron"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Bottom Text Input Bar (No Audio / Speech) */}
            <form
              onSubmit={handleSendText}
              className={`p-3 border-t shrink-0 flex items-center gap-2 ${
                darkMode ? 'bg-navy-light/90 border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={t('chatbotPlaceholder')}
                className={`flex-1 px-3.5 py-2.5 rounded-2xl border text-xs outline-none transition-colors ${
                  darkMode
                    ? 'bg-navy/70 border-white/15 text-white placeholder-gray-500 focus:border-saffron'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-saffron focus:bg-white'
                }`}
              />
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-saffron to-amber-500 text-slate-950 flex items-center justify-center shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
                title={t('chatbotSend')}
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
