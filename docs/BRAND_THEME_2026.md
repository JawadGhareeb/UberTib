# UberTeb brand palette (patient app — October 2026)

## Source and naming

The user's October 2026 UberTeb Concept 1 palette supersedes all older colors for the Patient UI. Do not rename existing UperTib routes or internal identifiers during a visual change.

## Exact identity swatches

- **Primary brand and interactive primary:** `#00E0B8` (light and dark, with no hue substitution).
- **Black:** `#111111`.
- **Charcoal:** `#2A2A2A`.
- **White:** `#FFFFFF`.

The logo and Primary buttons use **exactly the same brand teal**. Neither the dark theme nor a pressed/active state may replace Primary with a darker or different teal. Buttons, tabs and selected controls use a solid fill, never a gradient.

The single source of truth for the approved brand swatches is `src/shared/theme/tokens.json → brand`. `npm run theme:sync` derives all non-status surface, text, border and selected-state colors from those swatches; `npm run theme:check` ensures the generated palette stays synchronized. UI components use semantic colors via `useAppTheme()` and NativeWind classes. **Never manually tune an isolated green tint in a screen.**

The same JSON file also defines the `typography` scale consumed by `AppText` through NativeWind `text-type-*` utilities. The original Pen V5 Arabic type roles were display 32/42, H1 30/40, H2 24/36, H3 20/32, H4 18/28, body 16/28, label 14/20 and caption 14/22. The **October 11 user-approved compact override** reduces the live app scale to **display 28/38, H1 24/34, H2 20/30, H3 18/28, H4 16/25, body 14/23, label 13/21, and caption 11.5/19**. Onboarding title/copy use 23/34 and 14/23. All values are device-independent points. See `docs/PEN_V5_LAYOUT_CONTRACT.md`. Edit these shared roles, not dozens of hand-tuned screens. Layouts should grow vertically at larger system font scales, never crop content with fixed card heights.

Identity-derived tints are used for quiet decoration and focus states; informational, warning and danger status colors remain separate so their meanings are not erased. Changing `brand.mark` requires `npm run theme:sync` and then a new build or Metro restart so Tailwind utilities refresh.

## Light and dark appearance

- Light: near-white canvas, `#FFFFFF` cards, `#111111` main copy.
- Dark: near-black canvas, `#111111` cards, `#2A2A2A` secondary surfaces, `#FFFFFF` main copy.
- **Both:** `action.primary = action.primaryActive = brand.mark = #00E0B8`.
- Primary action labels and icons: white in both themes by explicit design request.
- Destructive actions: red fill, white foreground.
- **All interactive text links, outline button labels, icons and outline borders use the exact `#00E0B8` Primary**, including on light backgrounds. No darker legacy teal swatch is permitted for these roles. The contrast limitation of this choice is documented below.

## Contrast and limitations

White text directly on the specified `#00E0B8` Primary has only about **1.7:1** contrast, below WCAG AA's 4.5:1 normal-text threshold. The exact-brand-fill + white-text pairing is therefore an explicit visual requirement **with a known accessibility limitation**. Do not silently darken Primary to make a contrast test pass. A future accessibility fix needs separate user approval, e.g. a dark backing behind white text or a foreground change.

Gradients and glow are not used on regular app screens. The dark startup SplashScreen is an explicit exception based on the October 12 screenshot: its subtle glow/gradient derive from the current Primary, without changing page surfaces, buttons or the native app icon. **Default appearance on a fresh install is Light**, regardless of the OS appearance. A user-selected Dark/Light preference from Profile → Settings remains stored and takes precedence on future launches. Do not automatically switch appearance when the OS changes. Logo assets are never tinted by theme.

## Dental chart assets

`src/shared/components/ui/tooth-svg.tsx` is a vector `react-native-svg` component with incisor, canine, premolar and molar shapes. These are reconstructed semantic illustrations, **not an export of the Pen handoff**. To achieve exact visual parity, export the original teeth layer group from `UberTib_Patient_V5_Client_Dev_Handoff.pen` as SVG and substitute its shapes, retaining FDI tooth IDs and selectable hit targets.

## Form controls and dental anatomy

Text, date, location, phone and select controls share the compact form treatment. `FieldSurface` provides semantic border, label, optional icon and validation feedback; `TextField` and `SelectField` reuse it. Basic field tokens are `size.formField = 56` and `radius.formField = 14`. Their normal and focused outline uses the current Primary, not the darker legacy green. Do not create a separate 68/72px field style within feature screens. Segmented/radio controls use compatible geometry with at least 44px touch targets.

Dental vector outlines live in `tooth-svg.tsx` and the dental selector. Lower outlines require visible root ends and an expanded SVG viewBox. Do not clip the arch to a fixed-height row or replace individual clickable targets with a single static picture.

## Unified app icon asset

Use `src/shared/assets/icon.png` as the single approved image for the brand mark, native app icon, adaptive launcher foreground, favicon and launch splash. Do not recreate the deleted generated `src/shared/assets/brand/upertib-*.png` variants. The primary header places notifications on the RTL right and the brand on the left; secondary-screen back buttons keep their established direction.
