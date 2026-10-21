import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { RescheduleBookingScreen } from '@/features/booking';

function RescheduleBookingRoute() {
  return <RescheduleBookingScreen />;
}

export default withAuthRequired(RescheduleBookingRoute);
