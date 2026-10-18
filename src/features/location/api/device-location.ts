import * as Location from 'expo-location';

import type { Coordinate } from '@/features/auth/components/profile-location-map.types';

export type DeviceLocationResult =
  | { ok: true; coordinate: Coordinate }
  | { ok: false; message: string };

const MAX_LOCATION_AGE_MS = 20_000;
const MAX_LOCATION_ACCURACY_METERS = 2_000;

function usable(coords: Location.LocationObjectCoords): boolean {
  return (
    Number.isFinite(coords.latitude) &&
    Math.abs(coords.latitude) <= 90 &&
    Number.isFinite(coords.longitude) &&
    Math.abs(coords.longitude) <= 180 &&
    (coords.accuracy === null || coords.accuracy <= MAX_LOCATION_ACCURACY_METERS)
  );
}

/**
 * Real device GPS only. Do not substitute a static Aleppo point or a
 * neighbourhood label when geolocation is denied/unavailable.
 */
export async function getDevelopmentDeviceLocation(): Promise<DeviceLocationResult> {
  if (!__DEV__) return { ok: false, message: 'الموقع التلقائي متاح أثناء التطوير فقط.' };

  try {
    if (!(await Location.hasServicesEnabledAsync())) {
      return { ok: false, message: 'فعّل خدمة الموقع (GPS) بالجهاز وحاول مرة ثانية.' };
    }

    let permission = await Location.getForegroundPermissionsAsync();
    if (!permission.granted && permission.canAskAgain) {
      permission = await Location.requestForegroundPermissionsAsync();
    }
    if (!permission.granted) {
      return { ok: false, message: 'اسمح للتطبيق باستخدام الموقع من إعدادات الجهاز.' };
    }

    const lastKnown = await Location.getLastKnownPositionAsync({
      maxAge: MAX_LOCATION_AGE_MS,
      requiredAccuracy: MAX_LOCATION_ACCURACY_METERS,
    });
    if (lastKnown && usable(lastKnown.coords)) {
      return {
        ok: true,
        coordinate: {
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        },
      };
    }

    const current = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    if (!usable(current.coords)) {
      return { ok: false, message: 'دقة الموقع منخفضة. افتح GPS وحاول مرة ثانية.' };
    }
    return {
      ok: true,
      coordinate: { latitude: current.coords.latitude, longitude: current.coords.longitude },
    };
  } catch {
    return {
      ok: false,
      message: 'ما قدرنا نحدد موقع الجهاز. تأكد من صلاحية الموقع أو أعد تشغيل نسخة التطوير.',
    };
  }
}
