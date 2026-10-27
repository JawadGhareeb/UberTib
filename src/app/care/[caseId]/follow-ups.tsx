import { useLocalSearchParams } from 'expo-router';

import { FollowUpsScreen } from '@/features/my-care';

function FollowUpsRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <FollowUpsScreen caseId={caseId} />;
}

export default FollowUpsRoute;
