import type { StoreApi } from 'zustand';

const sessionStores = new Set<() => void>();

/**
 * Zustand stores outlive React subtrees. Reset personal state explicitly
 * on sign-out, matching the old sessionEpoch provider-remount behavior.
 */
export function registerSessionStore<T>(store: StoreApi<T>): void {
  sessionStores.add(() => store.setState(store.getInitialState(), true));
}

export function resetSessionStores(): void {
  for (const reset of sessionStores) reset();
}
