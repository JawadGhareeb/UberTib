import { Redirect, useLocalSearchParams } from 'expo-router';

/**
 * Legacy doctor-search entry now opens the unified results journey directly.
 * All provider filters are available in its single HeroUI Native bottom sheet.
 */
export function ProviderSearchScreen() {
  const { serviceCode } = useLocalSearchParams<{ serviceCode?: string }>();
  return (
    <Redirect
      href={{
        pathname: '/discover/providers/results',
        params: { serviceCode: serviceCode?.trim() || 'dental-checkup' },
      }}
    />
  );
}
