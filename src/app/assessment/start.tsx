import { AssessmentStartScreen } from '@/features/assessment';
import { withAuthRequired } from '@/features/auth/components/with-auth-required';

function AssessmentStartRoute() {
  return <AssessmentStartScreen />;
}

export default withAuthRequired(AssessmentStartRoute);
