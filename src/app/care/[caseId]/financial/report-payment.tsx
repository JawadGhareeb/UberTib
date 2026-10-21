import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { useLocalSearchParams } from 'expo-router';

import { ReportExternalPaymentScreen } from '@/features/my-care';

function ReportExternalPaymentRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <ReportExternalPaymentScreen caseId={caseId} />;
}

export default withAuthRequired(ReportExternalPaymentRoute);
