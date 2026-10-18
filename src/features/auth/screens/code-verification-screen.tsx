import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Pressable, TextInput, View } from 'react-native';

import { requestMockVerification, verifyMockCode } from '@/features/auth/mocks/auth.mock';
import { useAuthSession } from '@/providers/auth-session-provider';
import { AppIcon, AppText, Button, Screen } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { cn } from '@/shared/utils/cn';

function maskedPhone(value?: string) {
  if (!value) return '09•• ••• 245';

  const digits = value.replace(/\D/g, '');
  const national = digits.startsWith('963') ? `0${digits.slice(3)}` : digits;
  const start = national.slice(0, 2) || '09';
  const end = national.slice(-3) || '245';

  return `${start}•• ••• ${end}`;
}

export function CodeVerificationScreen() {
  const router = useRouter();
  const { phone, returnTo, resendAfterSeconds } = useLocalSearchParams<{
    phone?: string;
    returnTo?: string;
    resendAfterSeconds?: string;
  }>();
  const { signInMock } = useAuthSession();
  const { scenario } = useMockScenario();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [focused, setFocused] = useState(false);
  const [remaining, setRemaining] = useState(Number(resendAfterSeconds ?? 38));
  const inputRef = useRef<TextInput>(null);
  const keyboardVisibleRef = useRef(false);
  const displayPhone = useMemo(() => maskedPhone(phone), [phone]);

  // Android's Back gesture can dismiss the soft keyboard while TextInput still
  // reports itself focused. A second .focus() is then a no-op.
  useEffect(() => {
    const shown = Keyboard.addListener('keyboardDidShow', () => {
      keyboardVisibleRef.current = true;
    });
    const hidden = Keyboard.addListener('keyboardDidHide', () => {
      keyboardVisibleRef.current = false;
      inputRef.current?.blur();
      setFocused(false);
    });

    return () => {
      shown.remove();
      hidden.remove();
    };
  }, []);

  function focusCodeInput() {
    const input = inputRef.current;
    if (!input) return;

    // Recover even when keyboardDidHide was not delivered by the platform.
    // Avoid blur/focus flicker when the keyboard is already visible.
    if (input.isFocused() && !keyboardVisibleRef.current) {
      input.blur();
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }
    input.focus();
  }

  useEffect(() => {
    if (remaining <= 0) return;

    const timer = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);

    return () => clearInterval(timer);
  }, [remaining]);

  async function verifyCode() {
    if (!phone || code.length !== 6 || submitting) return;

    setSubmitting(true);
    setError(undefined);

    try {
      await verifyMockCode(code, scenario);
      signInMock();
      router.replace({
        pathname: '/auth/profile-setup',
        params: returnTo ? { returnTo } : undefined,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'تعذر التحقق من الرمز');
    } finally {
      setSubmitting(false);
    }
  }

  async function resendCode() {
    if (!phone || remaining > 0 || resending) return;

    setResending(true);
    setError(undefined);

    try {
      const response = await requestMockVerification(phone, scenario);
      setRemaining(response.resendAfterSeconds);
      setCode('');
      focusCodeInput();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'تعذر إعادة إرسال الرمز');
    } finally {
      setResending(false);
    }
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <View className="mx-auto w-full max-w-[430px] flex-1 px-6 pb-7">
        <View className="h-[72px] flex-row items-center justify-end">
          <Pressable
            accessibilityLabel="رجوع"
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-full border border-border-default bg-surface-default"
            onPress={() => router.back()}
          >
            <AppIcon
              name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
              size={22}
              tone="primary"
            />
          </Pressable>
        </View>

        <View className="min-h-0 flex-1 items-end gap-6">
          <AppText className="w-full font-ui-bold text-type-display " variant="heading-1">
            تحقق من رقمك
          </AppText>

          <AppText className="w-full text-type-body  text-content-secondary">
            أرسلنا الرمز إلى الرقم {displayPhone}. أدخله أدناه.
          </AppText>

          <Pressable
            accessibilityLabel="رمز التحقق، اضغط لإظهار لوحة الأرقام"
            accessibilityRole="button"
            className="w-full"
            onPress={focusCodeInput}
          >
            <View className="flex-row justify-center gap-2" style={{ direction: 'ltr' }}>
              {Array.from({ length: 6 }).map((_, index) => {
                const active = focused && index === Math.min(code.length, 5);
                const filled = index < code.length;
                const highlighted = filled || active;

                return (
                  <View
                    className={cn(
                      'h-[58px] w-[49px] items-center justify-center rounded-[12px] border bg-surface-default',
                      highlighted ? 'border-2 border-action-primary' : 'border-border-default',
                      error && 'border-tone-danger-border',
                    )}
                    key={index}
                  >
                    <AppText
                      align="center"
                      direction="ltr"
                      className={cn('text-type-heading-1 ', !filled && 'text-content-secondary')}
                      variant="heading-3"
                    >
                      {code[index] ?? (active ? '—' : '')}
                    </AppText>
                  </View>
                );
              })}
            </View>

            <TextInput
              ref={inputRef}
              accessibilityLabel="إدخال رمز التحقق المكون من ستة أرقام"
              keyboardType="number-pad"
              showSoftInputOnFocus
              caretHidden
              maxLength={6}
              onBlur={() => setFocused(false)}
              onChangeText={(value) => {
                setCode(value.replace(/\D/g, '').slice(0, 6));
                setError(undefined);
              }}
              onFocus={() => setFocused(true)}
              style={{ height: 1, opacity: 0, position: 'absolute', width: 1 }}
              value={code}
            />
          </Pressable>

          {error ? (
            <AppText
              accessibilityLiveRegion="polite"
              className="w-full text-tone-danger-text"
              variant="caption"
            >
              {error}
            </AppText>
          ) : null}

          <View className="w-full flex-row items-center justify-end gap-1.5">
            {remaining > 0 ? (
              <>
                <AppText
                  direction="ltr"
                  className="text-type-label  text-content-link"
                  variant="label"
                >
                  00:{String(remaining).padStart(2, '0')}
                </AppText>
                <AppText className="text-type-label  text-content-secondary" variant="caption">
                  إعادة إرسال الرمز بعد
                </AppText>
              </>
            ) : (
              <Pressable
                accessibilityRole="button"
                className="min-h-target-comfortable justify-center"
                disabled={resending}
                onPress={() => void resendCode()}
              >
                <AppText className="text-content-link" variant="label">
                  {resending ? 'جاري إعادة الإرسال...' : 'إعادة إرسال الرمز'}
                </AppText>
              </Pressable>
            )}
          </View>

          <Pressable
            accessibilityRole="button"
            className="min-h-target-comfortable flex-row items-center gap-1.5 self-end"
            onPress={() =>
              router.replace({
                pathname: '/auth/phone',
                params: returnTo ? { returnTo } : undefined,
              })
            }
          >
            <AppText className="text-type-label  text-content-link" variant="label">
              تغيير رقم الهاتف
            </AppText>
            <AppIcon
              name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
              size={16}
              tone="action"
            />
          </Pressable>
        </View>

        <View className="gap-3">
          <Button
            className="h-[52px] rounded-[12px]"
            disabled={code.length !== 6}
            endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
            label="تحقق ومتابعة"
            loading={submitting}
            loadingLabel="جاري التحقق"
            onPress={() => void verifyCode()}
          />
          <AppText
            align="center"
            className="text-type-label  text-content-secondary"
            variant="caption"
          >
            لم يصلك الرمز؟ تأكد من الرقم أو انتظر قليلاً.
          </AppText>
        </View>
      </View>
    </Screen>
  );
}
