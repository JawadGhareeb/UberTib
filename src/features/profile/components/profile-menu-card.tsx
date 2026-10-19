import { Pressable, View } from 'react-native';

import { AppIcon, AppText, type AppIconName } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

export function ProfileMenuCard({
  title,
  description,
  icon,
  onPress,
  danger = false,
  first = false,
}: {
  title: string;
  description?: string;
  icon: AppIconName;
  onPress: () => void;
  danger?: boolean;
  first?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      className={cn(
        'min-h-[58px] flex-row-reverse items-center gap-3 px-3 py-3',
        !first && 'border-t border-border-subtle',
      )}
      onPress={onPress}
    >
      <View
        className={cn(
          'h-9 w-9 shrink-0 items-center justify-center rounded-[11px]',
          danger ? 'bg-tone-danger-fill' : 'bg-action-subtle',
        )}
      >
        <AppIcon name={icon} size={19} tone={danger ? 'danger' : 'action'} />
      </View>
      <View className="min-w-0 flex-1 items-end gap-0.5">
        <AppText
          align="right"
          variant="label"
          className={cn('font-ui-semibold', danger && 'text-tone-danger-text')}
          numberOfLines={1}
        >
          {title}
        </AppText>
        {description ? (
          <AppText
            align="right"
            variant="caption"
            className="text-content-secondary"
            numberOfLines={2}
          >
            {description}
          </AppText>
        ) : null}
      </View>
      <AppIcon
        name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
        size={17}
        tone="secondary"
      />
    </Pressable>
  );
}
