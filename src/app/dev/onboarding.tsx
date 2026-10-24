import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';

import { OnboardingScreen } from '@/features/app-entry/components/onboarding-screen';

/** Preview the first-run screens without changing onboarding completion storage. */
export default function OnboardingDevPreview() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  if (!__DEV__) return <Redirect href="/" />;

  return (
    <OnboardingScreen
      step={step}
      direction={direction}
      onNext={() => {
        setDirection('forward');
        setStep((previous) => Math.min(previous + 1, 2) as 0 | 1 | 2);
      }}
      onBack={() => {
        setDirection('back');
        setStep((previous) => Math.max(previous - 1, 0) as 0 | 1 | 2);
      }}
      onBrowse={() => router.replace('/(tabs)/home')}
      onLogin={() => router.replace('/auth/phone')}
    />
  );
}
