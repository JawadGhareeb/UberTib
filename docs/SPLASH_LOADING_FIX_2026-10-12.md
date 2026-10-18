> **Theme update — 2026-10-12:** Default appearance is now Light (`#F9F9F9`) from the native startup/splash through the JavaScript loader. `userInterfaceStyle` is fixed to `light` to prevent dark-mode devices from showing a dark first frame. Explicit Dark selections inside the application remain available and persist through secure preferences. Rebuild the native binary for these launch appearance changes.

# Splash / Loading fix — 2026-10-12

## Why the logo was invisible

The original three repository PNG files were not usable brand artwork:
- `src/shared/assets/icon.png` displayed a teal square on white.
- `Logo 1.png` appeared solid black and `Logo 2.png` appeared solid white.
- `app.json` relied on deprecated `expo.splash`, with no SDK 57 `expo-splash-screen` plugin.

## Changes made

- Replaced `icon.png` with a visible **temporary** tooth/check mark, matching the existing `#00E0B8` primary and dark startup background. This mark is **not claimed as the official brand logo**.
- Added `splash-mark.png` with identical checked, valid PNG bytes.
- Native Android/iOS launch screen uses the `expo-splash-screen` config plugin with the new asset at 180px. Both appearance variants now use the Light startup background.
- The React Native in-app loading component still uses `BrandMark`, which resolves the now-visible `icon.png` asset. The font-loading fallback in `src/app/_layout.tsx` also uses this asset.
- Added `scripts/check-splash-assets.mjs`, wired through `npm run splash:check` and `npm run check`.
- Removed the older `expo.splash` config to avoid conflicting settings.

## Rebuild instructions

**Changing the native splash or app icon requires an entirely new app build**, not only Metro refresh or an OTA update.

```bash
npm ci
npm run splash:check
npx expo start -c
# Native release-like internal build (choose one or both):
npx eas-cli build --platform android --profile preview
npx eas-cli build --platform ios --profile preview
```

Install the new Android APK/iOS internal distribution build on the device. Uninstall/reinstall if the device caches an old launch image.

**Expo Go / development-client caveat:** these environments do not reliably show the native splash properties configured for a standalone binary. Test the preview or production build for the native launch screen. The JavaScript in-app loader can be checked in development.

## Official logo asset handoff

When the actual official UperTib mark becomes available, replace both PNGs with that artwork (correct contrast and centered transparency), and rebuild. Do not replace them with the previous flat-color placeholder images. The mark used in this fix is intentionally provisional so loading is visibly branded instead of blank.

## Verification status

Checked the committed PNG content/validity and the source path/plugin/lock consistency. Device and release build testing were **not** performed. Existing GitHub Quality workflow reports failure; do not call this production-verified until a release-like build passes.
