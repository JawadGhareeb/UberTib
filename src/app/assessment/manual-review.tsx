import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { AssessmentManualReviewScreen } from '@/features/assessment';

function AssessmentManualReviewRoute() {
  return <AssessmentManualReviewScreen />;
}

export default withAuthRequired(AssessmentManualReviewRoute);
