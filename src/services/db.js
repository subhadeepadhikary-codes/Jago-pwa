// Offline-first client database service for JAGO
// Manages local persistence using localStorage + IndexedDB with multi-key redundancy
import { cloudSyncService } from './cloudSyncService';

const STORAGE_KEYS = {
  APPLICANTS: 'jago_db_applicants',
  APPLICANTS_BACKUP: 'jago_vault_applicants_backup',
  APPLICANTS_ARCHIVE: 'jago_registered_vault',
  APPLICANTS_MASTER: 'jago_master_applicant_archive',
  LEGACY_KEYS: [
    'tribal_applicants',
    'jago_applicants',
    'jago_users',
    'tribal_users',
    'registered_applicants',
    'mota_applicants',
    'jago_auth_user',
    'currentUser',
    'user',
    'auth_user',
    'jago_user_profile',
    'scholarship_users',
    'student_profile',
  ],
  CURRENT_USER: 'jago_auth_user',
  CURRENT_OFFICER: 'jago_auth_officer',
  APPLICATIONS: 'jago_db_applications',
  APPLICATIONS_BACKUP: 'jago_vault_applications_backup',
  DOCUMENTS: 'jago_db_documents',
  DOCUMENTS_BACKUP: 'jago_vault_documents_backup',
  CONSENTS: 'jago_db_consents',
  FAMILY_HUB: 'jago_db_family_hub',
  NOTIFICATIONS: 'jago_db_notifications',
  OFFICER_QUEUE: 'jago_db_officer_queue',
  SYSTEM_CONFIG: 'jago_db_system_config',
  HAS_SEEN_ONBOARDING: 'jago_has_seen_onboarding',
};

// IndexedDB indestructible vault helper
const IDB_NAME = 'JagoPersistentVaultDB';
const IDB_STORE = 'applicants_vault';
const IDB_VERSION = 1;

function openIDB() {
  if (typeof window === 'undefined' || !window.indexedDB) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

async function idbSaveApplicants(applicants) {
  const db = await openIDB();
  if (!db) return;
  try {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    for (const a of applicants) {
      if (a && a.id) {
        store.put(a);
      }
    }
  } catch (e) {}
}

async function idbGetAllApplicants() {
  const db = await openIDB();
  if (!db) return [];
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    } catch (e) {
      resolve([]);
    }
  });
}

// Permanent seed vault ensuring verified applicant accounts are NEVER lost across APK reinstalls
export const DEFAULT_APPLICANTS = [
  {
    id: 'ST-2026-7649',
    name: 'Subhadeep Soren',
    fatherName: 'B. Soren',
    mobile: '9123977649',
    aadhaar: 'XXXX-XXXX-7649',
    aadhaarLast4: '7649',
    password: '', // Flexible: syncs with user password on first login
    category: 'ST',
    subCategory: 'Scheduled Tribe (Verified)',
    tribe: 'Santhal',
    state: 'Jharkhand',
    district: 'Ranchi',
    income: 180000,
    annualIncome: 180000,
    currentEducation: {
      level: 'Higher Education (Premier Institute)',
      course: 'B.Tech Computer Science & Engineering',
      institution: 'Indian Institute of Technology (IIT) Kharagpur',
      aisheCode: 'U-0584',
      year: '3rd Year (Semester 5)',
      rollNo: '23CS10042',
    },
    bankName: 'State Bank of India',
    accountNumber: '•••• •••• 7649',
    ifsc: 'SBIN0000123',
    dbtActive: true,
    profileCompletion: 92,
    createdAt: '2026-09-01T00:00:00.000Z',
    isPersistentSeed: true,
  },
  {
    id: 'DEMO-ST-2026-8471',
    name: 'Sunita Soren',
    fatherName: 'Birsa Soren',
    mobile: '9876543210',
    aadhaar: 'XXXX-XXXX-8471',
    aadhaarLast4: '8471',
    password: 'demo',
    category: 'ST',
    subCategory: 'PVTG (Particularly Vulnerable)',
    tribe: 'Santhal',
    state: 'Jharkhand',
    district: 'Ranchi',
    income: 180000,
    annualIncome: 180000,
    currentEducation: {
      level: 'Higher Education (Premier Institute)',
      course: 'B.Tech Computer Science & Engineering',
      institution: 'Indian Institute of Technology (IIT) Kharagpur',
      aisheCode: 'U-0584',
      year: '3rd Year (Semester 5)',
      rollNo: '23CS10042',
    },
    bankName: 'State Bank of India',
    accountNumber: '•••• •••• 4589',
    ifsc: 'SBIN0000123',
    dbtActive: true,
    profileCompletion: 92,
    createdAt: '2026-09-01T00:00:00.000Z',
    isPersistentSeed: true,
  },
  {
    id: 'USR-ST-2026-08471',
    name: 'Ananya Munda',
    fatherName: 'Birsa Munda',
    mobile: '9876543211',
    aadhaar: 'XXXX-XXXX-7823',
    aadhaarLast4: '7823',
    password: '',
    category: 'ST',
    subCategory: 'PVTG',
    tribe: 'Munda',
    state: 'Jharkhand',
    district: 'Ranchi',
    income: 180000,
    annualIncome: 180000,
    currentEducation: {
      level: 'Under Graduate',
      course: 'B.Tech Computer Science',
      institution: 'NIT Jamshedpur',
      aisheCode: 'U-0456',
      year: '3rd Year',
      rollNo: 'CS-2024-089',
    },
    bankName: 'State Bank of India',
    accountNumber: '•••• •••• 4521',
    ifsc: 'SBIN0000123',
    dbtActive: true,
    profileCompletion: 85,
    createdAt: '2026-09-01T00:00:00.000Z',
    isPersistentSeed: true,
  },
];

// Default system configuration with user's official MediaFire master folder
const DEFAULT_CONFIG = {
  currentVersion: '2.0',
  latestVersion: '2.0',
  mediaFireMasterFolder: 'https://www.mediafire.com/folder/4fmr1vrov62fl/Documents',
  latestApkUrl: 'https://www.mediafire.com/folder/4fmr1vrov62fl/Documents',
  releaseNotes: 'Official MoTA unified release v2.0 with Profile Window crash fix, live profile editor, and full multi-vault continuity.',
  lastBroadcastTimestamp: Date.now(),
};

export const dbService = {
  // --- SYSTEM CONFIG / OTA UPDATES ---
  getConfig() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SYSTEM_CONFIG);
      return data ? { ...DEFAULT_CONFIG, ...JSON.parse(data) } : DEFAULT_CONFIG;
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  },

  saveConfig(newConfig) {
    try {
      const current = this.getConfig();
      const merged = { ...current, ...newConfig, lastBroadcastTimestamp: Date.now() };
      localStorage.setItem(STORAGE_KEYS.SYSTEM_CONFIG, JSON.stringify(merged));
      return merged;
    } catch (e) {
      console.error('Error saving config:', e);
      return newConfig;
    }
  },

  // --- ONBOARDING STATE ---
  hasSeenOnboarding() {
    return localStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING) === 'true';
  },

  setHasSeenOnboarding(val = true) {
    localStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, val ? 'true' : 'false');
  },

  // --- APPLICANTS (Multi-Key Redundant Vault + Universal Scanner) ---
  getApplicants() {
    const combined = [];
    const seen = new Set();

    const normalizeAndAdd = (item) => {
      if (!item || typeof item !== 'object') return;
      const rawMobile = item.mobile || item.phone || item.phoneNumber || item.contact || item.mobileNumber;
      const rawId = item.id || item.applicantId || item.userId || item.regNo || item.applicationId;
      const rawAadhaar = item.aadhaar || item.aadhaarNumber;

      // Extract 10-digit mobile if available
      const cleanDigits = rawMobile ? String(rawMobile).replace(/\D/g, '') : '';
      const mobile10 = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : cleanDigits;

      // Deduplication key priority: 10-digit mobile > clean ID
      const dedupeKey = mobile10 || (rawId ? String(rawId).trim().toLowerCase() : null);
      if (!dedupeKey) return;

      if (!seen.has(dedupeKey)) {
        seen.add(dedupeKey);
        const rand4 = Math.floor(1000 + Math.random() * 9000);
        const resolvedId = rawId || (mobile10 ? `ST-2026-${mobile10.slice(-4)}` : `ST-2026-${rand4}`);

        const normalized = {
          ...item,
          id: resolvedId,
          name: item.name || item.fullName || item.applicantName || `Verified Scholar (${mobile10 ? mobile10.slice(-4) : rand4})`,
          fatherName: item.fatherName || item.guardianName || 'Guardian',
          mobile: mobile10 || item.mobile || '',
          aadhaar: rawAadhaar || item.aadhaar || `XXXX-XXXX-${mobile10 ? mobile10.slice(-4) : rand4}`,
          aadhaarLast4: item.aadhaarLast4 || (mobile10 ? mobile10.slice(-4) : String(rand4)),
          password: item.password || '',
          category: item.category || 'ST',
          subCategory: item.subCategory || 'Scheduled Tribe (Verified)',
          tribe: item.tribe || item.subTribe || 'Santhal',
          state: item.state || 'Jharkhand',
          district: item.district || 'Ranchi',
          income: Number(item.income || item.annualIncome) || 180000,
          annualIncome: Number(item.annualIncome || item.income) || 180000,
          currentEducation: item.currentEducation || {
            level: 'Higher Education (Premier Institute)',
            course: 'B.Tech / Higher Education',
            institution: 'Indian Institute of Technology (IIT) Kharagpur',
            aisheCode: 'U-0584',
            year: '3rd Year',
            rollNo: `ROLL-${mobile10 ? mobile10.slice(-4) : rand4}`,
          },
          bankName: item.bankName || 'State Bank of India',
          accountNumber: item.accountNumber || `•••• •••• ${mobile10 ? mobile10.slice(-4) : rand4}`,
          ifsc: item.ifsc || 'SBIN0000123',
          dbtActive: item.dbtActive !== undefined ? item.dbtActive : true,
          profileCompletion: item.profileCompletion || 92,
          createdAt: item.createdAt || new Date().toISOString(),
        };

        combined.push(normalized);
      }
    };

    const addList = (list) => {
      if (!Array.isArray(list)) return;
      for (const it of list) {
        normalizeAndAdd(it);
      }
    };

    // 1. Primary storage key
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICANTS);
      if (data) addList(JSON.parse(data));
    } catch (e) {}

    // 2. Redundant Vault keys
    try {
      const backup = localStorage.getItem(STORAGE_KEYS.APPLICANTS_BACKUP);
      if (backup) addList(JSON.parse(backup));
    } catch (e) {}
    try {
      const archive = localStorage.getItem(STORAGE_KEYS.APPLICANTS_ARCHIVE);
      if (archive) addList(JSON.parse(archive));
    } catch (e) {}
    try {
      const master = localStorage.getItem(STORAGE_KEYS.APPLICANTS_MASTER);
      if (master) addList(JSON.parse(master));
    } catch (e) {}

    // 3. Known Legacy storage keys
    for (const legKey of STORAGE_KEYS.LEGACY_KEYS) {
      try {
        const leg = localStorage.getItem(legKey);
        if (leg) {
          const parsed = JSON.parse(leg);
          if (Array.isArray(parsed)) addList(parsed);
          else if (parsed && typeof parsed === 'object') normalizeAndAdd(parsed);
        }
      } catch (e) {}
    }

    // 4. Universal Full LocalStorage Scanner:
    // Safely scans ALL localStorage entries for any applicant/user data from any previous version
    try {
      if (typeof localStorage !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (!k || k === STORAGE_KEYS.APPLICANTS || k === STORAGE_KEYS.APPLICANTS_BACKUP || k === STORAGE_KEYS.APPLICANTS_ARCHIVE || k === STORAGE_KEYS.APPLICANTS_MASTER) {
            continue;
          }
          try {
            const val = localStorage.getItem(k);
            if (val && (val.startsWith('[') || val.startsWith('{'))) {
              const parsed = JSON.parse(val);
              if (Array.isArray(parsed)) {
                for (const item of parsed) {
                  if (item && typeof item === 'object' && (item.mobile || item.phone || item.aadhaar || item.tribe || item.category || item.aisheCode || item.subCategory)) {
                    normalizeAndAdd(item);
                  }
                }
              } else if (parsed && typeof parsed === 'object' && (parsed.mobile || parsed.phone || parsed.aadhaar || parsed.tribe || parsed.category || parsed.subCategory)) {
                normalizeAndAdd(parsed);
              }
            }
          } catch (e) {}
        }
      }
    } catch (e) {}

    // 5. Default Seed Vault (Subhadeep Soren, Sunita Soren, Ananya Munda)
    addList(DEFAULT_APPLICANTS);

    return combined;
  },

  saveApplicant(applicant) {
    const applicants = this.getApplicants();
    const appMobile = applicant.mobile ? String(applicant.mobile).replace(/\D/g, '') : '';
    const mobile10 = appMobile.length >= 10 ? appMobile.slice(-10) : appMobile;
    const appId = applicant.id ? String(applicant.id).toLowerCase() : '';

    const index = applicants.findIndex((a) => {
      const aMobile = a.mobile ? String(a.mobile).replace(/\D/g, '') : '';
      const aMobile10 = aMobile.length >= 10 ? aMobile.slice(-10) : aMobile;
      const aId = a.id ? String(a.id).toLowerCase() : '';
      return (mobile10 && aMobile10 === mobile10) || (appId && aId === appId);
    });

    if (index >= 0) {
      applicants[index] = { ...applicants[index], ...applicant };
    } else {
      applicants.push(applicant);
    }

    const serialized = JSON.stringify(applicants);
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICANTS, serialized);
      localStorage.setItem(STORAGE_KEYS.APPLICANTS_BACKUP, serialized);
      localStorage.setItem(STORAGE_KEYS.APPLICANTS_ARCHIVE, serialized);
      localStorage.setItem(STORAGE_KEYS.APPLICANTS_MASTER, serialized);
    } catch (e) {
      console.error('Error saving applicant to redundant localStorage vault:', e);
    }

    // Also persist to IndexedDB asynchronously
    try {
      idbSaveApplicants(applicants);
    } catch (e) {}

    // Persist to Cloud Vault asynchronously (Zero-Knowledge Encrypted)
    try {
      cloudSyncService.syncApplicantToCloud(applicant);
    } catch (e) {}

    return applicant;
  },

  findApplicantByIdOrMobile(identifier) {
    if (!identifier) return null;
    const applicants = this.getApplicants();
    const cleanStr = String(identifier).trim().toLowerCase();
    const cleanDigits = String(identifier).replace(/\D/g, '');
    const last10 = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : cleanDigits;

    return applicants.find((a) => {
      if (!a) return false;
      const aId = a.id ? String(a.id).trim().toLowerCase() : '';
      const aMobile = a.mobile ? String(a.mobile).replace(/\D/g, '') : '';
      const aMobile10 = aMobile.length >= 10 ? aMobile.slice(-10) : aMobile;
      const aAadhaar = a.aadhaar ? String(a.aadhaar).replace(/\D/g, '') : '';

      // Match by ID
      if (aId && (aId === cleanStr || cleanStr.includes(aId) || aId.includes(cleanStr))) return true;

      // Match by Mobile (exact or 10-digit)
      if (last10 && aMobile10 && (aMobile10 === last10 || aMobile === cleanDigits)) return true;

      // Match by Aadhaar (last 4 digits or full)
      if (cleanDigits.length >= 4 && aAadhaar && (aAadhaar === cleanDigits || aAadhaar.slice(-4) === cleanDigits.slice(-4))) {
        if (cleanDigits.length >= 10 || (a.aadhaarLast4 && a.aadhaarLast4 === cleanDigits)) return true;
      }

      // Match by Name if string matches
      if (cleanStr.length >= 4 && a.name && a.name.toLowerCase() === cleanStr) return true;

      return false;
    });
  },

  // --- ACTIVE SESSION ---
  getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  },

  // --- ACTIVE OFFICER SESSION ---
  getCurrentOfficer() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_OFFICER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentOfficer(officer) {
    if (!officer) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_OFFICER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_OFFICER, JSON.stringify(officer));
    }
  },

  // --- APPLICATIONS (Per Applicant with Redundant Backup) ---
  getApplications(applicantId) {
    try {
      let data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (!data) {
        data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS_BACKUP);
      }
      const all = data ? JSON.parse(data) : [];
      if (!applicantId) return all;
      return all.filter((app) => app.applicantId === applicantId);
    } catch (e) {
      return [];
    }
  },

  saveApplication(application) {
    try {
      const all = this.getApplications();
      const index = all.findIndex((a) => a.id === application.id);
      if (index >= 0) {
        all[index] = { ...all[index], ...application };
      } else {
        all.unshift(application);
      }
      const serialized = JSON.stringify(all);
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, serialized);
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS_BACKUP, serialized);
      
      // Async Zero-Knowledge sync to Cloud
      try {
        cloudSyncService.syncApplicationToCloud(application);
      } catch (err) {}

      return application;
    } catch (e) {
      console.error('Error saving application:', e);
      return application;
    }
  },

  // --- DOCUMENTS (Per Applicant with Redundant Backup) ---
  getDocuments(applicantId) {
    try {
      let data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (!data) {
        data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS_BACKUP);
      }
      const all = data ? JSON.parse(data) : [];
      if (!applicantId) return all;
      return all.filter((doc) => doc.applicantId === applicantId);
    } catch (e) {
      return [];
    }
  },

  saveDocument(doc) {
    try {
      const all = this.getDocuments();
      const index = all.findIndex((d) => d.id === doc.id && d.applicantId === doc.applicantId);
      if (index >= 0) {
        all[index] = { ...all[index], ...doc };
      } else {
        all.unshift(doc);
      }
      const serialized = JSON.stringify(all);
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, serialized);
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS_BACKUP, serialized);
      
      // Async Zero-Knowledge sync to Cloud
      try {
        cloudSyncService.syncDocumentToCloud(doc);
      } catch (err) {}

      return doc;
    } catch (e) {
      console.error('Error saving document:', e);
      return doc;
    }
  },

  // --- CONSENTS (DPDP Compliance Cloud Synced) ---
  getConsents(applicantId) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONSENTS);
      const all = data ? JSON.parse(data) : [];
      if (!applicantId) return all;
      return all.filter((c) => c.applicantId === applicantId || c.applicantId === 'ALL');
    } catch (e) {
      return [];
    }
  },

  saveConsent(consent) {
    try {
      const all = this.getConsents();
      const index = all.findIndex((c) => c.id === consent.id && c.applicantId === consent.applicantId);
      if (index >= 0) {
        all[index] = { ...all[index], ...consent, updatedAt: Date.now() };
      } else {
        all.push({ ...consent, updatedAt: Date.now() });
      }
      localStorage.setItem(STORAGE_KEYS.CONSENTS, JSON.stringify(all));

      // Async cloud sync
      try {
        cloudSyncService.syncConsentToCloud(consent);
      } catch (e) {}

      return consent;
    } catch (e) {
      console.error('Error saving consent:', e);
      return consent;
    }
  },

  // --- FAMILY HUB (Household Aggregation Cloud Synced) ---
  getFamilyHub(householdId) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAMILY_HUB);
      const all = data ? JSON.parse(data) : [];
      if (!householdId) return all[0] || null;
      return all.find((f) => f.householdId === householdId) || all[0] || null;
    } catch (e) {
      return null;
    }
  },

  saveFamilyHub(familyData) {
    try {
      let data = localStorage.getItem(STORAGE_KEYS.FAMILY_HUB);
      let all = data ? JSON.parse(data) : [];
      const index = all.findIndex((f) => f.householdId === familyData.householdId);
      if (index >= 0) {
        all[index] = { ...all[index], ...familyData, updatedAt: Date.now() };
      } else {
        all.push({ ...familyData, updatedAt: Date.now() });
      }
      localStorage.setItem(STORAGE_KEYS.FAMILY_HUB, JSON.stringify(all));

      // Async zero-knowledge cloud sync
      try {
        cloudSyncService.syncFamilyHubToCloud(familyData);
      } catch (e) {}

      return familyData;
    } catch (e) {
      console.error('Error saving family hub:', e);
      return familyData;
    }
  },

  // --- NOTIFICATIONS (Cloud Push Synced) ---
  getNotifications(applicantId) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all = data ? JSON.parse(data) : [];
      if (!applicantId) return all;
      return all.filter((n) => n.applicantId === applicantId || n.applicantId === 'BROADCAST_ALL');
    } catch (e) {
      return [];
    }
  },

  saveNotification(notification) {
    try {
      let data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      let all = data ? JSON.parse(data) : [];
      const index = all.findIndex((n) => n.id === notification.id);
      if (index >= 0) {
        all[index] = { ...all[index], ...notification };
      } else {
        all.unshift(notification);
      }
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all.slice(0, 100)));

      // Async cloud sync
      try {
        cloudSyncService.syncNotificationToCloud(notification);
      } catch (e) {}

      return notification;
    } catch (e) {
      console.error('Error saving notification:', e);
      return notification;
    }
  },

  // --- OFFICER ACTIONS & VERIFICATION QUEUE (Cloud Synced) ---
  saveOfficerAction(action) {
    try {
      let data = localStorage.getItem(STORAGE_KEYS.OFFICER_QUEUE);
      let all = data ? JSON.parse(data) : [];
      all.unshift({ ...action, timestamp: Date.now() });
      localStorage.setItem(STORAGE_KEYS.OFFICER_QUEUE, JSON.stringify(all.slice(0, 200)));

      // Also sync to cloud vault immediately
      try {
        cloudSyncService.syncOfficerActionToCloud(action);
      } catch (e) {}

      return action;
    } catch (e) {
      console.error('Error saving officer action:', e);
      return action;
    }
  },

  // --- UNIVERSAL FULL PORTFOLIO HYDRATION ---
  async hydrateFullPortfolioFromCloud(applicantId, password) {
    if (!applicantId) return null;
    try {
      const portfolio = await cloudSyncService.hydrateFullPortfolio(applicantId, password);
      if (!portfolio) return null;

      // 1. Save hydrated applicant
      if (portfolio.applicant) {
        this.saveApplicant(portfolio.applicant);
      }

      // 2. Merge hydrated applications
      if (Array.isArray(portfolio.applications) && portfolio.applications.length > 0) {
        const localApps = this.getApplications();
        const map = new Map(localApps.map((a) => [a.id, a]));
        for (const app of portfolio.applications) {
          map.set(app.id, app);
        }
        const merged = Array.from(map.values());
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(merged));
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS_BACKUP, JSON.stringify(merged));
      }

      // 3. Merge hydrated documents
      if (Array.isArray(portfolio.documents) && portfolio.documents.length > 0) {
        const localDocs = this.getDocuments();
        const map = new Map(localDocs.map((d) => [d.id, d]));
        for (const doc of portfolio.documents) {
          map.set(doc.id, doc);
        }
        const merged = Array.from(map.values());
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(merged));
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS_BACKUP, JSON.stringify(merged));
      }

      // 4. Merge hydrated consents
      if (Array.isArray(portfolio.consents) && portfolio.consents.length > 0) {
        const localConsents = this.getConsents();
        const map = new Map(localConsents.map((c) => [c.id, c]));
        for (const c of portfolio.consents) {
          map.set(c.id, c);
        }
        localStorage.setItem(STORAGE_KEYS.CONSENTS, JSON.stringify(Array.from(map.values())));
      }

      // 5. Save hydrated family hub
      if (portfolio.familyHub) {
        this.saveFamilyHub(portfolio.familyHub);
      }

      // 6. Merge hydrated notifications
      if (Array.isArray(portfolio.notifications) && portfolio.notifications.length > 0) {
        const localNotifs = this.getNotifications();
        const map = new Map(localNotifs.map((n) => [n.id, n]));
        for (const n of portfolio.notifications) {
          map.set(n.id, n);
        }
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(Array.from(map.values()).slice(0, 100)));
      }

      return portfolio;
    } catch (e) {
      console.warn('Error in hydrateFullPortfolioFromCloud:', e);
      return null;
    }
  },

  // Initialize storage and synchronize redundant vault
  init() {
    try {
      if (!localStorage.getItem(STORAGE_KEYS.SYSTEM_CONFIG)) {
        this.saveConfig(DEFAULT_CONFIG);
      }
      // Ensure all applicants are synchronized across all vault keys
      const allApplicants = this.getApplicants();
      const serialized = JSON.stringify(allApplicants);
      localStorage.setItem(STORAGE_KEYS.APPLICANTS, serialized);
      localStorage.setItem(STORAGE_KEYS.APPLICANTS_BACKUP, serialized);
      localStorage.setItem(STORAGE_KEYS.APPLICANTS_ARCHIVE, serialized);
      localStorage.setItem(STORAGE_KEYS.APPLICANTS_MASTER, serialized);

      // Async IndexedDB hydration
      idbGetAllApplicants().then((idbList) => {
        if (Array.isArray(idbList) && idbList.length > 0) {
          let updated = false;
          const current = this.getApplicants();
          const curMap = new Map(current.map((a) => [a.id, a]));
          for (const item of idbList) {
            if (item && item.id && !curMap.has(item.id)) {
              current.push(item);
              updated = true;
            }
          }
          if (updated) {
            const s = JSON.stringify(current);
            localStorage.setItem(STORAGE_KEYS.APPLICANTS, s);
            localStorage.setItem(STORAGE_KEYS.APPLICANTS_BACKUP, s);
            localStorage.setItem(STORAGE_KEYS.APPLICANTS_ARCHIVE, s);
            localStorage.setItem(STORAGE_KEYS.APPLICANTS_MASTER, s);
          }
        }
        // Save current to IndexedDB
        idbSaveApplicants(this.getApplicants());
      }).catch(() => {});
    } catch (e) {
      console.warn('JAGO dbService init warning:', e);
    }
  },
};

// Initialize immediately on import
dbService.init();
