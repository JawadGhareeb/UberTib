import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'auth.access-token';
const THEME_SCHEME_KEY = 'preferences.theme-scheme';
const ONBOARDING_COMPLETE_KEY = 'experience.onboarding-complete';
const PREFERRED_LOCATION_KEY = 'preferences.preferred-location';
const CARE_DRAFT_INDEX = 'patient.care-drafts.v2.index';
const FAVORITES_KEY = 'patient.favorite-doctors.v1';
let favoriteStorageQueue: Promise<void> = Promise.resolve();
const careDraftKey = (id: string) => 'patient.care-drafts.v2.' + id;

const webMemory = new Map<string, string>();
let careDraftStorageQueue: Promise<void> = Promise.resolve();
let cachedDraftIndex: string | null = null;
const cachedDraftPayloads = new Map<string, string>();

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
  getCareDrafts: async (): Promise<unknown[]> => {
    const raw = await getItem(CARE_DRAFT_INDEX);
    if (!raw) {
      cachedDraftIndex = null;
      cachedDraftPayloads.clear();
      return [];
    }
    let ids: unknown;
    try {
      ids = JSON.parse(raw);
    } catch {
      return [];
    }
    if (!Array.isArray(ids)) return [];
    const entries = await Promise.all(
      ids.slice(0, 30).map(async (id) => {
        if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(id)) return null;
        const stored = await getItem(careDraftKey(id));
        if (!stored) return null;
        cachedDraftPayloads.set(id, stored);
        try {
          return JSON.parse(stored) as unknown;
        } catch {
          return null;
        }
      }),
    );
    cachedDraftIndex = raw;
    return entries.filter((item): item is object => item !== null) as unknown[];
  },
  setCareDrafts: (drafts: readonly { id: string }[]): Promise<void> => {
    const task = careDraftStorageQueue
      .catch(() => undefined)
      .then(async () => {
        const existing = cachedDraftIndex ?? (await getItem(CARE_DRAFT_INDEX));
        let oldIds: string[] = [];
        try {
          oldIds = existing ? (JSON.parse(existing) as string[]) : [];
        } catch {
          /* stale index */
        }
        const fresh = drafts.slice(0, 20);
        for (const draft of fresh) {
          if (!/^[a-zA-Z0-9_-]{1,100}$/.test(draft.id)) throw new Error('Invalid draft id');
          const payload = JSON.stringify(draft);
          if (cachedDraftPayloads.get(draft.id) !== payload) {
            await setItem(careDraftKey(draft.id), payload);
            cachedDraftPayloads.set(draft.id, payload);
          }
        }
        const nextIndex = JSON.stringify(fresh.map((item) => item.id));
        if (nextIndex !== existing) {
          await setItem(CARE_DRAFT_INDEX, nextIndex);
        }
        cachedDraftIndex = nextIndex;
        const removed = oldIds.filter((id) => !fresh.some((draft) => draft.id === id));
        await Promise.all(removed.map((id) => deleteItem(careDraftKey(id))));
        removed.forEach((id) => cachedDraftPayloads.delete(id));
      });
    careDraftStorageQueue = task.catch(() => undefined);
    return task;
  },
  clearCareDrafts: (): Promise<void> => {
    const task = careDraftStorageQueue
      .catch(() => undefined)
      .then(async () => {
        const raw = cachedDraftIndex ?? (await getItem(CARE_DRAFT_INDEX));
        let ids: string[] = [];
        try {
          ids = raw ? (JSON.parse(raw) as string[]) : [];
        } catch {
          /* stale index */
        }
        await deleteItem(CARE_DRAFT_INDEX);
        await Promise.all(
          ids
            .filter((id) => /^[a-zA-Z0-9_-]{1,100}$/.test(id))
            .map((id) => deleteItem(careDraftKey(id))),
        );
        cachedDraftIndex = null;
        cachedDraftPayloads.clear();
      });
    careDraftStorageQueue = task.catch(() => undefined);
    return task;
  },
  getDoctorFavorites: async (): Promise<{ providerId: string; serviceCode: string | null }[]> => {
    const raw = await getItem(FAVORITES_KEY);
    if (!raw) return [];
    try {
      const entries: unknown = JSON.parse(raw);
      if (!Array.isArray(entries)) return [];
      return entries
        .slice(0, 60)
        .filter(
          (value): value is { providerId: string; serviceCode: string | null } =>
            typeof value === 'object' &&
            value !== null &&
            typeof value.providerId === 'string' &&
            /^[a-zA-Z0-9_-]{1,100}$/.test(value.providerId) &&
            (value.serviceCode === null ||
              (typeof value.serviceCode === 'string' &&
                /^[a-zA-Z0-9_-]{1,100}$/.test(value.serviceCode))),
        );
    } catch {
      return [];
    }
  },
  setDoctorFavorites: (
    favorites: readonly { providerId: string; serviceCode: string | null }[],
  ): Promise<void> => {
    const task = favoriteStorageQueue
      .catch(() => undefined)
      .then(() => setItem(FAVORITES_KEY, JSON.stringify(favorites.slice(-60))));
    favoriteStorageQueue = task.catch(() => undefined);
    return task;
  },
  clearDoctorFavorites: (): Promise<void> => {
    const task = favoriteStorageQueue.catch(() => undefined).then(() => deleteItem(FAVORITES_KEY));
    favoriteStorageQueue = task.catch(() => undefined);
    return task;
  },
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
