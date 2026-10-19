import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

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

const DiscoverySessionContext = createContext<DiscoverySessionContextValue | null>(null);

export function DiscoverySessionProvider({ children }: PropsWithChildren) {
  const [catalogQuery, setCatalogQuery] = useState('');
  const [serviceStates, setServiceStates] = useState<Record<string, DiscoveryServiceState>>({});

  const updateServiceState = useCallback(
    (serviceCode: string, update: Partial<DiscoveryServiceState>) => {
      setServiceStates((current) => ({
        ...current,
        [serviceCode]: {
          ...initialServiceState(serviceCode),
          ...current[serviceCode],
          ...update,
        },
      }));
    },
    [],
  );

  const getServiceState = useCallback(
    (serviceCode?: string) =>
      serviceCode
        ? (serviceStates[serviceCode] ?? initialServiceState(serviceCode))
        : defaultServiceState,
    [serviceStates],
  );

  const setProviderArea = useCallback(
    (serviceCode: string, area: string) => {
      updateServiceState(serviceCode, { area, scrollY: 0 });
    },
    [updateServiceState],
  );

  const setProviderFilter = useCallback(
    (serviceCode: string, key: ProviderFilterKey, enabled: boolean) => {
      setServiceStates((current) => {
        const previous = current[serviceCode] ?? initialServiceState(serviceCode);
        return {
          ...current,
          [serviceCode]: {
            ...previous,
            filters: { ...previous.filters, [key]: enabled },
            filtersApplied: false,
            scrollY: 0,
          },
        };
      });
    },
    [],
  );

  const resetProviderFilters = useCallback(
    (serviceCode: string) => {
      updateServiceState(serviceCode, {
        filters: { ...defaultProviderFilters },
        filtersApplied: false,
        area: 'كل المناطق',
        scrollY: 0,
      });
    },
    [updateServiceState],
  );

  const applyProviderFilters = useCallback(
    (serviceCode: string) => {
      updateServiceState(serviceCode, { filtersApplied: true, scrollY: 0 });
    },
    [updateServiceState],
  );

  const setProviderSort = useCallback(
    (serviceCode: string, sort: ProviderSortMode) => {
      updateServiceState(serviceCode, { sort, scrollY: 0 });
    },
    [updateServiceState],
  );

  const setProviderScrollY = useCallback(
    (serviceCode: string, scrollY: number) => {
      updateServiceState(serviceCode, { scrollY: Math.max(0, scrollY) });
    },
    [updateServiceState],
  );

  const toggleComparisonProvider = useCallback((serviceCode: string, providerId: string) => {
    setServiceStates((current) => {
      const currentState = current[serviceCode] ?? initialServiceState(serviceCode);
      const selected = currentState.comparisonProviderIds;

      if (!selected.includes(providerId) && selected.length >= 3) {
        return current;
      }

      const comparisonProviderIds = selected.includes(providerId)
        ? selected.filter((id) => id !== providerId)
        : [...selected, providerId];

      return {
        ...current,
        [serviceCode]: {
          ...currentState,
          comparisonProviderIds,
        },
      };
    });
  }, []);

  const setComparisonProviders = useCallback((serviceCode: string, providerIds: string[]) => {
    const comparisonProviderIds = Array.from(new Set(providerIds)).slice(0, 3);

    setServiceStates((current) => {
      const currentState = current[serviceCode] ?? initialServiceState(serviceCode);

      if (
        currentState.comparisonProviderIds.length === comparisonProviderIds.length &&
        currentState.comparisonProviderIds.every(
          (providerId, index) => providerId === comparisonProviderIds[index],
        )
      ) {
        return current;
      }

      return {
        ...current,
        [serviceCode]: {
          ...currentState,
          comparisonProviderIds,
        },
      };
    });
  }, []);

  const value = useMemo<DiscoverySessionContextValue>(
    () => ({
      catalogQuery,
      setCatalogQuery,
      getServiceState,
      setProviderArea,
      setProviderFilter,
      resetProviderFilters,
      applyProviderFilters,
      setProviderSort,
      setProviderScrollY,
      toggleComparisonProvider,
      setComparisonProviders,
    }),
    [
      catalogQuery,
      getServiceState,
      setComparisonProviders,
      setProviderArea,
      setProviderFilter,
      resetProviderFilters,
      applyProviderFilters,
      setProviderScrollY,
      setProviderSort,
      toggleComparisonProvider,
    ],
  );

  return (
    <DiscoverySessionContext.Provider value={value}>{children}</DiscoverySessionContext.Provider>
  );
}

export function useDiscoverySession(): DiscoverySessionContextValue {
  const value = useContext(DiscoverySessionContext);

  if (!value) {
    throw new Error('useDiscoverySession must be used inside DiscoverySessionProvider');
  }

  return value;
}
