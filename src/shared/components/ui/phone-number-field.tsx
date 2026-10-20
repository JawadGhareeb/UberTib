import { Input, FieldError, Label, TextField as HeroTextField } from 'heroui-native';
import { View } from 'react-native';
import {
  CountrySelect,
  phoneCountries,
  type CountryOption,
} from '@/shared/components/ui/country-select';
import { AppText } from '@/shared/components/ui/app-text';

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
/** Uses the Auth Input focus/border style for the security phone dialog. */
export function PhoneNumberField({
  country,
  number,
  onCountryChange,
  onNumberChange,
  error,
  disabled = false,
  helperText = false,
}: PhoneNumberFieldProps) {
  return (
    <HeroTextField isInvalid={Boolean(error)} isDisabled={disabled} className="w-full gap-2">
      <Label className="self-end font-ui-semibold text-text-primary">رقم الهاتف</Label>
      <View className="flex-row items-center gap-2" style={{ direction: 'ltr' }}>
        <View className="h-14 justify-center rounded-form-field border border-border-default bg-surface-default px-1">
          <CountrySelect
            value={country}
            onChange={onCountryChange}
            variant="inline"
            disabled={disabled}
          />
        </View>
        <Input
          accessibilityLabel="رقم الهاتف"
          accessibilityHint="أدخل رقم الهاتف بدون رمز الدولة"
          autoComplete="tel"
          keyboardType="phone-pad"
          value={number}
          onChangeText={(value) => onNumberChange(value.replace(/[^0-9]/g, ''))}
          placeholder="9XX XXX XXX"
          variant="secondary"
          className="h-14 min-w-0 flex-1 rounded-form-field border border-border-default bg-surface-default px-4 font-ui-medium text-base text-text-primary focus:border-action-primary"
          placeholderColorClassName="text-text-placeholder"
          selectionColorClassName="text-action-primary"
          style={{ textAlign: 'left', writingDirection: 'ltr' }}
        />
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
