import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { useLocalSearchParams } from 'expo-router';

import { ClaimAppealScreen } from '@/features/my-care';

function ClaimAppealRoute() {
  const { caseId, claimId } = useLocalSearchParams<{ caseId: string; claimId: string }>();

  return <ClaimAppealScreen caseId={caseId} claimId={claimId} />;
}

export default withAuthRequired(ClaimAppealRoute);
