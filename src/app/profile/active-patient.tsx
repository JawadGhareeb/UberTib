import { Redirect } from 'expo-router';

/** Patient identity never switches globally. Choose family member at booking only. */
function LegacyActivePatientRoute() {
  return <Redirect href="/profile/family" />;
}

export default LegacyActivePatientRoute;
