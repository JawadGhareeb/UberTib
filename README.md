# UperTib Mobile

Patient-facing React Native application for UperTib.

## Stack

- Expo SDK 57 + Expo Router
- React Native + strict TypeScript
- HeroUI Native + Uniwind + Tailwind CSS 4
- TanStack React Query
- Expo Secure Store
- IBM Plex Sans Arabic
- ESLint + Prettier

## Current development mode

The Patient app is currently **mock-first**. No screen requires a live backend URL and no Patient flow should call a network API until backend integration is explicitly enabled.

The local mocks preserve the screen and state contracts while the real backend contracts are still being completed. The supplied Postman collection remains useful as example-shape reference material, but it is not treated as a live dependency of this app.

## Source of truth

Product behavior and UX contracts are owned by `UperTip/UperTib-Docs`. This repository implements the Patient mobile surface and must not invent backend business rules.

Read `docs/MOBILE_FOUNDATION.md`, `docs/DESIGN_SYSTEM_RULES.md` and `AGENTS.md` before adding a feature.

## Start

```bash
npm install
npm run start
```

No `.env` file is required for the current mock-first build.

MapLibre uses native code and is not included in Expo Go. Expo Go and web use the safe
coordinate fallback; build the app locally for the interactive native map:

```bash
npm run android
```

Rebuild the native app after installing or upgrading MapLibre. Restarting Metro alone does not
add native modules to an existing binary.

## HeroUI Native development preview

## Mobile build verification

Use `npm run lint` to verify the entire repo with **zero allowed ESLint warnings** and `npm run typecheck` to check strict TypeScript. `npm run build` is the single local gate: Lint, TypeScript, canonical Uniwind theme validation, Android Expo production JS export and iOS Expo production JS export. Generated files go to `dist/android` and `dist/ios` (ignored by Git).

```bash
npm run lint
npm run typecheck
npm run build
```

The `build` script validates **Expo JavaScript bundles** for both platforms. It does **not** produce a signed APK/AAB/IPA; native binaries require an EAS or native toolchain build and real-device QA remains necessary.

The design-system preview route is `/dev/ui-kit` (development builds only). It exercises HeroUI Native Button, Card and Input, the UberTib Arabic font, and light/dark brand themes without changing patient screens.

```bash
npm run uniwind:theme:sync
npm run uniwind:theme:check
npm run start
```

The CSS theme is generated from `src/shared/theme/tokens.json`. Never edit `src/shared/theme/uniwind-theme.css` by hand. HeroUI Native is focused on iOS/Android; web parity is not part of this migration test. Android/iOS JS bundles can be checked with Expo export, but device validation is still required.

## Mock verification

Phone verification is local-only during UI development.

```text
Verification code: 123456
```

## Quality gate

```bash
npm run check
```
