import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'auth.access-token';
const THEME_SCHEME_KEY = 'preferences.theme-scheme';
const ONBOARDING_COMPLETE_KEY = 'experience.onboarding-complete';
const PREFERRED_LOCATION_KEY = 'preferences.preferred-location';

const webMemory = new Map<string, string>();

function getWebPersistentItem(key: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setWebPersistentItem(key: string, value: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable in restricted/private browser contexts.
  }
}

function deleteWebPersistentItem(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Storage can be unavailable in restricted/private browser contexts.
  }
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS !== 'web') {
    return SecureStore.getItemAsync(key);
  }

  if (key === ACCESS_TOKEN_KEY) {
    return webMemory.get(key) ?? null;
  }

  return getWebPersistentItem(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS !== 'web') {
    await SecureStore.setItemAsync(key, value);
    return;
  }

  if (key === ACCESS_TOKEN_KEY) {
    webMemory.set(key, value);
    return;
  }

  setWebPersistentItem(key, value);
}

async function deleteItem(key: string): Promise<void> {
  if (Platform.OS !== 'web') {
    await SecureStore.deleteItemAsync(key);
    return;
  }

  if (key === ACCESS_TOKEN_KEY) {
    webMemory.delete(key);
    return;
  }

  deleteWebPersistentItem(key);
}

export const secureStorage = {
  getAccessToken: () => getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => setItem(ACCESS_TOKEN_KEY, token),
  clearAccessToken: () => deleteItem(ACCESS_TOKEN_KEY),
  getThemeScheme: () => getItem(THEME_SCHEME_KEY),
  setThemeScheme: (scheme: 'light' | 'dark') => setItem(THEME_SCHEME_KEY, scheme),
  getPreferredLocation: () => getItem(PREFERRED_LOCATION_KEY),
  clearPreferredLocation: () => deleteItem(PREFERRED_LOCATION_KEY),
  setPreferredLocation: (value: string) => setItem(PREFERRED_LOCATION_KEY, value),
  getOnboardingComplete: async () => (await getItem(ONBOARDING_COMPLETE_KEY)) === '1',
  setOnboardingComplete: () => setItem(ONBOARDING_COMPLETE_KEY, '1'),
};
