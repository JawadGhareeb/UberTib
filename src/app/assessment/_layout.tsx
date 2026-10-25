import { Stack } from 'expo-router';

import { AssessmentSessionProvider } from '@/features/assessment';
import { AssessmentDraftBridge } from '@/features/assessment/components/assessment-draft-bridge';
import { useAppTheme } from '@/shared/theme/use-app-theme';

export default function AssessmentLayout() {
  const { colors } = useAppTheme();
  return (
    <AssessmentSessionProvider>
      <AssessmentDraftBridge>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.surface.canvas },
          }}
        />
      </AssessmentDraftBridge>
    </AssessmentSessionProvider>
  );
}
