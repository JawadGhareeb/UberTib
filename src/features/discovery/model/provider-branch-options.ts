import type { MockProvider } from '@/features/discovery/mocks/providers.mock';

/**
 * The UI never fabricates a second branch. The API can replace this mock
 * adapter with actual branch offerings and canonical IDs.
 */
export type ProviderBranchOption = {
  uiKey: string;
  branchId: string | null;
  name: string;
  area: string;
  serviceCodes: readonly string[];
};

export function getMockProviderBranchOptions(
  provider: MockProvider | undefined,
): ProviderBranchOption[] {
  if (!provider) return [];
  return [
    {
      uiKey: 'mock:' + provider.id,
      branchId: null,
      name: provider.branch,
      area: provider.area,
      serviceCodes: provider.serviceCodes,
    },
  ];
}

/** The selected branch, not other branches' catalogs, controls visible services. */
export function isBranchServiceAvailable(
  branch: ProviderBranchOption | null | undefined,
  serviceCode: string | null,
) {
  return Boolean(branch && serviceCode && branch.serviceCodes.includes(serviceCode));
}
