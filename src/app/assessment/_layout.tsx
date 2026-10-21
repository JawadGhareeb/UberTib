import { Stack } from 'expo-router/js-stack';
import { useReducedMotion } from 'react-native-reanimated';

import { AssessmentSessionProvider } from '@/features/assessment';
import { pageTransitionOptions } from '@/shared/navigation/navigation-transitions';
import { useAppTheme } from '@/shared/theme/use-app-theme';

export default function AssessmentLayout() {
  const { colors } = useAppTheme();
  const reduceMotion = useReducedMotion();
  return (
    <AssessmentSessionProvider>
      <Stack
        screenOptions={{
          ...pageTransitionOptions(reduceMotion),
          headerShown: false,
          cardStyle: { backgroundColor: colors.surface.canvas },
        }}
      />
    </AssessmentSessionProvider>
  );
}
