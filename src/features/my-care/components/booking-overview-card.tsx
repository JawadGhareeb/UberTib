import { Card as HeroCard } from 'heroui-native';
import { Pressable, View } from 'react-native';

import { AppIcon, AppText, StatusIndicator } from '@/shared/components/ui';
import { CenteredActionIcon } from '@/shared/components/ui/centered-action-icon';
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
        className="gap-2.5 rounded-[15px] border border-border-subtle bg-surface-default p-3.5"
      >
        <View className="flex-row-reverse items-center gap-3">
          <CenteredActionIcon name="calendar" frameSize={46} iconSize={21} />
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" variant="body-strong" numberOfLines={1}>
              {item.serviceName}
            </AppText>
            <AppText
              align="right"
              variant="label"
              className="text-content-secondary"
              numberOfLines={1}
            >
              {item.providerName}
            </AppText>
          </View>
          <AppIcon
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            size={17}
            tone="secondary"
          />
        </View>
        <View className="flex-row-reverse items-center justify-between gap-2">
          <AppText
            align="right"
            variant="caption"
            className="min-w-0 flex-1 text-content-secondary"
            numberOfLines={2}
          >
            {item.dateLabel} · {item.timeLabel}
          </AppText>
          <StatusIndicator label={item.statusLabel} tone={tone} />
        </View>
      </HeroCard>
    </Pressable>
  );
}
