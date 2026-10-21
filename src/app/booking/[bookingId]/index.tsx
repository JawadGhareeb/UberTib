import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { BookingDetailScreen } from '@/features/booking';

function BookingDetailRoute() {
  return <BookingDetailScreen />;
}

export default withAuthRequired(BookingDetailRoute);
