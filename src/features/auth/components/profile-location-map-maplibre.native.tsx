import { Camera, Map } from '@maplibre/maplibre-react-native';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';

import { AppIcon } from '@/shared/components/ui';
import type { Coordinate, ProfileLocationMapProps } from './profile-location-map.types';
import { useAppTheme } from '@/shared/theme/use-app-theme';

type LngLat = [longitude: number, latitude: number];

const OPEN_FREE_MAP_LIGHT_STYLE = 'https://tiles.openfreemap.org/styles/liberty';
const OPEN_FREE_MAP_DARK_STYLE = 'https://tiles.openfreemap.org/styles/dark';

function isLngLat(value: unknown): value is LngLat {
  return Array.isArray(value) && value.length === 2 &&
    typeof value[0] === 'number' && Number.isFinite(value[0]) && Math.abs(value[0]) <= 180 &&
    typeof value[1] === 'number' && Number.isFinite(value[1]) && Math.abs(value[1]) <= 90;
}

function fromLngLat([longitude, latitude]: LngLat): Coordinate {
  return { latitude, longitude };
}

/**
 * Pinned-center picker: the patient pans or zooms the MAP, not a draggable
 * native ViewAnnotation. The fixed pin cannot swallow gestures, and the map's
 * center is the precise coordinate saved by the parent screen.
 */
export function MapLibreProfileLocationMap({ coordinate, onChange, onInteractiveChange, recenterToken = 0 }: ProfileLocationMapProps) {
  const { scheme } = useAppTheme();
  const cameraRef = useRef<React.ComponentRef<typeof Camera>>(null);
  const mapStyle = scheme === 'dark' ? OPEN_FREE_MAP_DARK_STYLE : OPEN_FREE_MAP_LIGHT_STYLE;

  useEffect(() => {
    if (recenterToken > 0) {
      cameraRef.current?.easeTo({ center: [coordinate.longitude, coordinate.latitude], duration: 350 });
    }
    // Token changes only when GPS is explicitly selected, not on every drag.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recenterToken]);

  return (
    <View className="flex-1">
      <Map
        androidView="texture"
        attribution
        attributionPosition={{ bottom: 8, left: 8 }}
        compass={false}
        dragPan
        touchZoom
        doubleTapZoom
        touchRotate={false}
        touchPitch={false}
        mapStyle={mapStyle}
        onDidFinishLoadingMap={() => {
          onInteractiveChange?.(true);
          if (recenterToken > 0) {
            cameraRef.current?.easeTo({ center: [coordinate.longitude, coordinate.latitude], duration: 350 });
          }
        }}
        onDidFailLoadingMap={() => onInteractiveChange?.(false)}
        onRegionDidChange={(event) => {
          const { center, userInteraction } = event.nativeEvent;
          if (userInteraction && isLngLat(center)) onChange(fromLngLat(center));
        }}
        onPress={(event) => {
          const point = event.nativeEvent.lngLat;
          if (!isLngLat(point)) return;
          onChange(fromLngLat(point));
          cameraRef.current?.easeTo({ center: point, duration: 220 });
        }}
        style={{ flex: 1 }}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: [coordinate.longitude, coordinate.latitude],
            zoom: 15,
          }}
        />
      </Map>

      <View
        accessibilityElementsHidden
        className="absolute inset-0 items-center justify-center"
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
      >
        <View className="items-center" style={{ transform: [{ translateY: -30 }] }}>
          <View className="h-12 w-12 items-center justify-center rounded-full border-[3px] border-action-primary bg-surface-default">
            <AppIcon
              name={{ ios: 'mappin', android: 'location_on', web: 'location_on' }}
              size={25}
              tone="action"
            />
          </View>
          <View className="h-3 w-[3px] rounded-full bg-action-primary" />
        </View>
      </View>
    </View>
  );
}
