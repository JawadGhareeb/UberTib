import { useRouter } from 'expo-router';
import { Card as HeroCard } from 'heroui-native';
import { Pressable, View } from 'react-native';

import { type MockProvider } from '@/features/discovery/mocks/providers.mock';
import {
  findPenFamily,
  penServiceGroups,
  type PenServiceFamily,
} from '@/features/discovery/presentation/pen-discovery-data';
import { AppIcon, AppText } from '@/shared/components/ui';
import {
  matchingPricedServices,
  selectedDiscoveryAreas,
  type DiscoveryFilterSelection,
} from '../model/discover-filters';
import { selectDiscoverMatches } from '../model/discover-search';
import { DiscoverSearchIllustration } from './discover-search-illustration';

export function DiscoverSearchResults({
  query,
  filters,
  onChooseFamily,
  onChooseArea,
}: {
  query: string;
  filters: DiscoveryFilterSelection;
  onChooseFamily: (family: PenServiceFamily) => void;
  onChooseArea: (area: string) => void;
}) {
  const router = useRouter();
  const matches = selectDiscoverMatches(query, filters);

  if (!matches.hasCriteria) return <DiscoverSearchIllustration />;

  const hasResults =
    matches.families.length > 0 || matches.providers.length > 0 || matches.areas.length > 0;
  if (!hasResults) return <DiscoverSearchIllustration empty />;

  return (
    <View className="gap-3">
      <View className="items-end gap-1">
        <AppText align="right" variant="heading-4">
          النتائج المناسبة
        </AppText>
        <AppText align="right" variant="caption" className="text-content-secondary">
          {matches.providers.length} أطباء · {matches.families.length} أقسام خدمات
        </AppText>
      </View>

      {matches.families.length && !filters.serviceCode ? (
        <View className="gap-2">
          <AppText variant="label" align="right" className="font-ui-semibold">
            الخدمات
          </AppText>
          {matches.families.map((family) => (
            <Pressable
              key={family.id}
              accessibilityRole="button"
              accessibilityLabel={'اختيار خدمة ' + family.title}
              className="min-h-[59px] flex-row-reverse items-center gap-2.5 rounded-[13px] border border-border-subtle bg-surface-default px-3 py-2"
              onPress={() => onChooseFamily(family)}
            >
              <View className="h-9 w-9 items-center justify-center rounded-[11px] bg-action-subtle">
                <AppIcon
                  name={{
                    ios: 'stethoscope',
                    android: 'medical_services',
                    web: 'medical_services',
                  }}
                  size={18}
                  tone="action"
                />
              </View>
              <View className="min-w-0 flex-1 items-end gap-0.5">
                <AppText align="right" variant="label" className="font-ui-semibold">
                  {family.title}
                </AppText>
                <AppText
                  align="right"
                  variant="caption"
                  className="text-content-secondary"
                  numberOfLines={1}
                >
                  {penServiceGroups.find((group) => group.code === family.groupCode)?.title}
                </AppText>
              </View>
              <AppIcon
                name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                size={17}
                tone="secondary"
              />
            </Pressable>
          ))}
        </View>
      ) : null}

      {matches.providers.length ? (
        <View className="gap-2">
          <AppText align="right" variant="label" className="font-ui-semibold">
            الأطباء
          </AppText>
          {matches.providers.map((doctor) => (
            <ProviderSearchRow key={doctor.id} provider={doctor} filters={filters} />
          ))}
          {filters.serviceCode ? (
            <Pressable
              accessibilityRole="button"
              className="min-h-[46px] items-center justify-center rounded-[12px] border border-action-primary bg-action-subtle px-3"
              onPress={() =>
                router.push({
                  pathname: '/discover/providers/results',
                  params: {
                    serviceCode: filters.serviceCode!,
                    area: filters.area,
                    areas: selectedDiscoveryAreas(filters).join('|'),
                    ...(filters.priceRange
                      ? {
                          minPrice: String(filters.priceRange[0]),
                          maxPrice: String(filters.priceRange[1]),
                        }
                      : {}),
                  },
                })
              }
            >
              <AppText variant="label" className="font-ui-semibold text-content-link">
                عرض الأطباء ومقارنتهم
              </AppText>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {matches.areas.length ? (
        <View className="gap-2">
          <AppText align="right" variant="label" className="font-ui-semibold">
            المناطق
          </AppText>
          {matches.areas.map((area) => (
            <Pressable
              key={area}
              accessibilityRole="button"
              accessibilityLabel={'البحث ضمن ' + area}
              className="min-h-[52px] flex-row-reverse items-center gap-2 rounded-[13px] border border-border-subtle bg-surface-default px-3"
              onPress={() => onChooseArea(area)}
            >
              <AppIcon
                name={{ ios: 'mappin', android: 'place', web: 'place' }}
                size={20}
                tone="action"
              />
              <AppText className="min-w-0 flex-1" align="right" variant="label">
                {area}
              </AppText>
              <AppIcon
                name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                size={16}
                tone="secondary"
              />
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function ProviderSearchRow({
  provider,
  filters,
}: {
  provider: MockProvider;
  filters: DiscoveryFilterSelection;
}) {
  const router = useRouter();
  // For a price-only search, show the service whose real price matched the
  // selected range, not an unrelated first service from this doctor's list.
  const selectedServiceCode = matchingPricedServices(provider, filters)[0];
  const service = findPenFamily(selectedServiceCode);
  const price = selectedServiceCode ? provider.prices[selectedServiceCode] : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'ملف الطبيب ' + provider.name}
      onPress={() =>
        router.push({
          pathname: '/discover/provider/[providerId]',
          params: { providerId: provider.id, serviceCode: selectedServiceCode ?? 'dental-checkup' },
        })
      }
    >
      <HeroCard
        variant="default"
        className="gap-2 rounded-[14px] border border-border-subtle bg-surface-default p-3"
      >
        <View className="flex-row-reverse items-center gap-2.5">
          <View className="h-11 w-11 shrink-0 items-center justify-center rounded-full bg-action-subtle">
            <AppText align="center" className="font-ui-semibold text-content-link" variant="label">
              {provider.initials}
            </AppText>
          </View>
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" variant="body-strong" numberOfLines={1}>
              {provider.name}
            </AppText>
            <AppText
              align="right"
              variant="caption"
              className="text-content-secondary"
              numberOfLines={1}
            >
              {provider.specialty} · {provider.area}
            </AppText>
          </View>
          <AppIcon
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            size={18}
            tone="secondary"
          />
        </View>
        {service && price ? (
          <View className="flex-row-reverse items-center justify-between gap-2">
            <AppText
              align="right"
              variant="caption"
              className="min-w-0 flex-1 text-content-secondary"
              numberOfLines={1}
            >
              {service.title}
            </AppText>
            <AppText variant="caption" className="font-ui-semibold" numberOfLines={1}>
              {price.displayLabel}
            </AppText>
          </View>
        ) : null}
      </HeroCard>
    </Pressable>
  );
}
