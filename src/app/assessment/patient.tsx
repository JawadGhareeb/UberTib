import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { AssessmentPatientScreen } from '@/features/assessment';

function AssessmentPatientRoute() {
  return <AssessmentPatientScreen />;
}

export default withAuthRequired(AssessmentPatientRoute);
