import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { AssessmentNeedsMoreInfoScreen } from '@/features/assessment';

function AssessmentNeedsMoreInfoRoute() {
  return <AssessmentNeedsMoreInfoScreen />;
}

export default withAuthRequired(AssessmentNeedsMoreInfoRoute);
