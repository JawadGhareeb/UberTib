import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AssessmentScaffold } from '@/features/assessment/components/assessment-scaffold';
import { useAssessmentSession } from '@/features/assessment/state/assessment-session-provider';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { cn } from '@/shared/utils/cn';

// These are local presentation fixtures; medical details are not edited by this screen.
const healthFacts = [
  {
    label: 'حالة صحية مهمة',
    value: 'لا شيء',
    icon: { ios: 'checkmark.circle', android: 'verified', web: 'verified' },
    warm: false,
  },
  {
    label: 'الأدوية الحالية',
    value: 'لا توجد أدوية يومية',
    icon: { ios: 'pills.fill', android: 'medication', web: 'medication' },
    warm: false,
  },
  {
    label: 'الحساسيات',
    value: 'بنسلين — طفح جلدي سابق',
    icon: { ios: 'exclamationmark.shield', android: 'health_and_safety', web: 'health_and_safety' },
    warm: true,
  },
] as const;

// First item appears at the right of each row in the Arabic layout.
const dentalFacts = [
  {
    label: 'تاج خزفي',
    value: '2023 — ضرس علوي',
    icon: { ios: 'crown.fill', android: 'workspace_premium', web: 'workspace_premium' },
    warm: true,
  },
  {
    label: 'علاج جذور سابق',
    value: '2022 — الضرس السفلي',
    icon: { ios: 'waveform.path.ecg', android: 'dentistry', web: 'dentistry' },
    warm: false,
  },
  {
    label: 'أشعة سابقة',
    value: '2024 — بانورامية',
    icon: { ios: 'viewfinder', android: 'center_focus_weak', web: 'center_focus_weak' },
    warm: true,
  },
  {
    label: 'آخر زيارة',
    value: 'منذ 6 أشهر',
    icon: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
    warm: false,
  },
] as const;

function SectionHeading({
  title,
  icon,
  warm = false,
  onEdit,
}: {
  title: string;
  icon: AppIconName;
  warm?: boolean;
  onEdit: () => void;
}) {
  const { rowClassName } = useAppDirection();

  return (
    <View className={cn('min-h-[36px] items-center gap-2', rowClassName)}>
      <View
        className={cn(
          'h-[28px] w-[28px] items-center justify-center rounded-[9px]',
          warm ? 'bg-tone-warning-fill' : 'bg-action-subtle',
        )}
      >
        <AppIcon name={icon} size={17} tone={warm ? 'warning' : 'action'} />
      </View>
      <AppText align="right" className="min-w-0 font-ui-bold text-content-primary" variant="label">
        {title}
      </AppText>
      <View className="min-w-0 flex-1" />
      <Pressable
        accessibilityLabel={'تعديل ' + title}
        accessibilityRole="button"
        className="min-h-[44px] min-w-[44px] items-center justify-center"
        onPress={onEdit}
      >
        <AppText align="center" className="text-content-link" variant="caption">
          تعديل
        </AppText>
      </Pressable>
    </View>
  );
}

export function AssessmentHealthScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { setHealthConfirmed } = useAssessmentSession();
  const editHealth = () => router.push('/profile/health');

  return (
    <AssessmentScaffold
      backIcon={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
      phase="السياق الصحي"
      title="هل هذه المعلومات ما زالت صحيحة؟"
      topContent={
        <View className="pt-1">
          <View
            className={cn(
              'min-h-[56px] items-center justify-between gap-3 rounded-[14px] bg-action-subtle px-3 py-2',
              rowClassName,
            )}
          >
            <View className="min-w-0 flex-1 items-end">
              <AppText align="right" className="font-ui-bold text-content-primary" variant="label">
                سارة الأحمد
              </AppText>
              <AppText align="right" className="mt-0.5 text-content-secondary" variant="caption">
                سنستخدم نسخة مرتبطة بهذا التقييم فقط
              </AppText>
            </View>
            <AppText
              direction="rtl"
              align="left"
              className="font-ui-bold text-content-link"
              variant="caption"
            >
              31 سنة
            </AppText>
          </View>
        </View>
      }
    >
      <View className="mt-3 rounded-[14px] border border-border-subtle bg-surface-default px-3 pb-3 pt-1">
        <SectionHeading
          title="الملخص الصحي"
          icon={{ ios: 'heart.text.square', android: 'monitor_heart', web: 'monitor_heart' }}
          onEdit={editHealth}
        />
        <View className={cn('mt-1 items-stretch gap-2', rowClassName)}>
          {healthFacts.map((fact) => (
            <View
              className="min-h-[128px] min-w-0 flex-1 items-end rounded-[11px] bg-surface-subtle px-2 py-2"
              key={fact.label}
            >
              <View
                className={cn(
                  'h-[30px] w-[30px] items-center justify-center rounded-[9px]',
                  fact.warm ? 'bg-tone-warning-fill' : 'bg-action-subtle',
                )}
              >
                <AppIcon name={fact.icon} size={17} tone={fact.warm ? 'warning' : 'action'} />
              </View>
              <AppText
                align="right"
                className="mt-1.5 w-full text-content-secondary"
                variant="caption"
              >
                {fact.label}
              </AppText>
              <AppText align="right" className="mt-1 w-full font-ui-semibold text-content-primary" variant="caption">
                {fact.value}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-2 rounded-[14px] border border-border-subtle bg-surface-default px-3 pb-3 pt-1">
        <SectionHeading
          title="تاريخ الأسنان"
          icon={{ ios: 'clock.arrow.circlepath', android: 'history', web: 'history' }}
          warm
          onEdit={editHealth}
        />
        <View className={cn('mt-1 flex-wrap justify-between gap-y-2', rowClassName)}>
          {dentalFacts.map((fact) => (
            <View
              className="min-h-[82px] w-[49%] items-end rounded-[11px] bg-surface-subtle px-2.5 py-2"
              key={fact.label}
            >
              <View
                className={cn(
                  'h-7 w-7 items-center justify-center rounded-[9px]',
                  fact.warm ? 'bg-tone-warning-fill' : 'bg-action-subtle',
                )}
              >
                <AppIcon name={fact.icon} size={16} tone={fact.warm ? 'warning' : 'action'} />
              </View>
              <AppText align="right" className="mt-1 w-full text-content-secondary" variant="caption">
                {fact.label}
              </AppText>
              <AppText
                align="right"
                className="mt-0.5 w-full font-ui-semibold text-content-primary"
                variant="caption"
              >
                {fact.value}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <View className={cn('mt-2 min-h-[36px] items-center gap-2 rounded-[10px] bg-tone-info-fill px-3 py-2', rowClassName)}>
        <AppIcon
          name={{ ios: 'info.circle', android: 'info_outline', web: 'info_outline' }}
          size={16}
          tone="info"
        />
        <AppText align="right" className="min-w-0 flex-1 text-tone-info-text" variant="caption">
          تحديث الملف الصحي الأصلي إجراء منفصل وواضح
        </AppText>
      </View>

      <View className={cn('mt-3 gap-2', rowClassName)}>
        <Button
          className="h-[50px] min-w-0 flex-1 rounded-[12px]"
          label="لا تغييرات"
          onPress={() => {
            setHealthConfirmed(true);
            router.push('/assessment/media');
          }}
        />
        <Button
          className="h-[50px] min-w-0 flex-1 rounded-[12px]"
          label="تحديث المعلومات"
          onPress={editHealth}
          variant="secondary"
        />
      </View>
    </AssessmentScaffold>
  );
}
