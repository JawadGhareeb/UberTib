import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { useAuthSession } from '@/providers/auth-session-provider';
import { ConfirmationDialog } from '@/shared/components/ui/confirmation-dialog';
import { resolveSafeReturnTo } from '@/features/auth/navigation/auth-intent';

export interface AuthAccessRequest {
  /** Exact screen (with safe query) to reopen after OTP verification. */
  returnTo: string;
  title?: string;
  description?: string;
  /** The public screen restored if a guest declines a protected route. */
  guestFallback?: '/(tabs)/home' | '/(tabs)/profile' | '/(tabs)/discover';
}

interface AuthAccessContextValue {
  requireAuth: (request: AuthAccessRequest) => boolean;
}

const AuthAccessContext = createContext<AuthAccessContextValue | null>(null);

export function AuthAccessProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const { isAuthenticated } = useAuthSession();
  const [pending, setPending] = useState<AuthAccessRequest | null>(null);

  const requireAuth = useCallback(
    (request: AuthAccessRequest) => {
      if (isAuthenticated) return true;
      setPending((current) =>
        current?.returnTo === request.returnTo ? current : request,
      );
      return false;
    },
    [isAuthenticated],
  );

  const contextValue = useMemo(() => ({ requireAuth }), [requireAuth]);
  const continueAsGuest = () => {
    const fallback = pending?.guestFallback;
    setPending(null);
    if (fallback) router.replace(fallback);
  };

  const goToSignIn = () => {
    if (!pending) return;
    const target = resolveSafeReturnTo(pending.returnTo);
    setPending(null);
    router.push({
      pathname: '/auth/phone',
      params: { returnTo: String(target) },
    });
  };

  return (
    <AuthAccessContext.Provider value={contextValue}>
      {children}
      <ConfirmationDialog
        visible={Boolean(pending)}
        title={pending?.title ?? 'سجّل دخولك للمتابعة'}
        description={
          pending?.description ??
          'سجّل دخولك لعرض بياناتك الشخصية أو إكمال هذا الإجراء، أو تابع التصفح كزائر.'
        }
        confirmLabel="تسجيل الدخول"
        cancelLabel="إكمال التصفح كزائر"
        icon={{ ios: 'lock.shield', android: 'lock_outline', web: 'lock' }}
        onConfirm={goToSignIn}
        onCancel={continueAsGuest}
      />
    </AuthAccessContext.Provider>
  );
}

export function useAuthAccess(): AuthAccessContextValue {
  const value = useContext(AuthAccessContext);
  if (!value) throw new Error('AuthAccessProvider is required for auth-gated actions');
  return value;
}
