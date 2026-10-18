import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, FieldError, Input, Label, Select, TextField, Typography } from 'heroui-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CountryFlag } from '@/features/auth/components/country-flag';
import { requestMockVerification } from '@/features/auth/mocks/auth.mock';
import { BrandMark } from '@/shared/components/brand/brand-mark';
import { phoneCountries, type CountryOption } from '@/shared/components/ui/country-select';
import { toE164 } from '@/shared/components/ui/phone-number-field';
import { useMockScenario } from '@/shared/mock';

const DEFAULT_COUNTRY = phoneCountries[0]!;

function normalizeDigits(input: string): string {
  return input
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/\D/g, '');
}

export function PhoneEntryScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { scenario } = useMockScenario();
  const [country, setCountry] = useState<CountryOption>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const e164Phone = toE164(country, phone);
  const national = phone.replace(/^0+/, '');
  const canSubmit =
    /^\+[1-9]\d{7,14}$/.test(e164Phone) && (country.iso !== 'SY' || /^9\d{8}$/.test(national));

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
      <KeyboardAvoidingView
        className="flex-1"
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mx-auto w-full max-w-[430px] flex-1 px-6 pb-8 pt-6">
            <View className="flex-row items-center justify-between" style={{ direction: 'ltr' }}>
              <View className="flex-row items-center gap-2">
                <BrandMark size={42} />
                <Typography.Heading type="h3" className="font-ui-bold text-text-primary">
                  UberTib
                </Typography.Heading>
              </View>
            </View>

            <View className="mt-14 gap-3">
              <Typography.Heading
                type="h1"
                className="font-ui-bold text-text-primary"
                style={{ textAlign: 'right', writingDirection: 'rtl' }}
              >
                أهلاً بك في أوبرطب
              </Typography.Heading>
              <Typography.Paragraph
                className="font-ui-regular text-text-secondary"
                style={{ textAlign: 'right', writingDirection: 'rtl' }}
              >
                أدخل رقم موبايلك لنبعتلك رمز التحقق وتكمّل حجزك بسهولة.
              </Typography.Paragraph>
            </View>

            <TextField className="mt-9 gap-3" isInvalid={Boolean(error)} isDisabled={submitting}>
              <Label className="self-end font-ui-semibold text-text-primary">رقم الموبايل</Label>
              <View className="flex-row items-center gap-2" style={{ direction: 'ltr' }}>
                <Select
                  value={{ value: country.iso, label: country.dialCode }}
                  onValueChange={(choice) => {
                    if (!choice || Array.isArray(choice)) return;
                    const selected = phoneCountries.find((item) => item.iso === choice.value);
                    if (!selected) return;
                    setCountry(selected);
                    setError(undefined);
                  }}
                  isDisabled={submitting}
                  presentation="bottom-sheet"
                >
                  <Select.Trigger
                    accessibilityLabel={'تغيير الدولة، ' + country.nameAr + '، ' + country.dialCode}
                    className="h-14 w-[132px] flex-row items-center justify-center gap-1.5 rounded-form-field border border-border-default bg-surface-default px-2"
                  >
                    <CountryFlag iso={country.iso} />
                    <Select.Value
                      placeholder={country.dialCode}
                      className="font-ui-semibold text-text-primary"
                      style={{ writingDirection: 'ltr' }}
                    />
                    <Select.TriggerIndicator iconProps={{ size: 14 }} />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Overlay />
                    <Select.Content presentation="bottom-sheet" snapPoints={['65%']}>
                      <Select.ListLabel className="mb-2 text-right font-ui-semibold">
                        اختر الدولة ورمز الاتصال
                      </Select.ListLabel>
                      {phoneCountries.map((item) => (
                        <Select.Item
                          key={item.iso}
                          value={item.iso}
                          label={item.nameAr + ' · ' + item.dialCode}
                        >
                          <View
                            className="flex-1 flex-row items-center gap-3"
                            style={{ direction: 'ltr' }}
                          >
                            <CountryFlag iso={item.iso} />
                            <Select.ItemLabel className="flex-1 text-right font-ui-regular" />
                          </View>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Portal>
                </Select>

                <Input
                  accessibilityLabel="رقم الموبايل بدون رمز الدولة"
                  accessibilityHint="أدخل رقمك بدون رمز الدولة، ويمكن إدخال الصفر الأول"
                  autoComplete="tel"
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  maxLength={15}
                  placeholder={country.iso === 'SY' ? '9XX XXX XXX' : 'رقم الهاتف'}
                  className="h-14 min-w-0 flex-1 rounded-form-field border border-border-default bg-surface-default px-4 font-ui-medium text-base text-text-primary focus:border-action-primary"
                  placeholderColorClassName="text-text-placeholder"
                  selectionColorClassName="text-action-primary"
                  variant="secondary"
                  value={phone}
                  onChangeText={(value) => {
                    setPhone(normalizeDigits(value));
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
                ? 'مثال: 9XXXXXXXX أو 09XXXXXXXX'
                : 'اكتب الرقم المحلي بدون رمز الاتصال الدولي.'}
            </Typography.Paragraph>

            <View className="min-h-10 flex-1" />

            <View className="mt-8 gap-4">
              <Button
                size="lg"
                variant="primary"
                isDisabled={!canSubmit || submitting}
                onPress={() => void submitPhone()}
                className="min-h-[52px] rounded-control bg-action-primary"
                accessibilityLabel="إرسال رمز التحقق"
              >
                <Button.Label className="font-ui-semibold text-text-on-action">
                  {submitting ? 'جاري إرسال الرمز...' : 'إرسال رمز التحقق'}
                </Button.Label>
              </Button>
              <Typography.Paragraph
                type="body-sm"
                className="font-ui-regular text-text-secondary"
                style={{ textAlign: 'center', writingDirection: 'rtl' }}
              >
                بالمتابعة، أنت توافق على شروط الاستخدام وسياسة الخصوصية.
              </Typography.Paragraph>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
