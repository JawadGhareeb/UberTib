import { Redirect } from 'expo-router';

// All catalog entry links land on the same Discover/search tab.
export default function PublicDiscoverRoute() {
  return <Redirect href="/(tabs)/discover" />;
}
