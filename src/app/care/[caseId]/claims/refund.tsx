import { useLocalSearchParams } from 'expo-router';

import { RefundRequestScreen } from '@/features/my-care';

function RefundRequestRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <RefundRequestScreen caseId={caseId} />;
}

export default RefundRequestRoute;
