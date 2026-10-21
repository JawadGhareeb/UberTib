import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { NeedsAttentionScreen } from '@/features/platform';

function NeedsAttentionRoute() {
  return <NeedsAttentionScreen />;
}

export default withAuthRequired(NeedsAttentionRoute);
