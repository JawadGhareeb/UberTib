import { useLocalSearchParams } from 'expo-router';

import { CaseTimelineScreen } from '@/features/my-care';

export default function CaseTimelineRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <CaseTimelineScreen caseId={caseId} />;
}
