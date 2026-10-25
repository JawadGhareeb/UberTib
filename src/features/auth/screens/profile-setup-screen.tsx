import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Avatar,
  Button,
  FieldError,
  Input,
  Label,
  RadioGroup,
  TextField,
  Typography,
} from 'heroui-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardResponsiveScrollView } from '@/shared/components/ui/keyboard-responsive-scroll-view';

import { BrandedDateField } from '@/features/auth/components/branded-date-field';
import { formatDate, type Gender } from '@/features/auth/utils/profile-fields';
import { useProfilePhoto } from '@/features/profile/state/profile-photo-store';
import { EditableProfileAvatar } from '@/shared/components/media/editable-profile-avatar';
import { OutlineIcon } from '@/shared/components/media/outline-icon';
import { resolveSafeReturnTo } from '@/features/auth/navigation/auth-intent';
import { usePreferredLocation } from '@/features/location/state/preferred-location-provider';
import { BrandLogo } from '@/shared/components/brand';
import { AuthBackButton } from '@/shared/components/navigation/auth-back-button';
import { useAppTheme } from '@/shared/theme/use-app-theme';

export function ProfileSetupScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [selectedDate, setSelectedDate] = useState(new Date(1994, 7, 12));
  const [submitting, setSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const { location } = usePreferredLocation();
  const { colors } = useAppTheme();
  const { photo, setPhoto } = useProfilePhoto();

  const area = location?.label ?? '';
  const valid =
    name.trim().length >= 2 && Boolean(birthDate) && Boolean(gender) && area.trim().length >= 2;

  const save = async () => {
    if (submitting) return;
    setAttempted(true);
    if (!valid) return;

    setSubmitting(true);
    try {
      // Mock-first screen: profile persistence will be attached to the approved API.
      await Promise.resolve();
      router.replace(resolveSafeReturnTo(returnTo));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-canvas" style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={Platform.OS === 'ios'}>
        <KeyboardResponsiveScrollView
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
                  if (router.canGoBack()) router.back();
                  else router.replace({ pathname: '/auth/phone', params: { mode: 'register' } });
                }}
              />
            </View>

            <View className="mt-10 gap-3">
              <Typography.Heading
                type="h1"
                className="font-ui-bold text-text-primary"
                style={{
                  textAlign: 'right',
                  writingDirection: 'rtl',
                  lineHeight: 55,
                  paddingTop: 11,
                  paddingBottom: 7,
                  includeFontPadding: true,
                }}
              >
                أكمل ملفك الأساسي
              </Typography.Heading>
              <Typography.Paragraph
                className="font-ui-regular text-text-secondary"
                style={{
                  textAlign: 'right',
                  writingDirection: 'rtl',
                  lineHeight: 30,
                  paddingTop: 5,
                  paddingBottom: 2,
                  includeFontPadding: true,
                }}
              >
                هالمعلومات الأساسية بتساعدنا نجهّز حجوزاتك ونخصّص تجربتك.
              </Typography.Paragraph>
            </View>

            <View
              className="mt-7 flex-row items-center justify-end gap-3"
              style={{ direction: 'ltr' }}
            >
              <View className="flex-1 items-end gap-1">
                <Typography.Paragraph
                  className="font-ui-semibold text-text-primary"
                  style={{ textAlign: 'right', writingDirection: 'rtl' }}
                >
                  صورة شخصية (اختيارية)
                </Typography.Paragraph>
                <Typography.Paragraph
                  type="body-sm"
                  className="font-ui-regular text-text-secondary"
                  style={{ textAlign: 'right', writingDirection: 'rtl' }}
                >
                  بتقدر تضيفها لاحقاً من حسابك.
                </Typography.Paragraph>
              </View>
              <EditableProfileAvatar value={photo} onChange={setPhoto} />
            </View>

            <View className="mt-8 gap-6">
              <TextField isRequired isInvalid={attempted && name.trim().length < 2}>
                <Label className="mb-2 self-end font-ui-semibold text-text-primary">
                  الاسم الكامل
                </Label>
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder="الاسم الكامل"
                  autoComplete="name"
                  returnKeyType="done"
                  variant="secondary"
                  className="h-14 rounded-form-field border border-border-default bg-surface-default px-4 font-ui-medium text-text-primary focus:border-action-primary"
                  placeholderColorClassName="text-text-placeholder"
                  style={{ textAlign: 'right', writingDirection: 'rtl' }}
                />
                <FieldError>أدخل الاسم الكامل، حرفين على الأقل.</FieldError>
              </TextField>

              <BrandedDateField
                value={selectedDate}
                displayValue={birthDate}
                error={attempted && !birthDate ? 'اختر تاريخ الميلاد.' : undefined}
                onChange={(date) => {
                  setSelectedDate(date);
                  setBirthDate(formatDate(date));
                }}
              />

              <View className="gap-3">
                <Label className="self-end font-ui-semibold text-text-primary">الجنس</Label>
                <RadioGroup
                  value={gender}
                  onValueChange={(next) => {
                    if (next === 'male' || next === 'female') setGender(next);
                  }}
                  className="flex-row gap-3"
                  style={{ direction: 'rtl' }}
                >
                  {(
                    [
                      { value: 'male', label: 'ذكر', icon: 'mars' },
                      { value: 'female', label: 'أنثى', icon: 'venus' },
                    ] as const
                  ).map(({ value, label, icon }) => {
                    const selected = gender === value;
                    return (
                      <RadioGroup.Item
                        key={value}
                        value={value}
                        className={
                          'min-h-[124px] flex-1 items-center justify-center rounded-form-field border px-3 py-3 ' +
                          (selected
                            ? 'border-action-primary bg-action-subtle'
                            : 'border-border-default bg-surface-default')
                        }
                      >
                        <View className="items-center justify-center gap-2.5">
                          <View className="relative">
                            <Avatar
                              size="lg"
                              variant="soft"
                              color={selected ? 'accent' : 'default'}
                            >
                              <Avatar.Fallback>
                                <OutlineIcon
                                  name="user-round"
                                  size={26}
                                  color={colors.text.primary}
                                  strokeWidth={1.8}
                                />
                              </Avatar.Fallback>
                            </Avatar>
                            <View className="absolute -bottom-1 -right-2 h-7 w-7 items-center justify-center rounded-full border border-border-subtle bg-surface-default">
                              <OutlineIcon
                                name={icon}
                                size={16}
                                color={selected ? colors.text.primary : colors.text.secondary}
                                strokeWidth={2}
                              />
                            </View>
                          </View>
                          <Typography.Paragraph
                            className={
                              selected
                                ? 'font-ui-semibold text-text-primary'
                                : 'font-ui-medium text-text-secondary'
                            }
                            style={{ textAlign: 'center', writingDirection: 'rtl' }}
                          >
                            {label}
                          </Typography.Paragraph>
                        </View>
                      </RadioGroup.Item>
                    );
                  })}
                </RadioGroup>
              </View>

              <View className="gap-2.5">
                <Label className="self-end font-ui-semibold text-text-primary">المنطقة</Label>
                <TextField>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={area ? 'تغيير المنطقة: ' + area : 'اختر مدينتك أو منطقتك'}
                    accessibilityHint="يفتح صفحة البحث عن المدن والمناطق"
                    className="relative justify-center"
                    onPress={() => router.push('/location-picker')}
                  >
                    <Input
                      editable={false}
                      pointerEvents="none"
                      variant="secondary"
                      value={area}
                      placeholder="اختر مدينتك أو منطقتك"
                      className="h-14 rounded-form-field border border-border-default bg-surface-default pl-12 pr-4 font-ui-medium text-text-primary"
                      placeholderColorClassName="text-text-placeholder"
                      style={{ textAlign: 'right', writingDirection: 'rtl' }}
                    />
                    <View
                      pointerEvents="none"
                      className="absolute left-4 h-8 w-8 items-center justify-center"
                    >
                      <OutlineIcon name="map-pin" size={20} color={colors.action.primary} />
                    </View>
                  </Pressable>
                </TextField>
                <FieldError isInvalid={attempted && area.trim().length < 2}>
                  حدد منطقتك للمتابعة.
                </FieldError>
                <Typography.Paragraph
                  type="body-sm"
                  className="font-ui-regular text-text-secondary"
                  style={{ textAlign: 'right', writingDirection: 'rtl' }}
                >
                  بتقدر تغيّر منطقتك بأي وقت من الحساب.
                </Typography.Paragraph>
              </View>
            </View>

            <View className="mt-auto min-h-8" />

            <View className="mt-8 gap-3">
              <Button
                variant="primary"
                size="lg"
                isDisabled={submitting}
                className="min-h-[52px] rounded-form-field bg-action-primary"
                onPress={() => void save()}
              >
                <Button.Label className="font-ui-semibold text-text-on-action">
                  {submitting ? 'جاري الحفظ...' : 'حفظ والمتابعة'}
                </Button.Label>
              </Button>
              <Typography.Paragraph
                type="body-sm"
                className="font-ui-regular text-text-secondary"
                style={{ textAlign: 'center', writingDirection: 'rtl' }}
              >
                بتقدر تكمل بقية معلوماتك لاحقاً من ملفك الشخصي.
              </Typography.Paragraph>
            </View>
          </View>
        </KeyboardResponsiveScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
