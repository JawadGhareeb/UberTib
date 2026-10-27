import { Redirect } from 'expo-router';

/** Diagnostic mock-only entry: no visitor onboarding or login gate. */
export default function HomeRoute() {
  return <Redirect href="/(tabs)/home" />;
}
