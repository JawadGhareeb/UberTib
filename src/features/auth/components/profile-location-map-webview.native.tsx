import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Button, Typography } from 'heroui-native';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';

import type { Coordinate, ProfileLocationMapProps } from './profile-location-map.types';
import { getThemeColors, type ThemeScheme } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme/use-app-theme';

function validPoint(value: Coordinate): boolean {
  return (
    Number.isFinite(value.latitude) &&
    Number.isFinite(value.longitude) &&
    Math.abs(value.latitude) <= 90 &&
    Math.abs(value.longitude) <= 180
  );
}

const MAP_DOCUMENT =
  '<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n<meta charset="utf-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>\n<link rel="stylesheet" href="https://unpkg.com/maplibre-gl@5.15.0/dist/maplibre-gl.css"/>\n<style>\n*{box-sizing:border-box}\nhtml,body,#map{height:100%;width:100%;margin:0;padding:0;overflow:hidden}\nbody{background:#f3f6f5;font-family:system-ui,sans-serif}\n#status{position:absolute;inset:0;z-index:3;display:flex;align-items:center;justify-content:center;text-align:center;padding:20px;color:#444;font-size:13px;background:#f3f6f5;line-height:1.8}\n#pin{pointer-events:none;position:absolute;left:50%;top:50%;z-index:2;transform:translate(-50%,-100%);filter:drop-shadow(0 3px 4px #3334)}\n.maplibregl-control-container{direction:ltr}\n</style></head>\n<body><div id="map"></div>\n<div id="status">جاري تحميل الخريطة…</div>\n<div id="pin" aria-hidden="true"><svg width="42" height="54" viewBox="0 0 42 54">\n<path d="M21 2C10 2 2 11 2 22c0 15 19 30 19 30s19-15 19-30C40 11 32 2 21 2Z" fill="#00CDAA" stroke="white" stroke-width="3"/>\n<circle cx="21" cy="22" r="7.5" fill="#fff"/></svg></div>\n<script>\n(function(){\n const status=document.getElementById(\'status\');\n const send=data=>window.ReactNativeWebView?.postMessage(JSON.stringify(data));\n let initialized=false;\n const fail=()=>{\n  status.textContent=\'ما قدرنا نحمّل الخريطة. تأكد من اتصال الإنترنت وحاول مجدداً.\';\n  status.style.display=\'flex\';\n  send({type:\'ready\',value:false});\n };\n window.__onMapScriptError=fail;\n window.__createMap=()=>{\n  if(!window.maplibregl){fail();return;}\n  try{\n   const map=new maplibregl.Map({\n     container:\'map\',\n     style:\'https://tiles.openfreemap.org/styles/liberty\',\n     center:[__LONGITUDE__, __LATITUDE__],zoom:14,\n     attributionControl:true,\n   });\n   map.addControl(new maplibregl.NavigationControl({showCompass:false}),\'bottom-left\');\n   map.on(\'load\',()=>{initialized=true;status.style.display=\'none\';send({type:\'ready\',value:true});});\n   const selectedPoint=point=>{\n     if(initialized&&Number.isFinite(point.lng)&&Number.isFinite(point.lat))\n       send({type:\'selected\',latitude:point.lat,longitude:point.lng});\n   };\n   map.on(\'dragend\',()=>selectedPoint(map.getCenter()));\n   map.on(\'zoomend\',event=>{if(event.originalEvent)selectedPoint(map.getCenter());});\n   map.on(\'click\',event=>{map.easeTo({center:event.lngLat,duration:250});selectedPoint(event.lngLat);});\n   window.__upertibRecenter=(lon,lat)=>{\n     if(!Number.isFinite(lon)||!Number.isFinite(lat)||Math.abs(lon)>180||Math.abs(lat)>90)return;\n     map.easeTo({center:[lon,lat],duration:400,zoom:Math.max(map.getZoom(),14)});\n   };\n   window.setTimeout(()=>{if(!initialized)fail();},18000);\n  }catch(_){fail();}\n };\n})();\n</script>\n<script src="https://unpkg.com/maplibre-gl@5.15.0/dist/maplibre-gl.js" onload="window.__createMap()" onerror="window.__onMapScriptError()"></script>\n</body></html>';

function documentFor(initial: Coordinate, scheme: ThemeScheme): string {
  const colors = getThemeColors(scheme);
  const latitude = validPoint(initial) ? initial.latitude : 36.2021;
  const longitude = validPoint(initial) ? initial.longitude : 37.1343;
  return MAP_DOCUMENT.replace('__LATITUDE__', String(latitude))
    .replace('__LONGITUDE__', String(longitude))
    .replaceAll('#f3f6f5', colors.surface.subtle)
    .replace('color:#444', 'color:' + colors.text.primary)
    .replace('styles/liberty', 'styles/' + (scheme === 'dark' ? 'dark' : 'liberty'))
    .replace('#00CDAA', colors.action.primary);
}

/**
 * Interactive fallback for Expo Go: WebView is bundled with Expo Go, MapLibre
 * native is not. A gesture or tap selects the pin's coordinate.
 */
export function WebViewProfileLocationMap({
  coordinate,
  onChange,
  onInteractiveChange,
  recenterToken = 0,
}: ProfileLocationMapProps) {
  const { scheme, colors } = useAppTheme();
  const view = useRef<WebView>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const ready = status === 'ready';
  const [initialCoordinate] = useState(() => coordinate);
  const document = useMemo(
    () => documentFor(initialCoordinate, scheme),
    [initialCoordinate, scheme],
  );
  const latest = useRef(coordinate);
  const changeHandler = useRef(onChange);
  const availabilityHandler = useRef(onInteractiveChange);

  useEffect(() => {
    latest.current = coordinate;
    changeHandler.current = onChange;
    availabilityHandler.current = onInteractiveChange;
  }, [coordinate, onChange, onInteractiveChange]);

  useEffect(() => {
    if (recenterToken === 0 || !ready) return;
    const point = latest.current;
    if (!validPoint(point)) return;
    view.current?.injectJavaScript(
      'window.__upertibRecenter?.(' + point.longitude + ',' + point.latitude + ');true;',
    );
  }, [recenterToken, ready]);

  const message = (event: WebViewMessageEvent) => {
    let payload: {
      type?: string;
      value?: boolean;
      latitude?: number;
      longitude?: number;
    };
    try {
      payload = JSON.parse(event.nativeEvent.data) as typeof payload;
    } catch {
      return;
    }

    if (payload.type === 'ready' && typeof payload.value === 'boolean') {
      setStatus(payload.value ? 'ready' : 'failed');
      availabilityHandler.current?.(payload.value);
      return;
    }
    if (
      payload.type === 'selected' &&
      typeof payload.latitude === 'number' &&
      typeof payload.longitude === 'number'
    ) {
      const point = { latitude: payload.latitude, longitude: payload.longitude };
      if (validPoint(point)) changeHandler.current(point);
    }
  };

  return (
    <View className="flex-1 bg-surface-subtle" style={{ flex: 1 }}>
      <WebView
        key={scheme}
        ref={view}
        source={{ html: document, baseUrl: 'https://tiles.openfreemap.org/' }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled={false}
        onMessage={message}
        onError={() => {
          setStatus('failed');
          availabilityHandler.current?.(false);
        }}
        onLoadStart={() => {
          setStatus('loading');
          availabilityHandler.current?.(false);
        }}
        style={{ flex: 1, backgroundColor: colors.surface.subtle }}
        scrollEnabled={false}
      />
      {status === 'loading' ? (
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center bg-surface-subtle"
        >
          <ActivityIndicator size="large" accessibilityLabel="جاري تحميل الخريطة" />
        </View>
      ) : status === 'failed' ? (
        <View className="absolute inset-0 items-center justify-center gap-4 bg-surface-subtle px-6">
          <Typography.Paragraph
            className="font-ui-medium text-text-secondary"
            style={{ textAlign: 'center', writingDirection: 'rtl' }}
          >
            تعذّر تحميل الخريطة. تأكد من اتصال الإنترنت ثم أعد المحاولة.
          </Typography.Paragraph>
          <Button
            variant="outline"
            size="lg"
            className="rounded-form-field"
            onPress={() => {
              setStatus('loading');
              view.current?.reload();
            }}
          >
            <Button.Label className="font-ui-semibold">إعادة تحميل الخريطة</Button.Label>
          </Button>
        </View>
      ) : null}
    </View>
  );
}
