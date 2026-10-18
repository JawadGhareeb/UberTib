import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  type OnboardingSlide,
  OnboardingScreen,
} from '@/features/app-entry/components/onboarding-screen';
import { SplashScreen } from '@/features/app-entry/components/splash-screen';
import { secureStorage } from '@/shared/storage/secure-storage';
import { theme } from '@/shared/theme';

const slides: OnboardingSlide[] = [
  {
    title: 'خلّينا نفهم شو عم يزعجك',
    copy: 'مو ضروري تعرف اسم المشكلة أو الاختصاص.',
    illustration: 'complaint',
  },
  {
    title: 'الخطوات الأربع',
    copy: 'خطوة بسيطة، منساعدك توصل للرعاية المناسبة.',
    illustration: 'steps',
  },
  {
    title: 'اختر الطبيب المناسب لك',
    copy: 'نعرض لك أطباء مؤهلين للخدمة، وأنت تختار وتقارن.',
    illustration: 'doctor',
  },
  {
    title: 'من أول زيارة لآخر مرحلة',
    copy: 'من التقييم والحجز لخطة العلاج والمراحل والمتابعة.',
    illustration: 'care',
  },
];

export function AppEntryScreen() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');
  const [nextRoute, setNextRoute] = useState<'/(tabs)/home' | '/auth/phone'>('/auth/phone');

  useEffect(() => {
    let active = true;

    const boot = async () => {
      let onboardingComplete = false;
      let accessToken: string | null = null;

      try {
        [onboardingComplete, accessToken] = await Promise.all([
          secureStorage.getOnboardingComplete(),
          secureStorage.getAccessToken(),
        ]);
      } catch {
        // A SecureStore failure must never trap the patient on the splash
        // screen. Fall back to the unauthenticated intro/phone route.
      }

      await new Promise((resolve) => setTimeout(resolve, theme.motion.duration.ceiling + 580));

      if (!active) return;

      const destination = accessToken ? '/(tabs)/home' : '/auth/phone';
      setNextRoute(destination);

      // Development builds need to replay and visually QA all four Pen
      // onboarding slides on EVERY fresh app launch, even after a previous
      // preview or when a mock/session token exists. The saved first-use
      // decision still controls production launches.
      if (__DEV__) {
        setSlideIndex(0);
        setShowOnboarding(true);
        setReady(true);
        return;
      }

      if (accessToken || onboardingComplete) {
        router.replace(destination);
        return;
      }

      setShowOnboarding(true);
      setReady(true);
    };

    void boot();

    return () => {
      active = false;
    };
  }, [router]);

  const goToSlide = (target: number) => {
    if (target < 0 || target >= slides.length || target === slideIndex) return;
    setTransitionDirection(target > slideIndex ? 'forward' : 'backward');
    setSlideIndex(target);
  };

  const completeOnboarding = async () => {
    try {
      await secureStorage.setOnboardingComplete();
    } catch {
      // Storage permission errors should not prevent going to login/home.
    }
    router.replace(nextRoute);
  };

  if (!ready || !showOnboarding) {
    return <SplashScreen />;
  }

  return (
    <OnboardingScreen
      index={slideIndex}
      onBack={() => goToSlide(slideIndex - 1)}
      onGoToSlide={goToSlide}
      onNext={() => {
        if (slideIndex === slides.length - 1) {
          void completeOnboarding();
          return;
        }

        goToSlide(slideIndex + 1);
      }}
      onSkip={() => void completeOnboarding()}
      slide={slides[slideIndex]!}
      total={slides.length}
      transitionDirection={transitionDirection}
    />
  );
}
