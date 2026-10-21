import { useRouter } from 'expo-router';
import { Button as HeroButton, Card as HeroCard } from 'heroui-native';
import { View } from 'react-native';

import { CenteredActionIcon } from '@/shared/components/ui/centered-action-icon';
import { AppText } from '@/shared/components/ui';
import type { MockCareCase } from '../mocks/care.mock';
import { getCareStageSummary } from '../model/care-overview-view';
import { CareCaseStatusBadge } from './care-case-status-badge';
import { CareRecordTitle } from './care-record-title';

function CareProgressTrack({ progress }: { progress: number }) {
  // Explicit native heights: relying on arbitrary class h-[6px] let this view
  // grow to a screen-sized pill on iOS when its child used percentage width.
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={'تقدم العلاج ' + progress + ' بالمئة'}
      accessibilityValue={{ min: 0, max: 100, now: progress }}
      className="bg-surface-subtle"
      style={{ width: '100%', height: 6, borderRadius: 99, overflow: 'hidden', flexShrink: 0 }}
    >
      <View
        className="bg-action-primary"
        style={{ width: `${progress}%`, height: 6, borderRadius: 99 }}
      />
    </View>
  );
}

/** The single card style for every treatment case, with two explicit actions. */
export function CaseRow({ item }: { item: MockCareCase }) {
  const router = useRouter();
  const { finished, total } = getCareStageSummary(item);
  const progress = Math.min(100, Math.max(0, item.progress));

  const openDetails = () =>
    router.push({ pathname: '/care/[caseId]/timeline', params: { caseId: item.id } });
  const openPlan = () =>
    router.push({ pathname: '/care/[caseId]/plan', params: { caseId: item.id } });

  return (
    <HeroCard
      variant="default"
      className="gap-3 rounded-[16px] border border-border-subtle bg-surface-default p-3.5"
    >
      <View className="flex-row-reverse items-center gap-3">
        <CenteredActionIcon name="care" frameSize={44} iconSize={20} />
        <View className="min-w-0 flex-1 items-end gap-1">
          <View className="w-full flex-row-reverse items-center justify-between gap-2">
            <View className="min-w-0 flex-1">
              <CareRecordTitle title={item.title} provider={item.provider} />
            </View>
            <CareCaseStatusBadge careCase={item} />
          </View>
          <AppText
            align="right"
            variant="caption"
            className="text-content-secondary"
            numberOfLines={1}
          >
            {item.branch}
          </AppText>
        </View>
      </View>

      {total > 0 ? (
        <View className="gap-2" style={{ flexShrink: 0 }}>
          <View className="flex-row-reverse items-center justify-between gap-2">
            <AppText align="right" variant="caption" className="text-content-secondary">
              {finished} من {total} مراحل مكتملة
            </AppText>
            <AppText variant="caption" className="font-ui-medium text-content-link">
              {progress}%
            </AppText>
          </View>
          <CareProgressTrack progress={progress} />
        </View>
      ) : null}

      <View className="flex-row-reverse gap-2">
        <HeroButton
          variant="primary"
          className="min-h-[46px] min-w-0 flex-1 rounded-[12px] bg-action-primary"
          onPress={openDetails}
        >
          <HeroButton.Label className="font-ui-semibold text-content-on-action">
            تفاصيل الحالة
          </HeroButton.Label>
        </HeroButton>
        <HeroButton
          variant="outline"
          className="min-h-[46px] min-w-0 flex-1 rounded-[12px] border-action-primary"
          onPress={openPlan}
        >
          <HeroButton.Label className="font-ui-semibold text-content-link">
            خطة العلاج
          </HeroButton.Label>
        </HeroButton>
      </View>
    </HeroCard>
  );
}
