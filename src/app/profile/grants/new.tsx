import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { CreateGrantScreen } from '@/features/profile';

function CreateGrantRoute() {
  return <CreateGrantScreen />;
}

export default withAuthRequired(CreateGrantRoute);
