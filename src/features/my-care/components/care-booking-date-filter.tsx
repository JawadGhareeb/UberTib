import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppIcon, AppText } from '@/shared/components/ui';
import type { BookingAdvancedFilters } from '../model/care-tab-filters';

function toISO(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}
function fromISO(key: string | null): Date {
  if (!key) return new Date();
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year || 2026, (month || 1) - 1, day || 1, 12);
}
function display(key: string | null) {
  return key
    ? fromISO(key).toLocaleDateString('ar', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'اختار التاريخ';
}

export function CareBookingDateFilter({
  value,
  onChange,
}: {
  value: BookingAdvancedFilters;
  onChange: (next: BookingAdvancedFilters) => void;
}) {
  const [active, setActive] = useState<'dateFrom' | 'dateTo' | null>(null);
  const choose = (field: 'dateFrom' | 'dateTo', selected: Date) => {
    const iso = toISO(selected);
    // Keep the two bounds valid even when the user changes the first one.
    onChange({
      ...value,
      [field]: iso,
      ...(field === 'dateFrom' && value.dateTo && iso > value.dateTo ? { dateTo: iso } : {}),
      ...(field === 'dateTo' && value.dateFrom && iso < value.dateFrom ? { dateFrom: iso } : {}),
    });
  };
  return (
    <View className="gap-2">
      <View className="flex-row-reverse items-center justify-between gap-2">
        <AppText align="right" variant="label" className="font-ui-semibold">
          نطاق تاريخ محدد
        </AppText>
        {value.dateFrom || value.dateTo ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="مسح نطاق التاريخ"
            className="min-h-[38px] justify-center"
            onPress={() => onChange({ ...value, dateFrom: null, dateTo: null })}
          >
            <AppText variant="caption" className="text-content-link">
              مسح التاريخ
            </AppText>
          </Pressable>
        ) : null}
      </View>
      <View className="flex-row-reverse gap-2">
        {(['dateFrom', 'dateTo'] as const).map((field) => (
          <Pressable
            key={field}
            accessibilityRole="button"
            accessibilityLabel={
              field === 'dateFrom' ? 'اختيار تاريخ البداية' : 'اختيار تاريخ النهاية'
            }
            className="min-h-[60px] min-w-0 flex-1 items-end justify-center gap-1 rounded-[12px] bg-surface-subtle px-3"
            onPress={() => setActive(field)}
          >
            <AppText align="right" variant="caption" className="text-content-secondary">
              {field === 'dateFrom' ? 'من' : 'إلى'}
            </AppText>
            <View className="flex-row-reverse items-center gap-2">
              <AppIcon
                name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
                tone="action"
                size={16}
              />
              <AppText align="right" variant="label" className="min-w-0 flex-1" numberOfLines={1}>
                {display(value[field])}
              </AppText>
            </View>
          </Pressable>
        ))}
      </View>
      {active ? (
        <DateTimePicker
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          value={fromISO(value[active])}
          onChange={(event, date) => {
            if (event.type === 'set' && date) choose(active, date);
            if (Platform.OS !== 'ios') setActive(null);
          }}
        />
      ) : null}
      {active && Platform.OS === 'ios' ? (
        <Pressable
          className="min-h-[40px] self-end justify-center px-3"
          accessibilityRole="button"
          accessibilityLabel="تأكيد اختيار التاريخ"
          onPress={() => setActive(null)}
        >
          <AppText variant="label" className="text-content-link">
            تم
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
