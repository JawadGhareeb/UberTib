import { Stack } from 'expo-router/js-stack';
import { useReducedMotion } from 'react-native-reanimated';

import { AssessmentSessionProvider } from '@/features/assessment';
import { AssessmentDraftBridge } from '@/features/assessment/components/assessment-draft-bridge';
import { pageTransitionOptions } from '@/shared/navigation/navigation-transitions';
import { useAppTheme } from '@/shared/theme/use-app-theme';

export default function AssessmentLayout() {
  const { colors } = useAppTheme();
  const reduceMotion = useReducedMotion();
  return (
    <AssessmentSessionProvider>
      <AssessmentDraftBridge>
        <Stack
          screenOptions={{
            ...pageTransitionOptions(reduceMotion),
            headerShown: false,
            cardStyle: { backgroundColor: colors.surface.canvas },
          }}
        />
      </AssessmentDraftBridge>
    </AssessmentSessionProvider>
  );
}
