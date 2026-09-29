import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiService } from '../services/apiService';
import { dbService } from '../services/db';
import { otaCloudService } from '../services/otaCloudService';
import { notifications as initialNotifications } from '../data/notifications';
import { scholarshipSchemes, disbursementHistory } from '../data/scholarships';
import { getTranslation, TOP_LANGUAGES } from '../services/languageService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { currentUser: authUser } = useAuth();

  // Active applicant profile (real logged in applicant, or fallback for preview)
  const [user, setUser] = useState(() => authUser || null);

  // App Language State (Top 7 Popular Languages in India)
  const [appLanguage, setAppLanguageState] = useState(() => {
    return localStorage.getItem('jago_selected_language') || 'en';
  });

  const setAppLanguage = (lang) => {
    localStorage.setItem('jago_selected_language', lang);
    setAppLanguageState(lang);
  };

  const t = (key, fallbackText = '') => getTranslation(key, appLanguage, fallbackText);

  // Applicant applications (ZERO demo data for fresh applicants!)
  const [applications, setApplications] = useState(() => {
    if (authUser?.id) {
      return apiService.getApplications(authUser.id);
    }
    return [];
  });

  const [schemes] = useState(scholarshipSchemes);

  // Applicant documents (Clean slate for new applicants)
  const [documents, setDocuments] = useState(() => {
    if (authUser?.id) {
      return apiService.getDocuments(authUser.id);
    }
    return [];
  });

  const [notifications, setNotifications] = useState(initialNotifications);
  const [disbursements] = useState(disbursementHistory);

  // Sync state whenever authUser changes (e.g. on login/signup/logout)
  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      const apps = apiService.getApplications(authUser.id);
      setApplications(apps);
      const docs = apiService.getDocuments(authUser.id);
      setDocuments(docs);

      // Asynchronously hydrate full cloud portfolio across all 7 models
      dbService.hydrateFullPortfolioFromCloud(authUser.id, authUser.password).then((portfolio) => {
        if (portfolio) {
          if (portfolio.applications && portfolio.applications.length > 0) {
            setApplications(portfolio.applications);
          }
          if (portfolio.documents && portfolio.documents.length > 0) {
            setDocuments(portfolio.documents);
          }
          if (portfolio.notifications && portfolio.notifications.length > 0) {
            setNotifications((prev) => {
              const map = new Map(prev.map((n) => [n.id, n]));
              for (const n of portfolio.notifications) map.set(n.id, n);
              return Array.from(map.values());
            });
          }
        }
      });
    } else {
      setUser(null);
      setApplications([]);
      setDocuments([]);
    }
  }, [authUser]);

  // Default to light mode (white background) with separate dark mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('tribal_theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    localStorage.setItem('tribal_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const currentVersion = '1.0';

  // Automatic Responsive Viewport Management (Desktop Widescreen >= 768px, Mobile Portrait < 768px)
  const [windowWidth, setWindowWidth] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth : 1200;
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDesktopView = windowWidth >= 768;

  // PWA Native Installation Support
  const [canInstallPwa, setCanInstallPwa] = useState(false);

  useEffect(() => {
    const handleInstallable = () => setCanInstallPwa(true);
    window.addEventListener('pwa-installable', handleInstallable);
    if (window.deferredInstallPrompt) setCanInstallPwa(true);
    return () => window.removeEventListener('pwa-installable', handleInstallable);
  }, []);

  const installPwa = async () => {
    const promptEvent = window.deferredInstallPrompt;
    if (!promptEvent) {
      alert('PWA is already installed or your browser does not support automatic installation. You can install it from your browser menu ("Install JAGO" or "Add to Home Screen").');
      return;
    }
    promptEvent.prompt();
    const result = await promptEvent.userChoice;
    if (result.outcome === 'accepted') {
      window.deferredInstallPrompt = null;
      setCanInstallPwa(false);
    }
  };

  // Master MediaFire folder specified by user
  const MASTER_FOLDER_URL = 'https://www.mediafire.com/folder/4fmr1vrov62fl/Documents';

  // Version Packs Directory: Current Version & Immediate Predecessor Only!
  const [versionPacks, setVersionPacks] = useState(() => {
    const saved = localStorage.getItem('jago_version_packs_pwa_v1.0');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'v1.0-pwa',
        version: '1.0',
        title: 'JAGO PWA v1.0 (Desktop & Mobile Edition)',
        tag: 'PWA v1.0',
        size: '1.57 MB',
        date: 'Sept 2026',
        isLatest: true,
        isCurrent: true,
        downloadUrl: MASTER_FOLDER_URL,
        folderUrl: MASTER_FOLDER_URL,
        features: [
          'Adaptive Responsive Aspect Ratio: Seamless Desktop Widescreen (16:9) & Mobile Portrait (9:16)',
          'Zero-Knowledge Client-Side AES-256-GCM Encryption (Admin Blindness)',
          'Offline Service Worker Caching & Instant Web Application Installation',
          'Full-App Localization across 7 Indian Languages with instant translation',
          'Accurate AI Assistant with West Bengal SVMCM & Central MoTA Intelligence',
          'Interactive Aspect Ratio Switcher with simulated device frame',
        ],
      },
    ];
  });


  const [mediaFireFolderUrl, setMediaFireFolderUrl] = useState(() => {
    return localStorage.getItem('jago_mediafire_folder_url') || MASTER_FOLDER_URL;
  });

  // OTA Update Management: only show on first launch of this newly installed/updated version
  const [updateConfig, setUpdateConfig] = useState(() => {
    const lastSeenVersion = localStorage.getItem('jago_seen_version_popup');
    const isFirstTimeThisVersion = lastSeenVersion !== currentVersion;

    // Immediately mark as seen so subsequent opens never show the popup automatically
    if (isFirstTimeThisVersion) {
      try {
        localStorage.setItem('jago_seen_version_popup', currentVersion);
      } catch (e) {}
    }

    return {
      latestVersion: currentVersion,
      mediaFireUrl: MASTER_FOLDER_URL,
      releaseNotes: 'Real-Time Global Cloud Relay for instant OTA updates across all devices, resolved cross-device notification bug, and profile editor enhancements.',
      showModal: isFirstTimeThisVersion,
      isUpdateTriggered: false,
    };
  });

  // Real-Time Global Cloud Relay: poll for OTA broadcast updates from Admin Portal across all devices
  useEffect(() => {
    let isSubscribed = true;

    const syncRemoteBroadcast = async () => {
      try {
        const remote = await otaCloudService.fetchLatestBroadcast();
        if (!isSubscribed || !remote || !remote.latestVersion) return;

        // Check if remote version is strictly newer than current installed version
        if (otaCloudService.isNewerVersion(remote.latestVersion, currentVersion)) {
          const downloadTarget = remote.fileUrl || remote.folderUrl || MASTER_FOLDER_URL;

          // Trigger update prompt modal
          setUpdateConfig({
            latestVersion: remote.latestVersion,
            mediaFireUrl: downloadTarget,
            releaseNotes: remote.releaseNotes || 'A new update is available in the MediaFire Master Folder.',
            showModal: true,
            isUpdateTriggered: true,
          });

          // Check if we haven't already notified about this specific version
          const notifiedKey = `jago_ota_notified_${remote.latestVersion}`;
          if (!localStorage.getItem(notifiedKey)) {
            addNotification({
              type: 'system',
              title: `🚨 MoTA Update v${remote.latestVersion} Available!`,
              message: remote.releaseNotes || 'Version pack is ready in MediaFire Master Folder. Tap to download.',
              downloadUrl: downloadTarget,
              icon: '⚡',
              isOtaUpdate: true,
            });
            try {
              localStorage.setItem(notifiedKey, 'true');
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn('OTA Cloud Relay check failed (offline or network error):', err);
      }

      // Also refresh active applicant's cloud portfolio in background
      if (authUser?.id && isSubscribed) {
        try {
          const portfolio = await dbService.hydrateFullPortfolioFromCloud(authUser.id, authUser.password);
          if (portfolio && isSubscribed) {
            if (portfolio.applications && portfolio.applications.length > 0) {
              setApplications(portfolio.applications);
            }
            if (portfolio.documents && portfolio.documents.length > 0) {
              setDocuments(portfolio.documents);
            }
            if (portfolio.notifications && portfolio.notifications.length > 0) {
              setNotifications((prev) => {
                const map = new Map(prev.map((n) => [n.id, n]));
                for (const n of portfolio.notifications) map.set(n.id, n);
                return Array.from(map.values());
              });
            }
          }
        } catch (e) {}
      }
    };

    // 1. Initial check on mount
    syncRemoteBroadcast();

    // 2. Periodic poll every 35 seconds
    const interval = setInterval(syncRemoteBroadcast, 35000);

    // 3. Check when window regains focus or comes back online
    const handleActivity = () => syncRemoteBroadcast();
    window.addEventListener('focus', handleActivity);
    window.addEventListener('online', handleActivity);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleActivity);
      window.removeEventListener('online', handleActivity);
    };
  }, [currentVersion]);

  const checkForUpdates = async () => {
    try {
      const remote = await otaCloudService.fetchLatestBroadcast();
      if (remote && remote.latestVersion && otaCloudService.isNewerVersion(remote.latestVersion, currentVersion)) {
        const downloadTarget = remote.fileUrl || remote.folderUrl || MASTER_FOLDER_URL;
        setUpdateConfig({
          latestVersion: remote.latestVersion,
          mediaFireUrl: downloadTarget,
          releaseNotes: remote.releaseNotes || 'A new update is available in the MediaFire Master Folder.',
          showModal: true,
          isUpdateTriggered: true,
        });
        addNotification({
          type: 'system',
          title: `JAGO Update v${remote.latestVersion} Available`,
          message: remote.releaseNotes || 'Version pack is ready in MediaFire Master Folder.',
          downloadUrl: downloadTarget,
          icon: '🚀',
          isOtaUpdate: true,
        });
        return true;
      }
    } catch (e) {}

    const latestPack = versionPacks.find((p) => p.isLatest) || versionPacks[0];
    const hasUpdate = latestPack && otaCloudService.isNewerVersion(latestPack.version, currentVersion);
    if (hasUpdate) {
      setUpdateConfig({
        latestVersion: latestPack.version,
        mediaFireUrl: latestPack.downloadUrl || mediaFireFolderUrl,
        releaseNotes: latestPack.features.join(' • '),
        showModal: true,
        isUpdateTriggered: true,
      });
      addNotification({
        type: 'system',
        title: `JAGO Update v${latestPack.version} Available`,
        message: `Version pack is ready in MediaFire Master Folder. Tap to download.`,
        downloadUrl: latestPack.downloadUrl || mediaFireFolderUrl,
        icon: '🚀',
        isOtaUpdate: true,
      });
      return true;
    }
    setUpdateConfig((prev) => ({
      ...prev,
      showModal: true,
      isUpdateTriggered: false,
    }));
    return false;
  };

  const closeUpdateModal = () => {
    try {
      localStorage.setItem('jago_seen_version_popup', currentVersion);
    } catch (e) {}
    setUpdateConfig((prev) => ({ ...prev, showModal: false, isUpdateTriggered: false }));
  };

  const updateVersionPackUrl = (id, newUrl) => {
    setVersionPacks((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, downloadUrl: newUrl } : p));
      localStorage.setItem('jago_version_packs_v2.0', JSON.stringify(updated));
      return updated;
    });
  };

  const addVersionPack = (newPack) => {
    setVersionPacks((prev) => {
      const updated = prev.map((p) => (newPack.isLatest ? { ...p, isLatest: false } : p));
      const res = [newPack, ...updated];
      localStorage.setItem('jago_version_packs_v2.0', JSON.stringify(res));
      return res;
    });
    setUpdateConfig({
      latestVersion: newPack.version,
      mediaFireUrl: newPack.downloadUrl || mediaFireFolderUrl,
      releaseNotes: newPack.features ? newPack.features.join(' • ') : 'New version pack released.',
      showModal: true,
      isUpdateTriggered: true,
    });
    addNotification({
      type: 'system',
      title: `New Version Pack Released: ${newPack.title}`,
      message: `MediaFire Master Folder download is live: ${newPack.downloadUrl}`,
      icon: '🚀',
    });
  };

  const saveMediaFireFolderUrl = (url) => {
    setMediaFireFolderUrl(url);
    localStorage.setItem('jago_mediafire_folder_url', url);
  };

  const publishNewVersion = ({ version, url, notes }) => {
    const newPack = {
      id: `v${version}`,
      version: version,
      title: `JAGO v${version} (Master Release)`,
      tag: 'Latest Release',
      size: '7.3 MB',
      date: 'Today',
      isLatest: true,
      isCurrent: false,
      downloadUrl: url || mediaFireFolderUrl,
      folderUrl: mediaFireFolderUrl,
      features: notes ? notes.split('•').map((s) => s.trim()) : ['General improvements and bug fixes.'],
    };
    addVersionPack(newPack);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      ...notif,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Submit new scholarship application (Persisted to backend/db)
  const addApplication = (appData) => {
    const scheme = schemes.find((s) => s.id === appData.schemeId);
    const newApp = {
      id: `APP-2026-${(appData.schemeId || 'SCH').toUpperCase().slice(0, 2)}-${Math.floor(1000 + Math.random() * 9000)}`,
      schemeId: appData.schemeId,
      schemeName: scheme ? scheme.name : appData.schemeName || 'Scholarship Scheme',
      academicYear: '2026-27',
      status: 'submitted',
      appliedDate: new Date().toISOString().split('T')[0],
      currentStage: 1,
      stages: [
        { name: 'Submitted', status: 'completed', date: new Date().toISOString().split('T')[0], note: 'Application submitted online with verified digital documents' },
        { name: 'Document Verification', status: 'current', date: null, note: 'Digital verification in progress via DigiLocker / State e-District' },
        { name: 'Institute Verified', status: 'pending', date: null, note: `Verification pending by ${appData.institution || 'Institution'}` },
        { name: 'State Approved', status: 'pending', date: null, note: 'Awaiting State Tribal Welfare Dept approval' },
        { name: 'Sanctioned', status: 'pending', date: null, note: 'Sanction order pending' },
        { name: 'Disbursed', status: 'pending', date: null, note: 'DBT bank transfer via PFMS' },
      ],
      amount: appData.amount || 45000,
      disbursed: 0,
      queuePosition: `#${Math.floor(120 + Math.random() * 250)} (Batch 2026-27)`,
      studentData: appData,
    };

    if (user?.id) {
      apiService.submitApplication(user.id, newApp);
    }

    setApplications((prev) => [newApp, ...prev]);

    addNotification({
      type: 'verification',
      title: 'Application Enqueued for Sanction',
      message: `Your application ${newApp.id} for ${newApp.schemeName} has been submitted at queue position ${newApp.queuePosition}.`,
      icon: '📝',
    });

    return newApp;
  };

  // Add document to wallet (Persisted to backend/db)
  const addDocument = (docData) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      verified: true,
      usedIn: [],
      type: 'PDF',
      size: '350 KB',
      ...docData,
    };

    if (user?.id) {
      apiService.saveDocument(user.id, newDoc);
    }

    setDocuments((prev) => [newDoc, ...prev]);

    addNotification({
      type: 'verification',
      title: 'Document Added to Wallet',
      message: `${newDoc.name} has been securely stored in your Document Wallet.`,
      icon: '📁',
    });

    return newDoc;
  };

  // Resolve deficiency on application
  const resolveDeficiency = (appId, docName = 'Income Certificate') => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const updatedStages = app.stages.map((st) => {
            if (st.name === 'Document Verification') {
              return { ...st, status: 'completed', date: new Date().toISOString().split('T')[0], note: `${docName} re-uploaded & verified successfully.` };
            }
            if (st.name === 'Institute Verified') {
              return { ...st, status: 'current', note: 'Pending institution sign-off' };
            }
            return st;
          });
          return {
            ...app,
            status: 'under-review',
            currentStage: 3,
            stages: updatedStages,
            deficiency: null,
          };
        }
        return app;
      })
    );

    setDocuments((prev) =>
      prev.map((d) => (d.name.includes('Income') ? { ...d, verified: true, issue: null } : d))
    );

    addNotification({
      type: 'verification',
      title: 'Deficiency Resolved',
      message: `Updated document for application ${appId} has been verified and processed.`,
      icon: '✅',
    });
  };

  // Sync / import from DigiLocker
  const syncDigiLockerDocs = (newDocsList) => {
    if (newDocsList && newDocsList.length > 0) {
      setDocuments((prev) => {
        const existingIds = new Set(prev.map((d) => d.id));
        const toAdd = newDocsList.filter((d) => !existingIds.has(d.id));
        return [...toAdd, ...prev];
      });
    }

    setDocuments((prev) =>
      prev.map((d) => (d.source === 'DigiLocker' ? { ...d, verified: true, issue: null } : d))
    );

    addNotification({
      type: 'verification',
      title: 'DigiLocker Synced',
      message: 'Verified digital documents successfully synchronized from DigiLocker.',
      icon: '🪪',
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        applications,
        schemes,
        documents,
        notifications,
        disbursements,
        unreadCount,
        darkMode,
        toggleDarkMode,
        markAsRead,
        markAllRead,
        addApplication,
        addDocument,
        resolveDeficiency,
        syncDigiLockerDocs,
        addNotification,
        currentVersion,
        updateConfig,
        checkForUpdates,
        closeUpdateModal,
        publishNewVersion,
        versionPacks,
        updateVersionPackUrl,
        addVersionPack,
        mediaFireFolderUrl,
        saveMediaFireFolderUrl,
        appLanguage,
        setAppLanguage,
        isDesktopView,
        canInstallPwa,
        installPwa,
        t,
        TOP_LANGUAGES,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
