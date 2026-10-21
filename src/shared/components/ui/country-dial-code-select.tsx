import { Select } from 'heroui-native';
import { ScrollView, View } from 'react-native';

import { CountryFlag } from '@/shared/components/ui/country-flag';
import { phoneCountries, type CountryOption } from '@/shared/components/ui/country-select';

/** Exact same HeroUI dialog and trigger as the phone Auth journey. */
export function CountryDialCodeSelect({
  country,
  onCountryChange,
  disabled = false,
}: {
  country: CountryOption;
  onCountryChange: (country: CountryOption) => void;
  disabled?: boolean;
}) {
  return (
    <Select
      value={{ value: country.iso, label: country.dialCode }}
      onValueChange={(choice) => {
        if (!choice || Array.isArray(choice)) return;
        const selected = phoneCountries.find((item) => item.iso === choice.value);
        if (selected) onCountryChange(selected);
      }}
      isDisabled={disabled}
      presentation="dialog"
    >
      <Select.Trigger
        accessibilityLabel={'تغيير الدولة، ' + country.nameAr + '، ' + country.dialCode}
        className="h-14 w-[132px] flex-row items-center justify-center gap-1.5 rounded-form-field border border-border-default bg-surface-default px-2"
      >
        <CountryFlag iso={country.iso} />
        <Select.Value
          placeholder={country.dialCode}
          className="font-ui-semibold text-text-primary"
          style={{ writingDirection: 'ltr' }}
        />
        <Select.TriggerIndicator iconProps={{ size: 14 }} />
      </Select.Trigger>
      <Select.Portal>
        <Select.Overlay />
        <Select.Content
          presentation="dialog"
          classNames={{ content: 'w-[90%] max-w-[420px] rounded-form-field p-5' }}
        >
          <View className="mb-4 flex-row items-center justify-between" style={{ direction: 'rtl' }}>
            <Select.ListLabel className="font-ui-semibold text-text-primary">
              اختر الدولة ورمز الاتصال
            </Select.ListLabel>
            <Select.Close accessibilityLabel="إغلاق قائمة الدول" />
          </View>
          <ScrollView
            className="max-h-[390px]"
            nestedScrollEnabled
            keyboardShouldPersistTaps="always"
          >
            {phoneCountries.map((item) => (
              <Select.Item
                key={item.iso}
                value={item.iso}
                label={item.nameAr + ' · ' + item.dialCode}
              >
                <View className="flex-1 flex-row items-center gap-3" style={{ direction: 'ltr' }}>
                  <CountryFlag iso={item.iso} />
                  <Select.ItemLabel className="flex-1 text-right font-ui-regular" />
                </View>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </ScrollView>
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}
