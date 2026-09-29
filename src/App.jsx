import { useState } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';

// Layout
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';
import DesktopSidebar from './components/layout/DesktopSidebar';
import DesktopTopBar from './components/layout/DesktopTopBar';

// Student Pages
import Dashboard from './pages/Dashboard';
import ScholarshipExplorer from './pages/ScholarshipExplorer';
import ScholarshipDetail from './pages/ScholarshipDetail';
import ApplyScholarship from './pages/ApplyScholarship';
import ApplicationTracker from './pages/ApplicationTracker';
import DocumentWallet from './pages/DocumentWallet';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import EligibilityChecker from './pages/EligibilityChecker';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import FamilyHub from './pages/FamilyHub';
import ConsentManager from './pages/ConsentManager';
import FindScholarship from './pages/FindScholarship';

// Officer Console Pages
import OfficerLogin from './pages/officer/OfficerLogin';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerQueue from './pages/officer/OfficerQueue';
import OfficerExceptionReview from './pages/officer/OfficerExceptionReview';
import OfficerCoverageRadar from './pages/officer/OfficerCoverageRadar';

// Chatbot & Modals
import JagoChatbot from './components/chatbot/JagoChatbot';
import UpdatePromptModal from './components/common/UpdatePromptModal';
import IosInstallPrompt from './components/common/IosInstallPrompt';

function ProtectedRoute({ children }) {
  const { isAuthenticated, hasSeenOnboarding } = useAuth();

  if (!hasSeenOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function OfficerProtectedRoute({ children }) {
  const { isOfficerAuthenticated } = useAuth();
  if (!isOfficerAuthenticated) {
    return <Navigate to="/officer/login" replace />;
  }
  return children;
}

function AppLayout() {
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();
  const { darkMode, isDesktopView } = useApp();

  const isAuthScreen = location.pathname === '/login' || location.pathname === '/onboarding' || location.pathname === '/officer/login';
  const isOfficerScreen = location.pathname.startsWith('/officer');

  // Common routes component
  const pageRoutes = (
    <Routes location={location} key={location.pathname}>
      {/* Public / Onboarding */}
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />

      {/* Officer Console Routes */}
      <Route path="/officer/login" element={<OfficerLogin />} />
      <Route path="/officer/dashboard" element={<OfficerProtectedRoute><OfficerDashboard /></OfficerProtectedRoute>} />
      <Route path="/officer/queue" element={<OfficerProtectedRoute><OfficerQueue /></OfficerProtectedRoute>} />
      <Route path="/officer/exceptions" element={<OfficerProtectedRoute><OfficerExceptionReview /></OfficerProtectedRoute>} />
      <Route path="/officer/coverage-radar" element={<OfficerProtectedRoute><OfficerCoverageRadar /></OfficerProtectedRoute>} />

      {/* Student Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Dashboard onChatOpen={() => setChatOpen(true)} /></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><ScholarshipExplorer /></ProtectedRoute>} />
      <Route path="/scheme/:id" element={<ProtectedRoute><ScholarshipDetail /></ProtectedRoute>} />
      <Route path="/apply/:schemeId" element={<ProtectedRoute><ApplyScholarship /></ProtectedRoute>} />
      <Route path="/apply" element={<ProtectedRoute><ApplyScholarship /></ProtectedRoute>} />
      <Route path="/tracker" element={<ProtectedRoute><ApplicationTracker /></ProtectedRoute>} />
      <Route path="/application/:id" element={<ProtectedRoute><ApplicationTracker /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><DocumentWallet /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/eligibility" element={<ProtectedRoute><EligibilityChecker /></ProtectedRoute>} />
      <Route path="/family" element={<ProtectedRoute><FamilyHub /></ProtectedRoute>} />
      <Route path="/consent" element={<ProtectedRoute><ConsentManager /></ProtectedRoute>} />
      <Route path="/find-scholarship" element={<ProtectedRoute><FindScholarship /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  // -------------------------------------------------------------
  // DESKTOP WIDESCREEN VIEW (16:9 Aspect Ratio / >= 768px)
  // -------------------------------------------------------------
  if (isDesktopView) {
    return (
      <div className={`min-h-screen flex ${
        darkMode ? 'dark bg-navy text-white' : 'bg-slate-50 text-slate-900'
      }`}>
        {!isAuthScreen && !isOfficerScreen && <DesktopSidebar />}

        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {!isAuthScreen && !isOfficerScreen && <DesktopTopBar />}

          <main className={`flex-1 w-full overflow-y-auto ${
            isAuthScreen || isOfficerScreen ? '' : 'max-w-7xl mx-auto px-6 py-6'
          }`}>
            <AnimatePresence mode="wait">
              {pageRoutes}
            </AnimatePresence>
          </main>
        </div>

        {/* Global Modals & Desktop Chatbot */}
        {!isAuthScreen && !isOfficerScreen && (
          <>
            <UpdatePromptModal />
            <JagoChatbot
              isOpen={chatOpen}
              onOpen={() => setChatOpen(true)}
              onClose={() => setChatOpen(false)}
            />
          </>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // MOBILE PORTRAIT VIEW (9:16 Aspect Ratio / Mobile Screen Simulation)
  // -------------------------------------------------------------
  return (
    <div className={`min-h-screen transition-colors ${
      darkMode ? 'dark bg-navy text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Centered Phone Chassis Frame for Desktop Browsers in Mobile Mode */}
      <div className="py-0 md:py-6 flex justify-center items-center min-h-screen">
        <div className={`w-full max-w-md min-h-screen md:min-h-[850px] md:max-h-[94vh] md:rounded-[40px] md:shadow-2xl md:border-8 md:border-slate-800 relative overflow-x-hidden overflow-y-auto transition-colors ${
          isAuthScreen || isOfficerScreen ? '' : 'pb-16'
        } ${
          darkMode ? 'bg-navy' : 'bg-[#F8FAFC]'
        }`}>
          {!isAuthScreen && <TopBar />}

          <AnimatePresence mode="wait">
            {pageRoutes}
          </AnimatePresence>

          {!isAuthScreen && !isOfficerScreen && (
            <>
              <UpdatePromptModal />
              <IosInstallPrompt />
              <BottomNav />
              <JagoChatbot
                isOpen={chatOpen}
                onOpen={() => setChatOpen(true)}
                onClose={() => setChatOpen(false)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppProvider>
          <AppLayout />
        </AppProvider>
      </AuthProvider>
    </HashRouter>
  );
}
