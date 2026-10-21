import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { PrivacyConsentsScreen } from '@/features/profile';

function PrivacyConsentsRoute() {
  return <PrivacyConsentsScreen />;
}

export default withAuthRequired(PrivacyConsentsRoute);
