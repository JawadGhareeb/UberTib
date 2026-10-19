import { useState } from 'react';
import { TextInput, View } from 'react-native';

import {
  CountrySelect,
  phoneCountries,
  type CountryOption,
} from '@/shared/components/ui/country-select';
import { FieldSurface } from '@/shared/components/ui/field-surface';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { cn } from '@/shared/utils/cn';

interface PhoneNumberFieldProps {
  country: CountryOption;
  number: string;
  onCountryChange: (country: CountryOption) => void;
  onNumberChange: (number: string) => void;
  error?: string;
  disabled?: boolean;
  helperText?: string | false;
}

export const defaultPhoneCountry: CountryOption = phoneCountries[0]!;

export function toE164(country: CountryOption, number: string): string {
  const nationalNumber = number.replace(/\D/g, '').replace(/^0+/, '');
  return `${country.dialCode}${nationalNumber}`;
}

export function PhoneNumberField({
  country,
  number,
  onCountryChange,
  onNumberChange,
  error,
  disabled = false,
  helperText = false,
}: PhoneNumberFieldProps) {
  const { colors } = useAppTheme();
  const [focused, setFocused] = useState(false);

  return (
    <FieldSurface
      disabled={disabled}
      error={error}
      focused={focused}
      helperText={helperText || undefined}
      label="رقم الهاتف"
    >
      <View className="min-h-[44px] flex-row items-center" style={{ direction: 'ltr' }}>
        <CountrySelect
          disabled={disabled}
          onChange={onCountryChange}
          value={country}
          variant="inline"
        />
        <View className="mx-2 h-6 w-px bg-border-subtle" />
        <TextInput
          accessibilityHint="أدخل رقم الهاتف بدون رمز الدولة"
          accessibilityLabel="رقم الهاتف"
          accessibilityState={{ disabled }}
          autoComplete="tel"
          className={cn(
            'min-h-[44px] min-w-0 flex-1 bg-transparent p-0 font-ui-regular text-type-body text-content-primary',
            disabled && 'text-content-disabled',
          )}
          editable={!disabled}
          keyboardType="phone-pad"
          onBlur={() => setFocused(false)}
          onChangeText={(value) => onNumberChange(value.replace(/[^0-9]/g, ''))}
          onFocus={() => setFocused(true)}
          placeholder="9XX XXX XXX"
          placeholderTextColor={colors.text.placeholder}
          style={{ letterSpacing: 0, textAlign: 'left', writingDirection: 'ltr' }}
          value={number}
        />
      </View>
    </FieldSurface>
  );
}
