import { useLocalSearchParams } from 'expo-router';

import { ReportRefundExecutionScreen } from '@/features/my-care';

function ReportRefundExecutionRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <ReportRefundExecutionScreen caseId={caseId} />;
}

export default ReportRefundExecutionRoute;
