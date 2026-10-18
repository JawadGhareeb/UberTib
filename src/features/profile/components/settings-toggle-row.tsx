import { Pressable, View } from 'react-native';

import { useAppDirection } from '@/providers/app-direction-provider';
import { AppText } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

interface SettingsToggleRowProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function SettingsToggleRow({
  title,
  description,
  value,
  onValueChange,
}: SettingsToggleRowProps) {
  const { rowClassName } = useAppDirection();

  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      className="px-4 py-3.5 active:bg-surface-subtle"
      onPress={() => onValueChange(!value)}
    >
      <View className={cn('items-center gap-4', rowClassName)}>
        <View className="min-w-0 flex-1">
          <AppText variant="body-strong">{title}</AppText>
          <AppText className="mt-0.5 text-content-secondary" variant="caption">
            {description}
          </AppText>
        </View>

        <View
          className={cn(
            'h-7 w-12 justify-center rounded-full p-0.5',
            value
              ? 'items-end bg-action-primary'
              : 'items-start border border-border-default bg-surface-subtle',
          )}
        >
          <View className="h-6 w-6 rounded-full border border-border-subtle bg-surface-default" />
        </View>
      </View>
    </Pressable>
  );
}
