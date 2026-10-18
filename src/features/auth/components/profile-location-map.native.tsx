import { lazy, Suspense, useEffect } from 'react';
import { ActivityIndicator, TurboModuleRegistry, View } from 'react-native';

import { ProfileLocationMapFallback } from './profile-location-map-fallback';
import type { ProfileLocationMapProps } from './profile-location-map.types';

const hasMapLibreNativeModules =
  TurboModuleRegistry.get('MLRNCameraModule') !== null &&
  TurboModuleRegistry.get('MLRNMapViewModule') !== null;

const MapLibreProfileLocationMap = lazy(async () => {
  const module = await import('./profile-location-map-maplibre.native');

  return { default: module.MapLibreProfileLocationMap };
});

export function ProfileLocationMap({ coordinate, onChange, onInteractiveChange, recenterToken }: ProfileLocationMapProps) {
  useEffect(() => {
    if (!hasMapLibreNativeModules) onInteractiveChange?.(false);
  }, [onInteractiveChange]);
  if (!hasMapLibreNativeModules) {
    return (
      <ProfileLocationMapFallback
        coordinate={coordinate}
        description="الخريطة التفاعلية غير متاحة في هذه النسخة؛ يلزم تشغيل النسخة الداعمة للخرائط."
        onChange={onChange}
        onInteractiveChange={onInteractiveChange}
        recenterToken={recenterToken}
      />
    );
  }

  return (
    <Suspense
      fallback={
        <View className="flex-1 items-center justify-center bg-surface-subtle">
          <ActivityIndicator accessibilityLabel="جاري تحميل الخريطة" size="large" />
        </View>
      }
    >
      <MapLibreProfileLocationMap coordinate={coordinate} onChange={onChange} onInteractiveChange={onInteractiveChange} recenterToken={recenterToken} />
    </Suspense>
  );
}
