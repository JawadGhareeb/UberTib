import { mockProviders, type MockProvider } from '@/features/discovery/mocks/providers.mock';
import { findPenFamily } from '@/features/discovery/presentation/pen-discovery-data';

/** The mock has no canonical branch IDs yet. Group by both displayed name and area. */
export function getBranchView(providerId: string) {
  const current = mockProviders.find((provider) => provider.id === providerId);
  if (!current) return undefined;

  const doctors = mockProviders.filter(
    (provider) => provider.branch === current.branch && provider.area === current.area,
  );
  const serviceCodes = [...new Set(doctors.flatMap((provider) => provider.serviceCodes))];

  return {
    name: current.branch,
    area: current.area,
    doctors,
    services: serviceCodes
      .map((code) => ({ code, family: findPenFamily(code) }))
      .filter((item): item is { code: string; family: NonNullable<typeof item.family> } =>
        Boolean(item.family),
      ),
    /** A one-doctor listing is not proof of legal ownership or facility type. */
    singleListedDoctor: doctors.length === 1,
  };
}

export function getProviderServiceLabels(provider: MockProvider) {
  return provider.serviceCodes
    .map((code) => findPenFamily(code)?.title)
    .filter((title): title is string => Boolean(title));
}
