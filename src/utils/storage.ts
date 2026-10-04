import { PostHistoryItem, AccountConnections, OmniGenerationResult } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'mono_gen_history',
  ACCOUNTS: 'mono_gen_accounts',
  SAVED_ITEMS: 'mono_gen_saved_items',
  LAST_RESULT: 'mono_gen_last_result',
  DEVICE_ID: 'mono_gen_device_id'
};

export function getDeviceId(): string {
  let deviceId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  }
  return deviceId;
}

export function getStoredAccounts(): AccountConnections {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return {
    githubToken: '',
    githubUsername: 'developer',
    openaiApiKey: '',
    linkedinConnected: true,
    xConnected: true,
    instagramConnected: true,
    tiktokConnected: true,
    facebookConnected: true
  };
}

export function saveStoredAccounts(accounts: AccountConnections) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredHistory(): PostHistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveHistoryItem(item: PostHistoryItem) {
  try {
    const list = getStoredHistory();
    const updated = [item, ...list];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error(e);
    return [];
  }
}
