import type { ComponentProps } from 'react';
import { FieldError, Input, Label, TextField as HeroTextField } from 'heroui-native';
import { Pressable, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/shared/components/ui/app-icon';
import { AppText } from '@/shared/components/ui/app-text';
import { cn } from '@/shared/utils/cn';

type InputProps = ComponentProps<typeof Input>;
type TextFieldProps = Omit<InputProps, 'variant'> & {
  label: string;
  error?: string;
  helperText?: string;
  direction?: 'rtl' | 'ltr';
  variant?: 'standard' | 'contained';
  icon?: AppIconName;
  clearable?: boolean;
};

/** Same HeroUI TextField/Input/Label and focus border as Auth screens. */
export function TextField({
  label,
  error,
  helperText,
  direction = 'rtl',
  variant = 'standard',
  icon,
  clearable = false,
  className,
  onChangeText,
  value,
  multiline,
  style,
  ...props
}: TextFieldProps) {
  const disabled = props.editable === false || props.isDisabled === true;
  return (
    <HeroTextField
      isInvalid={Boolean(error)}
      isDisabled={disabled}
      className={cn('w-full gap-2', variant === 'contained' && 'self-stretch')}
    >
      <Label className="self-end font-ui-semibold text-text-primary">{label}</Label>
      <View className="flex-row-reverse items-center gap-2">
        {icon ? (
          <View className="h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-action-subtle">
            <AppIcon name={icon} size={20} tone="action" />
          </View>
        ) : null}
        <View className="min-w-0 flex-1">
          <Input
            {...props}
            accessibilityLabel={props.accessibilityLabel ?? label}
            value={value}
            onChangeText={onChangeText}
            multiline={multiline}
            variant="secondary"
            className={cn(
              'min-h-14 rounded-form-field border border-border-default bg-surface-default px-4 font-ui-medium text-text-primary focus:border-action-primary',
              multiline && 'min-h-[104px] py-3',
              className,
            )}
            placeholderColorClassName="text-text-placeholder"
            selectionColorClassName="text-action-primary"
            style={[
              {
                textAlign: direction === 'rtl' ? 'right' : 'left',
                writingDirection: direction,
                textAlignVertical: multiline ? 'top' : 'center',
              },
              style,
            ]}
          />
        </View>
        {clearable && Boolean(value) && !disabled && onChangeText ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={'مسح ' + label}
            onPress={() => onChangeText('')}
            hitSlop={7}
            className="h-10 w-10 items-center justify-center rounded-full bg-surface-subtle"
          >
            <AppIcon
              name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
              tone="secondary"
              size={18}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <FieldError>{error}</FieldError>
      ) : helperText ? (
        <AppText variant="caption" align="right" className="text-content-secondary">
          {helperText}
        </AppText>
      ) : null}
    </HeroTextField>
  );
}
