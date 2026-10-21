import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { AccountSecurityScreen } from '@/features/profile';

function AccountSecurityRoute() {
  return <AccountSecurityScreen />;
}

export default withAuthRequired(AccountSecurityRoute);
