import { View } from 'react-native';

import { DiscoverDoctorResultCard } from '@/features/discovery/components/discover-doctor-result-card';
import { type MockProvider } from '@/features/discovery/mocks/providers.mock';
import { getPenDoctorsForService } from '@/features/discovery/presentation/pen-discovery-data';
import { AppText } from '@/shared/components/ui';
import { matchingPricedServices, type DiscoveryFilterSelection } from '../model/discover-filters';
import { selectDiscoverMatches } from '../model/discover-search';
import { DiscoverSearchIllustration } from './discover-search-illustration';

/** Reuse the exact doctor/comparison card from the service and assessment results. */
function matchingService(provider: MockProvider, filters: DiscoveryFilterSelection) {
  return matchingPricedServices(provider, filters)[0] ?? provider.serviceCodes[0];
}

export function DiscoverSearchResults({
  query,
  filters,
  comparison,
  onToggleComparison,
  showAllByDefault = false,
  allowGeneralComparison = true,
}: {
  query: string;
  filters: DiscoveryFilterSelection;
  comparison: { serviceCode: string | null; providerIds: string[] } | null;
  onToggleComparison: (providerId: string, serviceCode: string | null) => void;
  showAllByDefault?: boolean;
  allowGeneralComparison?: boolean;
}) {
  const matches = selectDiscoverMatches(query, filters);

  if (!matches.hasCriteria && !showAllByDefault) return <DiscoverSearchIllustration />;

  const doctors = matches.providers.flatMap((provider) => {
    // The fallback service supplies display data only, never a booking selection.
    const lookupService = matchingService(provider, filters);
    if (!lookupService) return [];
    const doctor = getPenDoctorsForService(lookupService).find((item) => item.id === provider.id);
    return doctor ? [{ doctor, serviceCode: filters.serviceCode ?? null }] : [];
  });

  return (
    <View className="gap-3">
      <AppText align="right" variant="heading-4" className="font-ui-bold">
        النتائج ({doctors.length})
      </AppText>
      {comparison?.providerIds.length ? (
        <AppText align="right" variant="caption" className="text-content-secondary">
          {comparison.serviceCode
            ? 'المقارنة بحسب الخدمة المختارة من الفلاتر، وبحد أقصى 3 أطباء.'
            : 'المقارنة بين معلومات الأطباء، وبحد أقصى 3 أطباء. الأسعار حسب الخدمة.'}
        </AppText>
      ) : null}
      {doctors.length ? (
        <View className="gap-3">
          {doctors.map(({ doctor, serviceCode }) => {
            const selection = comparison?.providerIds ?? [];
            const selected = selection.includes(doctor.id);
            return (
              <DiscoverDoctorResultCard
                key={doctor.id}
                doctor={doctor}
                serviceCode={serviceCode}
                selected={selected}
                disabled={!selected && selection.length >= 3}
                showServicePrice={Boolean(filters.serviceCode)}
                showComparison={allowGeneralComparison || Boolean(filters.serviceCode)}
                onToggle={() => onToggleComparison(doctor.id, filters.serviceCode ?? null)}
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
