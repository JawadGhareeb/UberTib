import { useLocalSearchParams } from 'expo-router';

import { ReportRefundExecutionScreen } from '@/features/my-care';

export default function ReportRefundExecutionRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <ReportRefundExecutionScreen caseId={caseId} />;
}
