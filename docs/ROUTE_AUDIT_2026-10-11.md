> **Superseded on 2026-10-12:** This earlier source audit documents known gaps at that time. See [V5_JOURNEY_ROUTE_AUDIT_2026-10-12.md](V5_JOURNEY_ROUTE_AUDIT_2026-10-12.md) and [PATIENT_V5_BACKEND_HANDOFF_2026-10-12.md](PATIENT_V5_BACKEND_HANDOFF_2026-10-12.md). Follow-up changes separated mock booking/claim data, removed unapproved actions and added backend contracts.

# UperTip mobile — route and page audit
Date: 2026-10-11 · Ref: `main`

## Scope and method

**Source-level audit**, not on-device acceptance testing. Read the non-layout route files under `src/app`, their feature screen entrypoints, and explicit route destinations in the feature screens. A static route/import checker was added at `scripts/audit-routes.mjs` and exposed via `npm run routes:check`; it has not been successfully run in the current GitHub Actions environment.

| Feature area | Route pages |
| --- | ---: |
| Patient tabs | 4 |
| Assessment | 13 |
| Authentication | 3 |
| Bookings | 7 |
| Care, plans, financials and claims | 16 |
| Dental discovery, doctors and services | 12 |
| Profile, privacy, family and permissions | 11 |
| Entry, map, notifications, needs-attention | 4 |
| **Total page route files** | **70** |
| Layout files | 3 |

Every page route inspected has a default screen/component or redirect. Static path references in the inspected feature screens resolve to known route shapes, including parameterized routes; this **does not prove** that the parameter values reference valid records or that interactions succeed at runtime.

## Routing repairs committed during review

1. `/(tabs)/care` no longer redirects unconditionally to `case-001`; a new list shows the actual care-case mock IDs.
2. The list opens each case's own **timeline** rather than displaying the hard-coded accepted plan of another case. Timelines now account for the active mock scenario.
3. Doctor `serviceCode` is propagated from comparison/search to details, branch and booking instead of being replaced by `root-canal`.
4. Unknown doctor IDs no longer silently render the first doctor's profile; those routes show a safe not-found state.
5. The `/(tabs)/discover` tab is intentionally labelled **حجوزاتي** and opens the bookings screen; the dental service catalog remains `/discover`.

## Known blockers — **not yet verified / not safe to declare complete**

**Booking-to-care identity**
- `src/features/booking/screens/my-bookings-screen.tsx` still contains three sample display cards, with two mapping to `booking-001`. The third will open the wrong booking detail.
- Booking list display names, services and status labels differ from `src/features/booking/mocks/bookings.mock.ts`.
- `src/features/booking/screens/booking-detail-screen.tsx` still displays a fixed root-canal header/timeline for every resolved booking. Its plan/finance buttons always navigate to `case-001`. Booking and care data need a common authoritative `bookingId → caseId` relation and correct view models before a route can be considered semantically valid.

**Provider-to-booking identity**
- The Pen display catalog `penDoctors` has `provider-rima`, but `mockProviders` does not. Reaching a booking slot for that provider yields a not-found state.
- Some IDs exist in both catalogs but represent different provider names/professional data. Do **not** silently merge records with the same ID without selecting a canonical source of truth.
- The provider filters are visually rendered as switches, but demo filter state and actual results filtering are not fully connected to a real search backend.

**Case plan specifics**
- Several `TreatmentPlanScreen` accepted-plan sections still contain fixed root-canal sample copy independent of `caseId`; linking all cases directly to them is unsafe. The new tab therefore takes the patient to their own case timeline instead.

**Environment and visual QA**
- GitHub Quality and Visual QA workflows currently report failure **before any job steps run** (last checked in the current audit). There is no successful TypeScript build, lint run, runtime navigation suite, or device screenshot comparison proving the recent changes.
- MapLibre native selection requires a compatible development/production build, not only the fallback view. Real device, permissions, location lookup and RTL need testing.
- Screens are mock-driven, and the code review does not establish live backend correctness, permissions or state transitions.

## Verification to finish

1. Resolve single source of truth for provider, booking and care-case mock IDs, then correct list and detail view models without changing actual patient data to fit a screenshot.
2. Run `npm run routes:check`, `npm run check`, and fix source-level issues they report.
3. Exercise every route family on Android and iOS, including invalid IDs, unauthenticated entry, no permission, empty results, network errors, pending writes, back navigation, Arabic RTL and small devices.
4. Compare each rendered screen against Pen (360/390/430 widths) and record screenshots for visual review.
5. Only after successful builds, route-flow checks and device visual QA should the project be described as *fully verified*.
