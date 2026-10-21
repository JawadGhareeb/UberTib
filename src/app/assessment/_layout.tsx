import { Stack } from 'expo-router';

import { AssessmentSessionProvider } from '@/features/assessment';
import { useAppTheme } from '@/shared/theme/use-app-theme';

export default function AssessmentLayout() {
  const { colors } = useAppTheme();
  return (
    <AssessmentSessionProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.surface.canvas },
        }}
      />
    </AssessmentSessionProvider>
  );
}
