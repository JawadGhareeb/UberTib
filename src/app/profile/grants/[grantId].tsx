import { useLocalSearchParams } from 'expo-router';

import { GrantDetailScreen } from '@/features/profile';

export default function GrantDetailRoute() {
  const { grantId } = useLocalSearchParams<{ grantId: string }>();
  return <GrantDetailScreen grantId={grantId ?? ''} />;
}
