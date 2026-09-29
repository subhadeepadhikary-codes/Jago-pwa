import { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { apiService } from '../services/apiService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => dbService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!dbService.getCurrentUser());
  const [currentOfficer, setCurrentOfficer] = useState(() => dbService.getCurrentOfficer());
  const [isOfficerAuthenticated, setIsOfficerAuthenticated] = useState(() => !!dbService.getCurrentOfficer());
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => dbService.hasSeenOnboarding());

  useEffect(() => {
    const user = dbService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    const officer = dbService.getCurrentOfficer();
    if (officer) {
      setCurrentOfficer(officer);
      setIsOfficerAuthenticated(true);
    }
  }, []);

  const login = async (identifier, password) => {
    const res = await apiService.login(identifier, password);
    if (res.success) {
      if (!res.isAdmin) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
      }
    }
    return res;
  };

  const register = async (applicantData) => {
    const res = await apiService.register(applicantData);
    if (res.success) {
      setCurrentUser(res.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const recoverPassword = async (mobile, newPassword) => {
    const res = await apiService.resetPasswordWithOTP(mobile, newPassword);
    if (res.success) {
      setCurrentUser(res.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const logout = () => {
    apiService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Officer auth methods
  const officerLogin = async (email, password) => {
    const res = await apiService.officerLogin(email, password);
    if (res.success) {
      setCurrentOfficer(res.officer);
      setIsOfficerAuthenticated(true);
    }
    return res;
  };

  const officerLogout = () => {
    apiService.officerLogout();
    setCurrentOfficer(null);
    setIsOfficerAuthenticated(false);
  };

  const completeOnboarding = () => {
    dbService.setHasSeenOnboarding(true);
    setHasSeenOnboarding(true);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        currentOfficer,
        setCurrentOfficer,
        isOfficerAuthenticated,
        hasSeenOnboarding,
        login,
        register,
        recoverPassword,
        logout,
        officerLogin,
        officerLogout,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
