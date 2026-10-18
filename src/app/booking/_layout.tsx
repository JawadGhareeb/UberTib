import { Stack } from 'expo-router';

import { BookingDraftProvider } from '@/features/booking/state/booking-draft-provider';

export default function BookingLayout() {
  return (
    <BookingDraftProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </BookingDraftProvider>
  );
}
