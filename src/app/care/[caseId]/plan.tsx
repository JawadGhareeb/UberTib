import { useLocalSearchParams } from 'expo-router';

import { TreatmentPlanScreen } from '@/features/my-care';

function TreatmentPlanRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <TreatmentPlanScreen caseId={caseId} />;
}

export default TreatmentPlanRoute;
