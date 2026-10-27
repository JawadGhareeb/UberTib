import { useLocalSearchParams } from 'expo-router';

import { ClaimsScreen } from '@/features/my-care';

function ClaimsRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <ClaimsScreen caseId={caseId} />;
}

export default ClaimsRoute;
