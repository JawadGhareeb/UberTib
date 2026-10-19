import { penServiceGroups } from '@/features/discovery/presentation/pen-discovery-data';
import {
  mockAreas,
  mockProviders,
  type MockProvider,
  type MockProviderPriceFact,
} from '@/features/discovery/mocks/providers.mock';

export type PriceRange = [number, number];
export type DiscoveryFilterSelection = {
  /** Legacy single-area value is retained for existing result routes. */
  area: string;
  /** Empty or absent means all areas; otherwise matches any chosen area. */
  areas?: string[];
  priceRange: PriceRange | null;
  groupCode?: string | null;
  serviceCode?: string | null;
};
export const discoverAreas: readonly string[] = mockAreas;
const allCatalogServiceCodes = new Set(
  penServiceGroups.flatMap((group) => group.families.map((family) => family.id)),
);

export function selectedDiscoveryAreas(filters: DiscoveryFilterSelection): string[] {
  if (filters.areas)
    return filters.areas.filter(
      (area) => area !== 'كل المناطق' && mockAreas.includes(area as (typeof mockAreas)[number]),
    );
  return filters.area === 'كل المناطق' ? [] : [filters.area];
}

export function withSelectedDiscoveryAreas(
  filters: DiscoveryFilterSelection,
  areas: string[],
): DiscoveryFilterSelection {
  const chosen = [...new Set(areas)].filter(
    (area) => area !== 'كل المناطق' && mockAreas.includes(area as (typeof mockAreas)[number]),
  );
  return {
    ...filters,
    areas: chosen,
    area: chosen.length === 1 ? (chosen[0] ?? 'كل المناطق') : 'كل المناطق',
  };
}

function pricedInterval(fact?: MockProviderPriceFact): PriceRange | null {
  if (!fact || fact.mode === 'requires-plan') return null;
  if (fact.mode === 'free') return [0, 0];
  if (fact.mode === 'fixed' && fact.amount !== undefined) return [fact.amount, fact.amount];
  if (fact.mode === 'range' && fact.amount_min !== undefined && fact.amount_max !== undefined) {
    return [fact.amount_min, fact.amount_max];
  }
  return null;
}

export function allowedDiscoveryServices(
  provider: MockProvider,
  filters: DiscoveryFilterSelection,
  explicitServiceCode?: string,
): string[] {
  const serviceCode = explicitServiceCode ?? filters.serviceCode;
  if (serviceCode) return provider.serviceCodes.includes(serviceCode) ? [serviceCode] : [];
  let candidates = provider.serviceCodes.filter((code) => allCatalogServiceCodes.has(code));
  if (filters.groupCode) {
    const group = penServiceGroups.find((item) => item.code === filters.groupCode);
    if (!group) return [];
    const familyCodes = new Set(group.families.map((family) => family.id));
    candidates = candidates.filter((code) => familyCodes.has(code));
  }
  return candidates;
}

/** Minimum and maximum real numeric facts in the selected service, group, or entire catalog. */
export function priceLimitsForSelection(filters: DiscoveryFilterSelection): PriceRange | null {
  const values = mockProviders.flatMap((provider) =>
    allowedDiscoveryServices(provider, filters).flatMap((code) => {
      const interval = pricedInterval(provider.prices[code]);
      return interval ? [interval[0], interval[1]] : [];
    }),
  );
  if (!values.length) return null;
  const min = Math.max(0, Math.floor(Math.min(...values) / 50) * 50);
  const max = Math.ceil(Math.max(...values) / 50) * 50;
  return [min, Math.max(min + 50, max)];
}

export function priceLimitsForService(serviceCode?: string): PriceRange | null {
  return serviceCode
    ? priceLimitsForSelection({ area: 'كل المناطق', serviceCode, priceRange: null })
    : null;
}

/** Given a numeric filter, return only services with an actual overlapping listed price. */
export function matchingPricedServices(
  provider: MockProvider,
  filters: DiscoveryFilterSelection,
  explicitServiceCode?: string,
): string[] {
  const eligible = allowedDiscoveryServices(provider, filters, explicitServiceCode);
  if (!filters.priceRange) return eligible;
  return eligible.filter((code) => {
    const actual = pricedInterval(provider.prices[code]);
    return (
      actual !== null && actual[0] <= filters.priceRange![1] && actual[1] >= filters.priceRange![0]
    );
  });
}

export function matchesDiscoveryFilters(
  provider: MockProvider,
  filters: DiscoveryFilterSelection,
  serviceCode?: string,
): boolean {
  const areas = selectedDiscoveryAreas(filters);
  if (areas.length && !areas.includes(provider.area)) return false;
  return matchingPricedServices(provider, filters, serviceCode).length > 0;
}

/** Only services explicitly present in the catalog may scope search results. */
export function matchesSelectedCatalogService(
  offeredServiceCodes: readonly string[],
  filters: DiscoveryFilterSelection,
): boolean {
  if (filters.serviceCode) return offeredServiceCodes.includes(filters.serviceCode);
  if (!filters.groupCode) return true;
  const group = penServiceGroups.find((item) => item.code === filters.groupCode);
  return group ? group.families.some((family) => offeredServiceCodes.includes(family.id)) : false;
}
