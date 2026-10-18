import { Stack } from 'expo-router';

import { AssessmentSessionProvider } from '@/features/assessment';

export default function AssessmentLayout() {
  return (
    <AssessmentSessionProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AssessmentSessionProvider>
  );
}
