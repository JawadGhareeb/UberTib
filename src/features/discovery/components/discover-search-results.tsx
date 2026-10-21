import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { DiscoverDoctorResultCard } from '@/features/discovery/components/discover-doctor-result-card';
import { type MockProvider } from '@/features/discovery/mocks/providers.mock';
import {
  findPenFamily,
  getPenDoctorsForService,
  type PenServiceFamily,
} from '@/features/discovery/presentation/pen-discovery-data';
import { useDiscoverySession } from '@/features/discovery/state/discovery-session-provider';
import { AppText } from '@/shared/components/ui';
import { matchingPricedServices, type DiscoveryFilterSelection } from '../model/discover-filters';
import { matchesDiscoverQuery, selectDiscoverMatches } from '../model/discover-search';
import { DiscoverSearchIllustration } from './discover-search-illustration';

/** Reuse the exact doctor/comparison card from the service and assessment results. */
function matchingService(provider: MockProvider, query: string, filters: DiscoveryFilterSelection) {
  if (filters.serviceCode && provider.serviceCodes.includes(filters.serviceCode)) {
    return filters.serviceCode;
  }
  const candidates = matchingPricedServices(provider, filters);
  return (
    candidates.find((code) => {
      const family = findPenFamily(code);
      return family && matchesDiscoverQuery(query, family.title, family.description);
    }) ??
    candidates[0] ??
    provider.serviceCodes[0]
  );
}

export function DiscoverSearchResults({
  query,
  filters,
}: {
  query: string;
  filters: DiscoveryFilterSelection;
  onChooseFamily: (family: PenServiceFamily) => void;
  onChooseArea: (area: string) => void;
}) {
  const router = useRouter();
  const { getServiceState, toggleComparisonProvider } = useDiscoverySession();
  const matches = selectDiscoverMatches(query, filters);

  if (!matches.hasCriteria) return <DiscoverSearchIllustration />;

  const doctors = matches.providers.flatMap((provider) => {
    const serviceCode = matchingService(provider, query, filters);
    if (!serviceCode) return [];
    const doctor = getPenDoctorsForService(serviceCode).find((item) => item.id === provider.id);
    return doctor ? [{ doctor, serviceCode }] : [];
  });

  return (
    <View className="gap-3">
      <AppText align="right" variant="heading-4" className="font-ui-bold">
        النتائج ({doctors.length})
      </AppText>
      {doctors.length ? (
        <View className="gap-3">
          {doctors.map(({ doctor, serviceCode }) => {
            const selection = getServiceState(serviceCode).comparisonProviderIds;
            return (
              <DiscoverDoctorResultCard
                key={doctor.id}
                doctor={doctor}
                serviceCode={serviceCode}
                selected={selection.includes(doctor.id)}
                disabled={selection.length >= 3 && !selection.includes(doctor.id)}
                onToggle={() => {
                  toggleComparisonProvider(serviceCode, doctor.id);
                  router.push({
                    pathname: '/discover/providers/results',
                    params: { serviceCode },
                  });
                }}
              />
            );
          })}
        </View>
      ) : (
        <DiscoverSearchIllustration empty />
      )}
    </View>
  );
}
