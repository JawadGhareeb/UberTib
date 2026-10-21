import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { MyCasesOverviewScreen } from '@/features/my-care/screens/my-cases-overview-screen';

function CareRoute() {
  return <MyCasesOverviewScreen />;
}

export default withAuthRequired(CareRoute);
