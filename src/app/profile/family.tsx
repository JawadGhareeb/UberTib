import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { FamilyRepresentationScreen } from '@/features/profile';

function FamilyRepresentationRoute() {
  return <FamilyRepresentationScreen />;
}

export default withAuthRequired(FamilyRepresentationRoute);
