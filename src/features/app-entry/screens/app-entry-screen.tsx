import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { OnboardingScreen } from '@/features/app-entry/components/onboarding-screen';
import type { OnboardingStep } from '@/features/app-entry/components/onboarding-artwork';
import { AppLoadingScreen } from '@/features/app-entry/components/app-loading-screen';
import { secureStorage } from '@/shared/storage/secure-storage';

/**
 * The index route owns the initial session check, never RootLayout.
 * Both Expo Go and release honor the saved completion flag: intro is
 * shown only until a user explicitly chooses to browse or sign in.
 */
export function AppEntryScreen() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState<OnboardingStep>(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  useEffect(() => {
    let active = true;

    const boot = async () => {
      let onboardingComplete = false;

      try {
        onboardingComplete = await secureStorage.getOnboardingComplete();
      } catch {
        // Missing/unavailable storage must never trap a first-time visitor.
      }

      if (!active) return;

      if (onboardingComplete) {
        router.replace('/(tabs)/home');
        return;
      }

      setStep(0);
      setShowOnboarding(true);
      setReady(true);
    };

    void boot();
    return () => {
      active = false;
    };
  }, [router]);

  const finish = useCallback(
    async (destination: '/(tabs)/home' | '/auth/phone') => {
      try {
        await secureStorage.setOnboardingComplete();
      } catch {
        // Never block the user's choice if persistence is unavailable.
      }
      router.replace(destination);
    },
    [router],
  );

  if (!ready || !showOnboarding) {
    return <AppLoadingScreen />;
  }

  return (
    <OnboardingScreen
      step={step}
      direction={direction}
      onNext={() => {
        setDirection('forward');
        setStep((current) => Math.min(current + 1, 3) as OnboardingStep);
      }}
      onBack={() => {
        setDirection('back');
        setStep((current) => Math.max(current - 1, 0) as OnboardingStep);
      }}
      onSkip={() => {
        setDirection('forward');
        setStep(3);
      }}
      onBrowse={() => void finish('/(tabs)/home')}
      onLogin={() => void finish('/auth/phone')}
    />
  );
}
