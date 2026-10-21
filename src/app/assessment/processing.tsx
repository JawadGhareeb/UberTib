import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { AssessmentProcessingScreen } from '@/features/assessment';

function AssessmentProcessingRoute() {
  return <AssessmentProcessingScreen />;
}

export default withAuthRequired(AssessmentProcessingRoute);
