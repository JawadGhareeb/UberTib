import { useLocalSearchParams } from 'expo-router';

import { SubmitReviewScreen } from '@/features/my-care';

export default function SubmitReviewRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();

  return <SubmitReviewScreen caseId={caseId} />;
}
