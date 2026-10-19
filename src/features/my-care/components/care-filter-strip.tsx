import { Button as HeroButton } from 'heroui-native';
import { ScrollView } from 'react-native';
import { careFilters, type CareFilter } from '../model/overview-items';

export function CareFilterStrip({
  filter,
  onChange,
}: {
  filter: CareFilter;
  onChange: (value: CareFilter) => void;
}) {
  return (
    <ScrollView
      horizontal
      accessibilityRole="tablist"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 4,
      }}
    >
      {careFilters.map((value) => (
        <HeroButton
          key={value}
          size="sm"
          variant={value === filter ? 'primary' : 'outline'}
          className={
            value === filter
              ? 'min-h-[44px] rounded-[12px] bg-action-primary px-3'
              : 'min-h-[44px] rounded-[12px] border-border-default bg-surface-default px-3'
          }
          onPress={() => onChange(value)}
          accessibilityLabel={'تصفية: ' + value}
          accessibilityState={{ selected: value === filter }}
        >
          <HeroButton.Label
            className={
              value === filter
                ? 'font-ui-semibold text-content-on-action'
                : 'font-ui-medium text-content-primary'
            }
          >
            {value}
          </HeroButton.Label>
        </HeroButton>
      ))}
    </ScrollView>
  );
}
