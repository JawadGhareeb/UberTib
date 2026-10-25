import { useRouter } from 'expo-router';

import { resolveSafeReturnTo } from '@/features/auth/navigation/auth-intent';
import { useAuthAccess } from '@/features/auth/state/auth-access-store';
import { ConfirmationDialog } from '@/shared/components/ui/confirmation-dialog';

/** One mounted UI portal; auth/guest access logic lives in a Zustand store. */
export function AuthAccessDialog() {
  const router = useRouter();
  const pending = useAuthAccess((state) => state.pending);
  const dismiss = useAuthAccess((state) => state.dismiss);

  const continueAsGuest = () => {
    const fallback = pending?.guestFallback;
    dismiss();
    if (fallback) router.replace(fallback);
  };

  const goToSignIn = () => {
    if (!pending) return;
    const target = resolveSafeReturnTo(pending.returnTo);
    dismiss();
    router.push({
      pathname: '/auth/phone',
      params: { returnTo: String(target) },
    });
  };

  return (
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
  );
}
