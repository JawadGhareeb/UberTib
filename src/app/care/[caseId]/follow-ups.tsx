import { useLocalSearchParams } from 'expo-router';

import { FollowUpsScreen } from '@/features/my-care';

export default function FollowUpsRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <FollowUpsScreen caseId={caseId} />;
}
