import { useLocalSearchParams } from 'expo-router';

import { FinancialTimelineScreen } from '@/features/my-care';

export default function FinancialTimelineRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <FinancialTimelineScreen caseId={caseId} />;
}
