import { AppIcon, type AppIconName } from '@/shared/components/ui/app-icon';
import { AppText } from '@/shared/components/ui/app-text';
import { FieldSurface } from '@/shared/components/ui/field-surface';

interface SelectFieldProps {
  label: string;
  value?: string;
  placeholder: string;
  direction?: 'rtl' | 'ltr';
  error?: string;
  helperText?: string;
  icon?: AppIconName;
  disabled?: boolean;
  onPress: () => void;
}

/** Date/location/country triggers share the same field frame and tap target. */
export function SelectField({
  label,
  value,
  placeholder,
  direction = 'rtl',
  error,
  helperText,
  icon,
  disabled,
  onPress,
}: SelectFieldProps) {
  return (
    <FieldSurface
      accessory={
        <AppIcon
          name={{ ios: 'chevron.down', android: 'keyboard_arrow_down', web: 'keyboard_arrow_down' }}
          size={17}
          tone="action"
        />
      }
      disabled={disabled}
      error={error}
      helperText={helperText}
      icon={icon}
      label={label}
      onPress={onPress}
      selectionValue={value}
    >
      <AppText
        align="right"
        className={value ? 'font-ui-medium text-content-primary' : 'text-content-placeholder'}
        direction={value ? direction : 'rtl'}
        numberOfLines={1}
        variant="body"
      >
        {value || placeholder}
      </AppText>
    </FieldSurface>
  );
}
