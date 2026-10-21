import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { AccountClosureRequestScreen } from '@/features/profile';

function AccountClosureRequestRoute() {
  return <AccountClosureRequestScreen />;
}

export default withAuthRequired(AccountClosureRequestRoute);
