import { useLocalSearchParams } from 'expo-router';

import { StageDetailScreen } from '@/features/my-care';

export default function StageDetailRoute() {
  const { caseId, stageId } = useLocalSearchParams<{ caseId: string; stageId: string }>();

  return <StageDetailScreen caseId={caseId} stageId={stageId} />;
}
