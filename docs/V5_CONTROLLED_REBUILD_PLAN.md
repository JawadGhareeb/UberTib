# Patient V5 — Controlled Rebuild Plan

## Goal

Rebuild the Patient mobile app section by section so the shipped React Native UI follows the supplied `UberTib_Patient_V5_Client_Dev_Handoff.pen` rather than preserving older screen styling.

The rebuild is intentionally controlled: business behavior, route contracts, providers, mock state, RTL rules and domain logic stay in place unless the V5 handoff explicitly replaces them. Visual shells are replaced one slice at a time and obsolete presentation code is removed only after its replacement passes checks.

## Non-negotiable implementation rules

- Expo Router route files stay thin and only select feature screens.
- Feature logic stays inside its feature.
- Shared primitives remain product-agnostic.
- Arabic remains app-owned RTL while the native root stays LTR.
- Phone numbers, OTPs, dates and machine values stay LTR/bidi-safe.
- IBM Plex Sans Arabic and semantic theme roles remain the typography/theme foundation.
- No backend behavior is invented while the app is mock-first.
- Every rebuilt screen must cover loading, disabled, error and recovery states that apply to it.
- 360 / 390 / 430 widths are checked before a section is complete.
- A section is not considered complete until `npm run check` passes and the implementation is visually compared with the V5 handoff.

## Execution status

- Phase 1 — App entry + Auth: merged through PR #42, with Pen-exact follow-up in PR #46.
- Phase 2 — Assessment + Home: merged through PR #49 after the initial assessment rebuild in PR #43.
- Phase 3 — Discovery: merged through PR #50.
- Phase 4 — Booking: merged through PR #51.
- Phase 5 — Care and follow-up: merged through PR #52.
- Phase 6 — Payments, issues and verified reviews: merged through PR #53.
- Phase 7 — Profile, family and settings: merged through PR #54.
- Phase 8 — Consolidation: completed on PR #55. Route audit passed for all 60 feature screens, RTL/readability/semantic-color/dead-code consolidation is applied, and Quality run #558 passed before merge.

## Rebuild sequence

### Phase 1 — App entry + Auth

Reference: section `02 — البداية وإنشاء الحساب`.

Screens:

- session splash
- onboarding O-01: understand the complaint
- onboarding O-02: step-by-step journey
- onboarding O-03: choose/compare a doctor
- onboarding O-04: care timeline
- phone sign-in
- OTP verification
- basic profile completion

Work:

- rebuild AppEntry around splash + first-use onboarding
- persist onboarding completion
- rebuild phone field as one governed compound control
- rebuild OTP layout and resend states
- align profile setup geometry/content with the handoff while retaining the native date/map behavior
- preserve existing auth mock behavior and safe return intent
- remove only superseded entry/auth presentation code

### Phase 2 — Assessment

Reference: section `03 — فهم الحالة وتحديد الحاجة`.

Rebuild the assessment start, patient selection, complaint, location, questions, health, media, review, processing and result flow from the V5 board. Keep scenario/mutation truth in the existing feature layer.

### Phase 3 — Discovery

Reference: section `04 — استكشاف الخدمات واختيار الطبيب`.

Rebuild service discovery, provider results, comparison, provider details and rationale. Keep provider freshness/protection semantics explicit and patient-safe.

### Phase 4 — Booking

Reference: section `05 — الحجز وتأكيد الموعد`.

Rebuild slot selection, booking review/details, alternative appointment, cancellation and reschedule. Sensitive mutations remain pending until authoritative completion.

### Phase 5 — Care

Reference: section `06 — العلاج والمتابعة`.

Rebuild care overview, treatment plan, plan acceptance/amendment, stages, follow-ups and timeline. Preserve version/change/price-difference semantics.

### Phase 6 — Payments, issues and reviews

Reference: section `07 — الدفعات والمشكلات والتقييم`.

Rebuild financial timeline/events, payment reporting, refunds, claims, appeals and reviews with governed states instead of decorative status UI.

### Phase 7 — Profile, family and support

Reference: section `08 — الحساب والعائلة والدعم`.

Rebuild profile, active patient, dependents/family, grants, pending submissions and settings.

### Phase 8 — Consolidation

- delete superseded screen-local UI and dead assets
- remove duplicate components
- verify every route against the handoff interaction map
- run full RTL/LTR-value audit
- run Light/Dark and accessibility audit
- run `npm run check`
- perform final 360 / 390 / 430 screenshot comparison

## Deletion policy

Do not mass-delete future feature routes at the beginning of the rebuild. A route or component is deleted when its V5 replacement is implemented and verified. This keeps the repository runnable throughout the migration and prevents UI cleanup from accidentally deleting business behavior that the later V5 screens still need.

## Phase completion gate

Each phase must satisfy all four gates before moving on:

1. Visual match — hierarchy, spacing, geometry, typography and state treatments match the corresponding V5 board.
2. Behavioral match — navigation, mutations and mock contracts still behave correctly.
3. Technical quality — strict TypeScript, feature boundaries, no dead/debug code.
4. Product quality — Arabic RTL, bidi safety, accessibility, Light/Dark and recovery states are verified.
