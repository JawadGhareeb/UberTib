import { lazy, Suspense } from 'react';
import { ActivityIndicator, TurboModuleRegistry, View } from 'react-native';

import type { ProfileLocationMapProps } from './profile-location-map.types';
import { WebViewProfileLocationMap } from './profile-location-map-webview.native';

const hasMapLibreNativeModules =
  TurboModuleRegistry.get('MLRNCameraModule') !== null &&
  TurboModuleRegistry.get('MLRNMapViewModule') !== null;

const NativeMap = lazy(async () => {
  const module = await import('./profile-location-map-maplibre.native');
  return { default: module.MapLibreProfileLocationMap };
});

export function ProfileLocationMap(props: ProfileLocationMapProps) {
  if (!hasMapLibreNativeModules) return <WebViewProfileLocationMap {...props} />;

  return (
    <Suspense
      fallback={
        <View className="flex-1 items-center justify-center bg-surface-subtle">
          <ActivityIndicator accessibilityLabel="جاري تحميل الخريطة" size="large" />
        </View>
      }
    >
      <NativeMap {...props} />
    </Suspense>
  );
}
