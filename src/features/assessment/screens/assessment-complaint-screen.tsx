import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { RadioGroup } from 'heroui-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { ASSESSMENT_PATIENT_FIXTURES } from '@/features/assessment/presentation/assessment-patient-copy';
import { useAuthSession } from '@/features/auth/state/auth-session-store';
import { useAuthAccess } from '@/features/auth/state/auth-access-store';
import { buildReturnTo } from '@/features/auth/navigation/auth-intent';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { AppIcon, AppText } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

const complaints = [
  ['ألم في سن أو ضرس', { ios: 'cross.case', android: 'dentistry', web: 'dentistry' }],
  ['تورم أو انتفاخ', { ios: 'exclamationmark.triangle', android: 'warning', web: 'warning' }],
  ['حساسية الأسنان', { ios: 'snowflake', android: 'ac_unit', web: 'ac_unit' }],
  ['نزيف أو مشكلة لثة', { ios: 'drop.fill', android: 'water_drop', web: 'water_drop' }],
  ['كسر أو إصابة', { ios: 'bandage.fill', android: 'healing', web: 'healing' }],
  [
    'سن مفقود / زرعة',
    { ios: 'circle.dashed', android: 'radio_button_unchecked', web: 'radio_button_unchecked' },
  ],
  ['فحص أو تنظيف', { ios: 'checkmark.seal', android: 'verified', web: 'verified' }],
  ['المظهر أو اللون', { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }],
  ['مشكلة لدى طفل', { ios: 'figure.child', android: 'child_care', web: 'child_care' }],
  ['غير متأكد / أخرى', { ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' }],
] as const;

export function AssessmentComplaintScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { patient, complaint, setComplaint } = useAssessmentSession();
  const { isAuthenticated } = useAuthSession();
  const requireAuth = useAuthAccess((state) => state.requireAuth);
  return (
    <AssessmentScaffold
      onPrimary={() => {
        if (returnTo === 'review') router.replace('/assessment/review');
        else {
          const allowed = requireAuth({
            returnTo: buildReturnTo('/assessment/location', { initialComplaint: complaint }),
            title: 'سجّل دخولك لتكمل تحديد حالتك',
            description:
              'اخترت المشكلة، وبقي كم سؤال لحتى نجهّز التوجيه المناسب. سجّل دخولك لنحفظ اختياراتك ونكمل.',
          });
          if (allowed) router.push('/assessment/location');
        }
      }}
      primaryDisabled={!complaint}
      primaryLabel="متابعة"
      phase="المشكلة الرئيسية"
      title="شو نوع المشكلة اللي عم تواجهها؟"
      topContent={
        <View className="flex-row-reverse items-center justify-between">
          <AppText variant="label" className="text-content-secondary">
            اختار المشكلة الأقرب لحالتك.
          </AppText>
          <AppText variant="caption" className="text-content-link">
            {isAuthenticated ? ASSESSMENT_PATIENT_FIXTURES[patient].name : 'تقييم مبدئي'}
          </AppText>
        </View>
      }
    >
      <RadioGroup
        value={complaint}
        onValueChange={setComplaint}
        className="flex-row-reverse flex-wrap justify-between gap-y-2"
      >
        {complaints.map(([label, icon]) => {
          const selected = complaint === label;
          return (
            <RadioGroup.Item
              key={label}
              value={label}
              className={cn(
                'min-h-[84px] w-[48.5%] flex-col items-center justify-center gap-1.5 rounded-[13px] border px-2 py-2',
                selected
                  ? 'border-action-primary bg-action-subtle'
                  : 'border-border-subtle bg-surface-default',
              )}
            >
              <View
                className={cn(
                  'h-9 w-9 items-center justify-center rounded-[11px]',
                  selected ? 'bg-action-primary' : 'bg-surface-subtle',
                )}
              >
                <AppIcon name={icon} size={20} tone={selected ? 'onAction' : 'action'} />
              </View>
              <AppText
                align="center"
                variant="label"
                className={selected ? 'font-ui-bold text-content-link' : 'font-ui-medium'}
                numberOfLines={2}
              >
                {label}
              </AppText>
              {selected ? (
                <View className="absolute right-2 top-2">
                  <AppIcon
                    name={{
                      ios: 'checkmark.circle.fill',
                      android: 'check_circle',
                      web: 'check_circle',
                    }}
                    size={17}
                    tone="action"
                  />
                </View>
              ) : null}
            </RadioGroup.Item>
          );
        })}
      </RadioGroup>
    </AssessmentScaffold>
  );
}
