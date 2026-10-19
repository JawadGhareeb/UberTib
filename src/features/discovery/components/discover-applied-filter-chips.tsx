import { findPenFamily, findPenGroup } from '@/features/discovery/presentation/pen-discovery-data';
import {
  AppliedFilterChips,
  type AppliedFilterItem,
} from '@/shared/components/filters/applied-filter-chips';
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
  const chips: AppliedFilterItem[] = [];

  const areas = selectedDiscoveryAreas(selection);
  areas.forEach((area) =>
    chips.push({
      key: 'area-' + area,
      label: area,
      onRemove: () =>
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
      onRemove: () =>
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
      onRemove: () => onChange({ ...selection, serviceCode: null, priceRange: null }),
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
      onRemove: () => onChange({ ...selection, priceRange: null }),
    });
  }

  return <AppliedFilterChips items={chips} />;
}
