import { Chip } from 'heroui-native';
import { View } from 'react-native';

import { AppText } from '@/shared/components/ui';
import {
  providerSortChoices,
  type ProviderResultSort,
} from '@/features/discovery/utils/provider-sort';

/** Same HeroUI Chip choice pattern as the Discover and My Care filter sheets. */
export function ProviderSortOptions({
  value,
  onChange,
}: {
  value: ProviderResultSort;
  onChange: (value: ProviderResultSort) => void;
}) {
  return (
    <View className="gap-2">
      <AppText align="right" variant="heading-4" className="font-ui-semibold">
        الترتيب حسب
      </AppText>
      <View className="flex-row-reverse flex-wrap gap-2">
        {providerSortChoices.map((choice) => {
          const selected = value === choice.value;
          return (
            <Chip
              key={choice.value}
              color={selected ? 'accent' : 'default'}
              variant={selected ? 'primary' : 'soft'}
              size="lg"
              accessibilityRole="radio"
              accessibilityLabel={choice.label}
              accessibilityState={{ checked: selected }}
              className="min-h-[44px]"
              onPress={() => onChange(choice.value)}
            >
              <Chip.Label>{choice.label}</Chip.Label>
            </Chip>
          );
        })}
      </View>
      <AppText align="right" variant="caption" className="text-content-secondary">
        ترتيب السعر يعتمد على الأسعار المعروضة للخدمة، والخدمات التي تحتاج تسعيراً بعد الفحص تظهر
        أخيراً.
      </AppText>
    </View>
  );
}
