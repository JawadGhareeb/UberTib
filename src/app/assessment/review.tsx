import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { AssessmentReviewScreen } from '@/features/assessment';

function AssessmentReviewRoute() {
  return <AssessmentReviewScreen />;
}

export default withAuthRequired(AssessmentReviewRoute);
