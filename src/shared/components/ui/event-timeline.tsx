import { View } from 'react-native';

import { useAppDirection } from '@/shared/utils/app-direction';
import { AppIcon } from '@/shared/components/ui/app-icon';
import { AppText } from '@/shared/components/ui/app-text';
import { cn } from '@/shared/utils/cn';

export interface EventTimelineItem {
  id: string;
  title: string;
  dateLabel: string;
  detail?: string;
}

interface EventTimelineProps {
  items: EventTimelineItem[];
}

export function EventTimeline({ items }: EventTimelineProps) {
  const { rowClassName } = useAppDirection();

  return (
    <View>
      {items.map((item, index) => (
        <View className={cn('min-h-[92px] gap-3', rowClassName)} key={item.id}>
          <View className="items-center">
            <View className="mt-0.5 h-6 w-6 items-center justify-center rounded-full bg-action-subtle">
              <AppIcon name="circle.fill" size={10} tone="action" />
            </View>
            {index < items.length - 1 ? (
              <View className="mt-1 w-px flex-1 bg-border-default" />
            ) : null}
          </View>

          <View className="min-w-0 flex-1 pb-5">
            <AppText variant="body-strong">{item.title}</AppText>
            <AppText className="mt-0.5 text-content-secondary" variant="caption">
              {item.dateLabel}
            </AppText>
            {item.detail ? (
              <AppText className="mt-2 text-content-secondary">{item.detail}</AppText>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}
