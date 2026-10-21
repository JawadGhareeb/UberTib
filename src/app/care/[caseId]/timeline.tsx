import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { useLocalSearchParams } from 'expo-router';

import { CaseTimelineScreen } from '@/features/my-care';

function CaseTimelineRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <CaseTimelineScreen caseId={caseId} />;
}

export default withAuthRequired(CaseTimelineRoute);
