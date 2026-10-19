import { existsSync, readFileSync } from 'node:fs';

const app = JSON.parse(readFileSync('app.json', 'utf8')).expo;
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const root = readFileSync('src/app/_layout.tsx', 'utf8');
const theme = readFileSync('src/shared/theme/theme-preference.ts', 'utf8');
const tokens = JSON.parse(readFileSync('src/shared/theme/tokens.json', 'utf8'));
const errors = [];

const splashConfig = app.plugins.find(
  (p) => Array.isArray(p) && p[0] === 'expo-splash-screen',
)?.[1];
if (!splashConfig) errors.push('Expo splash config plugin is missing.');
if (app.userInterfaceStyle !== 'automatic') {
  errors.push(
    'Native UI style must allow the saved Uniwind preference to control the OS surfaces.',
  );
}
if (
  splashConfig?.backgroundColor !== tokens.color.surface.canvas ||
  splashConfig?.dark?.backgroundColor !== tokens.color.surface.canvas
) {
  errors.push(
    'Launch splash background must match branded Light preload, independent of saved theme.',
  );
}
if (
  !root.includes('initializePreferredTheme()') ||
  !root.includes('!fontsLoaded || !themeReady') ||
  !root.includes('setThemeReady(true)')
) {
  errors.push('Navigation must wait for fonts and persisted theme to avoid theme flash.');
}
if (
  !theme.includes('Uniwind.setTheme(scheme)') ||
  !theme.includes('Appearance.setColorScheme(scheme)') ||
  !theme.includes('secureStorage.getThemeScheme()') ||
  !theme.includes('secureStorage.setThemeScheme(scheme)')
) {
  errors.push(
    'Theme must be global, provider-free, applied to Uniwind/native and persisted securely.',
  );
}
if (app.splash) errors.push('Legacy expo.splash must not conflict with the splash plugin.');
if (
  pkg.dependencies['expo-splash-screen'] !== lock.packages[''].dependencies['expo-splash-screen']
) {
  errors.push('Expo splash dependency differs from package lock.');
}
if (!lock.packages['node_modules/expo-splash-screen'])
  errors.push('Splash dependency absent from lockfile.');
if (!root.includes("require('../shared/assets/icon.png')")) {
  errors.push('Font preload must render the project brand image.');
}

for (const source of [
  splashConfig?.image,
  splashConfig?.dark?.image,
  app.icon,
  app.android?.adaptiveIcon?.foregroundImage,
]) {
  if (!source) {
    errors.push('Missing required launch image.');
    continue;
  }
  const path = source.replace(/^\.\//, '');
  if (!existsSync(path)) {
    errors.push('Missing image: ' + path);
    continue;
  }
  const image = readFileSync(path);
  if (
    !image.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')) ||
    image.length < 1500 ||
    image.readUInt32BE(16) < 128 ||
    image.readUInt32BE(20) < 128
  ) {
    errors.push('Invalid splash/icon PNG: ' + path);
  }
}
if (errors.length) {
  process.stderr.write(errors.join('\n') + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write(
    'Expo launch, native theme, persisted Uniwind hydration and branding are aligned.\n',
  );
}
