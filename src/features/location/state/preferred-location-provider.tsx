import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { Coordinate } from '@/features/auth/components/profile-location-map.types';
import { secureStorage } from '@/shared/storage/secure-storage';

export interface PreferredLocation {
  coordinate: Coordinate;
  label: string;
  selectionVersion: 2;
}

interface PreferredLocationContextValue {
  location: PreferredLocation | null;
  setLocation: (value: PreferredLocation) => void;
}

const PreferredLocationContext = createContext<PreferredLocationContextValue | null>(null);

function isValidLocation(value: unknown): value is PreferredLocation {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<PreferredLocation>;
  return (
    // V1 allowed a typed neighborhood unrelated to the saved map pin.
    // Require one new map selection before trusting a legacy cached address.
    entry.selectionVersion === 2 &&
    typeof entry.label === 'string' &&
    entry.label.trim().length > 0 &&
    typeof entry.coordinate?.latitude === 'number' &&
    Number.isFinite(entry.coordinate.latitude) &&
    entry.coordinate.latitude >= -90 &&
    entry.coordinate.latitude <= 90 &&
    typeof entry.coordinate.longitude === 'number' &&
    Number.isFinite(entry.coordinate.longitude) &&
    entry.coordinate.longitude >= -180 &&
    entry.coordinate.longitude <= 180
  );
}

export function PreferredLocationProvider({ children }: PropsWithChildren) {
  const [location, setLocationState] = useState<PreferredLocation | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    void secureStorage
      .getPreferredLocation()
      .then((raw) => {
        if (!active || !raw) return;
        try {
          const parsed: unknown = JSON.parse(raw);
          if (isValidLocation(parsed)) setLocationState(parsed);
        } catch {
          // Ignore invalid cached data.
        }
      })
      .finally(() => {
        if (active) setHydrated(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const setLocation = useCallback((next: PreferredLocation) => {
    if (!isValidLocation(next)) return;
    setLocationState(next);
    void secureStorage.setPreferredLocation(JSON.stringify(next));
  }, []);

  const value = useMemo(() => ({ location, setLocation }), [location, setLocation]);

  // Do not render an outdated location during async storage hydration.
  if (!hydrated) return null;

  return (
    <PreferredLocationContext.Provider value={value}>{children}</PreferredLocationContext.Provider>
  );
}

export function usePreferredLocation() {
  const value = useContext(PreferredLocationContext);
  if (!value) throw new Error('usePreferredLocation requires PreferredLocationProvider');
  return value;
}
