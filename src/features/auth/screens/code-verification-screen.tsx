import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, FieldError, InputOTP, REGEXP_ONLY_DIGITS, Typography } from 'heroui-native';
import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardResponsiveScrollView } from '@/shared/components/ui/keyboard-responsive-scroll-view';

import { requestMockVerification, verifyMockCode } from '@/features/auth/mocks/auth.mock';
import { resolveSafeReturnTo } from '@/features/auth/navigation/auth-intent';
import {
  CODE_LENGTH,
  countdown,
  displayPhone,
  formatTimer,
} from '@/features/auth/utils/otp-formatters';
import { useAuthSession } from '@/providers/auth-session-provider';
import { BrandMark } from '@/shared/components/brand/brand-mark';
import { AuthBackButton } from '@/shared/components/navigation/auth-back-button';
import { useMockScenario } from '@/shared/mock';

export function CodeVerificationScreen() {
  const router = useRouter();
  const { phone, returnTo, mode, resendAfterSeconds, expiresInSeconds } = useLocalSearchParams<{
    phone?: string;
    returnTo?: string;
    mode?: 'register';
    resendAfterSeconds?: string;
    expiresInSeconds?: string;
  }>();
  const { signInMock } = useAuthSession();
  const { scenario } = useMockScenario();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [remaining, setRemaining] = useState(() => countdown(resendAfterSeconds, 30));
  const [expiresIn, setExpiresIn] = useState(() => countdown(expiresInSeconds, 120));

  const maskedPhone = useMemo(() => displayPhone(phone), [phone]);
  const expired = expiresIn === 0;
  const canVerify = Boolean(phone) && code.length === CODE_LENGTH && !expired && !submitting;

  useEffect(() => {
    if (remaining === 0 && expiresIn === 0) return;
    const interval = setInterval(() => {
      setRemaining((value) => Math.max(value - 1, 0));
      setExpiresIn((value) => Math.max(value - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [remaining, expiresIn]);

  const verifyCode = async () => {
    if (!phone || submitting) return;
    if (expired) {
      setError('انتهت صلاحية الرمز، اطلب رمزاً جديداً.');
      return;
    }
    if (code.length !== CODE_LENGTH) {
      setError('أدخل رمز التحقق المكوّن من ستة أرقام.');
      return;
    }

    setSubmitting(true);
    setError(undefined);
    try {
      await verifyMockCode(code, scenario);
      signInMock();
      if (mode === 'register') {
        router.push({
          pathname: '/auth/profile-setup',
          params: returnTo ? { returnTo } : undefined,
        });
      } else {
        router.replace(resolveSafeReturnTo(returnTo));
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'تعذّر التحقق من الرمز.');
    } finally {
      setSubmitting(false);
    }
  };

  const resendCode = async () => {
    if (!phone || remaining > 0 || resending) return;
    setResending(true);
    setError(undefined);
    try {
      const response = await requestMockVerification(phone, scenario);
      setRemaining(response.resendAfterSeconds);
      setExpiresIn(response.expiresInSeconds);
      setCode('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'تعذّرت إعادة إرسال الرمز.');
    } finally {
      setResending(false);
    }
  };

  const changeNumber = () =>
    router.replace({
      pathname: '/auth/phone',
      params: {
        ...(returnTo ? { returnTo } : {}),
        ...(mode === 'register' ? { mode } : {}),
      },
    });

  return (
    <SafeAreaView className="flex-1 bg-surface-canvas" style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        enabled={Platform.OS === 'ios'}
      >
      
        <KeyboardResponsiveScrollView
          bottomOffset={16}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mx-auto w-full max-w-[430px] px-6 pb-8 pt-6" style={{ flexGrow: 1 }}>
            <View className="flex-row items-center justify-between" style={{ direction: 'ltr' }}>
              <View className="flex-row items-center gap-2">
                <BrandMark size={42} />
                <Typography.Heading type="h3" className="font-ui-bold text-text-primary">
                  UberTib
                </Typography.Heading>
              </View>
              <AuthBackButton onPress={changeNumber} />
            </View>

            <View className="mt-14 gap-3">
              <Typography.Heading
                type="h1"
                className="font-ui-bold text-text-primary"
                style={{
                  textAlign: 'right',
                  writingDirection: 'rtl',
                  lineHeight: 53,
                  paddingTop: 9,
                  paddingBottom: 6,
                }}
              >
                تحقق من رقمك
              </Typography.Heading>
              <Typography.Paragraph
                className="font-ui-regular text-text-secondary"
                style={{ textAlign: 'right', writingDirection: 'rtl' }}
              >
                أرسلنا رمزاً من 6 أرقام إلى رقم موبايلك. اكتبه لنتأكد إنه إلك.
              </Typography.Paragraph>

              <View className="flex-row items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-form-field"
                  onPress={changeNumber}
                >
                  <Button.Label className="font-ui-semibold text-action-secondary-text">
                    تغيير الرقم
                  </Button.Label>
                </Button>
                <Typography.Paragraph
                  className="font-ui-medium text-text-primary"
                  style={{ writingDirection: 'ltr', textAlign: 'right' }}
                >
                  {maskedPhone}
                </Typography.Paragraph>
              </View>
            </View>

            <View className="mt-10 gap-4">
              <InputOTP
                textInputProps={{
                  accessibilityLabel: 'رمز التحقق من ستة أرقام',
                  autoComplete: 'one-time-code',
                }}
                maxLength={CODE_LENGTH}
                pattern={REGEXP_ONLY_DIGITS}
                inputMode="numeric"
                value={code}
                onChange={(value) => {
                  setCode(value.replace(/\D/g, '').slice(0, CODE_LENGTH));
                  if (error) setError(undefined);
                }}
                isInvalid={Boolean(error)}
                isDisabled={submitting || resending}
                className="w-full"
              >
                <InputOTP.Group
                  className="w-full flex-row items-center justify-between gap-1.5"
                  style={{ direction: 'ltr' }}
                >
                  {Array.from({ length: CODE_LENGTH }, (_, index) => (
                    <InputOTP.Slot
                      index={index}
                      key={index}
                      variant="secondary"
                      className="h-14 w-[46px] rounded-form-field border border-border-default bg-surface-default"
                    />
                  ))}
                </InputOTP.Group>
              </InputOTP>
              <FieldError isInvalid={Boolean(error)}>{error}</FieldError>
              <Typography.Paragraph
                type="body-sm"
                className="font-ui-regular text-text-secondary"
                style={{ textAlign: 'right', writingDirection: 'rtl' }}
              >
                {expired
                  ? 'انتهت صلاحية الرمز، يمكنك طلب رمز جديد.'
                  : 'صلاحية الرمز: ' + formatTimer(expiresIn)}
              </Typography.Paragraph>
              <View className="flex-row items-center justify-end gap-2">
                {remaining > 0 ? (
                  <Typography.Paragraph
                    type="body-sm"
                    className="font-ui-regular text-text-secondary"
                    style={{ textAlign: 'right', writingDirection: 'rtl' }}
                  >
                    إعادة الإرسال بعد {formatTimer(remaining)}
                  </Typography.Paragraph>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-form-field"
                    isDisabled={resending}
                    onPress={() => void resendCode()}
                  >
                    <Button.Label className="font-ui-semibold text-action-secondary-text">
                      {resending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
                    </Button.Label>
                  </Button>
                )}
              </View>
            </View>

            <View className="mt-auto min-h-10" />

            <View className="mt-8 gap-4">
              <Button
                size="lg"
                variant="primary"
                className="min-h-[52px] rounded-form-field bg-action-primary"
                isDisabled={!canVerify}
                onPress={() => void verifyCode()}
              >
                <Button.Label className="font-ui-semibold text-text-on-action">
                  {submitting ? 'جاري التحقق...' : 'تحقق ومتابعة'}
                </Button.Label>
              </Button>
              <Typography.Paragraph
                type="body-sm"
                className="font-ui-regular text-text-secondary"
                style={{ textAlign: 'center', writingDirection: 'rtl' }}
              >
                ما وصلك الرمز؟ تأكد من رقمك أو أعد إرساله بعد انتهاء العدّاد.
              </Typography.Paragraph>
            </View>
          </View>
        </KeyboardResponsiveScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
