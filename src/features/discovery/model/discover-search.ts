import { mockAreas, mockProviders } from '@/features/discovery/mocks/providers.mock';
import {
  matchesDiscoveryFilters,
  matchesSelectedCatalogService,
  selectedDiscoveryAreas,
  type DiscoveryFilterSelection,
} from './discover-filters';
import { penServiceGroups } from '@/features/discovery/presentation/pen-discovery-data';

/** Normalize common Arabic spelling variations without altering displayed names. */
export function normalizeDiscoverQuery(input: string): string {
  return input
    .normalize('NFKC')
    .toLocaleLowerCase('ar')
    .replace(/[\u064b-\u065f\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/[،.\/\\\-_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesDiscoverQuery(query: string, ...values: (string | undefined)[]): boolean {
  const terms = normalizeDiscoverQuery(query)
    .split(' ')
    .filter((term) => term.length > 0 && term !== 'في' && term !== 'عن');
  if (terms.length === 0) return true;
  const haystack = normalizeDiscoverQuery(values.filter(Boolean).join(' '));
  return terms.every((term) => haystack.includes(term));
}

/**
 * Search from one source of truth across available service families and doctors.
 * A selected domain narrows both service choices and the associated providers.
 */
export function selectDiscoverMatches(query: string, filters: DiscoveryFilterSelection) {
  const term = query.trim();
  const chosenGroup = filters.groupCode
    ? penServiceGroups.find((group) => group.code === filters.groupCode)
    : undefined;
  // Area-only filter should show matching doctors, not all 26 unrelated service families.
  const matchingFamilies = (
    term || filters.groupCode || filters.serviceCode ? penServiceGroups : []
  )
    .filter((group) => !filters.groupCode || group.code === filters.groupCode)
    .flatMap((group) => group.families)
    .filter(
      (family) =>
        (!filters.serviceCode || family.id === filters.serviceCode) &&
        matchesDiscoverQuery(
          term,
          family.title,
          family.description,
          penServiceGroups.find((group) => group.code === family.groupCode)?.title,
        ),
    );

  const matchingProviders = mockProviders.filter((provider) => {
    if (!matchesDiscoveryFilters(provider, filters, filters.serviceCode ?? undefined)) return false;
    if (!matchesSelectedCatalogService(provider.serviceCodes, filters)) return false;
    if (!term) return true;
    const serviceNames = provider.serviceCodes.flatMap((code) => {
      const service = penServiceGroups
        .flatMap((group) => group.families)
        .find((family) => family.id === code);
      return service ? [service.title, service.description] : [];
    });
    const groupNames = penServiceGroups
      .filter((group) => group.families.some((family) => provider.serviceCodes.includes(family.id)))
      .map((group) => group.title);
    return matchesDiscoverQuery(
      term,
      provider.name,
      provider.specialty,
      provider.branch,
      provider.area,
      ...serviceNames,
      ...groupNames,
    );
  });

  const areas =
    term && !filters.groupCode && !filters.serviceCode
      ? mockAreas.filter((area) => area !== 'كل المناطق' && matchesDiscoverQuery(term, area))
      : [];

  return {
    families: matchingFamilies,
    providers: matchingProviders,
    areas,
    hasCriteria: Boolean(
      term ||
      filters.groupCode ||
      filters.serviceCode ||
      selectedDiscoveryAreas(filters).length > 0 ||
      filters.priceRange,
    ),
    groupTitle: chosenGroup?.title,
  };
}
