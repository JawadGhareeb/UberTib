import { useRouter } from 'expo-router';
import { useDiscoverySession } from '@/features/discovery/state/discovery-session-provider';
import type { quickTypes } from '../presentation/search-options';

export function useUniversalSearchActions() {
  const router = useRouter();
  const { catalogQuery, setCatalogQuery } = useDiscoverySession();
  const submitSearch = (
    kind: 'all' | 'service' | 'doctor' | 'area' = 'all',
    query = catalogQuery,
  ) => {
    router.push({
      pathname: '/discover/search/results',
      params: { q: query.trim(), kind },
    });
  };

  const openQuickType = (kind: (typeof quickTypes)[number]['kind']) => {
    if (kind === 'pain') {
      router.push('/assessment/start');
    } else if (kind === 'area') {
      router.push({
        pathname: '/discover/providers',
        params: { serviceCode: 'root-canal', openArea: '1' },
      });
    } else {
      submitSearch(kind);
    }
  };

  const openRecent = (term: string) => {
    setCatalogQuery(term);
    if (term === 'علاج جذور في الجميلية') {
      router.push({
        pathname: '/discover/providers/results',
        params: { serviceCode: 'root-canal', area: 'الجميلية' },
      });
    } else if (term === 'د. ليان يوسف') {
      submitSearch('doctor', term);
    } else {
      submitSearch('service', 'تنظيف');
    }
  };
  return { catalogQuery, setCatalogQuery, submitSearch, openQuickType, openRecent };
}
