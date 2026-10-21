import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { useLocalSearchParams } from 'expo-router';

import { PlanAcceptanceScreen } from '@/features/my-care';

function PlanAcceptanceRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <PlanAcceptanceScreen caseId={caseId} />;
}

export default withAuthRequired(PlanAcceptanceRoute);
