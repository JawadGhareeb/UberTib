import { create } from 'zustand';
import { registerSessionStore } from '@/shared/state/session-stores';
import {
  toggleCatalogComparison,
  type CatalogComparisonSelection,
} from '@/features/discovery/model/catalog-comparison';
import {
  defaultProviderFilters,
  type ProviderFilterFlags,
  type ProviderFilterKey,
} from '@/features/discovery/utils/provider-filters';

export type ProviderSortMode = 'soonest' | 'rating';

export interface DiscoveryServiceState {
  area: string;
  sort: ProviderSortMode;
  scrollY: number;
  comparisonProviderIds: string[];
  filters: ProviderFilterFlags;
  filtersApplied: boolean;
}

interface DiscoverySessionContextValue {
  catalogQuery: string;
  setCatalogQuery: (query: string) => void;
  catalogComparison: CatalogComparisonSelection | null;
  doctorBrowseComparison: CatalogComparisonSelection | null;
  toggleDoctorBrowseComparisonProvider: (
    providerId: string,
    serviceCode: string | null,
    services: readonly string[],
  ) => void;
  setDoctorBrowseComparison: (selection: CatalogComparisonSelection | null) => void;
  toggleCatalogComparisonProvider: (
    providerId: string,
    serviceCode: string | null,
    services: readonly string[],
  ) => void;
  setCatalogComparison: (selection: CatalogComparisonSelection | null) => void;
  getServiceState: (serviceCode?: string) => DiscoveryServiceState;
  setProviderArea: (serviceCode: string, area: string) => void;
  setProviderFilter: (serviceCode: string, key: ProviderFilterKey, enabled: boolean) => void;
  resetProviderFilters: (serviceCode: string) => void;
  applyProviderFilters: (serviceCode: string) => void;
  setProviderSort: (serviceCode: string, sort: ProviderSortMode) => void;
  setProviderScrollY: (serviceCode: string, scrollY: number) => void;
  toggleComparisonProvider: (serviceCode: string, providerId: string) => void;
  setComparisonProviders: (serviceCode: string, providerIds: string[]) => void;
}

const defaultServiceState: DiscoveryServiceState = {
  area: 'كل المناطق',
  sort: 'soonest',
  scrollY: 0,
  comparisonProviderIds: [],
  filters: defaultProviderFilters,
  filtersApplied: false,
};

// Search results start unfiltered and comparison starts empty; the user makes the choice.
function initialServiceState(_serviceCode?: string): DiscoveryServiceState {
  return defaultServiceState;
}

interface DiscoveryStore extends DiscoverySessionContextValue {
  serviceStates: Record<string, DiscoveryServiceState>;
}

export const useDiscoverySession = create<DiscoveryStore>()((set, get) => {
  const updateServiceState = (serviceCode: string, update: Partial<DiscoveryServiceState>) =>
    set(({ serviceStates }) => ({
      serviceStates: {
        ...serviceStates,
        [serviceCode]: {
          ...initialServiceState(serviceCode),
          ...serviceStates[serviceCode],
          ...update,
        },
      },
    }));

  return {
    catalogQuery: '',
    setCatalogQuery: (catalogQuery) => set({ catalogQuery }),
    catalogComparison: null,
    doctorBrowseComparison: null,
    toggleDoctorBrowseComparisonProvider: (providerId, serviceCode, services) =>
      set(({ doctorBrowseComparison }) => ({
        doctorBrowseComparison: toggleCatalogComparison(
          doctorBrowseComparison,
          providerId,
          serviceCode,
          services,
        ),
      })),
    setDoctorBrowseComparison: (doctorBrowseComparison) => set({ doctorBrowseComparison }),
    toggleCatalogComparisonProvider: (providerId, serviceCode, services) =>
      set(({ catalogComparison }) => ({
        catalogComparison: toggleCatalogComparison(
          catalogComparison,
          providerId,
          serviceCode,
          services,
        ),
      })),
    setCatalogComparison: (catalogComparison) => set({ catalogComparison }),
    serviceStates: {},
    getServiceState: (serviceCode) =>
      serviceCode
        ? (get().serviceStates[serviceCode] ?? initialServiceState(serviceCode))
        : defaultServiceState,
    setProviderArea: (serviceCode, area) => updateServiceState(serviceCode, { area, scrollY: 0 }),
    setProviderFilter: (serviceCode, key, enabled) =>
      set(({ serviceStates }) => {
        const previous = serviceStates[serviceCode] ?? initialServiceState(serviceCode);
        return {
          serviceStates: {
            ...serviceStates,
            [serviceCode]: {
              ...previous,
              filters: { ...previous.filters, [key]: enabled },
              filtersApplied: false,
              scrollY: 0,
            },
          },
        };
      }),
    resetProviderFilters: (serviceCode) =>
      updateServiceState(serviceCode, {
        filters: { ...defaultProviderFilters },
        filtersApplied: false,
        area: 'كل المناطق',
        scrollY: 0,
      }),
    applyProviderFilters: (serviceCode) =>
      updateServiceState(serviceCode, { filtersApplied: true, scrollY: 0 }),
    setProviderSort: (serviceCode, sort) => updateServiceState(serviceCode, { sort, scrollY: 0 }),
    setProviderScrollY: (serviceCode, scrollY) =>
      updateServiceState(serviceCode, { scrollY: Math.max(0, scrollY) }),
    toggleComparisonProvider: (serviceCode, providerId) =>
      set(({ serviceStates }) => {
        const currentState = serviceStates[serviceCode] ?? initialServiceState(serviceCode);
        const selected = currentState.comparisonProviderIds;
        if (!selected.includes(providerId) && selected.length >= 3) return {};
        const comparisonProviderIds = selected.includes(providerId)
          ? selected.filter((id) => id !== providerId)
          : [...selected, providerId];
        return {
          serviceStates: {
            ...serviceStates,
            [serviceCode]: { ...currentState, comparisonProviderIds },
          },
        };
      }),
    setComparisonProviders: (serviceCode, providerIds) => {
      const comparisonProviderIds = Array.from(new Set(providerIds)).slice(0, 3);
      set(({ serviceStates }) => {
        const currentState = serviceStates[serviceCode] ?? initialServiceState(serviceCode);
        if (
          currentState.comparisonProviderIds.length === comparisonProviderIds.length &&
          currentState.comparisonProviderIds.every(
            (providerId, index) => providerId === comparisonProviderIds[index],
          )
        )
          return {};
        return {
          serviceStates: {
            ...serviceStates,
            [serviceCode]: { ...currentState, comparisonProviderIds },
          },
        };
      });
    },
  };
});

registerSessionStore(useDiscoverySession);
