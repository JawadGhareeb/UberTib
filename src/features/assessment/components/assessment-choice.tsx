import { Pressable, View } from 'react-native';

import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, type AppIconName, AppText } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

interface AssessmentChoiceProps {
  label: string;
  caption?: string;
  selected: boolean;
  onPress: () => void;
  icon?: AppIconName;
  compact?: boolean;
}

export function AssessmentChoice({
  label,
  caption,
  selected,
  onPress,
  icon,
  compact = false,
}: AssessmentChoiceProps) {
  const { rowClassName } = useAppDirection();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={cn(
        rowClassName,
        'items-center gap-3 rounded-[14px] border bg-surface-default',
        compact ? 'min-h-control px-3 py-2.5' : 'min-h-[64px] px-4 py-3',
        selected ? 'border-state-selected-border bg-state-selected' : 'border-border-subtle',
      )}
      onPress={onPress}
    >
      {icon ? (
        <View
          className={cn(
            'h-9 w-9 items-center justify-center rounded-full',
            selected ? 'bg-action-primary' : 'bg-surface-subtle',
          )}
        >
          <AppIcon name={icon} size={18} tone={selected ? 'onAction' : 'secondary'} />
        </View>
      ) : null}

      <View className="min-w-0 flex-1">
        <AppText className={selected ? 'text-content-link' : undefined} variant="label">
          {label}
        </AppText>
        {caption ? (
          <AppText className="mt-0.5 text-content-secondary" variant="caption">
            {caption}
          </AppText>
        ) : null}
      </View>

      <View
        className={cn(
          'h-5 w-5 items-center justify-center rounded-full border',
          selected ? 'border-action-primary bg-action-primary' : 'border-border-strong',
        )}
      >
        {selected ? (
          <AppIcon
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            size={12}
            tone="onAction"
          />
        ) : null}
      </View>
    </Pressable>
  );
}
