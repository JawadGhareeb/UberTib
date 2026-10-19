import { Pressable, View } from 'react-native';

import { AppIcon, AppText } from '@/shared/components/ui';
import type { CareMainTab } from '../model/care-tab-filters';

const items = [
  {
    key: 'cases',
    label: 'حالاتي العلاجية',
    icon: { ios: 'heart.text.square', android: 'medical_services', web: 'medical_services' },
  },
  {
    key: 'bookings',
    label: 'حجوزاتي',
    icon: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  },
] as const;

/** Tabs and the single filter affordance share one balanced horizontal row. */
export function CareMainTabs({
  selected,
  onChange,
  onOpenFilters,
  filtersActive,
}: {
  selected: CareMainTab;
  onChange: (tab: CareMainTab) => void;
  onOpenFilters: () => void;
  filtersActive: boolean;
}) {
  return (
    <View className="mx-4 flex-row-reverse items-center gap-2">
      <View
        className="min-w-0 flex-1 flex-row-reverse gap-1 rounded-[15px] bg-surface-subtle p-1"
        accessibilityRole="tablist"
      >
        {items.map((item) => {
          const active = selected === item.key;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={item.label}
              onPress={() => onChange(item.key)}
              className={
                'min-h-[48px] min-w-0 flex-1 flex-row-reverse items-center justify-center gap-1.5 rounded-[11px] px-1.5 ' +
                (active ? 'border border-border-subtle bg-surface-default' : '')
              }
            >
              <AppIcon name={item.icon} size={17} tone={active ? 'action' : 'secondary'} />
              <AppText
                variant="label"
                align="center"
                className={active ? 'font-ui-semibold text-content-link' : 'text-content-secondary'}
                numberOfLines={1}
              >
                {item.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="تصفية السجلات"
        accessibilityHint="عرض فلاتر الحالة أو الحجز داخل النافذة"
        onPress={onOpenFilters}
        className={
          'h-[56px] w-[53px] shrink-0 items-center justify-center rounded-[13px] border ' +
          (filtersActive
            ? 'border-action-primary bg-action-subtle'
            : 'border-border-subtle bg-surface-default')
        }
      >
        <AppIcon
          name={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }}
          size={22}
          tone="action"
        />
        {filtersActive ? (
          <View className="absolute right-2 top-2 h-[6px] w-[6px] rounded-full bg-action-primary" />
        ) : null}
      </Pressable>
    </View>
  );
}
