import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { AssessmentLocationScreen } from '@/features/assessment';

function AssessmentLocationRoute() {
  return <AssessmentLocationScreen />;
}

export default withAuthRequired(AssessmentLocationRoute);
