import { Button, Typography } from 'heroui-native';
import { useEffect } from 'react';
import {
  BackHandler,
  Platform,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandLogo } from '@/shared/components/brand';
import { AuthBackButton } from '@/shared/components/navigation/auth-back-button';
import { OnboardingArtwork, type OnboardingStep } from './onboarding-artwork';

type Props = {
  step: OnboardingStep;
  direction: 'forward' | 'back';
  onNext: () => void;
  onBack: () => void;
  onBrowse: () => void;
  onLogin: () => void;
};

const pages = [
  {
    title: 'عنايتك بأسنانك بتبدأ من هون',
    description:
      'مو متأكد شو بتحتاج؟ منساعدك تبدأ بتحديد حالتك، أو فيك تستكشف الأطباء والخدمات بنفسك.',
  },
  {
    title: 'اختار طبيبك بثقة ووضوح',
    description:
      'قارن بين الأطباء حسب تصنيفهم العلمي، تقييمات المرضى، الأسعار ومستويات الحماية المتاحة.',
  },
  {
    title: 'من الحجز للمتابعة، كل خطوة واضحة',
    description: 'اختار موعدك، تابع طلب الحجز وخطتك العلاجية، واطّلع على شروط الحماية المتاحة إلك.',
  },
] as const;

export function OnboardingScreen({ step, onNext, onBack, onBrowse, onLogin }: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const artworkHeight = Math.max(232, Math.min(280, Math.round(windowHeight * 0.35)));
  const page = pages[step];

  useEffect(() => {
    if (Platform.OS !== 'android' || step === 0) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => subscription.remove();
  }, [step, onBack]);

  return (
    <SafeAreaView className="flex-1 bg-surface-canvas" edges={['top', 'bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="mx-auto w-full max-w-[430px] flex-1 px-6 pb-7 pt-4">
          <View
            className="min-h-[44px] flex-row items-center justify-between"
            style={{ direction: 'rtl' }}
          >
            <BrandLogo size={32} />
            <View className="flex-row items-center gap-2" style={{ direction: 'rtl' }}>
              {step > 0 ? <AuthBackButton onPress={onBack} /> : null}
              {step < 2 ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="تخطي المقدمة والتصفح كزائر"
                  hitSlop={8}
                  className="min-h-[44px] min-w-[56px] items-center justify-center"
                  onPress={onBrowse}
                >
                  <Typography.Paragraph
                    type="body-sm"
                    className="font-ui-medium text-text-secondary"
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
            accessibilityValue={{ min: 1, max: 3, now: step + 1 }}
            className="mt-3 flex-row gap-2"
            style={{ direction: 'rtl' }}
          >
            {pages.map((_, index) => (
              <View
                key={index}
                className={
                  'h-1 flex-1 rounded-full ' +
                  (index <= step ? 'bg-action-primary' : 'bg-border-default')
                }
              />
            ))}
          </View>

          <View key={step} className="mt-5 gap-5">
            <OnboardingArtwork step={step} height={artworkHeight} />
            <View className="items-center gap-3">
              <Typography.Heading
                type="h1"
                className="w-full font-ui-bold text-text-primary"
                style={{ textAlign: 'center', writingDirection: 'rtl', lineHeight: 38 }}
              >
                {page.title}
              </Typography.Heading>
              <Typography.Paragraph
                className="w-full font-ui-regular text-text-secondary"
                style={{ textAlign: 'center', writingDirection: 'rtl', lineHeight: 25 }}
              >
                {page.description}
              </Typography.Paragraph>
            </View>
          </View>

          <View className="min-h-4 flex-1" />
          <View className="mt-6 gap-3">
            {step < 2 ? (
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
                  onPress={onBrowse}
                >
                  <Button.Label className="font-ui-semibold">ابدأ التصفح</Button.Label>
                </Button>
                <Button
                  variant="tertiary"
                  size="lg"
                  className="min-h-[52px] rounded-form-field"
                  onPress={onLogin}
                >
                  <Button.Label className="font-ui-semibold">لدي حساب</Button.Label>
                </Button>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}