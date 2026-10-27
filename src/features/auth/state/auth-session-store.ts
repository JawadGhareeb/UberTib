import { create } from 'zustand';
import { secureStorage } from '@/shared/storage/secure-storage';
import { queryClient } from '@/shared/query/query-client';
import { resetSessionStores } from '@/shared/state/session-stores';

interface AuthSessionState {
  isAuthenticated: boolean;
  sessionEpoch: number;
  signInMock: () => void;
  signOut: () => Promise<void>;
}

/**
 * Session identity is shared application state, not a view-level Context.
 * sessionEpoch continues to remount the remaining storage-backed providers
 * after sign-out, while global Zustand stores are explicitly reset.
 */
export const useAuthSession = create<AuthSessionState>()((set) => ({
  isAuthenticated: true,
  sessionEpoch: 0,
  signInMock: () => set({ isAuthenticated: true }),
  signOut: async () => {
    await Promise.allSettled([
      secureStorage.clearAccessToken(),
      secureStorage.clearPreferredLocation(),
      secureStorage.clearCareDrafts(),
      secureStorage.clearDoctorFavorites(),
    ]);
    queryClient.clear();
    resetSessionStores();
    set(({ sessionEpoch }) => ({ isAuthenticated: true, sessionEpoch: sessionEpoch + 1 }));
  },
}));
