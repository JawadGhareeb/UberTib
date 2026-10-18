import { useLocalSearchParams } from 'expo-router';

import { AcceptedFinancialTermsScreen } from '@/features/my-care';

export default function AcceptedFinancialTermsRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <AcceptedFinancialTermsScreen caseId={caseId} />;
}
