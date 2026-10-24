import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getMockProvider } from '@/features/discovery/mocks/providers.mock';
import { secureStorage } from '@/shared/storage/secure-storage';

export type FavoriteDoctor = { providerId: string; serviceCode: string | null };
type DoctorFavoritesValue = {
  ready: boolean;
  favorites: FavoriteDoctor[];
  isFavorite: (providerId: string, serviceCode: string | null) => boolean;
  toggleFavorite: (providerId: string, serviceCode: string | null) => void;
};
const Context = createContext<DoctorFavoritesValue | null>(null);
const same = (a: FavoriteDoctor, b: FavoriteDoctor) =>
  a.providerId === b.providerId && a.serviceCode === b.serviceCode;

/** Device-local mock favorites; no server synchronization or cross-account claim. */
export function DoctorFavoritesProvider({ children }: PropsWithChildren) {
  const [favorites, setFavorites] = useState<FavoriteDoctor[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    void secureStorage
      .getDoctorFavorites()
      .then((raw) => {
        if (!active) return;
        setFavorites(
          raw.filter((item) => {
            const provider = getMockProvider(item.providerId);
            return Boolean(
              provider && (!item.serviceCode || provider.serviceCodes.includes(item.serviceCode)),
            );
          }),
        );
        setReady(true);
      })
      .catch(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const isFavorite = useCallback(
    (providerId: string, serviceCode: string | null) =>
      favorites.some((item) => same(item, { providerId, serviceCode })),
    [favorites],
  );
  const toggleFavorite = useCallback(
    (providerId: string, serviceCode: string | null) => {
      if (!ready) return;
      const provider = getMockProvider(providerId);
      if (!provider || (serviceCode && !provider.serviceCodes.includes(serviceCode))) return;
      const candidate = { providerId, serviceCode };
      setFavorites((current) => {
        const next = current.some((item) => same(item, candidate))
          ? current.filter((item) => !same(item, candidate))
          : [...current, candidate].slice(-60);
        return next;
      });
    },
    [ready],
  );

  useEffect(() => {
    if (!ready) return;
    void secureStorage.setDoctorFavorites(favorites).catch(() => undefined);
  }, [favorites, ready]);

  const value = useMemo(
    () => ({ ready, favorites, isFavorite, toggleFavorite }),
    [ready, favorites, isFavorite, toggleFavorite],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useDoctorFavorites() {
  const value = useContext(Context);
  if (!value) throw new Error('useDoctorFavorites requires DoctorFavoritesProvider');
  return value;
}
