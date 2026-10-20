import { View } from 'react-native';
import { Radio } from 'heroui-native';

import { AppIcon } from '@/shared/components/ui/app-icon';
import { AppText } from '@/shared/components/ui/app-text';
import { cn } from '@/shared/utils/cn';

interface PatientSelectionCardProps {
  name: string;
  description: string;
  status: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}

/**
 * Shared patient selector for assessment and booking.
 * Availability comes from the calling feature's action-specific authorization.
 */
export function PatientSelectionCard({
  name,
  description,
  status,
  selected,
  disabled = false,
  onPress,
}: PatientSelectionCardProps) {
  return (
    <Radio
      isSelected={selected}
      isDisabled={disabled}
      onSelectedChange={onPress}
      accessibilityLabel={`${name}، ${description}، ${status}`}
      className={cn(
        'min-h-[94px] flex-row items-center gap-3 rounded-[16px] border px-3 py-3',
        disabled
          ? 'border-border-subtle bg-surface-subtle'
          : selected
            ? 'border-action-primary bg-action-subtle'
            : 'border-border-subtle bg-surface-default',
      )}
    >
      <Radio.Indicator />

      <View className="min-w-0 flex-1 items-end justify-center gap-[3px]">
        <AppText
          align="right"
          className={cn('w-full font-ui-bold', disabled && 'text-content-secondary')}
          numberOfLines={1}
          style={{ fontSize: 14, lineHeight: 21 }}
          variant="label"
        >
          {name}
        </AppText>
        <AppText
          align="right"
          className="w-full text-content-secondary"
          numberOfLines={1}
          style={{ fontSize: 11, lineHeight: 18 }}
          variant="caption"
        >
          {description}
        </AppText>
        <AppText
          align="right"
          className={cn(
            'w-full font-ui-semibold',
            disabled ? 'text-tone-danger-text' : 'text-content-link',
          )}
          numberOfLines={2}
          style={{ fontSize: 10.5, lineHeight: 18 }}
          variant="caption"
        >
          {status}
        </AppText>
      </View>

      <View
        className={cn(
          'h-11 w-11 shrink-0 items-center justify-center rounded-full',
          disabled ? 'bg-surface-subtle' : 'bg-action-subtle',
        )}
      >
        <AppIcon
          name={
            disabled
              ? { ios: 'lock.fill', android: 'lock', web: 'lock' }
              : { ios: 'person.crop.circle', android: 'person_outline', web: 'person_outline' }
          }
          size={22}
          tone={disabled ? 'secondary' : 'action'}
        />
      </View>
    </Radio>
  );
}
