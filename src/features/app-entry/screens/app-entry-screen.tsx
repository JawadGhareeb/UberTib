import { useLocalSearchParams, useRouter } from 'expo-router';
import { Typography } from 'heroui-native';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingScreen } from '@/features/app-entry/components/onboarding-screen';
import { BrandMark } from '@/shared/components/brand/brand-mark';
import { secureStorage } from '@/shared/storage/secure-storage';

/**
 * New two-step first-use intro; guests are not forced to authenticate.
 * Development builds replay both steps for easy visual QA.
 */
export function AppEntryScreen() {
  const router = useRouter();
  const { step: requestedStep } = useLocalSearchParams<{ step?: string }>();
  const [checking, setChecking] = useState(!__DEV__ && requestedStep !== '2');
  const [step, setStep] = useState<0 | 1>(requestedStep === '2' ? 1 : 0);

  useEffect(() => {
    if (__DEV__ || requestedStep === '2') return;
    let active = true;
    const bootstrap = async () => {
      try {
        const [complete, token] = await Promise.all([
          secureStorage.getOnboardingComplete(),
          secureStorage.getAccessToken(),
        ]);
        if (!active) return;
        if (complete || token) {
          router.replace('/(tabs)/home');
          return;
        }
      } catch {
        // Secure storage being unavailable must not prevent guest browsing.
      }
      if (active) setChecking(false);
    };
    void bootstrap();
    return () => {
      active = false;
    };
  }, [router, requestedStep]);

  const finish = useCallback(
    async (destination: '/(tabs)/home' | '/auth/phone', mode?: 'register') => {
      try {
        await secureStorage.setOnboardingComplete();
      } catch {
        // Storage failure must never block an explicit patient choice.
      }
      if (destination === '/auth/phone' && mode === 'register') {
        router.replace({ pathname: '/auth/phone', params: { mode } });
      } else {
        router.replace(destination);
      }
    },
    [router],
  );

  const back = useCallback(() => setStep(0), []);

  if (checking) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface-canvas">
        <View className="items-center gap-3">
          <BrandMark size={92} />
          <Typography.Paragraph className="font-ui-medium text-text-secondary">
            جارٍ تهيئة التطبيق…
          </Typography.Paragraph>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <OnboardingScreen
      step={step}
      onNext={() => setStep(1)}
      onBack={back}
      onBrowse={() => void finish('/(tabs)/home')}
      onLogin={() => void finish('/auth/phone')}
      onRegister={() => void finish('/auth/phone', 'register')}
    />
  );
}
