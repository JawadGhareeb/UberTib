import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, FieldError, Input, Label, TextField, Typography } from 'heroui-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardResponsiveScrollView } from '@/shared/components/ui/keyboard-responsive-scroll-view';

import { AuthModeSwitch } from '@/features/auth/components/auth-mode-switch';
import { CountryDialCodeSelect } from '@/shared/components/ui/country-dial-code-select';
import { normalizeDigits } from '@/features/auth/utils/phone-input';
import { requestMockVerification } from '@/features/auth/mocks/auth.mock';
import { BrandLogo } from '@/shared/components/brand';
import { AuthBackButton } from '@/shared/components/navigation/auth-back-button';
import { phoneCountries, type CountryOption } from '@/shared/components/ui/country-select';
import { toE164 } from '@/shared/components/ui/phone-number-field';
import { useMockScenario } from '@/shared/mock';

const DEFAULT_COUNTRY = phoneCountries[0]!;

export function PhoneEntryScreen() {
  const router = useRouter();
  const { returnTo, mode } = useLocalSearchParams<{ returnTo?: string; mode?: 'register' }>();
  const { scenario } = useMockScenario();
  const [country, setCountry] = useState<CountryOption>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const e164Phone = toE164(country, phone);
  const national = phone;
  const canSubmit =
    /^\+[1-9]\d{7,14}$/.test(e164Phone) && (country.iso !== 'SY' || /^9\d{8}$/.test(national));

  const switchAuthMode = () => {
    setError(undefined);
    router.replace({
      pathname: '/auth/phone',
      params: {
        ...(returnTo ? { returnTo } : {}),
        ...(mode === 'register' ? {} : { mode: 'register' }),
      },
    });
  };

  const submitPhone = async () => {
    if (submitting) return;
    if (!canSubmit) {
      setError(
        country.iso === 'SY'
          ? 'أدخل رقم موبايل سوري صحيحاً من 9 أرقام يبدأ بـ 9.'
          : 'أدخل رقم هاتف صحيحاً.',
      );
      return;
    }
    setSubmitting(true);
    setError(undefined);
    try {
      const verification = await requestMockVerification(e164Phone, scenario);
      router.push({
        pathname: '/auth/code',
        params: {
          phone: e164Phone,
          returnTo,
          ...(mode === 'register' ? { mode } : {}),
          expiresInSeconds: String(verification.expiresInSeconds),
          resendAfterSeconds: String(verification.resendAfterSeconds),
        },
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'تعذّر إرسال رمز التحقق.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-canvas" style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={Platform.OS === 'ios'}>
        <KeyboardResponsiveScrollView
          className="flex-1"
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mx-auto w-full max-w-[430px] px-6 pb-8 pt-6" style={{ flexGrow: 1 }}>
            <View className="flex-row items-center justify-between" style={{ direction: 'ltr' }}>
              <BrandLogo size={32} />
              <AuthBackButton
                onPress={() => {
                  if (returnTo && router.canGoBack()) router.back();
                  else router.dismissTo('/(tabs)/home');
                }}
              />
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
                {mode === 'register' ? 'أنشئ حسابك في أوبرطب' : 'أهلاً بك في أوبرطب'}
              </Typography.Heading>
              <Typography.Paragraph
                className="font-ui-regular text-text-secondary"
                style={{ textAlign: 'right', writingDirection: 'rtl' }}
              >
                {mode === 'register'
                  ? 'أنشئ حسابك برقم الموبايل، ومنكمل بياناتك الأساسية بعد التحقق.'
                  : 'أدخل رقم موبايلك لنبعتلك رمز التحقق وتكمّل حجزك بسهولة.'}
              </Typography.Paragraph>
            </View>

            <TextField className="mt-9 gap-3" isInvalid={Boolean(error)} isDisabled={submitting}>
              <Label className="self-end font-ui-semibold text-text-primary">رقم الموبايل</Label>
              <View className="flex-row items-center gap-2" style={{ direction: 'ltr' }}>
                <CountryDialCodeSelect
                  country={country}
                  onCountryChange={(next) => {
                    setCountry(next);
                    setError(undefined);
                  }}
                  disabled={submitting}
                />

                <Input
                  accessibilityLabel="رقم الموبايل بدون رمز الدولة"
                  accessibilityHint="أدخل الرقم المحلي بعد رمز الدولة بدون صفر في البداية. الرقم السوري يبدأ بـ 9."
                  autoComplete="tel"
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  maxLength={country.iso === 'SY' ? 9 : 15}
                  placeholder={country.iso === 'SY' ? '9XXXXXXXX' : 'رقم الهاتف'}
                  className="h-14 min-w-0 flex-1 rounded-form-field border border-border-default bg-surface-default px-4 font-ui-medium text-base text-text-primary focus:border-action-primary"
                  placeholderColorClassName="text-text-placeholder"
                  selectionColorClassName="text-action-primary"
                  variant="secondary"
                  value={phone}
                  onChangeText={(value) => {
                    setPhone(normalizeDigits(value).replace(/^0+/, ''));
                    if (error) setError(undefined);
                  }}
                  returnKeyType="done"
                  onSubmitEditing={() => void submitPhone()}
                  style={{ textAlign: 'left', writingDirection: 'ltr' }}
                />
              </View>
              <FieldError>{error}</FieldError>
            </TextField>

            <Typography.Paragraph
              type="body-sm"
              className="mt-3 font-ui-regular text-text-secondary"
              style={{ textAlign: 'right', writingDirection: 'rtl' }}
            >
              {country.iso === 'SY'
                ? 'مثال: 9XXXXXXXX — بدون صفر في البداية'
                : 'اكتب الرقم المحلي بدون رمز الاتصال الدولي.'}
            </Typography.Paragraph>

            <View className="mt-auto min-h-10" />

            <View className="mt-8 gap-4">
              <Button
                size="lg"
                variant="primary"
                isDisabled={!canSubmit || submitting}
                onPress={() => void submitPhone()}
                className="min-h-[52px] rounded-form-field bg-action-primary"
                accessibilityLabel="إرسال رمز التحقق"
              >
                <Button.Label className="font-ui-semibold text-text-on-action">
                  {submitting ? 'جاري إرسال الرمز...' : 'إرسال رمز التحقق'}
                </Button.Label>
              </Button>
              <Button size="lg" variant="outline" className="min-h-[52px] rounded-form-field" onPress={() => router.dismissTo('/(tabs)/home')} accessibilityLabel="تصفح كزائر"><Button.Label className="font-ui-semibold">تصفح كزائر</Button.Label></Button>
              <AuthModeSwitch isRegister={mode === 'register'} onSwitch={switchAuthMode} />
              <Typography.Paragraph
                type="body-sm"
                className="font-ui-regular text-text-secondary"
                style={{ textAlign: 'center', writingDirection: 'rtl' }}
              >
                بالمتابعة، أنت توافق على شروط الاستخدام وسياسة الخصوصية.
              </Typography.Paragraph>
            </View>
          </View>
        </KeyboardResponsiveScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
