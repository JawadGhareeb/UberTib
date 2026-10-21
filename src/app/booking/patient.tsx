import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { BookingPatientSelectionScreen } from '@/features/booking/screens/booking-patient-selection-screen';

function BookingPatientRoute() {
  return <BookingPatientSelectionScreen />;
}

export default withAuthRequired(BookingPatientRoute);
