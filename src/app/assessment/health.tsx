import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { AssessmentHealthScreen } from '@/features/assessment';

function AssessmentHealthRoute() {
  return <AssessmentHealthScreen />;
}

export default withAuthRequired(AssessmentHealthRoute);
