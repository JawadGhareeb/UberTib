import type { ComponentType } from 'react';
import { useMemo } from 'react';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { View } from 'react-native';

import { buildReturnTo } from '@/features/auth/navigation/auth-intent';
import { useAuthSession } from '@/providers/auth-session-provider';
import { AppIcon, AppText, Button, Screen } from '@/shared/components/ui';

function guestDestination(pathname: string) {
  return pathname.startsWith('/booking/')
    ? ('/(tabs)/discover' as const)
    : ('/(tabs)/home' as const);
}

/** Private screens render only one guest gate; no automatic navigation or duplicate dialog. */
export function withAuthRequired<Props extends object>(Component: ComponentType<Props>) {
  function ProtectedScreen(props: Props) {
    const { isAuthenticated } = useAuthSession();
    const router = useRouter();
    const pathname = usePathname();
    const params = useLocalSearchParams();

    const returnTo = useMemo(() => {
      const query: Record<string, string | undefined> = {};
      for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'string' && value.length < 300 && key !== 'returnTo')
          query[key] = value;
      }
      return buildReturnTo(pathname, query);
    }, [pathname, params]);

    if (isAuthenticated) return <Component {...props} />;

    return (
      <Screen contentClassName="px-5 py-8">
        <View className="flex-1 items-center justify-center gap-3">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-action-subtle">
            <AppIcon
              name={{ ios: 'lock.shield', android: 'lock_outline', web: 'lock' }}
              size={29}
              tone="action"
            />
          </View>
          <AppText align="center" variant="heading-4" className="font-ui-bold">
            سجّل دخولك للمتابعة
          </AppText>
          <AppText align="center" variant="label" className="text-content-secondary">
            هذه الصفحة خاصة بحسابك. سجّل دخولك لتشوف بياناتك وتكمل إجراءاتك.
          </AppText>
          <View className="mt-3 w-full max-w-[320px] gap-2">
            <Button
              label="تسجيل الدخول"
              onPress={() => router.push({ pathname: '/auth/phone', params: { returnTo } })}
            />
            <Button
              label="إكمال التصفح كزائر"
              variant="outline"
              onPress={() => router.replace(guestDestination(pathname))}
            />
          </View>
        </View>
      </Screen>
    );
  }
  ProtectedScreen.displayName = `WithAuthRequired(${Component.displayName ?? Component.name ?? 'Screen'})`;
  return ProtectedScreen;
}
