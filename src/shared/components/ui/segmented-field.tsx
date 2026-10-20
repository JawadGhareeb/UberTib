import { View } from 'react-native';
import { RadioGroup, Radio } from 'heroui-native';

import { AppText } from '@/shared/components/ui/app-text';
import { cn } from '@/shared/utils/cn';

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
  return (
    <View className="w-full gap-1.5">
      <AppText className="font-ui-medium text-content-secondary" variant="label">
        {label}
      </AppText>
      <RadioGroup
        value={value}
        onValueChange={(next) => onChange(next as T)}
        isDisabled={disabled}
        className="flex-row-reverse gap-2"
        style={{ direction: 'rtl' }}
      >
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <RadioGroup.Item
              key={option.value}
              value={option.value}
              className={cn(
                'min-h-form-field min-w-0 flex-1 flex-row-reverse items-center justify-center gap-2 rounded-[14px] border px-2',
                selected
                  ? 'border-state-selected-border bg-action-subtle'
                  : 'border-border-subtle bg-surface-default',
                error && 'border-tone-danger-border',
                disabled && 'bg-state-readonly',
              )}
            >
              <Radio />
              <AppText
                align="center"
                className={
                  selected ? 'font-ui-semibold text-content-link' : 'text-content-secondary'
                }
                variant="label"
              >
                {option.label}
              </AppText>
            </RadioGroup.Item>
          );
        })}
      </RadioGroup>
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
