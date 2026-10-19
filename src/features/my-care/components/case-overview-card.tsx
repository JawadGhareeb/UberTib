import { Card as HeroCard } from 'heroui-native';
import { Pressable, View } from 'react-native';

import type { MockCareCase } from '@/features/my-care/mocks/care.mock';
import { AppIcon, AppText, StatusIndicator } from '@/shared/components/ui';
import { CenteredActionIcon } from '@/shared/components/ui/centered-action-icon';

export function CaseRow({ item, onPress }: { item: MockCareCase; onPress: () => void }) {
  const complete = item.progress >= 100;
  const progress = Math.min(100, Math.max(0, item.progress));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'تفاصيل الحالة العلاجية: ' + item.title}
      onPress={onPress}
    >
      <HeroCard
        variant="default"
        className="gap-2.5 rounded-[15px] border border-border-subtle bg-surface-default p-3.5"
      >
        <View className="flex-row-reverse items-center gap-3">
          <CenteredActionIcon name="care" frameSize={46} iconSize={21} />
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" variant="body-strong" numberOfLines={1}>
              {item.title}
            </AppText>
            <AppText
              align="right"
              variant="label"
              className="text-content-secondary"
              numberOfLines={1}
            >
              {item.provider}
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
            numberOfLines={1}
          >
            {item.nextAction}
          </AppText>
          <StatusIndicator label={item.statusLabel} tone={complete ? 'success' : 'info'} />
        </View>
        <View
          accessible
          accessibilityLabel={'تقدم العلاج ' + progress + ' بالمئة'}
          className="h-[4px] overflow-hidden rounded-full bg-surface-subtle"
        >
          <View
            className="h-full rounded-full bg-action-primary"
            style={{ width: `${progress}%` }}
          />
        </View>
      </HeroCard>
    </Pressable>
  );
}
