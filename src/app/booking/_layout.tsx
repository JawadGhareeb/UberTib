import { Stack } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';

import { BookingDraftProvider } from '@/features/booking/state/booking-draft-provider';
import { pageTransitionOptions } from '@/shared/navigation/navigation-transitions';
import { useAppTheme } from '@/shared/theme/use-app-theme';

export default function BookingLayout() {
  const { colors } = useAppTheme();
  const reduceMotion = useReducedMotion();
  return (
    <BookingDraftProvider>
      <Stack
        screenOptions={{
          ...pageTransitionOptions(reduceMotion),
          headerShown: false,
          contentStyle: { backgroundColor: colors.surface.canvas },
        }}
      />
    </BookingDraftProvider>
  );
}
