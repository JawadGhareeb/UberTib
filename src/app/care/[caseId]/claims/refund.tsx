import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { useLocalSearchParams } from 'expo-router';

import { RefundRequestScreen } from '@/features/my-care';

function RefundRequestRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <RefundRequestScreen caseId={caseId} />;
}

export default withAuthRequired(RefundRequestRoute);
