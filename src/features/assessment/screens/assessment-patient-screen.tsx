import { useLocalSearchParams, useRouter } from 'expo-router';
import { Radio, RadioGroup } from 'heroui-native';
import { View } from 'react-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { ASSESSMENT_PATIENT_FIXTURES } from '@/features/assessment/presentation/assessment-patient-copy';
import {
  useAssessmentSession,
  type AssessmentPatient,
} from '@/features/assessment/state/assessment-session-provider';
import { AppIcon, AppText, Button } from '@/shared/components/ui';

const patients: { value: AssessmentPatient; status: string; disabled: boolean }[] = [
  { value: 'self', status: 'ملفي الصحي', disabled: false },
  { value: 'adam', status: 'يمكنك التقييم نيابةً عنها', disabled: false },
  { value: 'nour', status: 'لا تسمح صلاحية التفويض بالتقييم', disabled: true },
];

export function AssessmentPatientScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { patient, setPatient } = useAssessmentSession();
  return (
    <AssessmentScaffold
      onPrimary={() => {
        if (returnTo === 'review') router.replace('/assessment/review');
        else router.push('/assessment/complaint');
      }}
      primaryDisabled={patient === 'nour'}
      primaryLabel="متابعة"
      phase="المريض"
      title="لمن هذا التقييم؟"
      topContent={
        <AppText align="right" variant="label" className="text-content-secondary">
          اختر المريض الصحيح حتى تستخدم معلوماته خلال التقييم.
        </AppText>
      }
    >
      <RadioGroup
        value={patient}
        onValueChange={(next) => setPatient(next as AssessmentPatient)}
        className="gap-2"
      >
        {patients.map(({ value, status, disabled }) => {
          const info = ASSESSMENT_PATIENT_FIXTURES[value];
          const selected = patient === value;
          return (
            <RadioGroup.Item
              key={value}
              value={value}
              isDisabled={disabled}
              accessibilityLabel={`${info.name}، ${status}`}
              className={
                'min-h-[72px] flex-row-reverse items-center gap-3 rounded-[13px] border px-3 py-2.5 ' +
                (selected
                  ? 'border-action-primary bg-action-subtle'
                  : disabled
                    ? 'border-border-subtle bg-surface-subtle'
                    : 'border-border-subtle bg-surface-default')
              }
            >
              <View className="h-9 w-9 items-center justify-center rounded-full bg-surface-subtle">
                <AppIcon
                  name={
                    disabled
                      ? { ios: 'lock.fill', android: 'lock', web: 'lock' }
                      : { ios: 'person', android: 'person_outline', web: 'person_outline' }
                  }
                  tone={disabled ? 'secondary' : 'action'}
                  size={19}
                />
              </View>
              <View className="min-w-0 flex-1 items-end gap-0.5">
                <AppText
                  align="right"
                  variant="label"
                  className="w-full font-ui-bold"
                  numberOfLines={1}
                >
                  {info.name}
                </AppText>
                <AppText
                  align="right"
                  variant="caption"
                  className="w-full text-content-secondary"
                  numberOfLines={1}
                >
                  {info.note} · {info.age} سنة
                </AppText>
                <AppText
                  align="right"
                  variant="caption"
                  className={disabled ? 'w-full text-tone-danger-text' : 'w-full text-content-link'}
                  numberOfLines={1}
                >
                  {status}
                </AppText>
              </View>
              <Radio />
            </RadioGroup.Item>
          );
        })}
      </RadioGroup>
      <Button
        label="إضافة فرد من الأسرة"
        endIcon={{ ios: 'person.badge.plus', android: 'person_add', web: 'person_add' }}
        onPress={() => router.push('/profile/dependents/new')}
        size="sm"
        variant="outline"
      />
      <View className="flex-row-reverse items-center gap-2 rounded-[11px] bg-tone-info-fill p-3">
        <AppIcon
          name={{ ios: 'lock.shield', android: 'lock', web: 'lock' }}
          tone="info"
          size={17}
        />
        <AppText align="right" variant="caption" className="min-w-0 flex-1 text-tone-info-text">
          التقييم متاح فقط للمريض الذي تملك صلاحية استخدام معلوماته الصحية.
        </AppText>
      </View>
    </AssessmentScaffold>
  );
}
