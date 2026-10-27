import { useLocalSearchParams } from 'expo-router';

import { GrantDetailScreen } from '@/features/profile';

function GrantDetailRoute() {
  const { grantId } = useLocalSearchParams<{ grantId: string }>();
  return <GrantDetailScreen grantId={grantId ?? ''} />;
}

export default GrantDetailRoute;
