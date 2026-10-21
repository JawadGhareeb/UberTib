import { mockProviders } from '@/features/discovery/mocks/providers.mock';
import {
  matchesDiscoveryFilters,
  matchesSelectedCatalogService,
  selectedDiscoveryAreas,
  type DiscoveryFilterSelection,
} from './discover-filters';

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
 * Text search matches a doctor's name only.
 * Services, specialties, areas and prices are controlled by DiscoverFilterSheet,
 * never by the free-text query.
 */
export function selectDiscoverMatches(query: string, filters: DiscoveryFilterSelection) {
  const term = query.trim();
  const matchingProviders = mockProviders.filter(
    (provider) =>
      matchesDiscoveryFilters(provider, filters, filters.serviceCode ?? undefined) &&
      matchesSelectedCatalogService(provider.serviceCodes, filters) &&
      (!term || matchesDiscoverQuery(term, provider.name)),
  );

  return {
    families: [],
    providers: matchingProviders,
    areas: [],
    hasCriteria: Boolean(
      term ||
      filters.groupCode ||
      filters.serviceCode ||
      selectedDiscoveryAreas(filters).length > 0 ||
      filters.priceRange,
    ),
  };
}
