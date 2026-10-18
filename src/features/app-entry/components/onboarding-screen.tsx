import { Button, Typography } from 'heroui-native';
import { useEffect } from 'react';
import { BackHandler, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

import { BrandMark } from '@/shared/components/brand/brand-mark';
import { AuthBackButton } from '@/shared/components/navigation/auth-back-button';
import { theme } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme/theme-provider';

type OnboardingScreenProps = {
  step: 0 | 1;
  onNext: () => void;
  onBack: () => void;
  onBrowse: () => void;
  onLogin: () => void;
  onRegister: () => void;
};

function IntroArtwork({ step }: { step: 0 | 1 }) {
  const { colors } = useAppTheme();
  const teal = theme.brand.mark;
  const ink = colors.text.primary;

  return (
    <View
      accessible
      accessibilityLabel={
        step === 0 ? 'رسم توضيحي لسن ورحلة العناية به' : 'رسم توضيحي لطبيب أسنان وموعد حجز مؤكد'
      }
      accessibilityRole="image"
      className="w-full items-center justify-center"
    >
      <Svg width="100%" height={280} viewBox="0 0 320 280" fill="none">
        {step === 0 ? (
          <>
            <Circle cx="160" cy="139" r="116" fill={colors.action.subtle} />
            <Circle
              cx="160"
              cy="139"
              r="100"
              stroke={colors.border.default}
              strokeWidth="1.5"
              strokeDasharray="5 9"
            />
            <Circle
              cx="73"
              cy="66"
              r="24"
              fill={colors.surface.default}
              stroke={colors.border.subtle}
              strokeWidth="2"
            />
            <Path
              d="M65 66l6 6 11-13"
              stroke={teal}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="249"
              cy="207"
              r="24"
              fill={colors.surface.default}
              stroke={colors.border.subtle}
              strokeWidth="2"
            />
            <Path d="M239 207h20M249 197v20" stroke={teal} strokeWidth="3" strokeLinecap="round" />
            <Path
              d="M159 71C138 56 114 61 102 78c-20 28-6 62 5 97l10 31c5 18 16 18 22 1l11-37c4-12 15-12 19 0l11 37c6 17 17 17 22-1l10-31c12-36 25-70 5-97-12-17-36-22-58-7z"
              fill={colors.surface.default}
              stroke={ink}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <Path
              d="M138 99c12 10 31 12 46 0"
              stroke={teal}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <Circle cx="83" cy="205" r="5" fill={teal} />
            <Circle cx="241" cy="88" r="7" fill={ink} />
            <Line
              x1="238"
              y1="90"
              x2="228"
              y2="100"
              stroke={ink}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <Circle cx="160" cy="139" r="116" fill={colors.action.subtle} />
            <Rect
              x="69"
              y="30"
              width="182"
              height="218"
              rx="23"
              fill={colors.surface.default}
              stroke={colors.border.default}
              strokeWidth="2"
            />
            <Rect x="97" y="55" width="126" height="116" rx="19" fill={colors.surface.subtle} />
            <Circle cx="160" cy="94" r="24" fill={teal} />
            <Path d="M117 151c6-28 22-38 43-38s37 10 43 38" fill={ink} />
            <Rect x="100" y="189" width="76" height="9" rx="4.5" fill={colors.border.default} />
            <Rect x="100" y="208" width="117" height="7" rx="3.5" fill={colors.border.subtle} />
            <Circle
              cx="235"
              cy="212"
              r="32"
              fill={teal}
              stroke={colors.surface.default}
              strokeWidth="7"
            />
            <Path
              d="M221 212l10 10 19-21"
              stroke="#111111"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="77" cy="65" r="14" fill={ink} />
            <Circle cx="250" cy="66" r="8" fill={teal} />
          </>
        )}
      </Svg>
    </View>
  );
}

export function OnboardingScreen({
  step,
  onNext,
  onBack,
  onBrowse,
  onLogin,
  onRegister,
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
            <View className="flex-row items-center gap-2">
              <BrandMark size={40} />
              <Typography.Heading type="h3" className="font-ui-bold text-text-primary">
                UberTib
              </Typography.Heading>
            </View>
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
                : 'تصفّح الأطباء والخدمات كزائر، أو أنشئ حساباً جديداً، أو سجّل الدخول لتتابع حجوزاتك.'}
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
                  variant="outline"
                  size="lg"
                  className="min-h-[52px] rounded-form-field"
                  onPress={onRegister}
                >
                  <Button.Label className="font-ui-semibold">الانضمام للمنصة</Button.Label>
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
