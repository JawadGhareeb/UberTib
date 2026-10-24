import { Stack } from 'expo-router';

import { AssessmentSessionProvider } from '@/features/assessment';
import { AssessmentDraftBridge } from '@/features/assessment/components/assessment-draft-bridge';
import { pageTransitionOptions } from '@/shared/navigation/navigation-transitions';
import { useAppTheme } from '@/shared/theme/use-app-theme';

export default function AssessmentLayout() {
  const { colors } = useAppTheme();
  return (
    <AssessmentSessionProvider>
      <AssessmentDraftBridge>
        <Stack
          screenOptions={{
            ...pageTransitionOptions(),
            headerShown: false,
            contentStyle: { backgroundColor: colors.surface.canvas },
          }}
        />
      </AssessmentDraftBridge>
    </AssessmentSessionProvider>
  );
}