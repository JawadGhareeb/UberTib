import { Button, Typography } from 'heroui-native';
import { useEffect } from 'react';
import { BackHandler, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandLogo } from '@/shared/components/brand';
import { AuthBackButton } from '@/shared/components/navigation/auth-back-button';
import { IntroArtwork } from './intro-artwork';

type OnboardingScreenProps = {
  step: 0 | 1;
  onNext: () => void;
  onBack: () => void;
  onBrowse: () => void;
  onLogin: () => void;
};

export function OnboardingScreen({
  step,
  onNext,
  onBack,
  onBrowse,
  onLogin,
}: OnboardingScreenProps) {
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
      className="flex-1 bg-surface-canvas"
      style={{ flex: 1 }}
      edges={['top', 'bottom']}
    >
      <ScrollView
        style={{ flex: 1 }}
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View
          className="mx-auto w-full max-w-[430px] flex-1 px-6 pb-7 pt-5"
          style={{ flexGrow: 1 }}
        >
          <View className="flex-row items-center justify-between" style={{ direction: 'ltr' }}>
            <BrandLogo size={32} />
            <View className="flex-row items-center gap-2">
              <Typography.Paragraph type="body-sm" className="font-ui-medium text-text-secondary">
                {step + 1} / 2
              </Typography.Paragraph>
              {step === 1 ? <AuthBackButton onPress={onBack} /> : null}
            </View>
          </View>
          <View className="mt-5 flex-row gap-2" style={{ direction: 'ltr' }}>
            <View className="h-[4px] flex-1 rounded-full bg-action-primary" />
            <View
              className={
                step === 1
                  ? 'h-[4px] flex-1 rounded-full bg-action-primary'
                  : 'h-[4px] flex-1 rounded-full bg-border-default'
              }
            />
          </View>
          <View className="mt-6">
            <IntroArtwork step={step} />
          </View>
          <View className="mt-2 items-end gap-3">
            <Typography.Heading
              type="h1"
              className="w-full font-ui-bold text-text-primary"
              style={{
                textAlign: 'right',
                writingDirection: 'rtl',
                lineHeight: 51,
                paddingTop: 9,
                paddingBottom: 6,
              }}
            >
              {step === 0 ? 'عناية أسنان أسهل، من أول خطوة' : 'بلّش بالطريقة اللي بتناسبك'}
            </Typography.Heading>
            <Typography.Paragraph
              className="w-full font-ui-regular text-text-secondary"
              style={{ textAlign: 'right', writingDirection: 'rtl' }}
            >
              {step === 0
                ? 'مو ضروري تعرف اسم المشكلة. منساعدك توصف حاجتك، تقارن بين الأطباء المؤهلين، وتحجز الموعد المناسب.'
                : 'تصفّح الأطباء والخدمات كزائر، أو سجّل الدخول لتتابع حجوزاتك.'}
            </Typography.Paragraph>
          </View>
          <View className="min-h-8 flex-1" />
          <View className="mt-8 gap-3">
            {step === 0 ? (
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
                  <Button.Label className="font-ui-semibold">التصفح كزائر</Button.Label>
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
