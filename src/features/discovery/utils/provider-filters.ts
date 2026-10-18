import type { MockProvider } from '@/features/discovery/mocks/providers.mock';

export type ProviderFilterKey =
  | 'area'
  | 'soonest'
  | 'price'
  | 'rating'
  | 'branch'
  | 'payment';

export type ProviderFilterFlags = Record<ProviderFilterKey, boolean>;

// Date-sensitive filters are always opt-in. Demo appointment dates can be historical,
// so turning on "next seven days" by default incorrectly hides every listed doctor.
export const defaultProviderFilters: ProviderFilterFlags = {
  area: false,
  soonest: false,
  price: false,
  rating: false,
  branch: false,
  payment: false,
};

/**
 * Mock-only branch/payment facets.
 * These represent fixture values for UX testing, never confirmed live
 * provider capability, payment acceptance or bookable availability.
 */
const demoFacets: Record<string, { branchReady: boolean; shamCash: boolean }> = {
  'provider-layan': { branchReady: true, shamCash: false },
  'provider-omar': { branchReady: true, shamCash: true },
  'provider-karim': { branchReady: true, shamCash: true },
  'provider-rima': { branchReady: false, shamCash: true },
  'provider-rama': { branchReady: true, shamCash: false },
  'provider-yazan': { branchReady: false, shamCash: false },
};

function nextAvailabilityTime(provider: MockProvider, today: Date): number {
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const options = provider.availability
    .filter((date) => date.slots.length > 0)
    .map((date) => new Date(`${date.dateKey}T12:00:00`).getTime())
    .filter((time) => Number.isFinite(time) && time >= startOfToday);
  return options.length ? Math.min(...options) : Number.POSITIVE_INFINITY;
}

export function filterMockProviders(
  providers: MockProvider[],
  serviceCode: string,
  area: string,
  filters: ProviderFilterFlags,
  today: Date = new Date(),
): MockProvider[] {
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const oneWeekLater = todayStart + 7 * 24 * 60 * 60 * 1000;

  return providers
    .filter((provider) => {
      if (!provider.serviceCodes.includes(serviceCode)) return false;
      if (filters.area && area !== 'كل المناطق' && provider.area !== area) return false;
      if (filters.soonest && nextAvailabilityTime(provider, today) >= oneWeekLater) return false;
      if (filters.price && (!provider.prices[serviceCode] || provider.prices[serviceCode].mode === 'requires-plan')) return false;
      if (filters.rating && (provider.rating < 4.5 || provider.reviews === 0)) return false;
      if (filters.branch && !demoFacets[provider.id]?.branchReady) return false;
      if (filters.payment && !demoFacets[provider.id]?.shamCash) return false;
      return true;
    })
    .sort((a, b) =>
      filters.soonest
        ? nextAvailabilityTime(a, today) - nextAvailabilityTime(b, today)
        : 0,
    );
}
