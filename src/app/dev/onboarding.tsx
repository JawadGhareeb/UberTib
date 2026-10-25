import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';

import { OnboardingScreen } from '@/features/app-entry/components/onboarding-screen';
import type { OnboardingStep } from '@/features/app-entry/components/onboarding-artwork';

/** Preview the first-run screens without changing onboarding completion storage. */
export default function OnboardingDevPreview() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  if (!__DEV__) return <Redirect href="/" />;

  return (
    <OnboardingScreen
      step={step}
      direction={direction}
      onNext={() => {
        setDirection('forward');
        setStep((previous) => Math.min(previous + 1, 3) as OnboardingStep);
      }}
      onBack={() => {
        setDirection('back');
        setStep((previous) => Math.max(previous - 1, 0) as OnboardingStep);
      }}
      onSkip={() => {
        setDirection('forward');
        setStep(3);
      }}
      onBrowse={() => router.replace('/(tabs)/home')}
      onLogin={() => router.replace('/auth/phone')}
    />
  );
}
