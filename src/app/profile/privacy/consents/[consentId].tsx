import { useLocalSearchParams } from 'expo-router';

import { ConsentDetailScreen } from '@/features/profile';

export default function ConsentDetailRoute() {
  const { consentId } = useLocalSearchParams<{ consentId: string }>();
  return <ConsentDetailScreen consentId={consentId ?? ''} />;
}
