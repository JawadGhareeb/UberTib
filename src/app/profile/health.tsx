import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { PatientHealthInformationScreen } from '@/features/profile/screens/patient-health-information-screen';

function HealthInformationRoute() {
  return <PatientHealthInformationScreen />;
}

export default withAuthRequired(HealthInformationRoute);
