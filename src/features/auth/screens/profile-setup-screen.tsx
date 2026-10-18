import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { BrandedDateField } from '@/features/auth/components/branded-date-field';
import { resolveSafeReturnTo } from '@/features/auth/navigation/auth-intent';
import { usePreferredLocation } from '@/features/location/state/preferred-location-provider';
import {
  AppIcon,
  AppText,
  Button,
  Screen,
  SegmentedField,
  SelectField,
  TextField,
} from '@/shared/components/ui';

type Gender = 'female' | 'male';

export function ProfileSetupScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender>();
  const { location } = usePreferredLocation();
  const area = location?.label ?? '';
  const [submitting, setSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(1994, 7, 12));

  const valid =
    name.trim().length >= 2 && Boolean(birthDate) && Boolean(gender) && area.trim().length >= 2;

  const save = async () => {
    setAttempted(true);
    if (!valid || submitting) return;

    setSubmitting(true);
    await Promise.resolve();
    setSubmitting(false);
    router.replace(resolveSafeReturnTo(returnTo));
  };

  return (
    <Screen contentClassName="px-0 pb-0 pt-0">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="mx-auto w-full max-w-[430px] flex-1 gap-2 px-4 pb-5"
      >
        <View className="h-16 flex-row items-center justify-between">
          <View className="rounded-[8px] bg-action-subtle px-[10px] py-1.5">
            <AppText className="text-content-link" variant="label">
              الخطوة 3 من 3
            </AppText>
          </View>

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

        <ScrollView
          className="min-h-0 flex-1"
          contentContainerClassName="gap-3.5 pb-3"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AppText className="font-ui-bold" variant="heading-1">
            أكمل ملفك الأساسي
          </AppText>

          <AppText className="text-content-secondary" variant="body">
            نستخدم هذه المعلومات لتجهيز حجوزاتك وتخصيص تجربتك.
          </AppText>

          <View className="w-full flex-row items-center justify-end gap-3">
            <View className="items-end gap-[3px]">
              <AppText className="" variant="body-strong">
                صورة شخصية (اختيارية)
              </AppText>
              <AppText className="text-content-secondary" variant="caption">
                يمكنك إضافتها لاحقاً
              </AppText>
            </View>
            <View className="h-14 w-14 items-center justify-center rounded-full bg-action-subtle">
              <AppIcon
                name={{ ios: 'person', android: 'person_outline', web: 'person_outline' }}
                size={26}
                tone="action"
              />
            </View>
          </View>

          <TextField
            clearable
            variant="contained"
            error={attempted && name.trim().length < 2 ? 'أدخل الاسم الكامل.' : undefined}
            icon={{ ios: 'person', android: 'person_outline', web: 'person_outline' }}
            label="الاسم الكامل"
            onChangeText={setName}
            placeholder="ليان خالد"
            value={name}
          />

          <BrandedDateField
            displayValue={birthDate}
            error={attempted && !birthDate ? 'اختر تاريخ الميلاد.' : undefined}
            onChange={(date) => {
              setSelectedDate(date);
              setBirthDate(
                `${String(date.getDate()).padStart(2, '0')} / ${String(
                  date.getMonth() + 1,
                ).padStart(2, '0')} / ${date.getFullYear()}`,
              );
            }}
            value={selectedDate}
          />

          <SegmentedField
            error={attempted && !gender ? 'اختر الجنس.' : undefined}
            label="الجنس"
            onChange={setGender}
            options={[
              { value: 'female', label: 'أنثى' },
              { value: 'male', label: 'ذكر' },
            ]}
            value={gender}
          />

          <SelectField
            error={attempted && area.trim().length < 2 ? 'حدد منطقتك.' : undefined}
            icon={{ ios: 'mappin', android: 'location_on', web: 'location_on' }}
            label="المنطقة"
            onPress={() => router.push('/location-picker')}
            placeholder="حلب · الفرقان"
            value={area}
          />

          <View className="w-full flex-row items-center justify-end gap-2">
            <AppText className="text-content-secondary" variant="caption">
              يمكن تعديل المنطقة من الخريطة
            </AppText>
            <AppIcon
              name={{ ios: 'info.circle', android: 'info', web: 'info' }}
              size={16}
              tone="info"
            />
          </View>
        </ScrollView>

        <Button
          className="h-[52px] rounded-[12px]"
          endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
          label="حفظ والدخول"
          loading={submitting}
          loadingLabel="جاري الحفظ"
          onPress={() => void save()}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}
