import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Button, Typography } from 'heroui-native';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileLocationMap } from '@/features/auth/components/profile-location-map';
import type { Coordinate } from '@/features/auth/components/profile-location-map.types';
import { getDevelopmentDeviceLocation } from '@/features/location/api/device-location';
import { reverseGeocodeArabic } from '@/features/location/api/reverse-geocode';
import { usePreferredLocation } from '@/features/location/state/preferred-location-provider';
import { OutlineIcon } from '@/shared/components/media/outline-icon';
import { AuthBackButton } from '@/shared/components/navigation/auth-back-button';
import { useAppTheme } from '@/shared/theme/use-app-theme';

const DEFAULT_CENTER: Coordinate = { latitude: 36.2021, longitude: 37.1343 };

function validCoordinate(value: Coordinate) {
  return (
    Number.isFinite(value.latitude) &&
    Number.isFinite(value.longitude) &&
    Math.abs(value.latitude) <= 90 &&
    Math.abs(value.longitude) <= 180
  );
}

export function LocationPickerScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { location, setLocation } = usePreferredLocation();
  const [coordinate, setCoordinate] = useState<Coordinate>(location?.coordinate ?? DEFAULT_CENTER);
  const [selection, setSelection] = useState<{
    label?: string;
    source: 'saved' | 'gps' | 'map';
  } | null>(location ? { label: location.label, source: 'saved' } : null);
  const [mapReady, setMapReady] = useState(false);
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [recenterToken, setRecenterToken] = useState(0);
  const mounted = useRef(true);

  // Ask for location access when opening this screen, but never require GPS
  // permission to select a point manually on the map.
  useEffect(() => {
    mounted.current = true;
    const requestOnEntry = async () => {
      try {
        const permission = await Location.getForegroundPermissionsAsync();
        if (!permission.granted && permission.canAskAgain) {
          await Location.requestForegroundPermissionsAsync();
        }
      } catch {
        // Manual map selection must keep working even without device-location support.
      }
    };
    void requestOnEntry();
    return () => {
      mounted.current = false;
    };
  }, []);

  const locateDeviceNow = async () => {
    if (locating || saving) return;
    setLocating(true);
    setError('');
    try {
      const gps = await getDevelopmentDeviceLocation();
      if (!mounted.current) return;
      if (!gps.ok) {
        setError(gps.message);
        return;
      }
      setCoordinate(gps.coordinate);
      setSelection({ source: 'gps' });
      setRecenterToken((token) => token + 1);
    } finally {
      if (mounted.current) setLocating(false);
    }
  };

  const changeMapPoint = (next: Coordinate) => {
    if (!validCoordinate(next)) return;
    setCoordinate(next);
    setSelection({ source: 'map' });
    setError('');
  };

  const save = async () => {
    if (!selection || saving) return;
    setSaving(true);
    setError('');
    let label = selection.label;

    if (!label) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6500);
      try {
        label = await reverseGeocodeArabic(coordinate, controller.signal);
      } catch {
        // A real selected coordinate is still valid if reverse geocoding is offline.
        label =
          'موقع محدد · ' + coordinate.latitude.toFixed(4) + ', ' + coordinate.longitude.toFixed(4);
      } finally {
        clearTimeout(timeout);
      }
    }
    if (!mounted.current) return;
    setLocation({ coordinate, label, selectionVersion: 2 });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-canvas" style={{ flex: 1 }}>
      <View className="mx-auto w-full max-w-[430px] flex-1 px-5 pb-6 pt-3">
        <View
          className="min-h-14 flex-row items-center justify-between"
          style={{ direction: 'rtl' }}
        >
          <AuthBackButton label="رجوع إلى إكمال الملف" onPress={() => router.back()} />
          <Typography.Heading
            type="h3"
            className="font-ui-bold text-text-primary"
            style={{ textAlign: 'right', writingDirection: 'rtl', lineHeight: 35, paddingTop: 4 }}
          >
            حدّد منطقتك
          </Typography.Heading>
          <View className="w-11" />
        </View>

        <Typography.Paragraph
          className="mt-2 mb-4 font-ui-regular text-text-secondary"
          style={{ textAlign: 'right', writingDirection: 'rtl', lineHeight: 27 }}
        >
          حرّك الخريطة لتحديد النقطة تحت المؤشّر، أو استخدم موقعك الحالي.
        </Typography.Paragraph>

        <View
          className="min-h-[300px] flex-1 overflow-hidden rounded-form-field border border-border-default bg-surface-subtle"
          style={{ flex: 1 }}
        >
          <ProfileLocationMap
            coordinate={coordinate}
            onChange={changeMapPoint}
            onInteractiveChange={setMapReady}
            recenterToken={recenterToken}
          />
          <View pointerEvents="none" className="absolute left-3 right-3 top-3 items-center">
            <View className="rounded-full bg-surface-default px-4 py-2">
              <Typography.Paragraph
                type="body-sm"
                className="font-ui-medium text-text-primary"
                style={{ textAlign: 'center', writingDirection: 'rtl' }}
              >
                {mapReady ? 'حرّك الخريطة أو اضغط لتحديد الموقع' : 'جاري تهيئة الخريطة…'}
              </Typography.Paragraph>
            </View>
          </View>
        </View>

        <View className="mt-4 gap-3">
          <Button
            variant="outline"
            size="lg"
            className="min-h-[52px] rounded-form-field"
            isDisabled={locating || saving}
            onPress={() => void locateDeviceNow()}
          >
            <View className="flex-row items-center gap-2" style={{ direction: 'rtl' }}>
              <OutlineIcon name="map-pin" size={21} color={colors.action.primary} />
              <Typography.Paragraph className="font-ui-semibold text-text-primary">
                {locating ? 'جاري تحديد الموقع…' : 'استخدام موقعي الحالي'}
              </Typography.Paragraph>
            </View>
          </Button>

          <View className="min-h-12 rounded-form-field bg-action-subtle px-4 py-3">
            <Typography.Paragraph
              type="body-sm"
              className="font-ui-medium text-text-primary"
              style={{ textAlign: 'right', writingDirection: 'rtl', lineHeight: 23 }}
            >
              {selection?.label ??
                (selection
                  ? 'تم تحديد الموقع، اضغط اعتماد الموقع للحفظ.'
                  : 'حدّد نقطة على الخريطة أو استخدم موقعك الحالي للمتابعة.')}
            </Typography.Paragraph>
          </View>

          {error ? (
            <Typography.Paragraph
              className="font-ui-medium text-tone-danger-text"
              style={{ textAlign: 'right', writingDirection: 'rtl', lineHeight: 26 }}
            >
              {error}
            </Typography.Paragraph>
          ) : null}

          <Button
            variant="primary"
            size="lg"
            className="min-h-[54px] rounded-form-field bg-action-primary"
            isDisabled={!selection || saving}
            onPress={() => void save()}
          >
            <Button.Label className="font-ui-semibold text-text-on-action">
              {saving ? 'جاري حفظ الموقع…' : 'اعتماد الموقع'}
            </Button.Label>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
