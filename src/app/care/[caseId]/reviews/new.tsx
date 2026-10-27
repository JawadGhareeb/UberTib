import { useLocalSearchParams } from 'expo-router';

import { SubmitReviewScreen } from '@/features/my-care';

function SubmitReviewRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <SubmitReviewScreen caseId={caseId} />;
}

export default SubmitReviewRoute;
