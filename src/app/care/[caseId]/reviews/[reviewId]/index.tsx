import { useLocalSearchParams } from 'expo-router';

import { MyReviewScreen } from '@/features/my-care';

function MyReviewRoute() {
  const { caseId, reviewId } = useLocalSearchParams<{ caseId: string; reviewId: string }>();

  return <MyReviewScreen caseId={caseId} reviewId={reviewId} />;
}

export default MyReviewRoute;
