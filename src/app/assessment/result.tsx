import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { AssessmentResultScreen } from '@/features/assessment';

function AssessmentResultRoute() {
  return <AssessmentResultScreen />;
}

export default withAuthRequired(AssessmentResultRoute);
