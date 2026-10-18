import { BookingStatusScreen } from '@/features/booking/screens/booking-status-screen';

/**
 * The alternative-appointment route intentionally uses the same booking-state
 * design as /booking/[bookingId]/status.
 *
 * This keeps the two entry points visually identical and prevents an older
 * alternative-only screen from bypassing pending/confirmed/cancelled guards.
 * All acceptance / rejection actions live in BookingStatusScreen and remain
 * pending until a verified clinic response is received.
 */
export function AlternativeAppointmentScreen() {
  return <BookingStatusScreen />;
}
