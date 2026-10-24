import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { secureStorage } from '@/shared/storage/secure-storage';
import { queryClient } from '@/shared/query/query-client';

interface AuthSessionContextValue {
  isAuthenticated: boolean;
  sessionEpoch: number;
  signInMock: () => void;
  signOut: () => Promise<void>;
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Changing this key remounts every patient-specific in-memory provider,
  // removing tickets, drafts, selected patients, cases, and profile edits.
  const [sessionEpoch, setSessionEpoch] = useState(0);

  const signOut = useCallback(async () => {
    // Retain onboarding and appearance; delete auth and personally selected location.
    await Promise.allSettled([
      secureStorage.clearAccessToken(),
      secureStorage.clearPreferredLocation(),
      secureStorage.clearCareDrafts(),
      secureStorage.clearDoctorFavorites(),
    ]);
    queryClient.clear();
    setIsAuthenticated(false);
    setSessionEpoch((value) => value + 1);
  }, []);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      isAuthenticated,
      sessionEpoch,
      signInMock: () => setIsAuthenticated(true),
      signOut,
    }),
    [isAuthenticated, sessionEpoch, signOut],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession(): AuthSessionContextValue {
  const value = useContext(AuthSessionContext);
  if (!value) throw new Error('useAuthSession must be used inside AuthSessionProvider');
  return value;
}
