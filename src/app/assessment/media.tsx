import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { AssessmentMediaScreen } from '@/features/assessment';

function AssessmentMediaRoute() {
  return <AssessmentMediaScreen />;
}

export default withAuthRequired(AssessmentMediaRoute);
