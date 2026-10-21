import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { AddDependentScreen } from '@/features/profile';

function AddDependentRoute() {
  return <AddDependentScreen />;
}

export default withAuthRequired(AddDependentRoute);
