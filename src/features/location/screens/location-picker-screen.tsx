import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

import { ProfileLocationMap } from '@/features/auth/components/profile-location-map';
import type { Coordinate } from '@/features/auth/components/profile-location-map.types';
import { reverseGeocodeArabic } from '@/features/location/api/reverse-geocode';
import { getDevelopmentDeviceLocation } from '@/features/location/api/device-location';
import { usePreferredLocation } from '@/features/location/state/preferred-location-provider';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button, Screen } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

const ALEPPO_CENTER: Coordinate = { latitude: 36.2021, longitude: 37.1343 };
const UNRESOLVED_LABEL = 'موقع محدد على الخريطة';

export function LocationPickerScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { location, setLocation } = usePreferredLocation();
  const [coordinate, setCoordinate] = useState<Coordinate>(
    location?.coordinate ?? ALEPPO_CENTER,
  );
  const [saving, setSaving] = useState(false);
  const [mapInteractive, setMapInteractive] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(__DEV__);
  const [gpsSelected, setGpsSelected] = useState(false);
  const [recenterToken, setRecenterToken] = useState(0);
  const manuallySelected = useRef(false);
  const mounted = useRef(true);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const hasChosenLocation = touched || Boolean(location);
  // Only development GPS can bypass an unavailable native map. Never save
  // Aleppo's placeholder or an old location through that fallback.
  const canConfirm = mapInteractive
    ? hasChosenLocation
    : __DEV__ && touched && gpsSelected;
  const selectedLabel = gpsSelected
    ? 'موقع الجهاز الحالي'
    : touched
      ? 'تم اختيار نقطة جديدة على الخريطة'
      : location?.label || 'لم يتم تحديد موقع بعد';

  const locateDevice = useCallback(async () => {
    if (!__DEV__) return;
    setGpsLoading(true);
    setError('');
    const result = await getDevelopmentDeviceLocation();
    if (!mounted.current) return;
    setGpsLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    // The user may have chosen a point on the map while GPS was loading.
    if (manuallySelected.current) return;
    setCoordinate(result.coordinate);
    setTouched(true);
    setGpsSelected(true);
    setRecenterToken((current) => current + 1);
  }, []);

  useEffect(() => {
    mounted.current = true;
    if (__DEV__) void locateDevice();
    return () => { mounted.current = false; };
  }, [locateDevice]);

  const onChange = (next: Coordinate) => {
    if (
      !Number.isFinite(next.latitude) || Math.abs(next.latitude) > 90 ||
      !Number.isFinite(next.longitude) || Math.abs(next.longitude) > 180
    ) return;

    manuallySelected.current = true;
    setCoordinate(next);
    setTouched(true);
    setGpsSelected(false);
    setError('');
  };

  const confirm = async () => {
    if (saving || !canConfirm) return;
    setSaving(true);
    setError('');
    try {
      // Only the coordinates under the pin are authoritative. A previously
      // typed neighbourhood must never override the actual selected point.
      // Geocoder labels are best-effort and never move the saved pin.
      let place = gpsSelected ? 'موقعي الحالي' : UNRESOLVED_LABEL;
      const geocoding = new AbortController();
      const timeout = setTimeout(() => geocoding.abort(), 6500);
      try {
        const resolved = (await reverseGeocodeArabic(coordinate, geocoding.signal)).trim();
        if (resolved.length >= 2) place = resolved;
      } catch {
        // Reverse-geocoding is best effort. Keep the selected GPS coordinates.
      } finally {
        clearTimeout(timeout);
      }

      setLocation({ coordinate, label: place, selectionVersion: 2 });
      router.back();
    } catch {
      setError('تعذّر حفظ الموقع. حاول مرة ثانية.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen contentClassName="px-0 pb-0 pt-0">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="mx-auto w-full max-w-[430px] flex-1 px-4 pb-4 pt-2"
      >
        <View className={cn('h-12 items-center justify-between', rowClassName)}>
          <Pressable
            accessibilityLabel="رجوع"
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-full bg-surface-default"
            onPress={() => router.back()}
          >
            <AppIcon
              name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
              size={20}
              tone="action"
            />
          </Pressable>
          <AppText className="font-ui-bold" variant="heading-3">
            حدّد منطقتك
          </AppText>
        </View>

        <AppText align="right" className="mb-3 mt-1 text-content-secondary" variant="caption">
          {__DEV__
            ? 'موقعك الحالي بيتحدد تلقائياً. فيك تغيّره من الخريطة.'
            : 'حرّك الخريطة أو اضغط على المكان المطلوب.'}
        </AppText>

        <View className="relative min-h-[220px] flex-1 overflow-hidden rounded-[20px] border border-action-primary bg-surface-subtle">
          <ProfileLocationMap
            coordinate={coordinate}
            onChange={onChange}
            onInteractiveChange={setMapInteractive}
            recenterToken={recenterToken}
          />

          <View
            className="absolute left-3 right-3 top-3 flex-row items-center justify-center gap-2 self-center rounded-[12px] bg-surface-default px-3 py-2"
            pointerEvents="none"
          >
            <AppIcon
              name={{ ios: 'hand.draw', android: 'touch_app', web: 'touch_app' }}
              size={16}
              tone="action"
            />
            <AppText align="center" className="font-ui-medium" variant="caption">
              حرّك الخريطة لتحديد النقطة تحت المؤشر
            </AppText>
          </View>
        </View>

        <View className="mt-3 gap-2 rounded-[14px] border border-border-subtle bg-surface-default p-3">
          <View className={cn('items-center gap-2', rowClassName)}>
            <AppIcon
              name={{ ios: 'mappin.circle', android: 'place', web: 'place' }}
              size={20}
              tone="action"
            />
            <View className="min-w-0 flex-1 items-end">
              <AppText align="right" className="font-ui-semibold" variant="label">
                الموقع المحدد
              </AppText>
              <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
                {selectedLabel}
              </AppText>
            </View>
          </View>

          {__DEV__ ? (
            <Button
              label={gpsLoading ? 'جاري تحديد موقع الجهاز' : 'استخدام موقعي الحالي'}
              loading={gpsLoading}
              disabled={gpsLoading || saving}
              size="sm"
              variant="outline"
              onPress={() => {
                manuallySelected.current = false;
                void locateDevice();
              }}
            />
          ) : null}

          {!mapInteractive && !gpsSelected ? (
            <AppText align="right" className="text-tone-warning-text" variant="caption">
              الخريطة غير متاحة في هذه النسخة. {__DEV__
                ? 'استخدم موقع الجهاز الحالي بعد السماح بالوصول إلى GPS.'
                : 'يلزم فتح النسخة الداعمة للخرائط لتحديد الموقع.'}
            </AppText>
          ) : null}
          {!mapInteractive && gpsSelected ? (
            <AppText align="right" className="text-content-secondary" variant="caption">
              تم تحديد موقع الجهاز. يمكنك اعتماده حتى لو الخريطة ما اشتغلت بنسخة التطوير.
            </AppText>
          ) : null}

          {mapInteractive && !hasChosenLocation ? (
            <AppText align="right" className="text-tone-warning-text" variant="caption">
              الموقع الظاهر مجرد معاينة. حرّك الخريطة أو اضغط على مكانك قبل الاعتماد.
            </AppText>
          ) : null}
          {error ? (
            <AppText accessibilityLiveRegion="polite" align="right" className="text-tone-danger-text" variant="caption">
              {error}
            </AppText>
          ) : null}
        </View>

        <Button
          className="mt-3 h-[52px] rounded-[12px]"
          disabled={saving || !canConfirm}
          label="اعتماد الموقع"
          loading={saving}
          loadingLabel="عم نحفظ الموقع"
          onPress={() => void confirm()}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}
