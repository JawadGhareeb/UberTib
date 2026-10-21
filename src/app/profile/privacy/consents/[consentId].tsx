import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { useLocalSearchParams } from 'expo-router';

import { ConsentDetailScreen } from '@/features/profile';

function ConsentDetailRoute() {
  const { consentId } = useLocalSearchParams<{ consentId: string }>();
  return <ConsentDetailScreen consentId={consentId ?? ''} />;
}

export default withAuthRequired(ConsentDetailRoute);
