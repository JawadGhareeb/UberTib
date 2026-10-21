import { useRouter } from 'expo-router';
import { Typography } from 'heroui-native';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingScreen } from '@/features/app-entry/components/onboarding-screen';
import { BrandLogo } from '@/shared/components/brand';
import { secureStorage } from '@/shared/storage/secure-storage';

/** Intro is shown only on first launch, regardless of development/release mode. */
export function AppEntryScreen() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [step, setStep] = useState<0 | 1>(0);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const complete = await secureStorage.getOnboardingComplete();
        if (!active) return;
        if (complete) {
          router.replace('/(tabs)/home');
          return;
        }
      } catch {
        // First use is still available when storage is inaccessible.
      }
      if (active) setChecking(false);
    })();
    return () => {
      active = false;
    };
  }, [router]);

  const finish = useCallback(
    async (destination: '/(tabs)/home' | '/auth/phone') => {
      try {
        await secureStorage.setOnboardingComplete();
      } catch {
        // Never block an explicit onboarding choice.
      }
      router.replace(destination);
    },
    [router],
  );

  if (checking) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface-canvas">
        <View className="items-center gap-3">
          <BrandLogo size={68} />
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
      onBack={() => setStep(0)}
      onBrowse={() => void finish('/(tabs)/home')}
      onLogin={() => void finish('/auth/phone')}
    />
  );
}
