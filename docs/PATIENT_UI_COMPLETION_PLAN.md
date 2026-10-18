# UperTib Patient Mobile — UI Completion Plan

**Purpose:** finish the Patient mobile app as a complete, mock-backed, Arabic-first product UI before live API integration.

**Execution baseline:** `UperTip/upertip-mobile` on `main` after the first design-system audit.

**Canonical UX source:** `UperTip/UperTib-Docs` Phase 1–5 UX documents and Patient screen specifications.

**Visual completeness source:** `patient-screens-ar.html` — 47 canonical Patient screens and 230 approved states.

## Current status — 19 September 2026

Implementation status on `main`:

- **47/47 canonical Patient screens are implemented and route-mapped.**
- Product extras **Home + Settings** are implemented.
- Strict GitHub Quality workflow is restored and green: lint + TypeScript + Prettier.
- Arabic typography floors are aligned: Patient body 16px, labels/helpers/captions 14px.
- 44px comfortable targets and 48px standard controls are represented in the shared design system.
- Light + Dark semantic tokens, focus, selected and readonly roles are present.
- Auth preserves a safe `returnTo` intent instead of always routing OTP success to Home.
- Discover keeps provider area/sort/comparison/scroll context and uses filters as optional refinement.
- Structural read-state handling is wired through canonical read surfaces.
- Booking, representation, claims, reviews, finance and plan-acceptance mock mutations persist across navigation through the shared scenario provider instead of disappearing on back navigation.
- Sensitive clinical/financial/authorization actions use submitted/pending wording instead of optimistic final outcomes.
- Review, claim and financial records now reconcile list/detail views against the same session mutation overlay.
- Mock scenarios cover happy path, empty Patient, pending booking, alternative booking, pending care plan, claim review/appeal, review appeal, representation pending, stale/offline, partial failure and permission loss.
- Static accessibility audit completed for Patient screens: custom Pressables have roles, small text actions were raised to the target floor, physical RTL spacing was removed from the shared header, and BiDi isolation is handled by `AppText`.
- Reduced-motion handling is wired to the system preference for the current travel animations.
- Bottom-tab labels now respect the 14px Patient Arabic floor and no longer depend on a rigid fixed-height bar.

Still required before declaring production UI QA complete:

- visual smoke pass on **Android + iOS**,
- Light/Dark screenshot pass on the main flows,
- large-text runtime reflow/clipping pass,
- VoiceOver/TalkBack spot checks,
- final visual comparison against the 230 approved reference states.

---

## 1. What is already in good shape

The project is no longer a route prototype. The current code already has:

- Expo Router and a feature-based architecture.
- 4 persistent Patient tabs: Home, Discover, My Care, Profile.
- Screen implementations for the canonical Patient domains, plus product-level Home and Settings screens.
- Arabic-first rendering with app-owned RTL and BiDi isolation.
- Light/Dark semantic theme support.
- IBM Plex Sans Arabic.
- Shared header, text, buttons, fields, phone selector, state primitives and navigation icons.
- Mock catalog, providers, bookings, care, finance/reviews/claims, notifications and representation data.
- Working mock flows through discovery, provider selection, booking and care.
- Reduced-motion-aware base screen transition.
- React Query and a data-source boundary that can later swap Mock -> API.

The remaining work is mainly **system completion and audit**, not route creation.

---

## 2. Canonical product rules we will enforce

These come from the current `UperTib-Docs` UX system.

### Patient navigation

Keep exactly four primary destinations:

1. Home
2. Discover
3. My Care
4. Profile

Notifications, bookings, finance, reviews and claims remain contextual or utility destinations, not extra tabs.

### Patient visual character

The Patient app is:

**Arabic-first · calm · readable · accountable · one-column · low-chroma · flat**

Rules:

- one reading column at every Patient size class,
- cards only when the content is independently selectable/comparable,
- hairlines and surfaces instead of decorative shadows,
- no glassmorphism or gradients as product surfaces,
- no emoji or text-glyph icons when a governed icon exists,
- subtle motion only,
- weak connectivity and interrupted flows are designed states,
- no raw enum, backend, API or implementation language in Patient copy.

### Typography

Canonical floor:

- Arabic Patient body: **16px minimum**,
- Arabic helper/label/caption: **14px minimum**,
- Arabic letter spacing: **0**,
- hierarchy through weight/spacing, not shrinking Arabic text.

Implemented: `AppText.body` / `body-strong` use the 16px Patient floor, and Arabic label/helper/caption roles use the 14px floor.

### Touch targets

- standard Patient control: 48px,
- comfortable Patient target floor: 44px,
- no primary Patient action below that floor.

### Status

Status must never rely on color alone.

Every authoritative status should resolve to:

**label + governed tone + governed icon + emphasis**

Do not use a generic colored pill as the only status treatment.

### Motion

Use the canonical motion vocabulary:

- control feedback: 120ms,
- disclosure/state change: 180ms,
- overlay: ~240ms,
- ceiling: 320ms,
- reduced motion removes travel but preserves meaningful feedback.

---

# 3. Current gaps

## P0 — Build baseline — completed

- `npm run check` is green on the strict Quality workflow.
- lint/typecheck/format run without the temporary Prettier-write diagnostic.
- formatting-only CI failures from the audit batches were removed.
- every following batch must keep this baseline green.

---

## P0 — Design System V2 — implemented baseline

The shared semantic system now includes the required Patient foundations. Runtime visual verification remains part of the final device QA gate.

### Tokens aligned

Implemented:

- `semantic.color.focus.ring`
- `semantic.color.focus.ringContrast`
- `semantic.color.state.selected`
- `semantic.color.state.readonly`
- complete tone icon roles,
- complete tone emphasis roles,
- numeric text styles,
- helper text style separate from Patient body,
- canonical motion tokens.

Keep the current explicit product override:

> Patient mobile supports Light + Dark.

The source docs originally preserve dark as future compatibility, but the current mobile product decision explicitly enables it. Both schemes therefore remain required.

### Typography migration — completed

Implemented in the Patient text system:

- `body` / `body-strong` -> 16px minimum,
- `label` / `caption/helper` -> 14px minimum for Arabic,
- headings aligned closer to the canonical 18 / 20 / 24 scale,
- Western digits remain allowed for dates, times, amounts, OTP and identifiers,
- add tabular numeric treatment where practical.

### Shared components to build

Map implementation to the canonical Patient component system instead of hand-building the same pattern per screen.

Required shared components:

1. `StatusIndicator` — canonical state label/tone/icon.
2. `StateSummary` — authoritative state + key context.
3. `SubjectContextHeader` — active Patient/dependent context.
4. `ScreenActionBar` — primary/secondary actions with safe ordering.
5. `DeadlineIndicator` — deadlines and expiring actions.
6. `RecordList` / `RecordRow` — consistent list-to-detail behavior.
7. `SearchFilterBar` — search/filter/sort.
8. `EventTimeline` — bookings/care/finance/claims history.
9. `EmptyState` — already exists; align anatomy.
10. `RecoveryState` — already exists; expand stale/permission variants.
11. `SubmissionState` — submitting/retrying/unknown outcome/completed.
12. `EvidenceItem` — claims/dependent evidence.
13. `HumanAttribution` — who/when where relevant.
14. `SensitiveConfirmation` — cancellation, appeals, destructive/sensitive actions.
15. `AttentionItem` — Home / Needs Attention.
16. `PriceDisplay`.
17. `ProviderDecisionCard`.
18. `EligibilityExplanation`.
19. `TreatmentLine`.
20. `ChangeDisclosure` — plan/amendment changes.

### Icon rule

Use `expo-symbols` as the governed icon abstraction:

- SF Symbols on iOS,
- Material Symbols on Android/web,
- no `‹`, `⌕`, `★` or similar text glyph substitute where a symbol exists,
- decorative icons hidden from accessibility,
- interactive parent owns the accessibility label.

---

# 4. Mock Scenario Layer

The current mock data is coherent enough for the happy path, but it is spread across domain files.

Build one scenario layer above the domain mocks.

Suggested structure:

```text
src/shared/mock/
├── world/
│   ├── patient.ts
│   ├── catalog.ts
│   ├── providers.ts
│   ├── bookings.ts
│   ├── care.ts
│   ├── finance.ts
│   ├── reviews.ts
│   ├── claims.ts
│   └── representation.ts
├── scenarios/
│   ├── happy-path.ts
│   ├── empty-new-patient.ts
│   ├── booking-pending.ts
│   ├── booking-alternative.ts
│   ├── care-plan-pending.ts
│   ├── claim-under-review.ts
│   ├── claim-appeal-eligible.ts
│   ├── representation-pending.ts
│   ├── stale-offline.ts
│   ├── partial-failure.ts
│   └── permission-loss.ts
└── scenario-provider.tsx
```

### Rules

- same Patient ID everywhere,
- same provider ID everywhere,
- same service code everywhere,
- same booking/case/claim references everywhere,
- dates and amounts cannot contradict another screen,
- a notification deep-link always opens a record that exists,
- a Home attention item always corresponds to a real underlying record,
- a case financial total must match its accepted plan snapshot,
- completed treatments should produce appropriate reviewable history,
- claims/evidence must reference the same case and financial history.

### Mock repositories

The project keeps the repository/query boundary where it already exists and uses the shared scenario provider for cross-screen state. Some screen-local fixture reads still import domain mocks directly; these should move behind API repositories when live integration begins rather than forcing a rewrite now.

Today:

`MockRepository -> Query/Hook -> Screen`

Later:

`ApiRepository -> Query/Hook -> Screen`

No screen composition rewrite when API integration starts.

---

# 5. Structural State System — implemented across canonical read surfaces

`UperTib-Docs` defines structural read-state resolution globally.

Every relevant read surface must support:

1. `loading-initial`
2. `loading-refresh`
3. `empty-no-data`
4. `empty-filtered`
5. `partial`
6. `stale`
7. `error-fetch`
8. `error-permission`
9. `success`

### Precedence

- permission denial wins,
- fetch failure next,
- if old safe content exists prefer stale over blank error,
- initial loading uses skeletons,
- refresh keeps current content visible,
- empty only after a successful read,
- partial explicitly says what failed,
- success renders normal content.

### Mobile behavior

Add:

- pull-to-refresh where useful,
- explicit reachable refresh action,
- re-read on screen/app refocus where authoritative state matters,
- keep safe last-known content during refresh/fetch failure,
- as-of timestamp for stale data,
- do not show a committing action when state is stale/offline unless the command is explicitly resumable.

---

# 6. Mutation and form states — implemented mock contract

Sensitive commands cannot be represented only by a spinner.

Standard mutation states:

- ready,
- submitting,
- success,
- validation error,
- retryable failure,
- authoritative rejection,
- unknown outcome / reconciliation required,
- permission/authentication loss.

Rules:

- never destroy entered input on failure,
- never optimistically show clinical/financial/authorization outcomes,
- after a successful mutation, re-read authoritative state,
- unknown outcome reconciles before offering another submit,
- unauthorized actions disappear structurally instead of becoming misleading disabled buttons,
- disabled is reserved for temporary conditions in the active interaction.

---

# 7. User-flow completion

## Entry and authentication — completed mock flow

OTP success resolves a safe `returnTo` intent rather than always routing to Home.

Required flow:

```text
Public screen/action
-> authentication required
-> phone
-> OTP
-> returnTo exact origin
-> preserve search/filter/provider/slot context
```

Implemented:

- `returnTo`,
- serializable safe route intent,
- preserved discovery/provider/booking parameters,
- preserved comparison/discovery session state,
- auth success resolves the originating flow.

## Discover — completed mock flow

Current happy path:

```text
Discover
-> Service
-> Provider Results
-> Provider Detail
-> Slot
-> Review
```

Provider search/filter becomes **optional refinement**, not a forced screen.

Results default to:

- all areas,
- nearest availability,
- visible filter,
- visible sort.

Preserve result state when opening a provider and returning:

- query,
- area,
- sort,
- scroll position,
- comparison selection.

## Provider

Complete:

- rating/review count,
- branch,
- area,
- price,
- nearest availability,
- experience,
- governed eligibility/availability explanation,
- comparison,
- clear booking action.

No internal score, eligibility formula or classification leaks to Patient UI.

## Booking — completed mock flow

Implemented chain:

```text
Provider
-> Slot
-> Review
-> Submitted state
-> My Bookings
-> Booking Detail
├── Alternative
├── Cancel
└── Reschedule
```

Required state consistency:

- original booking remains visible while alternative/reschedule is unresolved,
- cancel explains effect before confirmation,
- reschedule does not silently replace the original appointment,
- submitted != confirmed,
- no dead disabled action in a valid mock scenario.

## My Care — completed mock flow

Implemented:

```text
Cases
-> Summary
├── Plan
│   -> Acceptance
├── Timeline
├── Stage
├── Follow-ups
├── Finance
├── Reviews
└── Claims
```

Priority order:

**authoritative status/identity -> primary facts -> related history -> current action**

## Profile and representation — completed mock flow

Implemented:

- active Patient context,
- family/dependents,
- grants,
- create grant,
- grant detail/revoke state,
- add dependent,
- pending submissions,
- preferences,
- logout.

Switching active Patient changes context only; it does not imply new authority.

---

# 8. Domain-by-domain completion matrix

- **Identity — 9 screens:** implemented; auth return-to-origin and representation mutation states are wired.
- **Catalog — 2 screens:** implemented with canonical typography and read-state handling.
- **Eligibility / Providers — 5 screens:** implemented; filter is optional, results session state is restored, comparison persists.
- **Platform — 3 screens:** implemented with unread/attention/pending semantics.
- **Booking — 7 screens:** implemented; cancel/reschedule/alternative states persist without replacing the authoritative booking optimistically.
- **Clinical — 7 screens:** implemented; plan acceptance is pending until confirmation and reconciles across Plan/Summary.
- **Finance — 5 screens:** implemented; external money wording and persistent reported/response states are wired.
- **Reviews — 4 screens:** implemented; active/retired/appeal and submitted-review states are represented.
- **Claims — 5 screens:** implemented; submitted claims, evidence, decisions and appeal-pending state reconcile across list/detail.
- **Product extras — Home + Settings:** implemented; Settings exposes Mock scenarios in development.

The remaining work across domains is runtime visual/accessibility QA, not missing screen functionality.

---

# 9. Screen audit order

Do not audit alphabetically.

Use the real Patient journey:

### Batch A — Foundation

- tokens
- typography
- icons
- status
- lists
- timeline
- state/recovery
- action bar
- sensitive confirmation
- motion

### Batch B — Home / Platform / Profile

- Home
- Needs Attention
- Notification Centre
- Profile
- Active Patient
- Family/Representation
- Pending Submissions
- Settings

### Batch C — Discover

- Service Groups
- Service Detail
- Provider Results
- Filters/Search
- Provider Detail
- Eligibility Explanation
- Comparison

### Batch D — Booking

- Slots
- Review
- My Bookings
- Booking Detail
- Alternative
- Cancel
- Reschedule

### Batch E — My Care

- Cases
- Case Summary
- Treatment Plan
- Plan Acceptance
- Timeline
- Stage Detail
- Follow-ups

### Batch F — Records

- Finance 5
- Reviews 4
- Claims 5

### Batch G — Entry/Auth

Run final auth polish after the product flow exists so `returnTo` can be tested against real destinations.

---

# 10. Accessibility / RTL / BiDi gate

Every completed batch must be checked for:

- accessible name/role/state on every custom control,
- selected/busy/disabled states exposed explicitly,
- icon-only buttons labelled,
- status not communicated by color alone,
- 44px+ touch targets,
- Arabic 14px minimum,
- Patient body 16px minimum,
- large-text reflow without clipping,
- logical start/end rather than physical left/right,
- phone/OTP/date/time/amount/ID BiDi isolation,
- directional icons mirror,
- status icons do not mirror,
- list-to-detail-and-back preserves context,
- reduced motion preserves feedback,
- VoiceOver/TalkBack spot checks on primary flows.

---

# 11. Light / Dark gate

Every screen is reviewed in both themes.

No raw screen-owned colors.

Check:

- primary action contrast,
- secondary text,
- border visibility,
- status tones,
- disabled/read-only distinction,
- focus visibility,
- sheets/modals/scrims,
- placeholder contrast,
- icons,
- system bars.

---

# 12. UI polish gate

Before a screen is marked complete:

- no technical copy,
- no duplicate page title + header title,
- no in-content back button,
- no unnecessary card wrapper,
- no oversized empty vertical region,
- no text glyph icon,
- no decorative shadow on resting cards,
- no inconsistent radius,
- no arbitrary spacing outside governed scale,
- no mixed icon language,
- no fake metrics that do not help the Patient,
- no button whose result is unclear.

---

# 13. Definition of Done

Patient UI is complete only when all of these are true:

### Coverage

- 47/47 canonical screens reachable,
- Home and Settings complete,
- no route ends in an old shell/unavailable placeholder for a normal mock scenario.

### Data

- one coherent mock Patient world,
- scenario switching supports happy, empty, error, stale, partial and permission conditions,
- no contradictory IDs/dates/providers/prices across screens.

### States

- all relevant screens support the structural state contract,
- all mutations support safe pending/failure/reconciliation behavior,
- Patient input survives recoverable failures.

### UX

- exact-origin return after authentication,
- no mandatory filter step when it can be optional,
- list state survives detail/back,
- booking/care records remain authoritative and understandable.

### Design

- tokens aligned,
- Arabic type floors respected,
- governed icons only,
- status system unified,
- Light/Dark reviewed,
- subtle reduced-motion-safe animation.

### Accessibility

- RTL/BiDi audit complete,
- text scaling audit complete,
- touch target audit complete,
- screen-reader smoke pass complete.

### Quality

- `npm run check` green,
- no TypeScript errors,
- no lint warnings,
- Prettier clean,
- Android + iOS primary flow smoke tests pass.

---

# 14. Remaining completion sequence

Implementation batches 1–10 are complete on `main`.

Remaining before live API work starts:

1. Run Android primary-flow visual smoke tests.
2. Run iOS primary-flow visual smoke tests.
3. Capture/compare Light + Dark states on the main journey.
4. Run large-text clipping/reflow checks.
5. Run VoiceOver/TalkBack spot checks on entry, discovery, booking, care, claims and representation.
6. Run the final visual 47-screen / 230-state reference audit.
7. Record any runtime-only defects, fix them, and keep strict `npm run check` green.
8. After the UI gate is clean, begin Mock Repository -> live API Repository replacement without changing screen composition.
