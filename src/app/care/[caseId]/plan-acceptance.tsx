import { useLocalSearchParams } from 'expo-router';

import { PlanAcceptanceScreen } from '@/features/my-care';

function PlanAcceptanceRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <PlanAcceptanceScreen caseId={caseId} />;
}

export default PlanAcceptanceRoute;
