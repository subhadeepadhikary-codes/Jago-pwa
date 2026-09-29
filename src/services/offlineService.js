// JAGO Offline-First Resilience Service
// Ensures uninterrupted functionality in low-connectivity tribal areas.
// Local caching of read-only state + safe queueing of mutable actions.

const QUEUE_KEY = 'jago_offline_action_queue';
const CACHE_KEY = 'jago_offline_cached_state';

export const offlineService = {
  // Check live network connectivity
  isOnline() {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  },

  // Save current verified state into offline cache
  cacheState(state) {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          ...state,
          cachedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.warn('Offline cache save failed:', e);
    }
  },

  // Retrieve cached state
  getCachedState() {
    try {
      const data = localStorage.getItem(CACHE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // Get current queued actions
  getQueue() {
    try {
      const data = localStorage.getItem(QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // Queue a safe action while offline (e.g. Save Draft, Respond to Correction)
  enqueueAction(actionType, payload) {
    const queue = this.getQueue();
    const actionItem = {
      id: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actionType,
      payload,
      timestamp: new Date().toISOString(),
      status: 'QUEUED_WAITING_FOR_CONNECTION',
    };
    queue.push(actionItem);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return actionItem;
  },

  // Flush and sync queued actions when connection returns
  async flushQueue(apiExecutor) {
    const queue = this.getQueue();
    if (queue.length === 0) return { syncedCount: 0 };

    const synced = [];
    for (const item of queue) {
      try {
        if (apiExecutor) {
          await apiExecutor(item);
        }
        synced.push(item.id);
      } catch (e) {
        console.error('Error syncing queued action:', item, e);
      }
    }

    // Retain failed items, remove synced items
    const remaining = queue.filter((item) => !synced.includes(item.id));
    localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));

    return {
      syncedCount: synced.length,
      remainingCount: remaining.length,
    };
  },
};
