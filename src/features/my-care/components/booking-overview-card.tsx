import { Card as HeroCard } from 'heroui-native';
import { Pressable, View } from 'react-native';

import { AppIcon, AppText, StatusIndicator } from '@/shared/components/ui';
import { CenteredActionIcon } from '@/shared/components/ui/centered-action-icon';
import { CareRecordTitle } from './care-record-title';
import type { BookingItem } from '../model/overview-items';

export function BookingRow({ item, onPress }: { item: BookingItem; onPress: () => void }) {
  const tone =
    item.status === 'confirmed'
      ? 'success'
      : item.status === 'completed'
        ? 'neutral'
        : item.status === 'cancelled'
          ? 'danger'
          : 'warning';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'تفاصيل الحجز: ' + item.serviceName}
      onPress={onPress}
    >
      <HeroCard
        variant="default"
        className="gap-3 rounded-[15px] border border-border-subtle bg-surface-default p-3.5"
      >
        <View className="flex-row-reverse items-center gap-2.5">
          <CenteredActionIcon name="calendar" frameSize={44} iconSize={20} />
          <View className="min-w-0 flex-1 items-end gap-1">
            <View className="w-full flex-row-reverse items-center justify-between gap-2">
              <View className="min-w-0 flex-1">
                <CareRecordTitle title={item.serviceName} provider={item.providerName} />
              </View>
              <StatusIndicator label={item.statusLabel} tone={tone} />
            </View>
            <AppText
              variant="caption"
              align="right"
              className="w-full text-content-secondary"
              numberOfLines={1}
            >
              {item.branch}
            </AppText>
          </View>
          <AppIcon
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            size={27}
            tone="action"
          />
        </View>
        <View className="flex-row-reverse items-center justify-between gap-2">
          <View className="min-w-0 flex-1 flex-row-reverse items-center gap-1.5">
            <AppIcon
              name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
              size={15}
              tone="secondary"
            />
            <AppText
              align="right"
              variant="caption"
              className="min-w-0 flex-1 text-content-secondary"
              numberOfLines={2}
            >
              {item.dateLabel} · {item.timeLabel}
            </AppText>
          </View>
        </View>
      </HeroCard>
    </Pressable>
  );
}
