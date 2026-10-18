import { Pressable, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';

import { useAppDirection } from '@/providers/app-direction-provider';
import { AppText } from '@/shared/components/ui/app-text';
import { cn } from '@/shared/utils/cn';
import { theme } from '@/shared/theme';

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedFieldProps<T extends string> {
  label: string;
  value?: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
  error?: string;
  disabled?: boolean;
}

export function SegmentedField<T extends string>({
  label,
  value,
  options,
  onChange,
  error,
  disabled = false,
}: SegmentedFieldProps<T>) {
  const { rowClassName } = useAppDirection();

  return (
    <View className="w-full gap-1.5">
      <AppText className="font-ui-medium text-content-secondary" variant="label">
        {label}
      </AppText>
      <View accessibilityRole="radiogroup" className={cn(rowClassName, 'gap-2')}>
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <Pressable
              accessibilityLabel={option.label}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected, disabled }}
              className={cn(
                'min-h-form-field min-w-0 flex-1 items-center justify-center rounded-[14px] border px-2',
                selected
                  ? 'border-state-selected-border bg-action-subtle'
                  : 'border-action-primary bg-surface-default',
                error && 'border-tone-danger-border',
                disabled && 'bg-state-readonly',
              )}
              disabled={disabled}
              key={option.value}
              onPress={() => onChange(option.value)}
            >
              {selected ? (
                <Animated.View
                  entering={FadeIn.duration(theme.motion.duration.stateChange).reduceMotion(
                    ReduceMotion.System,
                  )}
                  className="absolute top-0 h-[2px] w-8 rounded-full bg-action-primary"
                />
              ) : null}
              <AppText
                align="center"
                className={cn(
                  selected ? 'font-ui-semibold text-content-link' : 'text-content-secondary',
                )}
                variant="label"
              >
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <AppText
          accessibilityLiveRegion="polite"
          className="text-tone-danger-text"
          variant="caption"
        >
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
