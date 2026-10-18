import { Redirect, useLocalSearchParams } from 'expo-router';

/** Preserve bookmarked links without exposing removed treatment-plan modification UI. */
export default function PlanAmendmentsRoute() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  if (!caseId) return <Redirect href="/(tabs)/care" />;
  return <Redirect href={{ pathname: '/care/[caseId]/plan', params: { caseId } }} />;
}
