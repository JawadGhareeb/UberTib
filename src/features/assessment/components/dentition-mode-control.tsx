import { Pressable, View } from 'react-native';

import type { DentitionMode } from '@/features/assessment/state/assessment-session-provider';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppText } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/theme-provider';
import { cn } from '@/shared/utils/cn';

const modes: { value: DentitionMode; label: string }[] = [
  { value: 'primary', label: 'لبنية' },
  { value: 'mixed', label: 'مختلطة' },
  { value: 'permanent', label: 'دائمة' },
  { value: 'uncertain', label: 'غير متأكد' },
];

interface DentitionModeControlProps {
  value: DentitionMode;
  onChange: (value: DentitionMode) => void;
}

export function DentitionModeControl({ value, onChange }: DentitionModeControlProps) {
  const { rowClassName } = useAppDirection();
  const { colors } = useAppTheme();

  return (
    <View className="rounded-[16px] border border-border-default bg-surface-default px-[10px] py-2">
      <View className={cn('items-center justify-between', rowClassName)}>
        <AppText className="font-ui-bold" variant="label">
          نمط الأسنان
        </AppText>
        <AppText className="text-content-secondary" variant="caption">
          اقتراح أولي • يمكنك التغيير
        </AppText>
      </View>

      <View
        className={cn(
          'mt-[7px] h-[36px] gap-[3px] rounded-[10px] bg-surface-subtle p-[3px]',
          rowClassName,
        )}
      >
        {modes.map((mode) => {
          const selected = value === mode.value;

          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              className={cn(
                'min-w-0 flex-1 items-center justify-center rounded-[8px]',
                selected ? 'bg-action-primary' : 'bg-surface-subtle',
              )}
              hitSlop={4}
              key={mode.value}
              onPress={() => onChange(mode.value)}
            >
              <AppText
                style={selected ? { color: colors.text.onAction } : undefined}
                className={cn(
                  'text-type-caption font-ui-bold',
                  selected ? 'text-content-on-action' : 'text-content-secondary',
                )}
                variant="caption"
              >
                {mode.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
