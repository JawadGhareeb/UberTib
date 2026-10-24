import { Stack } from 'expo-router';

import { BookingDraftProvider } from '@/features/booking/state/booking-draft-provider';
import { pageTransitionOptions } from '@/shared/navigation/navigation-transitions';
import { useAppTheme } from '@/shared/theme/use-app-theme';

export default function BookingLayout() {
  const { colors } = useAppTheme();
  return (
    <BookingDraftProvider>
      <Stack
        screenOptions={{
          ...pageTransitionOptions(),
          headerShown: false,
          contentStyle: { backgroundColor: colors.surface.canvas },
        }}
      />
    </BookingDraftProvider>
  );
}