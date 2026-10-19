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
        className="gap-2 rounded-[14px] border border-border-subtle bg-surface-default p-3"
      >
        <View className="flex-row-reverse items-center gap-2">
          <CenteredActionIcon name="calendar" frameSize={40} iconSize={20} />
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" variant="caption">
              حجز موعد
            </AppText>
            <AppText align="right" variant="body-strong" numberOfLines={2}>
              {item.serviceName}
            </AppText>
          </View>
          <StatusIndicator label={item.statusLabel} tone={tone} />
        </View>
        <AppText align="right" variant="label">
          {item.providerName} · {item.branch}
        </AppText>
        <View className="flex-row-reverse items-center gap-2">
          <AppText className="min-w-0 flex-1" align="right" variant="caption">
            {item.dateLabel} · {item.timeLabel}
          </AppText>
          <AppText variant="label" className="text-content-link">
            عرض الحجز
          </AppText>
          <AppIcon
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            size={16}
            tone="action"
          />
        </View>
      </HeroCard>
    </Pressable>
  );
}
