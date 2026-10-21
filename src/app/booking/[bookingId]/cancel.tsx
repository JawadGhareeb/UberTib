import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { CancelBookingScreen } from '@/features/booking';

function CancelBookingRoute() {
  return <CancelBookingScreen />;
}

export default withAuthRequired(CancelBookingRoute);
