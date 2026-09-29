// JAGO Real-Time Cloud Persistence Service
// Unified bridge to GlobalCloudStore supporting all 7 data models
// Zero-Knowledge AES-256-GCM authenticated encryption + PBKDF2

import { globalCloudStore } from './globalCloudStore';

export const cloudSyncService = {
  isOnline() {
    return globalCloudStore.isOnline();
  },

  async fetchCloudVault() {
    return globalCloudStore.fetchVault();
  },

  async pushToCloudVault(vaultData) {
    return globalCloudStore.pushVault(vaultData);
  },

  // MODEL 1: Applicants
  async syncApplicantToCloud(applicant) {
    return globalCloudStore.syncApplicant(applicant);
  },

  // MODEL 2: Applications
  async syncApplicationToCloud(application, userKey) {
    return globalCloudStore.syncApplication(application, userKey);
  },

  // MODEL 3: Documents
  async syncDocumentToCloud(document, userKey) {
    return globalCloudStore.syncDocument(document, userKey);
  },

  // MODEL 4: Consents (DPDP Compliance)
  async syncConsentToCloud(consent) {
    return globalCloudStore.syncConsent(consent);
  },

  // MODEL 5: Family Hub
  async syncFamilyHubToCloud(familyData, userKey) {
    return globalCloudStore.syncFamilyHub(familyData, userKey);
  },

  // MODEL 6: Notifications
  async syncNotificationToCloud(notification) {
    return globalCloudStore.syncNotification(notification);
  },

  // MODEL 7: Officer Actions & Verification Queue
  async syncOfficerActionToCloud(action) {
    return globalCloudStore.syncOfficerAction(action);
  },

  // Universal Full Portfolio Hydration across devices
  async hydrateFromCloud(applicantId, password) {
    const portfolio = await globalCloudStore.hydrateFullPortfolio(applicantId, password);
    return portfolio?.applicant || null;
  },

  async hydrateFullPortfolio(applicantId, password) {
    return globalCloudStore.hydrateFullPortfolio(applicantId, password);
  },
};
