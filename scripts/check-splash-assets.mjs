import { existsSync, readFileSync } from 'node:fs';

const app = JSON.parse(readFileSync('app.json', 'utf8')).expo;
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const brandMark = readFileSync('src/shared/components/brand/brand-mark.tsx', 'utf8');
const inAppLoader = readFileSync('src/features/app-entry/components/splash-screen.tsx', 'utf8');
const root = readFileSync('src/app/_layout.tsx', 'utf8');
const errors = [];

const splashConfig = app.plugins.find((p) => Array.isArray(p) && p[0] === 'expo-splash-screen')?.[1];
if (!splashConfig) errors.push('Expo SDK 57 requires an expo-splash-screen config plugin.');
if (app.userInterfaceStyle !== 'light') errors.push('Native launch must default to Light, independently of OS Dark mode.');
if (splashConfig?.backgroundColor !== '#F9F9F9' ||
    splashConfig?.dark?.backgroundColor !== '#F9F9F9') {
  errors.push('Native splash colors must match Light startup and prevent Dark flash.');
}
const themeProvider = readFileSync('src/shared/theme/theme-provider.tsx', 'utf8');
if (!themeProvider.includes("useState<ThemeScheme>('light')") ||
    !themeProvider.includes("setSchemeState(storedScheme)") ||
    !themeProvider.includes('setThemeScheme(nextScheme)')) {
  errors.push('Theme must default to Light and keep explicitly selected/persisted Dark.');
}
if (!root.includes('backgroundColor: \'#F9F9F9\'') ||
    !root.includes('<StatusBar backgroundColor="#F9F9F9" style="dark" />')) {
  errors.push('Font loading must use a Light surface and dark status icons.');
}
if (!inAppLoader.includes('SPLASH_BACKGROUND = theme.color.surface.canvas') ||
    !inAppLoader.includes('backgroundColor={SPLASH_BACKGROUND} style="dark"')) {
  errors.push('In-app splash must match the Light startup theme.');
}
if (app.splash) errors.push('Legacy expo.splash must not conflict with the config plugin.');
if (pkg.dependencies['expo-splash-screen'] !== lock.packages[''].dependencies['expo-splash-screen']) {
  errors.push('Splash dependency mismatches package-lock.json.');
}
if (!lock.packages['node_modules/expo-splash-screen']) {
  errors.push('Missing expo-splash-screen dependency lock entry.');
}

const sources = [
  splashConfig?.image,
  splashConfig?.dark?.image,
  app.icon,
  app.android?.adaptiveIcon?.foregroundImage,
];
for (const source of sources) {
  if (!source) {
    errors.push('Missing image path for one of the configured app/splash variants.');
    continue;
  }
  const path = source.replace(/^\.\//, '');
  if (!existsSync(path)) {
    errors.push('Missing splash PNG: ' + path);
    continue;
  }
  const image = readFileSync(path);
  const pngSignature = Buffer.from('89504e470d0a1a0a', 'hex');
  if (!image.subarray(0, 8).equals(pngSignature)) {
    errors.push('Invalid PNG header: ' + path);
    continue;
  }
  const width = image.readUInt32BE(16), height = image.readUInt32BE(20);
  if (width < 128 || height < 128 || image.length < 1500) {
    errors.push('Splash asset too small or nearly empty: ' + path);
  }
}

if (!brandMark.includes("require('../../assets/icon.png')")) {
  errors.push('In-app BrandMark no longer references the checked asset.');
}
if (!inAppLoader.includes('<BrandMark size={88} />')) {
  errors.push('Custom loading screen must render the real brand image.');
}
if (!root.includes("require('../shared/assets/icon.png')")) {
  errors.push('Font preload must render the brand image without a blank frame.');
}

if (errors.length) {
  process.stderr.write(errors.join('\n') + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('Native and in-app splash images, Expo plugin and lockfile are aligned.\n');
}
