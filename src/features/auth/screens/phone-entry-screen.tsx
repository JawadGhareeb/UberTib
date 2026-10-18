import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { requestMockVerification } from '@/features/auth/mocks/auth.mock';
import { BrandMark } from '@/shared/components/brand/brand-mark';
import {
  AppIcon,
  AppText,
  Button,
  defaultPhoneCountry,
  PhoneNumberField,
  Screen,
  toE164,
  type CountryOption,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

export function PhoneEntryScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { scenario } = useMockScenario();
  const [country, setCountry] = useState<CountryOption>(defaultPhoneCountry);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const e164Phone = toE164(country, phone);
  const canSubmit = phone.length >= 7;

  const submitPhone = async () => {
    if (!canSubmit || submitting) return;

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
      setError(caughtError instanceof Error ? caughtError.message : 'تعذر التحقق من الرقم.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen contentClassName="px-0 pb-0 pt-0">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="mx-auto w-full max-w-[430px] flex-1 px-6 pb-7"
      >
        <View
          className="h-[112px] flex-row items-center justify-between"
          style={{ direction: 'ltr' }}
        >
          <AppText direction="ltr" className="font-ui-bold text-type-heading-1 ">
            UperTib
          </AppText>
          <BrandMark size={44} />
        </View>

        <View className="min-h-0 flex-1 items-end gap-6">
          <View className="w-full items-end gap-[10px]">
            <AppText className="w-full font-ui-bold text-type-display " variant="heading-1">
              أهلاً بك في أوبرطب
            </AppText>
            <AppText className="w-full text-type-body  text-content-secondary">
              أدخل رقم هاتفك للمتابعة. سنرسل رمز تحقق من 6 أرقام.
            </AppText>
          </View>

          <View className="w-full">
            <PhoneNumberField
              country={country}
              error={error}
              number={phone}
              onCountryChange={setCountry}
              onNumberChange={(value) => {
                setPhone(value);
                if (error) setError(undefined);
              }}
            />
          </View>

          <View className="w-full flex-row items-center justify-end gap-2">
            <AppText className="text-type-caption  text-content-secondary" variant="caption">
              نحمي رقمك ولا نشاركه دون إذنك
            </AppText>
            <AppIcon
              name={{ ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' }}
              size={18}
              tone="action"
            />
          </View>
        </View>

        <View className="gap-4">
          <Button
            className="h-[52px] rounded-[12px]"
            disabled={!canSubmit}
            endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
            label="إرسال رمز التحقق"
            loading={submitting}
            loadingLabel="جاري الإرسال"
            onPress={() => void submitPhone()}
          />
          <AppText
            align="center"
            className="text-type-label  text-content-secondary"
            variant="caption"
          >
            بالمتابعة، أنت توافق على شروط الاستخدام وسياسة الخصوصية
          </AppText>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
