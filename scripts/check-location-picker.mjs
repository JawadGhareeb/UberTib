import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const errors = [];
const requireFeature = (passed, message) => { if (!passed) errors.push(message); };

const nativeMap = read('src/features/auth/components/profile-location-map-maplibre.native.tsx');
const wrapper = read('src/features/auth/components/profile-location-map.native.tsx');
const webMap = read('src/features/auth/components/profile-location-map.web.tsx');
const picker = read('src/features/location/screens/location-picker-screen.tsx');
const provider = read('src/features/location/state/preferred-location-provider.tsx');
const home = read('src/features/patient-home/screens/patient-home-screen.tsx');
const deviceLocation = read('src/features/location/api/device-location.ts');
const nativeConfig = JSON.parse(read('app.json')).expo;
const packageJson = JSON.parse(read('package.json'));
const lockfile = JSON.parse(read('package-lock.json'));

requireFeature(
  nativeMap.includes('dragPan') &&
  nativeMap.includes('touchZoom') &&
  nativeMap.includes('onRegionDidChange') &&
  nativeMap.includes('userInteraction && isLngLat(center)') &&
  nativeMap.includes('onChange(fromLngLat(center))') &&
  nativeMap.includes('onPress={(event) =>') &&
  nativeMap.includes('pointerEvents="none"') &&
  !nativeMap.includes('<ViewAnnotation'),
  'Native map must allow pan/tap and pin the selected coordinate to the viewport center',
);
requireFeature(
  nativeMap.includes("androidView=\"texture\"") &&
  nativeMap.includes('onDidFinishLoadingMap={() => {') &&
  nativeMap.includes('onInteractiveChange?.(true);') &&
  nativeMap.includes('onDidFailLoadingMap={() => onInteractiveChange?.(false)}'),
  'Native map must report rendering readiness and avoid false success',
);
requireFeature(
  wrapper.includes('hasMapLibreNativeModules') &&
  wrapper.includes('onInteractiveChange?.(false)'),
  'Map fallback must not allow saving an unselected or inaccessible map',
);
requireFeature(
  webMap.includes("map.on('dragend', notifyCenter)") &&
  webMap.includes("map.on('load', () => parent.postMessage") &&
  webMap.includes("pin.style.cssText") &&
  webMap.includes("pointer-events:none"),
  'Web map must use a non-blocking fixed center pin and report drag selections',
);
requireFeature(
  picker.includes('const canConfirm = mapInteractive') &&
  picker.includes('__DEV__ && touched && gpsSelected') &&
  picker.includes('onInteractiveChange={setMapInteractive}') &&
  picker.includes('setLocation({ coordinate, label: place, selectionVersion: 2 })') &&
  picker.includes('await reverseGeocodeArabic(coordinate, geocoding.signal)') &&
  !picker.includes('lookupAddress') &&
  !picker.includes('تعرّف على العنوان') &&
  !picker.includes('setLabel(') &&
  !picker.includes('placeholder="مثلاً: حلب، العزيزية"'),
  'Picker must save only an actual mapped point or valid development GPS, never a typed neighborhood',
);
requireFeature(
  deviceLocation.includes("if (!__DEV__)") &&
  deviceLocation.includes('requestForegroundPermissionsAsync') &&
  deviceLocation.includes('getCurrentPositionAsync') &&
  deviceLocation.includes('MAX_LOCATION_AGE_MS') &&
  deviceLocation.includes('MAX_LOCATION_ACCURACY_METERS') &&
  !deviceLocation.includes('ALEPPO_CENTER') &&
  picker.includes('void locateDevice()') &&
  picker.includes('manuallySelected.current') &&
  picker.includes("setGpsSelected(true)") &&
  picker.includes("setRecenterToken((current) => current + 1)") &&
  picker.includes('label="اعتماد الموقع"') &&
  picker.includes('recenterToken={recenterToken}') &&
  picker.includes('new AbortController()') &&
  picker.includes('clearTimeout(timeout)'),
  'Development GPS must request permission, reject stale/fake points, and not overwrite map selections',
);
requireFeature(
  nativeMap.includes('recenterToken = 0') &&
  nativeMap.includes('cameraRef.current?.easeTo') &&
  webMap.includes('recenterToken = 0') &&
  webMap.includes('recenter: [point.longitude, point.latitude]') &&
  wrapper.includes('recenterToken={recenterToken}'),
  'Map camera should recenter only when the patient explicitly requests device location',
);
requireFeature(
  packageJson.dependencies['expo-location'] === '~57.0.17' &&
  lockfile.packages[''].dependencies['expo-location'] === '~57.0.17' &&
  lockfile.packages['node_modules/expo-location']?.version === '57.0.17' &&
  nativeConfig.plugins.some((p) => Array.isArray(p) && p[0] === 'expo-location'),
  'Expo Location package, lockfile and native permission plugin must agree',
);

requireFeature(
  provider.includes('setPreferredLocation(JSON.stringify(next))') &&
  provider.includes('entry.selectionVersion === 2') &&
  home.includes('PATIENT_TAB_BAR_HEIGHT + 10') &&
  !home.includes('px-3 pb-28 pt-3'),
  'Saved location must persist and home must not leave a huge gap below final cards',
);

if (errors.length) {
  process.stderr.write(errors.join('\n') + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('Interactive map, verified save source and tab-bottom layout contracts checked.\n');
}
