import { View } from 'react-native';

import { DiscoverDoctorResultCard } from '@/features/discovery/components/discover-doctor-result-card';
import { type MockProvider } from '@/features/discovery/mocks/providers.mock';
import {
  findPenFamily,
  getPenDoctorsForService,
} from '@/features/discovery/presentation/pen-discovery-data';
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
  comparison,
  onToggleComparison,
}: {
  query: string;
  filters: DiscoveryFilterSelection;
  comparison: { serviceCode: string; providerIds: string[] } | null;
  onToggleComparison: (providerId: string, serviceCode: string) => void;
}) {
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
      {comparison?.providerIds.length ? (
        <AppText align="right" variant="caption" className="text-content-secondary">
          المقارنة بين أطباء نفس الخدمة. يمكنك اختيار 3 أطباء كحد أقصى.
        </AppText>
      ) : null}
      {doctors.length ? (
        <View className="gap-3">
          {doctors.map(({ doctor, serviceCode }) => {
            const selection = comparison?.providerIds ?? [];
            const selected = selection.includes(doctor.id);
            const sameService =
              !comparison ||
              Boolean(
                matches.providers.find(
                  (provider) =>
                    provider.id === doctor.id &&
                    provider.serviceCodes.includes(comparison.serviceCode),
                ),
              );
            return (
              <DiscoverDoctorResultCard
                key={doctor.id}
                doctor={doctor}
                serviceCode={serviceCode}
                selected={selected}
                disabled={!selected && (!sameService || selection.length >= 3)}
                disabledReason={!sameService ? 'خدمة مختلفة' : undefined}
                onToggle={() => onToggleComparison(doctor.id, serviceCode)}
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
