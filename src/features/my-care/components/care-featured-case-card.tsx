import { useRouter } from 'expo-router';
import { Button as HeroButton, Card as HeroCard } from 'heroui-native';
import { View } from 'react-native';

import type { MockCareCase } from '../mocks/care.mock';
import { getCareStageSummary } from '../model/care-overview-view';
import { TreatmentStageProgress } from './treatment-stage-progress';
import { AppIcon, AppText, StatusIndicator } from '@/shared/components/ui';

export function CareFeaturedCaseCard({ careCase }: { careCase: MockCareCase }) {
  const router = useRouter();
  const { finished, total, current } = getCareStageSummary(careCase);

  return (
    <HeroCard
      variant="default"
      className="gap-3.5 rounded-[18px] border border-action-primary/25 bg-action-subtle p-4"
    >
      <View className="flex-row-reverse items-center justify-between gap-2">
        <View className="flex-row-reverse items-center gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-[10px] bg-surface-default">
            <AppIcon name={{ ios: 'heart.text.square', android: 'medical_services', web: 'medical_services' }} size={19} tone="action" />
          </View>
          <AppText variant="label" className="font-ui-semibold">متابعة العلاج</AppText>
        </View>
        <StatusIndicator label={careCase.statusLabel} tone="info" />
      </View>

      <View className="flex-row-reverse items-center gap-3">
        <View className="min-w-0 flex-1 items-end gap-1">
          <AppText align="right" variant="heading-4" className="font-ui-bold" numberOfLines={2}>
            {careCase.title}
          </AppText>
          <AppText align="right" variant="label" className="text-content-secondary" numberOfLines={2}>
            {careCase.provider}
          </AppText>
          <AppText align="right" variant="caption" className="text-content-secondary" numberOfLines={2}>
            {careCase.branch}
          </AppText>
        </View>
        {total > 0 ? <TreatmentStageProgress stages={careCase.stages} /> : null}
      </View>

      {current ? (
        <View className="gap-1 rounded-[12px] bg-surface-default px-3 py-2.5">
          <AppText align="right" variant="caption" className="text-content-secondary">
            المرحلة الحالية · {finished} من {total} مكتملة
          </AppText>
          <AppText align="right" variant="label" className="font-ui-semibold">
            {current.title}
          </AppText>
        </View>
      ) : null}

      {careCase.nextAction !== 'لا يوجد إجراء مطلوب' ? (
        <View className="flex-row-reverse items-start gap-2">
          <AppIcon name={{ ios: 'info.circle', android: 'info_outline', web: 'info_outline' }} size={18} tone="action" />
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" variant="label" className="font-ui-semibold" numberOfLines={2}>
              {careCase.nextAction}
            </AppText>
            <AppText align="right" variant="caption" className="text-content-secondary" numberOfLines={2}>
              {careCase.nextDateLabel}
            </AppText>
          </View>
        </View>
      ) : null}

      <View className="flex-row-reverse gap-2">
        <HeroButton
          variant="primary"
          className="min-h-[46px] min-w-0 flex-1 rounded-[12px] bg-action-primary"
          onPress={() => router.push({
            pathname: '/care/[caseId]/timeline',
            params: { caseId: careCase.id },
          })}
        >
          <HeroButton.Label className="font-ui-semibold text-content-on-action">
            تفاصيل الحالة
          </HeroButton.Label>
        </HeroButton>
        {careCase.treatmentPlan.length > 0 ? (
          <HeroButton
            variant="outline"
            className="min-h-[46px] min-w-0 flex-1 rounded-[12px] border-action-primary bg-surface-default"
            onPress={() => router.push({
              pathname: '/care/[caseId]/plan',
              params: { caseId: careCase.id },
            })}
          >
            <HeroButton.Label className="text-content-link">خطة العلاج</HeroButton.Label>
          </HeroButton>
        ) : null}
      </View>
    </HeroCard>
  );
}
