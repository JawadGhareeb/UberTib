import { useQuery } from '@tanstack/react-query';

import { getServiceGroups } from '@/features/discovery/api/catalog';

export const serviceGroupsQueryKey = ['catalog', 'service-groups'] as const;

export function useServiceGroupsQuery() {
  return useQuery({
    queryKey: serviceGroupsQueryKey,
    queryFn: getServiceGroups,
    staleTime: 60_000,
  });
}
