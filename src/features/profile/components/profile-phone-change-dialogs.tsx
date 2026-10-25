import { InputOTP, REGEXP_ONLY_DIGITS } from 'heroui-native';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView as NativeKeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from 'react-native';
import { KeyboardAvoidingView as ControllerKeyboardAvoidingView } from 'react-native-keyboard-controller';

import {
  MOCK_VERIFICATION_CODE,
  requestMockVerification,
  verifyMockCode,
} from '@/features/auth/mocks/auth.mock';
import { normalizeDigits } from '@/features/auth/utils/phone-input';
import { CODE_LENGTH, formatTimer } from '@/features/auth/utils/otp-formatters';
import { useAccountDetails } from '@/features/profile/state/account-details-store';
import {
  AppIcon,
  AppText,
  Button,
  PhoneNumberField,
  defaultPhoneCountry,
  toE164,
} from '@/shared/components/ui';
import type { CountryOption } from '@/shared/components/ui/country-select';
import { useMockScenario } from '@/shared/mock';
import { useAppTheme } from '@/shared/theme/use-app-theme';

type Stage = 'number' | 'otp' | null;

/** Two sequential dialogs; only completing the OTP step may update the local verified number. */
const KeyboardContainer =
  Platform.OS === 'android' ? ControllerKeyboardAvoidingView : NativeKeyboardAvoidingView;

export function ProfilePhoneChangeDialogs({
  visible,
  onClose,
  initialPhone,
  onVerified,
}: {
  visible: boolean;
  onClose: () => void;
  /** When a new number was entered in account edit, open directly at OTP. */
  initialPhone?: string;
  onVerified?: () => void;
}) {
  const { colors } = useAppTheme();
  const { phone, setVerifiedPhone } = useAccountDetails();
  const scenario = useMockScenario((state) => state.scenario);
  const [stage, setStage] = useState<Stage>(initialPhone ? 'otp' : 'number');
  const autoRequestStarted = useRef(false);
  const [country, setCountry] = useState<CountryOption>(defaultPhoneCountry);
  const [national, setNational] = useState('');
  const [pendingPhone, setPendingPhone] = useState(initialPhone ?? '');
  const [otp, setOtp] = useState('');
  const [remaining, setRemaining] = useState(0);
  const [expiry, setExpiry] = useState(0);
  const [busy, setBusy] = useState(Boolean(initialPhone));
  const [error, setError] = useState('');
  const nextPhone = toE164(country, national);
  const valid =
    /^\+[1-9]\d{7,14}$/.test(nextPhone) &&
    (country.iso !== 'SY' || /^9\d{8}$/.test(normalizeDigits(national))) &&
    nextPhone !== phone.replace(/\s/g, '');

  useEffect(() => {
    if (stage !== 'otp' || (remaining <= 0 && expiry <= 0)) return;
    const timer = setInterval(() => {
      setRemaining((n) => Math.max(0, n - 1));
      setExpiry((n) => Math.max(0, n - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [stage, remaining, expiry]);

  const close = () => {
    if (busy) return;
    setStage(null);
    onClose();
  };
  const send = async (number: string) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const result = await requestMockVerification(number, scenario);
      setPendingPhone(number);
      setOtp('');
      setRemaining(result.resendAfterSeconds);
      setExpiry(result.expiresInSeconds);
      setStage('otp');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'تعذّر بدء التحقق، حاول مجدداً.');
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    if (!visible || !initialPhone || autoRequestStarted.current) return;
    autoRequestStarted.current = true;
    let active = true;
    void (async () => {
      setBusy(true);
      setError('');
      try {
        const result = await requestMockVerification(initialPhone, scenario);
        if (!active) return;
        setPendingPhone(initialPhone);
        setOtp('');
        setRemaining(result.resendAfterSeconds);
        setExpiry(result.expiresInSeconds);
        setStage('otp');
      } catch (cause) {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : 'تعذّر طلب رمز التحقق.');
        setStage('number');
      } finally {
        if (active) setBusy(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [visible, initialPhone, scenario]);

  const verify = async () => {
    if (busy || otp.length !== CODE_LENGTH || expiry <= 0) return;
    setBusy(true);
    setError('');
    try {
      // Demo does not send SMS. Never accept arbitrary six digits for an account change.
      await verifyMockCode(otp, scenario);
      if (otp !== MOCK_VERIFICATION_CODE) throw new Error('رمز التحقق غير صحيح.');
      setVerifiedPhone(pendingPhone);
      onVerified?.();
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'تعذّر التحقق من الرمز.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      visible={visible && stage !== null}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={close}
    >
      <KeyboardContainer className="flex-1 items-center justify-center px-5" behavior="padding">
        <Pressable
          accessibilityLabel="إغلاق النافذة"
          className="absolute inset-0"
          onPress={close}
          style={{ backgroundColor: colors.surface.scrim, opacity: 0.54 }}
        />
        <View className="w-full max-w-[390px] gap-4 rounded-[20px] border border-border-subtle bg-surface-default p-4">
          <View className="flex-row-reverse items-center justify-between">
            <View className="flex-1 items-end gap-1">
              <AppText align="right" variant="heading-4" className="font-ui-bold">
                {stage === 'number' ? 'تغيير رقم الهاتف' : 'التحقق من الرقم الجديد'}
              </AppText>
              {stage === 'otp' ? (
                <AppText
                  direction="ltr"
                  align="right"
                  variant="caption"
                  className="text-content-secondary"
                >
                  {pendingPhone}
                </AppText>
              ) : null}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="إغلاق"
              disabled={busy}
              className="h-10 w-10 items-center justify-center rounded-full bg-surface-subtle"
              onPress={close}
            >
              <AppIcon
                name={{ ios: 'xmark', android: 'close', web: 'close' }}
                size={17}
                tone="secondary"
              />
            </Pressable>
          </View>

          {stage === 'number' ? (
            <>
              <PhoneNumberField
                country={country}
                number={national}
                onCountryChange={setCountry}
                onNumberChange={(value) => setNational(normalizeDigits(value))}
                disabled={busy}
                helperText="أدخل رقم الهاتف الجديد، ورح يطلب منك التطبيق رمز التحقق."
              />
              <Button
                label={busy ? 'جاري طلب الرمز...' : 'حفظ وإرسال رمز التحقق'}
                disabled={!valid || busy}
                loading={busy}
                onPress={() => void send(nextPhone)}
              />
            </>
          ) : (
            <>
              <AppText align="right" variant="caption" className="text-content-secondary">
                أدخل رمز التحقق المكوّن من 6 أرقام. رمز التحقق الحالي: {MOCK_VERIFICATION_CODE}.
              </AppText>
              <InputOTP
                maxLength={CODE_LENGTH}
                pattern={REGEXP_ONLY_DIGITS}
                inputMode="numeric"
                value={otp}
                onChange={(value) => {
                  setOtp(normalizeDigits(value).slice(0, CODE_LENGTH));
                  setError('');
                }}
                isDisabled={busy}
                className="w-full"
              >
                <InputOTP.Group
                  className="w-full flex-row items-center justify-between gap-1"
                  style={{ direction: 'ltr' }}
                >
                  {Array.from({ length: CODE_LENGTH }, (_, i) => (
                    <InputOTP.Slot
                      index={i}
                      key={i}
                      variant="secondary"
                      className="h-12 w-[43px] rounded-[11px] border border-border-default bg-surface-default"
                    />
                  ))}
                </InputOTP.Group>
              </InputOTP>
              <AppText align="right" variant="caption" className="text-content-secondary">
                {expiry > 0 ? 'صلاحية الرمز: ' + formatTimer(expiry) : 'انتهت صلاحية الرمز.'}
              </AppText>
              {remaining > 0 ? (
                <AppText align="right" variant="caption" className="text-content-secondary">
                  إعادة الإرسال بعد {formatTimer(remaining)}
                </AppText>
              ) : (
                <Button
                  variant="outline"
                  label="إعادة إرسال الرمز"
                  disabled={busy}
                  onPress={() => void send(pendingPhone)}
                />
              )}
              <Button
                label={busy ? 'جاري التحقق...' : 'تأكيد الرقم الجديد'}
                loading={busy}
                disabled={busy || otp.length !== CODE_LENGTH || expiry <= 0}
                onPress={() => void verify()}
              />
            </>
          )}
          {error ? (
            <AppText align="right" variant="caption" className="text-tone-danger-text">
              {error}
            </AppText>
          ) : null}
          <Button variant="outline" label="إلغاء" disabled={busy} onPress={close} />
        </View>
      </KeyboardContainer>
    </Modal>
  );
}
