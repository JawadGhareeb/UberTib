import { View } from 'react-native';

import { useAppDirection } from '@/shared/utils/app-direction';
import { AppText } from '@/shared/components/ui/app-text';
import { cn } from '@/shared/utils/cn';

export type ProgressRailState = 'complete' | 'current' | 'upcoming';

export interface ProgressRailItem {
  title: string;
  description?: string;
  state?: ProgressRailState;
}

interface ProgressRailProps {
  items: ProgressRailItem[];
  compact?: boolean;
}

const nodeClasses: Record<ProgressRailState, string> = {
  complete: 'border-action-primary bg-action-primary',
  current: 'border-action-primary bg-surface-default',
  upcoming: 'border-border-default bg-surface-default',
};

export function ProgressRail({ items, compact = false }: ProgressRailProps) {
  const { rowClassName } = useAppDirection();

  return (
    <View accessibilityLabel="مسار التقدم" className="w-full">
      {items.map((item, index) => {
        const state = item.state ?? 'upcoming';
        const isLast = index === items.length - 1;

        return (
          <View className={cn('gap-4', rowClassName)} key={item.title}>
            <View className="w-6 items-center">
              <View
                accessibilityElementsHidden
                className={cn('h-3 w-3 rounded-full border-2', nodeClasses[state])}
              />
              {!isLast ? (
                <View
                  accessibilityElementsHidden
                  className={cn('w-px flex-1 bg-border-subtle', compact ? 'min-h-6' : 'min-h-10')}
                />
              ) : null}
            </View>

            <View className={cn('min-w-0 flex-1', !isLast && (compact ? 'pb-3' : 'pb-5'))}>
              <AppText
                className={state === 'upcoming' ? 'text-content-secondary' : undefined}
                variant={state === 'current' ? 'body-strong' : 'body'}
              >
                {item.title}
              </AppText>
              {item.description ? (
                <AppText className="mt-1 text-content-secondary" variant="caption">
                  {item.description}
                </AppText>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
