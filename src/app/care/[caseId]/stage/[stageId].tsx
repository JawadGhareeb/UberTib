import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { useLocalSearchParams } from 'expo-router';

import { StageDetailScreen } from '@/features/my-care';

function StageDetailRoute() {
  const { caseId, stageId } = useLocalSearchParams<{ caseId: string; stageId: string }>();

  return <StageDetailScreen caseId={caseId} stageId={stageId} />;
}

export default withAuthRequired(StageDetailRoute);
