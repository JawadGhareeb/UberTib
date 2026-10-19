import { Card as HeroCard } from 'heroui-native';
import { Pressable, View } from 'react-native';

import { AppIcon, AppText, type AppIconName } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

export function ProfileMenuCard({
  title,
  description,
  icon,
  onPress,
  danger = false,
}: {
  title: string;
  description: string;
  icon: AppIconName;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress}>
      <HeroCard
        variant="default"
        className={cn(
          'min-h-[66px] flex-row-reverse items-center gap-3 rounded-[14px] border border-border-subtle bg-surface-default px-3 py-2.5',
          danger && 'border-tone-danger-border bg-tone-danger-fill',
        )}
      >
        <View
          className={cn(
            'h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] bg-action-subtle',
            danger && 'bg-tone-danger-fill',
          )}
        >
          <AppIcon name={icon} size={21} tone={danger ? 'danger' : 'action'} />
        </View>
        <View className="min-w-0 flex-1 items-end gap-1">
          <AppText
            align="right"
            className={cn('font-ui-semibold', danger && 'text-tone-danger-text')}
            variant="label"
            numberOfLines={1}
          >
            {title}
          </AppText>
          <AppText
            align="right"
            className="text-content-secondary"
            variant="caption"
            numberOfLines={2}
          >
            {description}
          </AppText>
        </View>
        <AppIcon
          name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
          size={17}
          tone={danger ? 'danger' : 'secondary'}
        />
      </HeroCard>
    </Pressable>
  );
}
