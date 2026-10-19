import { Redirect } from 'expo-router';

/** Patient identity never switches globally. Choose family member at booking only. */
export default function LegacyActivePatientRoute() {
  return <Redirect href="/profile/family" />;
}
