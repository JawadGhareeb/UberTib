import { ProfileScreen } from '@/features/profile';
import { withAuthRequired } from '@/features/auth/components/with-auth-required';

function ProfileRoute() {
  return <ProfileScreen />;
}

export default withAuthRequired(ProfileRoute);
