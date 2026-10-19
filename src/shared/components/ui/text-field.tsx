import type { ComponentProps } from 'react';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/shared/components/ui/app-icon';
import { FieldSurface } from '@/shared/components/ui/field-surface';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { cn } from '@/shared/utils/cn';

type NativeTextInputProps = ComponentProps<typeof TextInput>;

interface TextFieldProps extends NativeTextInputProps {
  label: string;
  error?: string;
  helperText?: string;
  direction?: 'rtl' | 'ltr';
  variant?: 'standard' | 'contained';
  icon?: AppIconName;
  clearable?: boolean;
}

export function TextField({
  label,
  error,
  helperText,
  direction = 'rtl',
  variant = 'standard',
  icon,
  clearable = false,
  className,
  accessibilityLabel,
  style,
  onFocus,
  onBlur,
  onChangeText,
  value,
  multiline,
  ...props
}: TextFieldProps) {
  const { colors } = useAppTheme();
  const [focused, setFocused] = useState(false);
  const disabled = props.editable === false;

  const clearAction =
    clearable && focused && Boolean(value) && !disabled && onChangeText ? (
      <Pressable
        accessibilityLabel={`مسح ${label}`}
        accessibilityRole="button"
        className="h-9 w-9 items-center justify-center rounded-full bg-surface-subtle"
        hitSlop={4}
        onPress={() => onChangeText('')}
      >
        <AppIcon
          name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
          size={17}
          tone="secondary"
        />
      </Pressable>
    ) : undefined;

  return (
    <View className={cn('w-full', variant === 'contained' && 'self-stretch')}>
      <FieldSurface
        accessory={clearAction}
        disabled={disabled}
        error={error}
        focused={focused}
        helperText={helperText}
        icon={icon}
        label={label}
      >
        <TextInput
          {...props}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityState={{ disabled }}
          className={cn(
            'w-full bg-transparent p-0 font-ui-regular text-type-body text-content-primary',
            multiline ? 'min-h-[76px] py-1' : 'min-h-[32px]',
            disabled && 'text-content-disabled',
            className,
          )}
          multiline={multiline}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onChangeText={onChangeText}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          placeholderTextColor={colors.text.placeholder}
          style={[
            {
              letterSpacing: 0,
              textAlign: direction === 'rtl' ? 'right' : 'left',
              textAlignVertical: multiline ? 'top' : 'center',
              writingDirection: direction,
            },
            style,
          ]}
          value={value}
        />
      </FieldSurface>
    </View>
  );
}
