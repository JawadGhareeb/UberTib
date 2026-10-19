import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

import type { ProfileLocationMapProps } from './profile-location-map.types';
import { getThemeColors, type ThemeScheme } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme/use-app-theme';

// Web fallback uses the same OpenFreeMap / MapLibre style as the native picker.
// The iframe is sandboxed: the pinned third-party map script cannot access app state.
const MAP_MESSAGE = 'upertib-location-picker';

function createMapDocument(latitude: number, longitude: number, scheme: ThemeScheme): string {
  const colors = getThemeColors(scheme);
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
<link href="https://unpkg.com/maplibre-gl@5.15.0/dist/maplibre-gl.css" rel="stylesheet" />
<style>
html,body,#map { margin:0; padding:0; width:100%; height:100%; overflow:hidden; }
body { font-family:system-ui,sans-serif; background:${colors.surface.subtle}; }
.maplibregl-control-container { direction:ltr; }
#unavailable { display:none; position:absolute; inset:0; place-items:center;
  text-align:center; padding:20px; color:${colors.text.primary}; background:${colors.surface.subtle}; }
</style>
</head>
<body>
<div id="map"></div>
<div id="unavailable">تعذّر تحميل الخريطة، تحقق من الاتصال بالإنترنت.</div>
<script src="https://unpkg.com/maplibre-gl@5.15.0/dist/maplibre-gl.js"></script>
<script>
(function () {
  const start = [${longitude}, ${latitude}];
  const unavailable = document.getElementById('unavailable');
  if (!window.maplibregl) { unavailable.style.display = 'grid'; parent.postMessage({type:'${MAP_MESSAGE}', ready:false}, '*'); return; }
  try {
    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://tiles.openfreemap.org/styles/${scheme === 'dark' ? 'dark' : 'liberty'}',
      center: start, zoom: 13.5,
      attributionControl: true,
    });
    window.addEventListener('message', (event) => {
      if (event.source !== parent || event.data?.type !== '${MAP_MESSAGE}') return;
      const point = event.data.recenter;
      if (Array.isArray(point) && point.length === 2 &&
          Number.isFinite(point[0]) && Number.isFinite(point[1]) &&
          Math.abs(point[0]) <= 180 && Math.abs(point[1]) <= 90) {
        map.easeTo({center: point, duration: 350});
      }
    });
    map.addControl(new maplibregl.NavigationControl({showCompass:false}), 'bottom-left');
    map.on('load', () => parent.postMessage({type:'${MAP_MESSAGE}', ready:true}, '*'));
    // The pin stays fixed on screen while the user moves the map underneath it.
    const pin = document.createElement('div');
    pin.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-100%);pointer-events:none;z-index:2;font-size:35px;color:${colors.action.primary};text-shadow:0 1px 4px ${colors.surface.default};';
    pin.textContent = '📍';
    document.body.appendChild(pin);
    function notifyCenter() {
      const center = map.getCenter();
      const lat = Number(center.lat), lon = Number(center.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
      parent.postMessage({type:'${MAP_MESSAGE}', latitude:lat, longitude:lon}, '*');
    }
    map.on('dragend', notifyCenter);
    map.on('zoomend', (event) => { if (event.originalEvent) notifyCenter(); });
    map.on('click', (event) => {
      map.easeTo({center:event.lngLat, duration:220});
      const lat = Number(event.lngLat.lat), lon = Number(event.lngLat.lng);
      if (Number.isFinite(lat) && Number.isFinite(lon))
        parent.postMessage({type:'${MAP_MESSAGE}', latitude:lat, longitude:lon}, '*');
    });
    map.on('error', () => { /* Network errors do not overwrite the user's pin. */ });
  } catch {
    unavailable.style.display = 'grid';
    parent.postMessage({type:'${MAP_MESSAGE}', ready:false}, '*');
  }
}());
</script>
</body></html>`;
}

export function ProfileLocationMap({
  coordinate,
  onChange,
  onInteractiveChange,
  recenterToken = 0,
}: ProfileLocationMapProps) {
  const { scheme } = useAppTheme();
  const [initialCoordinate] = useState(() => coordinate);
  const mapDocument = useMemo(
    () => createMapDocument(initialCoordinate.latitude, initialCoordinate.longitude, scheme),
    [initialCoordinate, scheme],
  );
  const onChangeRef = useRef(onChange);
  const coordinateRef = useRef(coordinate);
  const onInteractiveChangeRef = useRef(onInteractiveChange);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  useEffect(() => {
    onChangeRef.current = onChange;
    onInteractiveChangeRef.current = onInteractiveChange;
    coordinateRef.current = coordinate;
  }, [onChange, onInteractiveChange, coordinate]);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (!frameRef.current || event.source !== frameRef.current.contentWindow) return;
      const value = event.data as {
        type?: string;
        latitude?: number;
        longitude?: number;
        ready?: boolean;
      } | null;
      if (value?.type === MAP_MESSAGE && typeof value.ready === 'boolean') {
        onInteractiveChangeRef.current?.(value.ready);
        if (value.ready) {
          const point = coordinateRef.current;
          frameRef.current.contentWindow?.postMessage(
            {
              type: MAP_MESSAGE,
              recenter: [point.longitude, point.latitude],
            },
            '*',
          );
        }
        return;
      }
      if (
        value?.type !== MAP_MESSAGE ||
        typeof value.latitude !== 'number' ||
        typeof value.longitude !== 'number' ||
        !Number.isFinite(value.latitude) ||
        !Number.isFinite(value.longitude) ||
        Math.abs(value.latitude) > 90 ||
        Math.abs(value.longitude) > 180
      )
        return;
      onChangeRef.current({ latitude: value.latitude, longitude: value.longitude });
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);

  useEffect(() => {
    if (recenterToken < 1) return;
    const point = coordinateRef.current;
    frameRef.current?.contentWindow?.postMessage(
      {
        type: MAP_MESSAGE,
        recenter: [point.longitude, point.latitude],
      },
      '*',
    );
  }, [recenterToken]);

  return (
    <View className="flex-1 bg-surface-subtle">
      {createElement('iframe', {
        ref: frameRef,
        key: scheme,
        title: 'خريطة تحديد الموقع',
        srcDoc: mapDocument,
        sandbox: 'allow-scripts',
        style: { width: '100%', height: '100%', border: 0 },
      })}
    </View>
  );
}
