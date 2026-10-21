import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { AssessmentComplaintScreen } from '@/features/assessment';

function AssessmentComplaintRoute() {
  return <AssessmentComplaintScreen />;
}

export default withAuthRequired(AssessmentComplaintRoute);
