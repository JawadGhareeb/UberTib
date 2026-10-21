import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { useLocalSearchParams } from 'expo-router';

import { FinancialTimelineScreen } from '@/features/my-care';

function FinancialTimelineRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <FinancialTimelineScreen caseId={caseId} />;
}

export default withAuthRequired(FinancialTimelineRoute);
