import { useLocalSearchParams } from 'expo-router';

import { AcceptedFinancialTermsScreen } from '@/features/my-care';

function AcceptedFinancialTermsRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <AcceptedFinancialTermsScreen caseId={caseId} />;
}

export default AcceptedFinancialTermsRoute;
