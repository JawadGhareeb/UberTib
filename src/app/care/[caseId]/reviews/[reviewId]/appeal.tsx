import { useLocalSearchParams } from 'expo-router';

import { ReviewAppealScreen } from '@/features/my-care';

export default function ReviewAppealRoute() {
  const { caseId, reviewId } = useLocalSearchParams<{ caseId: string; reviewId: string }>();

  return <ReviewAppealScreen caseId={caseId} reviewId={reviewId} />;
}
