import { Tabs } from 'heroui-native';
import { View } from 'react-native';

import {
  doctorGradeTabs,
  type DoctorGradeTab,
} from '@/features/discovery/model/doctor-classification';

/** Each HeroUI tab represents a named Arabic classification in one category. */
export function DoctorGradeTabs({
  value,
  onChange,
}: {
  value: DoctorGradeTab;
  onChange: (value: DoctorGradeTab) => void;
}) {
  return (
    <View className="gap-2">
      <Tabs
        value={value}
        onValueChange={(next) => onChange(next as DoctorGradeTab)}
        variant="primary"
        animation="disable-all"
      >
        <Tabs.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollAlign="none"
          contentContainerStyle={{ flexDirection: 'row-reverse', paddingVertical: 3 }}
        >
          <Tabs.List className="flex-row-reverse gap-1 rounded-[12px] bg-surface-subtle p-1">
            <Tabs.Indicator className="rounded-[10px] bg-action-primary" />
            {doctorGradeTabs.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                accessibilityLabel={tab.label}
                accessibilityState={{ selected: value === tab.value }}
                className={
                  'min-h-[42px] items-center justify-center rounded-[10px] px-3 ' +
                  (value === tab.value
                    ? 'bg-action-primary'
                    : 'border border-border-subtle bg-surface-default')
                }
              >
                <Tabs.Label
                  className={
                    'font-ui-semibold text-type-caption ' +
                    (value === tab.value ? 'text-content-on-action' : 'text-content-primary')
                  }
                >
                  {tab.label}
                </Tabs.Label>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.ScrollView>
      </Tabs>
    </View>
  );
}
