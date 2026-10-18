import { useLocalSearchParams } from 'expo-router';

import { ReportExternalPaymentScreen } from '@/features/my-care';

export default function ReportExternalPaymentRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <ReportExternalPaymentScreen caseId={caseId} />;
}
