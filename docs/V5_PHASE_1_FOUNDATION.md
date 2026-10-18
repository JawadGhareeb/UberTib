# Patient V5 — Phase 1 Foundation

Phase 1 implements the reusable Patient V5 foundation while preserving the existing patient business rules.

## Handoff source

The supplied `UberTib_Patient_V5_Client_Dev_Handoff.pen` is the design reference. Its React Native handoff maps the canonical implementation to these existing targets:

- `ScreenShell → Screen` — `src/shared/components/ui/screen.tsx`
- `AppHeader` — `src/shared/components/navigation/app-header.tsx`
- `Button` primary / secondary / destructive — `src/shared/components/ui/button.tsx`
- `TextField` — `src/shared/components/ui/text-field.tsx`
- `EmptyState` — `src/shared/components/ui/empty-state.tsx`
- `RecoveryState` — `src/shared/components/ui/recovery-state.tsx`
- `StatusTag / StatusIndicator`
- `AppText`
- `AppIcon`
- `BottomNavigation` — Expo Tabs in `src/app/(tabs)/_layout.tsx`

The bottom navigation contract remains the existing Expo Tabs implementation: focused expanded, inactive compact, pressed state, hidden on keyboard, Arabic labels, selected accessibility state and Reduce Motion support.

## Canonical tokens

The handoff's `Appearance` variables mirror `src/shared/theme/tokens.json`:

- semantic light/dark surface, text, border, action, focus, state and tone roles
- IBM Plex Sans Arabic
- spacing: 4 / 8 / 16 / 24 / 32 / 48
- size: control 48, comfortable target 44, icons 16 / 20 / 24
- radius: control 8, surface 12, chip 6
- motion: 120 / 180 / 240 / 320 ms
- AppText variants: display, heading-1..4, body, body-strong, label, caption

October 2026 identity decision: primary buttons, selected primary controls and logo all use the **same exact solid `#00E0B8`** in light and dark, with white action labels/icons as requested. See `docs/BRAND_THEME_2026.md` for the resulting contrast caveat.

## Screen shell

The V5 reference shell documents a 64px app bar, 12px separation below it, optional context, 16px separation before the first card and 16px horizontal margins. Device widths 360 / 390 / 430 are preview references, not runtime breakpoints.

`Screen` now accepts optional `header` and `context` slots while remaining backward-compatible with existing feature screens.

## Added presentation primitives

The Navigation & Feedback board also defines reusable presentation patterns. Phase 1 adds:

- `Card` — default, subtle and selected reading surfaces
- `FeedbackState` — offline, error, empty, requires-action, rejected, pending and success treatments
- `LoadingSkeleton` — Reduce Motion aware placeholder
- `BottomSheetSurface` — modal bottom-sheet shell
- `Snackbar` — temporary non-blocking message/action surface

These are presentation-only; feature/domain layers still own business state.

## Input states

`TextField` and `PhoneNumberField` now expose visible focus, error and read-only/disabled treatments through semantic roles. Phone values remain explicitly LTR inside the Arabic shell.

## Guardrails

- Arabic-first and RTL-first.
- Use semantic variables, never hard-coded product/status colors in feature components.
- No gradients or glassmorphism.
- No shadow on resting cards; light elevation is reserved for floating surfaces.
- Status meaning is never color-only.
- Filled primary and destructive actions use white labels and icons.
- Phone numbers, OTPs, IDs, prices, dates and timestamps remain bidi-safe.
- Use responsive React Native layout; 360 / 390 / 430 are documentation references only.
- Do not duplicate canonical components under new paths.
