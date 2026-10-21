import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { AssessmentQuestionsScreen } from '@/features/assessment';

function AssessmentQuestionsRoute() {
  return <AssessmentQuestionsScreen />;
}

export default withAuthRequired(AssessmentQuestionsRoute);
