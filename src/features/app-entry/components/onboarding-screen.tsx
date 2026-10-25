import { Button, Typography } from 'heroui-native';
import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  BackHandler,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandLogo } from '@/shared/components/brand';
import { AuthBackButton } from '@/shared/components/navigation/auth-back-button';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { OnboardingArtwork, type OnboardingStep } from './onboarding-artwork';

type Props = {
  step: OnboardingStep;
  direction: 'forward' | 'back';
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onBrowse: () => void;
  onLogin: () => void;
};

const arabicStepNumbers = ['١', '٢', '٣', '٤'] as const;

const pages = [
  {
    eyebrow: 'بداية أسهل',
    title: 'عنايتك بأسنانك بتبدأ من هون',
    description:
      'مو ضروري تعرف اسم المشكلة. احكي عن حاجتك، ومنساعدك تبدأ بتحديد حالتك أو استكشاف الأطباء والخدمات.',
  },
  {
    eyebrow: 'اختيار بثقة',
    title: 'اختار طبيبك بثقة ووضوح',
    description:
      'قارن بين الأطباء حسب تصنيفهم العلمي، تقييمات المرضى ومعلومات الأسعار، واختار اللي بناسبك.',
  },
  {
    eyebrow: 'رحلتك خطوة بخطوة',
    title: 'من الحجز للمتابعة، كل خطوة واضحة',
    description: 'قدّم طلب الموعد، انتظر تأكيد العيادة، وتابع مواعيدك وخطتك العلاجية من مكان واحد.',
  },
  {
    eyebrow: 'أهلاً في UberTib',
    title: 'جاهز تبلّش رحلتك؟',
    description: 'سجّل دخولك لتتابع حجوزاتك وعلاجك، أو استكشف الأطباء والخدمات أولاً كزائر.',
  },
] as const;

export function OnboardingScreen({
  step,
  direction,
  onNext,
  onBack,
  onSkip,
  onBrowse,
  onLogin,
}: Props) {
  const { colors } = useAppTheme();
  const { height: windowHeight } = useWindowDimensions();
  const artworkHeight = Math.max(210, Math.min(345, Math.round(windowHeight * 0.36)));
  const page = pages[step];

  // Leave the first frame fully visible; transitions only run when the user
  // changes steps. This avoids reintroducing the Android cold-start blank view.
  const [opacity] = useState(() => new Animated.Value(1));
  const [translation] = useState(() => new Animated.Value(0));
  const previousStep = useRef(step);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (active) setReducedMotion(enabled);
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReducedMotion,
    );
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;

    opacity.stopAnimation();
    translation.stopAnimation();
    if (reducedMotion) {
      opacity.setValue(1);
      translation.setValue(0);
      return;
    }

    opacity.setValue(0.35);
    // In an Arabic journey the next page enters from the left.
    translation.setValue(direction === 'forward' ? -22 : 22);
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translation, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [step, direction, reducedMotion, opacity, translation]);

  useEffect(() => {
    if (Platform.OS !== 'android' || step === 0) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => subscription.remove();
  }, [step, onBack]);

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{ flex: 1, backgroundColor: colors.surface.canvas }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View
          style={{
            flexGrow: 1,
            width: '100%',
            maxWidth: 430,
            alignSelf: 'center',
            paddingHorizontal: 24,
            paddingTop: 14,
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              minHeight: 56,
              // Keep the physical positions stable on Android and iOS:
              // logo on the left, navigation actions on the right.
              flexDirection: 'row',
              direction: 'ltr',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <BrandLogo size={30} />
            <View
              style={{
                flexDirection: 'row-reverse',
                direction: 'ltr',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 12,
              }}
            >
              {step > 0 ? <AuthBackButton onPress={onBack} /> : null}
              {step < 3 ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="تخطي الشرح والانتقال لخيارات الدخول"
                  hitSlop={10}
                  style={{
                    minWidth: 48,
                    minHeight: 44,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={onSkip}
                >
                  <Typography.Paragraph
                    type="body-sm"
                    className="font-ui-medium text-text-secondary"
                    style={{ textAlign: 'center', writingDirection: 'rtl' }}
                  >
                    تخطي
                  </Typography.Paragraph>
                </Pressable>
              ) : null}
            </View>
          </View>

          <View
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel="تقدم خطوات المقدمة"
            accessibilityValue={{ min: 1, max: 4, now: step + 1 }}
            style={{ marginTop: 18, flexDirection: 'row', direction: 'rtl', gap: 6 }}
          >
            {pages.map((_, index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  height: 5,
                  borderRadius: 5,
                  backgroundColor: index <= step ? colors.action.primary : colors.border.default,
                }}
              />
            ))}
          </View>
          <Typography.Paragraph
            type="body-sm"
            className="mt-3 font-ui-medium text-text-secondary"
            style={{ textAlign: 'right', writingDirection: 'rtl' }}
          >
            الخطوة {arabicStepNumbers[step]} من ٤
          </Typography.Paragraph>

          <Animated.View
            style={{
              marginTop: 16,
              opacity,
              transform: [{ translateX: translation }],
              gap: 18,
            }}
          >
            <OnboardingArtwork step={step} height={artworkHeight} />
            <View style={{ gap: 10, alignItems: 'stretch' }}>
              <View
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: 20,
                  backgroundColor: colors.action.subtle,
                  alignSelf: 'flex-end',
                }}
              >
                <Typography.Paragraph
                  type="body-sm"
                  className="font-ui-semibold"
                  style={{
                    color: colors.action.primary,
                    textAlign: 'right',
                    writingDirection: 'rtl',
                  }}
                >
                  {page.eyebrow}
                </Typography.Paragraph>
              </View>
              <Typography.Heading
                type="h1"
                className="w-full font-ui-bold text-text-primary"
                style={{ textAlign: 'right', writingDirection: 'rtl', lineHeight: 38 }}
              >
                {page.title}
              </Typography.Heading>
              <Typography.Paragraph
                className="w-full font-ui-regular text-text-secondary"
                style={{ textAlign: 'right', writingDirection: 'rtl', lineHeight: 26 }}
              >
                {page.description}
              </Typography.Paragraph>
            </View>
          </Animated.View>

          <View style={{ minHeight: 20, flexGrow: 1 }} />
          <View style={{ marginTop: 22, gap: 12 }}>
            {step < 3 ? (
              <Button
                variant="primary"
                size="lg"
                className="min-h-[52px] rounded-form-field"
                onPress={onNext}
              >
                <Button.Label className="font-ui-semibold">التالي</Button.Label>
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  className="min-h-[52px] rounded-form-field"
                  onPress={onLogin}
                >
                  <Button.Label className="font-ui-semibold">تسجيل الدخول</Button.Label>
                </Button>
                <Button
                  variant="tertiary"
                  size="lg"
                  className="min-h-[52px] rounded-form-field"
                  onPress={onBrowse}
                >
                  <Button.Label className="font-ui-semibold">التصفح كزائر</Button.Label>
                </Button>
                <Typography.Paragraph
                  type="body-sm"
                  className="font-ui-regular text-text-secondary"
                  style={{
                    textAlign: 'center',
                    writingDirection: 'rtl',
                    fontSize: 11,
                    lineHeight: 19,
                  }}
                >
                  فيك تستكشف بدون حساب، وللحجز والمتابعة رح نطلب منك تسجيل الدخول.
                </Typography.Paragraph>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
