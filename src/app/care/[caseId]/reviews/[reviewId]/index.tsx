import { useLocalSearchParams } from 'expo-router';

import { MyReviewScreen } from '@/features/my-care';

export default function MyReviewRoute() {
  const { caseId, reviewId } = useLocalSearchParams<{ caseId: string; reviewId: string }>();

  return <MyReviewScreen caseId={caseId} reviewId={reviewId} />;
}
