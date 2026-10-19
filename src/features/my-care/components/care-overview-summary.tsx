import { Card as HeroCard } from 'heroui-native';
import { View } from 'react-native';

import { CenteredActionIcon } from '@/shared/components/ui/centered-action-icon';
import { AppText } from '@/shared/components/ui';
import type { CareItem } from '../model/overview-items';

export function CareOverviewSummary({ records }: { records: CareItem[] }) {
  if (records.length === 0) return null;

  const bookingCount = records.filter((item) => item.kind === 'booking').length;
  const caseCount = records.filter((item) => item.kind === 'case').length;

  return (
    <View className="flex-row-reverse gap-2 px-4">
      <HeroCard
        variant="default"
        className="min-w-0 flex-1 flex-row-reverse items-center gap-2.5 rounded-[14px] border border-border-subtle bg-surface-default px-3 py-3"
      >
        <CenteredActionIcon name="calendar" frameSize={40} iconSize={19} />
        <View className="min-w-0 flex-1 items-end gap-0.5">
          <AppText variant="heading-4">{bookingCount}</AppText>
          <AppText align="right" variant="caption" className="text-content-secondary">
            حجوزات
          </AppText>
        </View>
      </HeroCard>
      <HeroCard
        variant="default"
        className="min-w-0 flex-1 flex-row-reverse items-center gap-2.5 rounded-[14px] border border-border-subtle bg-surface-default px-3 py-3"
      >
        <CenteredActionIcon name="care" frameSize={40} iconSize={19} />
        <View className="min-w-0 flex-1 items-end gap-0.5">
          <AppText variant="heading-4">{caseCount}</AppText>
          <AppText align="right" variant="caption" className="text-content-secondary">
            حالات علاجية
          </AppText>
        </View>
      </HeroCard>
    </View>
  );
}
