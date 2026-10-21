import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { AlternativeAppointmentScreen } from '@/features/booking';

function AlternativeAppointmentRoute() {
  return <AlternativeAppointmentScreen />;
}

export default withAuthRequired(AlternativeAppointmentRoute);
