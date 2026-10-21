import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { useLocalSearchParams } from 'expo-router';

import { GrantDetailScreen } from '@/features/profile';

function GrantDetailRoute() {
  const { grantId } = useLocalSearchParams<{ grantId: string }>();
  return <GrantDetailScreen grantId={grantId ?? ''} />;
}

export default withAuthRequired(GrantDetailRoute);
