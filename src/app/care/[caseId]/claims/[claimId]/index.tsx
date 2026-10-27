import { useLocalSearchParams } from 'expo-router';

import { ClaimDetailScreen } from '@/features/my-care';

function ClaimDetailRoute() {
  const { caseId, claimId } = useLocalSearchParams<{ caseId: string; claimId: string }>();

  return <ClaimDetailScreen caseId={caseId} claimId={claimId} />;
}

export default ClaimDetailRoute;
