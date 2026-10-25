import { create } from 'zustand';

import { useAuthSession } from '@/features/auth/state/auth-session-store';
import { registerSessionStore } from '@/shared/state/session-stores';

export interface AuthAccessRequest {
  /** Exact screen (with safe query) to reopen after OTP verification. */
  returnTo: string;
  title?: string;
  description?: string;
  /** The public screen restored if a guest declines a protected route. */
  guestFallback?: '/(tabs)/home' | '/(tabs)/profile' | '/(tabs)/discover';
}

type AuthAccessState = {
  pending: AuthAccessRequest | null;
  requireAuth: (request: AuthAccessRequest) => boolean;
  dismiss: () => void;
};

/** Auth gate without a Context wrapper. Only the dialog subscribes to pending. */
export const useAuthAccess = create<AuthAccessState>()((set) => ({
  pending: null,
  requireAuth: (request) => {
    if (useAuthSession.getState().isAuthenticated) return true;
    set((current) =>
      current.pending?.returnTo === request.returnTo ? current : { pending: request },
    );
    return false;
  },
  dismiss: () => set({ pending: null }),
}));

// Remove an unfinished protected-navigation intent at sign-out.
registerSessionStore(useAuthAccess);
