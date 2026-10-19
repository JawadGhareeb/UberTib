import { Chip } from 'heroui-native';
import { View } from 'react-native';

import { findPenFamily, findPenGroup } from '@/features/discovery/presentation/pen-discovery-data';
import { AppIcon } from '@/shared/components/ui';
import {
  selectedDiscoveryAreas,
  withSelectedDiscoveryAreas,
  type DiscoveryFilterSelection,
} from '../model/discover-filters';

export function DiscoverAppliedFilterChips({
  selection,
  onChange,
}: {
  selection: DiscoveryFilterSelection;
  onChange: (selection: DiscoveryFilterSelection) => void;
}) {
  const chips: { key: string; label: string; clear: () => void }[] = [];

  const areas = selectedDiscoveryAreas(selection);
  areas.forEach((area) =>
    chips.push({
      key: 'area-' + area,
      label: area,
      clear: () =>
        onChange(
          withSelectedDiscoveryAreas(
            selection,
            areas.filter((item) => item !== area),
          ),
        ),
    }),
  );

  if (selection.groupCode) {
    chips.push({
      key: 'group',
      label: findPenGroup(selection.groupCode)?.title ?? 'المجال',
      clear: () =>
        onChange({
          ...selection,
          groupCode: null,
          serviceCode: null,
          priceRange: null,
        }),
    });
  }

  if (selection.serviceCode) {
    chips.push({
      key: 'service',
      label: findPenFamily(selection.serviceCode)?.title ?? 'الخدمة',
      clear: () => onChange({ ...selection, serviceCode: null, priceRange: null }),
    });
  }

  if (selection.priceRange) {
    chips.push({
      key: 'price',
      label:
        selection.priceRange[0].toLocaleString('en-US') +
        ' – ' +
        selection.priceRange[1].toLocaleString('en-US') +
        ' ل.س',
      clear: () => onChange({ ...selection, priceRange: null }),
    });
  }

  if (!chips.length) return null;

  return (
    <View className="flex-row-reverse flex-wrap gap-2" accessibilityLabel="الفلاتر المختارة">
      {chips.map((item) => (
        <Chip
          key={item.key}
          variant="soft"
          color="accent"
          size="md"
          accessibilityRole="button"
          accessibilityLabel={'إزالة فلتر ' + item.label}
          onPress={item.clear}
          className="min-h-[34px] flex-row-reverse items-center gap-1.5"
        >
          <Chip.Label>{item.label}</Chip.Label>
          <AppIcon
            name={{ ios: 'xmark', android: 'close', web: 'close' }}
            size={13}
            tone="action"
          />
        </Chip>
      ))}
    </View>
  );
}
