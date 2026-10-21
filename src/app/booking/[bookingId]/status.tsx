import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { BookingStatusScreen } from '@/features/booking/screens/booking-status-screen';

function BookingStatusRoute() {
  return <BookingStatusScreen />;
}

export default withAuthRequired(BookingStatusRoute);
