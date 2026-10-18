import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { AppIcon, AppText, Button, PatientSelectionCard } from '@/shared/components/ui';

const patients = [
  {
    value: 'self' as const,
    label: 'ريم الخطيب',
    meta: 'أنا شخصياً · 34 سنة',
    status: 'الملف الصحي الأساسي',
    disabled: false,
  },
  {
    value: 'adam' as const,
    label: 'آدم الخطيب',
    meta: 'ابني · 8 سنوات',
    status: 'يمكنك الحجز والتقييم نيابة عنه',
    disabled: false,
  },
  {
    value: 'nour' as const,
    label: 'نور الخطيب',
    meta: 'ابنتي · 17 سنة',
    status: 'التفويض لا يسمح بالتقييم الصحي',
    disabled: true,
  },
] as const;

export function AssessmentPatientScreen() {
  const router = useRouter();
  const { patient, setPatient } = useAssessmentSession();

  return (
    <AssessmentScaffold
      onPrimary={() => {
        if (patient === 'nour') return;
        router.push('/assessment/complaint');
      }}
      primaryDisabled={patient === 'nour'}
      primaryLabel="متابعة"
      phase="المريض"
      title="لمن هذا التقييم؟"
      topContent={
        <View className="gap-3 pt-1">
          <AppText
            align="right"
            className="text-content-secondary"
            style={{ fontSize: 12, lineHeight: 21 }}
            variant="caption"
          >
            اختر الشخص الذي ستُستخدم معلوماته الصحية وملفاته في التقييم.
          </AppText>
          <View className="h-12 flex-row-reverse items-center justify-between rounded-[12px] bg-surface-subtle px-3">
            <AppText
              align="right"
              className="font-ui-bold"
              style={{ fontSize: 12, lineHeight: 19 }}
              variant="label"
            >
              ريم الخطيب — ولية الأمر
            </AppText>
            <AppText
              align="left"
              className="text-content-secondary"
              style={{ fontSize: 10, lineHeight: 17 }}
              variant="caption"
            >
              الهوية القائمة بالتقييم
            </AppText>
          </View>
        </View>
      }
    >
      <View accessibilityRole="radiogroup" className="mt-3 gap-3">
        {patients.map((item) => (
          <PatientSelectionCard
            description={item.meta}
            disabled={item.disabled}
            key={item.value}
            name={item.label}
            onPress={() => {
              if (item.disabled) return;
              setPatient(item.value);
            }}
            selected={patient === item.value}
            status={item.status}
          />
        ))}
      </View>

      <View className="mt-3 flex-row items-center gap-2 rounded-[12px] bg-tone-warning-fill px-3 py-[11px]">
        <AppText
          align="right"
          className="min-w-0 flex-1 text-tone-warning-text"
          style={{ fontSize: 11, lineHeight: 19 }}
          variant="caption"
        >
          صلاحية تفويض نور لا تسمح باستخدام المعلومات الصحية للتقييم.
        </AppText>
        <AppIcon
          name={{ ios: 'lock.shield.fill', android: 'lock', web: 'lock' }}
          size={18}
          tone="warning"
        />
      </View>

      <Button
        className="mt-3"
        endIcon={{ ios: 'person.badge.plus', android: 'person_add', web: 'person_add' }}
        label="إضافة فرد من الأسرة"
        onPress={() => router.push('/profile/dependents/new')}
        size="sm"
        variant="outline"
      />
    </AssessmentScaffold>
  );
}
