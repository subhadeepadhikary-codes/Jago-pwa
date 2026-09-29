import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  Landmark,
  Bot,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import jagoLogo from '../assets/jago-logo.png';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import LanguageSelectModal from '../components/common/LanguageSelectModal';
import { TOP_LANGUAGES } from '../services/languageService';

const slides = [
  {
    icon: GraduationCap,
    badge: 'Unified Tribal Scholarships',
    title: '5 MoTA Schemes, One Single App',
    description:
      'Seamlessly apply, track, and manage Pre-Matric, Post-Matric, Top Class, National Fellowship (NFST), and Overseas Scholarships in one place.',
    color: 'from-amber-500/20 via-saffron/15 to-transparent',
    iconColor: 'text-saffron',
  },
  {
    icon: ShieldCheck,
    badge: '100% Paperless Verification',
    title: '1-Tap DigiLocker Integration',
    description:
      'Directly pull your verified ST Caste Certificate, Income Proof, and Bonafide Certificates with institutional cryptographic security.',
    color: 'from-blue-500/20 via-indigo-500/15 to-transparent',
    iconColor: 'text-blue-500',
  },
  {
    icon: Landmark,
    badge: 'Direct Benefit Transfer (DBT)',
    title: 'Live Sanction Queue & Bank Sync',
    description:
      'Transparent tracking from institutional verification to Aadhaar-seeded NPCI bank disbursal with official batch queue rankings.',
    color: 'from-green-500/20 via-emerald-500/15 to-transparent',
    iconColor: 'text-green-500',
  },
  {
    icon: Bot,
    badge: 'AI Powered Assistance',
    title: 'Meet Jago Tribal AI Assistant',
    description:
      'Ask questions about scheme eligibility, upload guidance, deadlines, and deficiency resolutions in your preferred tribal language.',
    color: 'from-purple-500/20 via-saffron/15 to-transparent',
    iconColor: 'text-purple-500',
  },
];

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir > 0 ? -100 : 100,
    opacity: 0,
  }),
};

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showLangModal, setShowLangModal] = useState(false);
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();
  const { darkMode, appLanguage } = useApp();

  const currentLangObj = TOP_LANGUAGES.find((l) => l.code === appLanguage) || TOP_LANGUAGES[0];

  const handleFinish = (target = '/login') => {
    completeOnboarding();
    navigate(target);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleFinish('/login');
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold) {
      // Swiped left -> Go to Next Slide
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      // Swiped right -> Go to Previous Slide
      handlePrev();
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div
      className={`min-h-screen flex flex-col justify-between p-6 transition-colors relative overflow-hidden select-none ${
        darkMode ? 'bg-navy text-white' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Top Bar with Skip */}
      <div className="flex items-center justify-between pt-6 z-10">
        <div className="flex items-center gap-2.5">
          <img
            src={jagoLogo}
            alt="JAGO Logo"
            className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-slate-200/80 shadow-xs"
          />
          <div>
            <span className="font-black text-xl tracking-tight text-slate-950 dark:text-white leading-none">
              JAGO
            </span>
            <p className="text-[10px] text-slate-600 dark:text-gray-400 font-semibold leading-none mt-0.5">
              Govt. of India • MoTA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLangModal(true)}
            className="px-2.5 py-1 rounded-full border border-slate-300 dark:border-white/10 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            title="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-saffron" />
            <span>{currentLangObj?.nativeName || 'English'}</span>
          </button>

          {currentSlide < slides.length - 1 && (
            <button
              onClick={() => handleFinish('/login')}
              className="text-xs font-bold text-slate-600 dark:text-gray-300 hover:text-saffron transition-colors px-3 py-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10"
            >
              Skip Tour
            </button>
          )}
        </div>
      </div>

      {/* Slide Content Card with Touch / Drag Gestures */}
      <div className="my-auto py-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={handleDragEnd}
            className="flex flex-col items-center text-center cursor-grab active:cursor-grabbing touch-pan-y"
          >
            {/* Visual Icon Container */}
            <div
              className={`w-28 h-28 rounded-3xl bg-gradient-to-b ${slide.color} flex items-center justify-center mb-7 border-2 border-slate-200 dark:border-white/10 shadow-lg relative pointer-events-none`}
            >
              <Icon className={`w-14 h-14 ${slide.iconColor}`} />
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-saffron text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Badge */}
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-saffron/15 text-saffron-dark dark:text-saffron mb-3 pointer-events-none">
              {slide.badge}
            </span>

            {/* Title */}
            <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white mb-3 max-w-xs pointer-events-none">
              {slide.title}
            </h2>

            {/* Description */}
            <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold max-w-sm leading-relaxed pointer-events-none">
              {slide.description}
            </p>

            <span className="text-[11px] text-slate-600 dark:text-gray-400 font-medium mt-4 pointer-events-none flex items-center gap-1">
              👈 Swipe to slide front & back 👉
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer with Controls */}
      <div className="pb-8 space-y-5 z-10">
        {/* Step Indicator Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-7 bg-saffron'
                  : 'w-2 bg-slate-300 dark:bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        {currentSlide < slides.length - 1 ? (
          <div className="flex items-center gap-2.5">
            {currentSlide > 0 && (
              <button
                onClick={handlePrev}
                className="py-3.5 px-4 rounded-2xl border-2 border-slate-300 dark:border-white/20 text-slate-800 dark:text-gray-200 font-bold text-sm bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-saffron to-saffron-light text-white font-bold text-sm shadow-md shadow-saffron/25 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrev}
                className="py-3.5 px-4 rounded-2xl border-2 border-slate-300 dark:border-white/20 text-slate-800 dark:text-gray-200 font-bold text-sm bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => handleFinish('/login')}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-saffron to-saffron-light text-white font-bold text-sm shadow-md shadow-saffron/25 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In to Your Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                completeOnboarding();
                navigate('/login', { state: { initialTab: 'signup' } });
              }}
              className="w-full py-3.5 px-6 rounded-2xl border-2 border-slate-300 dark:border-white/20 text-xs font-extrabold text-slate-900 dark:text-white bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 shadow-xs transition-colors"
            >
              Register as New Applicant
            </button>
          </div>
        )}
      </div>

      {/* Top 7 Languages Selection Modal */}
      <LanguageSelectModal
        isOpen={showLangModal}
        onClose={() => setShowLangModal(false)}
      />
    </div>
  );
}
