# Pen V5 — Patient visual parity contract

The uploaded `UberTib_Patient_V5_Client_Dev_Handoff.pen` is the source of truth for **geometry, content layout, typography, imagery and responsive behavior**. This contract applies to the patient app implementation, not to backend business rules.

## Brand color exception (explicit product decision)

The original Pen file has legacy green swatches. **Do not copy those into the app.** Preserve the app's currently approved `src/shared/theme/tokens.json → brand.mark = #00E0B8` and its generated light/dark semantic action palette. Never change the primary color merely to resemble a Pen preview. Replace any leftover legacy green used for brand/selection/interactive purposes with `bg-action-primary`, `border-action-primary`, `bg-action-subtle`, and `colors.action.primary` for icon tints. The current approved requirement also uses the exact Primary for action links and outline control labels; keep neutral text and status semantics distinct. Preserve non-brand warning, success, danger, skin-tone/peach and neutral colors from the design. `npm run theme:check` governs derived brand tints.

## Literal dimensions extracted from Pen

Reference artboard: **390 × 844**. Device variants **360**, **390**, **430** are preview widths, *not runtime breakpoints*. Use flexible layout, intrinsic content height, safe areas and text wrapping. Avoid globally scaling UI, including Arabic text and border radii.

- **Onboarding screen:** horizontal padding 20, top 14, bottom 20, vertical spacing 12
- **Onboarding progress navigation:** height 36; progress dots 7 × 7, active dot 20 × 7; gap 6
- **Onboarding illustration:** height 340; corner radius 24
- **Onboarding copy region:** height at least 118; gap 8; title 26; paragraph 15
- **Onboarding CTA:** height 52; corner radius 12; icon 20; bold label 16
- **Onboarding first-use note:** font size 11
- **Four assessment-step cards:** X 24 within the 350-wide illustration; width 302, height 62, radius 16; gap 16
- **Doctor illustration cards:** X 14 and 185, Y 18, width 151, height 304, radius 18, padding 12
- **Doctor illustration avatars:** 76 × 76, with warm/teal artwork differentiated
- **Care illustration rail:** X 305, Y 40, width 3, height 252; 6 rows of 290 × 44
- **Shared control:** minimum 48, touch target at least 44, radius 8
- **Shared resting card:** radius 12
- **Spacing scale:** 4, 8, 16, 24, 32, 48

Pen typography defaults: **display 32/42, H1 30/40, H2 24/36, H3 20/32, H4 18/28, body 16/28, label 14/20 and caption 14/22** (font size/line height). All use IBM Plex Sans Arabic. These are archived source-design measurements. On October 11 the user explicitly approved a **smaller, calmer typography system** for the running app. The current runtime scale is recorded in `docs/BRAND_THEME_2026.md` and the shared `tokens.json` typography roles; avoid additional ad-hoc per-screen shrinking.

Not all screens use the same horizontal inset: many normal pages use **16**, onboarding uses **20**, and several entry pages use **24**. Inspect the individual Pen screen before choosing a padding value; never globally force 20 or 24 everywhere.

## Adaptation and verification

1. At width 390 and ordinary font scaling, match Pen geometry, alignment, artwork and copy.
2. At width 360, prefer `flexShrink`, wrapping, and scroll overflow rather than clipped content, tiny text or transformed corner radii.
3. At width 430, preserve content proportions and reasonable max widths; do not stretch fixed-size icons, avatars or teeth.
4. Test smaller heights, large Arabic accessibility text, reduced motion, iOS and Android safe-area insets, RTL and both themes.
5. Validate screens individually; shared tokens alone do not mean all screens are pixel-matched. No screen may silently acquire its own legacy brand swatch or arbitrary font override.

## Current implementation boundaries

The onboarding visuals, shared typography and shared action-icon dimensions are being migrated using this contract. The **other journeys still require per-route screenshot comparison and layout verification** before claiming 1:1 fidelity across the app.

## Consistent bottom navigation

All patient bottom bars share `src/shared/components/navigation/patient-tab-metrics.ts`. The inside-safe-area navigation bars in discovery and care must not apply bottom safe-area insets a second time. The Expo Tabs container accounts for the physical bottom inset exactly once. This fixes tab height changing between Home, Care, Bookings and Profile.
