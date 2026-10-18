import { useLocalSearchParams } from 'expo-router';

import { RefundRequestScreen } from '@/features/my-care';

export default function RefundRequestRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <RefundRequestScreen caseId={caseId} />;
}
