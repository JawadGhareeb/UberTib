import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { useAppDirection } from '@/shared/utils/app-direction';
import { AppIcon } from '@/shared/components/ui/app-icon';
import { AppText } from '@/shared/components/ui/app-text';
import { SelectField } from '@/shared/components/ui/select-field';
import { TextField } from '@/shared/components/ui/text-field';
import { cn } from '@/shared/utils/cn';

export interface CountryOption {
  iso: string;
  nameAr: string;
  nameEn: string;
  dialCode: string;
}

export const phoneCountries: CountryOption[] = [
  { iso: 'SY', nameAr: 'سوريا', nameEn: 'Syria', dialCode: '+963' },
  { iso: 'SA', nameAr: 'السعودية', nameEn: 'Saudi Arabia', dialCode: '+966' },
  { iso: 'AE', nameAr: 'الإمارات', nameEn: 'United Arab Emirates', dialCode: '+971' },
  { iso: 'IQ', nameAr: 'العراق', nameEn: 'Iraq', dialCode: '+964' },
  { iso: 'JO', nameAr: 'الأردن', nameEn: 'Jordan', dialCode: '+962' },
  { iso: 'LB', nameAr: 'لبنان', nameEn: 'Lebanon', dialCode: '+961' },
  { iso: 'EG', nameAr: 'مصر', nameEn: 'Egypt', dialCode: '+20' },
  { iso: 'QA', nameAr: 'قطر', nameEn: 'Qatar', dialCode: '+974' },
  { iso: 'KW', nameAr: 'الكويت', nameEn: 'Kuwait', dialCode: '+965' },
  { iso: 'BH', nameAr: 'البحرين', nameEn: 'Bahrain', dialCode: '+973' },
  { iso: 'OM', nameAr: 'عُمان', nameEn: 'Oman', dialCode: '+968' },
  { iso: 'TR', nameAr: 'تركيا', nameEn: 'Turkey', dialCode: '+90' },
  { iso: 'US', nameAr: 'الولايات المتحدة', nameEn: 'United States', dialCode: '+1' },
];

interface CountrySelectProps {
  value: CountryOption;
  onChange: (country: CountryOption) => void;
  variant?: 'standalone' | 'inline';
  disabled?: boolean;
}

export function CountrySelect({
  value,
  onChange,
  variant = 'standalone',
  disabled = false,
}: CountrySelectProps) {
  const { rowClassName } = useAppDirection();
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

  const filteredCountries = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return phoneCountries;
    }

    return phoneCountries.filter((country) =>
      [country.nameAr, country.nameEn, country.iso, country.dialCode]
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  const chooseCountry = (country: CountryOption) => {
    onChange(country);
    setVisible(false);
    setQuery('');
  };

  const inline = variant === 'inline';

  return (
    <>
      {inline ? (
        <Pressable
          accessibilityHint="يفتح قائمة الدول ورموز الاتصال"
          accessibilityLabel={`الدولة ${value.nameAr}، رمز الاتصال ${value.dialCode}`}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          className="min-h-[44px] flex-row items-center justify-center gap-1.5 rounded-[10px] px-2"
          disabled={disabled}
          onPress={() => setVisible(true)}
        >
          <AppText direction="ltr" variant="body-strong">
            {value.dialCode}
          </AppText>
          <AppIcon
            name={{
              ios: 'chevron.down',
              android: 'keyboard_arrow_down',
              web: 'keyboard_arrow_down',
            }}
            size={14}
            tone="action"
          />
        </Pressable>
      ) : (
        <SelectField
          disabled={disabled}
          icon={{ ios: 'globe', android: 'public', web: 'public' }}
          label="الدولة"
          onPress={() => setVisible(true)}
          placeholder="اختر الدولة"
          value={`${value.nameAr} · ${value.dialCode}`}
        />
      )}

      <Modal
        animationType="slide"
        onRequestClose={() => setVisible(false)}
        transparent
        visible={visible}
      >
        <View className="flex-1 justify-end">
          <Pressable
            accessibilityLabel="إغلاق قائمة الدول"
            className="absolute inset-0 bg-surface-scrim/60"
            onPress={() => setVisible(false)}
          />

          <View className="max-h-[78%] rounded-t-[24px] border-t border-border-subtle bg-surface-canvas px-5 pb-8 pt-5">
            <View className="mb-5 gap-2">
              <AppText variant="heading-3">اختر الدولة</AppText>
              <AppText className="text-content-secondary" variant="caption">
                رقم الهاتف يبقى بالأرقام الغربية واتجاهه من اليسار إلى اليمين.
              </AppText>
            </View>

            <TextField
              autoCorrect={false}
              clearable
              icon={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
              label="البحث عن دولة"
              onChangeText={setQuery}
              placeholder="اسم الدولة أو رمز الاتصال"
              value={query}
            />

            <ScrollView className="mt-4" keyboardShouldPersistTaps="handled">
              {filteredCountries.map((country) => {
                const selected = country.iso === value.iso;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    className={cn(
                      'min-h-control items-center justify-between border-b border-border-subtle py-3',
                      rowClassName,
                    )}
                    key={country.iso}
                    onPress={() => chooseCountry(country)}
                  >
                    <View className="flex-1">
                      <AppText variant={selected ? 'body-strong' : 'body'}>
                        {country.nameAr}
                      </AppText>
                      <AppText className="text-content-secondary" direction="ltr" variant="caption">
                        {country.iso}
                      </AppText>
                    </View>
                    <AppText
                      className="text-content-secondary"
                      direction="ltr"
                      variant="body-strong"
                    >
                      {country.dialCode}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
