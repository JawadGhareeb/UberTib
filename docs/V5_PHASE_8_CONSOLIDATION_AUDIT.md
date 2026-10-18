# Patient V5 — Phase 8 Consolidation Audit

## Scope

Phase 8 consolidates the Patient V5 rebuild after phases 1–7 reached `main`. The goal is to remove superseded presentation code, verify navigation coverage, eliminate avoidable RTL drift, improve readability, and ensure rebuilt screens use semantic theme roles consistently.

## Completed consolidation work

### Navigation

- Audited all 60 feature screens that contain navigation.
- Compared every discovered literal navigation target against the current Expo Router tree.
- Result: 60/60 screens resolve only to existing routes; no dead literal navigation target remains.
- The previously removed `/profile/pending-submissions` path is no longer referenced.

### RTL and direction

- Shared `AppHeader` now resolves row direction through `AppDirectionProvider` rather than hard-coded `flex-row-reverse`.
- Contained `TextField` rows now use the same app-direction contract.
- Assessment choice/header rows were moved to the direction provider.
- Booking and Discovery detail headers were moved to the direction provider.
- The Patient Home duplicate header was removed in favor of the canonical shared `AppHeader`.

### Readability and accessibility

- Legacy V5 screen-local helper text at 7–11px was normalized to readable Tailwind text sizes.
- Compact supporting text now has a 12px floor; action/field labels use 14px where the previous screen-local override was smaller.
- Existing 44px/48px target rules remain owned by shared primitives.
- Patient platform reading surfaces were reduced from a 640px desktop-like cap to a 430px mobile cap.

### Theme and semantic colors

- Removed direct dark-card hex colors from treatment/follow-up content and replaced them with semantic surface/content roles.
- Removed an invalid `bg-surface-raised` utility that was not present in the Tailwind token map.
- Brand/onboarding illustration artwork keeps its intentional art-specific colors; those values are not used as UI action/status semantics.

### Dead and duplicate presentation code

- Removed the duplicate Patient Home header implementation and reused the shared header.
- Removed superseded `records-trust-screen.tsx`.
- Removed superseded `care-unavailable-panel.tsx`.
- Existing profile legacy components were already removed in PR #54.

## Responsive coverage

The rebuilt mobile shells use the established compact widths:

- 360px: content remains within the reading column with 16–24px horizontal padding.
- 390px: matches the primary V5 board geometry used by Assessment, Discovery, Booking and Care.
- 430px: App Entry/Auth/Profile and platform surfaces remain capped without horizontal overflow.

This audit verifies layout constraints statically. Final pixel-by-pixel screenshot comparison against the original Pen board still requires rendering the application on the target simulator/device.

## Quality gate

Before Phase 8 is marked complete:

1. Run Prettier on all changed source files.
2. Run `npm run check` (lint + TypeScript + formatting).
3. Merge only when the PR and post-merge `main` Quality runs pass.
