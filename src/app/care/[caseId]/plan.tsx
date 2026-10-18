import { useLocalSearchParams } from 'expo-router';

import { TreatmentPlanScreen } from '@/features/my-care';

export default function TreatmentPlanRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <TreatmentPlanScreen caseId={caseId} />;
}
