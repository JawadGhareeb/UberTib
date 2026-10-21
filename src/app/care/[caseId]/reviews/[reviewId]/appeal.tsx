import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { useLocalSearchParams } from 'expo-router';

import { ReviewAppealScreen } from '@/features/my-care';

function ReviewAppealRoute() {
  const { caseId, reviewId } = useLocalSearchParams<{ caseId: string; reviewId: string }>();

  return <ReviewAppealScreen caseId={caseId} reviewId={reviewId} />;
}

export default withAuthRequired(ReviewAppealRoute);
