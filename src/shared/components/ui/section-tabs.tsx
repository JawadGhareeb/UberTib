import { Tabs } from 'heroui-native';
import { View } from 'react-native';

import { AppIcon, AppText } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';

export interface SectionTabOption<T extends string> {
  value: T;
  label: string;
  icon?: AppIconName;
  count?: number;
}

/** In-page selection only. Expo Router's bottom navigation stays separate. */
export function SectionTabs<T extends string>({
  items,
  value,
  onValueChange,
  stacked = false,
  solidActive = false,
}: {
  items: readonly SectionTabOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  stacked?: boolean;
  solidActive?: boolean;
}) {
  return (
    <Tabs value={value} onValueChange={(next) => onValueChange(next as T)} variant="primary">
      <Tabs.List className="rounded-[15px] bg-surface-subtle p-1" style={{ direction: 'rtl' }}>
        <Tabs.Indicator
          className={solidActive ? 'rounded-[11px] bg-action-primary' : 'rounded-[11px]'}
        />
        {items.map((item) => (
          <Tabs.Trigger
            key={item.value}
            value={item.value}
            className="min-h-[46px] min-w-0 flex-1 items-center justify-center px-1"
          >
            <View
              className={
                stacked
                  ? 'items-center gap-1'
                  : 'flex-row-reverse items-center justify-center gap-1'
              }
            >
              {item.icon ? (
                <AppIcon
                  name={item.icon}
                  tone={value === item.value ? (solidActive ? 'onAction' : 'action') : 'secondary'}
                  size={16}
                />
              ) : null}
              <Tabs.Label
                numberOfLines={1}
                className={
                  solidActive
                    ? value === item.value
                      ? 'text-center font-ui-semibold text-content-on-action'
                      : 'text-center font-ui-semibold text-content-primary'
                    : 'text-center font-ui-semibold'
                }
              >
                {item.label}
              </Tabs.Label>
              {item.count ? (
                <View className="min-w-[20px] items-center justify-center rounded-full bg-action-subtle px-1">
                  <AppText variant="caption" className="text-content-link">
                    {item.count}
                  </AppText>
                </View>
              ) : null}
            </View>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
