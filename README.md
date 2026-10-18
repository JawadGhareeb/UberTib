# UperTib Mobile

Patient-facing React Native application for UperTib.

## Stack

- Expo SDK 57 + Expo Router
- React Native + strict TypeScript
- NativeWind
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

## Mock verification

Phone verification is local-only during UI development.

```text
Verification code: 123456
```

## Quality gate

```bash
npm run check
```
