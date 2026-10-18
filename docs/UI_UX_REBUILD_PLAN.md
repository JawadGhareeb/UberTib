# UperTib Patient — Final UI Completion Plan

**Status:** execution plan for completing the Patient mobile UI  
**Implementation branch:** `feat/patient-ui-ux-rebuild`  
**Target:** every Patient route becomes a complete, data-filled, Arabic-first mobile experience before live API integration.

---

## 1. Sources and decision order

This plan is built from four sources. They have different jobs and must not be mixed.

### A. Current product/UI decisions from the owner — highest priority for visual implementation

These are the current implementation decisions:

- rebuild the visual identity because the current app still feels like a technical prototype,
- fill all screens with coherent fake/mock data now; swap the data source later,
- do not expose API/backend explanations to the patient,
- use a compact full-width header on all product screens,
- header divider/background span the full viewport; only inner content is constrained,
- show a small UperTib logo/name plus the active customer/patient context,
- all secondary-page back navigation lives in the header; no back buttons in page content,
- reduce horizontal gutters and wasted vertical space,
- reduce title sizes across the whole product,
- Home must contain useful patient data rather than prose,
- Profile must support view/edit/account actions and logout,
- Discover must show clear service choices immediately instead of forcing explanatory steps,
- service/provider cards must expose useful decision data including mock price/availability where the canonical Patient flow permits it,
- provider search/results must be a real mock search experience, not a disabled placeholder,
- bottom tabs must be visually professional and use one real icon family,
- Light and Dark are both required,
- motion is required, but should remain subtle and product-appropriate.

### B. Canonical UperTib UX documents — behavior, disclosure, state, accessibility

Use:
- `UX_FOUNDATION.md`
- `INFORMATION_ARCHITECTURE.md`
- `USER_FLOWS.md`
- `WIREFRAMES_PATIENT_01.md`–`03.md`
- `DESIGN_DIRECTION.md`
- `DESIGN_TOKENS.md`
- component / interaction / content / accessibility guides
- `SCREEN_SPECS_PATIENT_01.md`–`03.md`

They govern:
- screen purpose,
- information priority,
- permitted actions,
- state/history semantics,
- disclosures,
- permission handling,
- error/recovery behavior,
- accessibility,
- financial/clinical/representation boundaries.

### C. `patient-screens-ar.html` — screen inventory and representative states

The HTML is the completeness map:
- **47 Patient screens**
- **230 states**
- representative screen purpose/state for every canonical screen.

Use it for:
- screen names,
- screen IDs,
- functional scope,
- representative state,
- expected sequence.

Do **not** copy its gradients, blur, shadows, oversized presentation or gallery styling into the mobile product. The canonical design direction prohibits those patterns for the product UI.

### D. Current `upertip-mobile/main` — implementation baseline

Keep the working architecture:
- Expo Router,
- feature folders,
- React Query,
- semantic Light/Dark tokens,
- mock-first data mode,
- Arabic direction provider,
- BiDi isolation,
- shared primitives,
- CI quality gate.

Replace the current safe shells/placeholder copy with complete mock-backed screens.

---

## 2. Explicit product override: Light + Dark

The canonical Phase 3 design document originally records Patient V1 as light-only.

**Current product decision:** the Patient mobile app will support **Light and Dark**.

Therefore:
- keep one semantic token system,
- every finished screen must be reviewed in both schemes,
- no screen may own raw light/dark colors,
- this override applies to the Patient mobile implementation only.

---

## 3. Final visual identity

### Character

UperTib Patient should feel:

**clear · medical without looking clinical · accountable · compact · human · calm**

Not:
- a documentation page,
- a dashboard full of metrics,
- a marketing landing page,
- a SaaS gradient template,
- a wall of cards,
- a page full of explanatory prose.

### Color

- neutrals carry most surfaces,
- teal is the primary action/selection color,
- status colors are reserved for status,
- primary filled action always uses white text,
- no gradients as brand surfaces,
- no glassmorphism,
- no decorative neon,
- shadows only for genuinely floating surfaces.

### Cards

Canonical rule: cards are a container of last resort.

Use cards when the unit is independently selectable/comparable:
- service,
- provider,
- appointment,
- case,
- claim,
- reviewable experience,
- family/dependent,
- grant.

Do not put every text/detail section inside a card.

### Icons

Adopt one governed icon family for the whole Patient app.

Implementation choice:
- use `expo-symbols` as the governed cross-platform icon layer,
- map SF Symbols on iOS to Material Symbols on Android/web,
- keep one semantic meaning per icon across platforms,
- no hand-drawn View-based icons or text glyph substitutes once migration is complete,
- icon-only controls still require accessibility labels.

---

## 4. Global layout rules

### Mobile content

- default horizontal gutter: **16px**,
- allow 12px only for intentionally dense list regions,
- 24px is not the default page gutter,
- primary column remains one-column,
- on wider devices content may cap around 640px, but phone layouts always use available width,
- avoid empty 32–48px vertical gaps unless they communicate real grouping.

### Typography target

- page title: **22–24px**
- section title: **18–20px**
- card title: **16–17px**
- body: **14–16px**
- metadata/supporting: **12–13px**
- Arabic letter-spacing remains zero.

The page should communicate hierarchy through type and spacing, not giant headings.

---

## 5. Canonical header

One shared `AppHeader` for the whole Patient product.

### Primary tab screens

Right/start:
- small UperTib mark,
- UperTib wordmark/name,
- active patient/customer name or short greeting.

Left/end:
- notifications where relevant,
- optional contextual action only when essential.

Theme selection lives in Profile → Settings, not in every primary toolbar.

No back button.

### Secondary/detail screens

Right/start:
- one back icon.

Center:
- short contextual title.

Left/end:
- one contextual action only when the task needs it; otherwise keep the slot visually balanced.

### Header construction

- full-width header surface,
- full-width bottom hairline divider **outside** the inner content container,
- inner content uses 16px side padding,
- 52–56px toolbar height,
- 44px touch targets,
- no duplicated brand block inside screen body,
- no in-content back button anywhere.

---

## 6. Bottom navigation

Canonical primary destinations stay:

1. الرئيسية
2. اكتشف
3. رعايتي
4. حسابي

Rebuild tabs with:
- real governed icons,
- compact Arabic labels,
- active teal icon/text,
- subtle selected indicator/background,
- inactive neutral state,
- safe-area-aware height,
- no primitive geometric icon drawings,
- focus transition via Reanimated.

No extra primary destinations unless canonical IA changes.

---

## 7. Motion system

Use the already-installed `react-native-reanimated`.

Motion depth follows the canonical design direction: **subtle feedback only**.

### Timing

- press/focus: 120–180ms
- tab selection / chip state: 160–220ms
- list/card entrance: 180–260ms
- sheet/modal: 220–300ms

### Allowed

- opacity,
- 4–8px translate,
- restrained scale 0.98–1,
- height/layout transitions,
- modal/sheet entrance.

### Not allowed

- bouncing,
- decorative looping animation,
- large parallax,
- scroll choreography,
- motion that delays task completion.

Respect reduced-motion settings.

---

## 8. Mock data architecture

Before finishing screens, create one coherent mock Patient world.

Do not hardcode unrelated fake values directly inside components.

### Required mock domains

- signed-in account,
- active patient,
- dependents,
- representation grants,
- notifications,
- service groups/services,
- providers,
- branches,
- provider service prices,
- ratings/review counts,
- availability,
- bookings,
- treatment cases,
- treatment plan/stages,
- follow-ups,
- financial terms/events,
- reviews,
- claims/evidence,
- pending submissions.

### Mock persona

Use a stable fake patient/account across every screen so the app feels like one product, not isolated demos.

The same IDs, names, dates, service, provider, price and case references must stay consistent across:
Home → Discover → Provider → Booking → My Care → Finance/Review/Claim.

### Data source boundary

UI consumes repositories/hooks.
Today: mock implementation.
Later: API implementation.

Changing from Mock to API must not require rewriting screen composition.

---

# 9. Execution phases

## Phase 0 — Foundation freeze

Finish before page-by-page work:

- final header,
- gutters/content width,
- final type scale,
- icon family,
- professional tabs,
- status treatment,
- card/list primitives,
- skeletons,
- buttons/fields/selects,
- modal/sheet pattern,
- motion primitives,
- Light/Dark review,
- RTL/BiDi review,
- mock repository/data seed.

**Gate:** no feature page is marked complete until Phase 0 is stable.

---

## Phase 1 — Home + Account identity

This phase addresses the strongest current UX gaps first.

### Home

Build a real patient home:

- compact greeting + active patient context,
- next appointment,
- active treatment/case,
- “يحتاج انتباهك” tasks,
- quick actions,
- recent activity,
- unread notifications indicator.

Remove:
- generic product explanation,
- abstract ProgressRail not linked to real case data,
- “لا توجد بيانات حالياً” placeholder when mock mode is active.

### Profile

Build:
- avatar/initials,
- full name,
- phone,
- profile/account status,
- view personal data,
- edit data,
- family/dependents,
- representation,
- active patient switch,
- preferences/theme,
- logout.

Logout is visible and intentionally separated.

### Canonical screens completed in this phase

- `SCR-IDENTITY-004` Patient profile
- `SCR-IDENTITY-005` Family and representation
- `SCR-IDENTITY-006` Create grant
- `SCR-IDENTITY-007` Grant detail
- `SCR-IDENTITY-008` Active patient context
- `SCR-IDENTITY-037` Add dependent
- `SCR-PLATFORM-001` Needs attention
- `SCR-PLATFORM-009` Notification centre
- `SCR-PLATFORM-002` Pending submissions

---

## Phase 2 — Entry and authentication polish

Finish:

- `SCR-IDENTITY-001` Patient entry
- `SCR-IDENTITY-002` Phone entry
- `SCR-IDENTITY-003` Code verification

Requirements:

- country selector + phone input,
- OTP,
- mock auth,
- compact branding,
- no large marketing explanation,
- full header pattern where appropriate,
- keyboard-safe layout,
- clean validation/error states.

---

## Phase 3 — Discover + Service

### Discover landing

The first useful content is the service catalog, not an explanation of how discovery works.

Top region:
- search,
- useful service categories,
- frequent/popular services.

Service cards:
- icon,
- title,
- one short useful line,
- mock price/range where permitted,
- provider/availability hint,
- clear tap affordance.

Remove:
- process ProgressRail,
- long API/eligibility explanation,
- forced preamble before service selection.

### Service detail

Show immediately:
- service,
- concise description,
- typical mock range,
- duration/preparation where relevant,
- provider count/availability,
- nearby/available providers,
- CTA.

Canonical screens:

- `SCR-CATALOG-001` Service groups
- `SCR-CATALOG-002` Service detail

---

## Phase 4 — Provider search, results, comparison

Rebuild search as a real product flow.

### Search / filters

Provider filtering is an optional refinement step, not a mandatory screen in the happy path.

Default flow:
**Service → Provider results**

Results start with all areas and nearest availability. The user can open the filter screen only when they want to narrow by area or other criteria.

Filter UI keeps:
- selected service visible,
- area/location,
- optional date when supported,
- clear apply/reset behavior.

Sorting remains available directly on the results screen.

### Result card

Each provider result exposes the information needed for a decision:

- provider photo/avatar,
- name,
- specialty,
- clinic/branch,
- verified rating + review count,
- service price/range,
- nearest availability,
- location/distance if mock data supports it,
- eligibility/availability status in patient-safe language,
- details/booking action.

### Provider decision/detail

- provider summary,
- service,
- branch,
- price,
- next available slots,
- reviews,
- reason/availability explanation only when useful,
- book CTA.

### Comparison

Use cards/table-like comparison only because providers are comparable units.

Canonical screens:

- `SCR-ELIG-001` Provider search
- `SCR-ELIG-002` Provider results
- `SCR-ELIG-003` Provider decision
- `SCR-ELIG-004` Eligibility explanation
- `SCR-ELIG-005` Provider comparison

---

## Phase 5 — Booking

Build a complete mock booking journey.

Canonical screens:

- `SCR-BOOKING-001` Slot selection
- `SCR-BOOKING-002` Request review/submit
- `SCR-BOOKING-003` My bookings
- `SCR-BOOKING-004` Booking detail
- `SCR-BOOKING-005` Alternative appointment decision
- `SCR-BOOKING-006` Cancel booking
- `SCR-BOOKING-016` Reschedule request

Required data/actions:

- provider/service summary,
- branch,
- calendar/day selector,
- slot chips,
- patient selector when acting for dependent,
- price summary,
- confirmation,
- booking status,
- cancellation/reschedule actions,
- clear alternative appointment choice.

No dead disabled actions in normal mock states.

---

## Phase 6 — My Care

Canonical screens:

- `SCR-CLINICAL-001` My cases
- `SCR-CLINICAL-002` Case summary
- `SCR-CLINICAL-003` Treatment plan
- `SCR-CLINICAL-004` Plan acceptance
- `SCR-CLINICAL-005` Case timeline
- `SCR-CLINICAL-006` Stage detail
- `SCR-CLINICAL-007` Follow-ups

UI priority follows canonical wireframes:

**authoritative status/identity → primary facts → related history → current action**

Build:

- active case cards,
- provider/service,
- treatment progress,
- accepted total/terms where allowed,
- stage list/timeline,
- next action,
- follow-up dates,
- historical events.

Use sections/timeline/list patterns instead of nesting every block inside cards.

---

## Phase 7 — Finance

Canonical screens:

- `SCR-FINANCE-001` Accepted financial terms
- `SCR-FINANCE-002` Financial timeline
- `SCR-FINANCE-003` Report external payment
- `SCR-FINANCE-004` Financial event response
- `SCR-FINANCE-005` Report refund execution

Build realistic mock records while preserving the canonical financial boundary:

- UperTib records events/terms,
- UI must not imply UperTib collected, transferred, settled or refunded money.

Show:
- accepted amount/currency snapshot,
- external payment assertions,
- confirmation/dispute state,
- refund obligation/execution record,
- timeline.

---

## Phase 8 — Reviews

Canonical screens:

- `SCR-REVIEWS-001` Reviewable experiences
- `SCR-REVIEWS-002` Submit review
- `SCR-REVIEWS-003` My review
- `SCR-REVIEWS-004` Review appeal

Build:
- eligible experience cards,
- rating input,
- concise comment,
- submitted review state,
- verification/status,
- appeal eligibility/history.

---

## Phase 9 — Claims

Canonical screens:

- `SCR-CLAIMS-001` My claims
- `SCR-CLAIMS-002` Refund request
- `SCR-CLAIMS-003` Protection claim
- `SCR-CLAIMS-004` Claim detail
- `SCR-CLAIMS-005` Claim appeal

Build:
- claim cards,
- status and deadline,
- requested amount where applicable,
- evidence checklist,
- decision/history,
- appeal action.

Keep authoritative state and required action ahead of explanatory text.

---

# 10. Complete 47-screen checklist

## Identity — 9

- [ ] SCR-IDENTITY-001 Patient entry
- [ ] SCR-IDENTITY-002 Phone entry
- [ ] SCR-IDENTITY-003 Code verification
- [ ] SCR-IDENTITY-004 Patient profile
- [ ] SCR-IDENTITY-005 Family and representation
- [ ] SCR-IDENTITY-006 Create grant
- [ ] SCR-IDENTITY-007 Grant detail
- [ ] SCR-IDENTITY-008 Active patient context
- [ ] SCR-IDENTITY-037 Add dependent

## Catalog — 2

- [ ] SCR-CATALOG-001 Service groups
- [ ] SCR-CATALOG-002 Service detail

## Eligibility/providers — 5

- [ ] SCR-ELIG-001 Provider search
- [ ] SCR-ELIG-002 Provider results
- [ ] SCR-ELIG-003 Provider decision
- [ ] SCR-ELIG-004 Eligibility explanation
- [ ] SCR-ELIG-005 Provider comparison

## Platform — 3

- [ ] SCR-PLATFORM-001 Needs attention
- [ ] SCR-PLATFORM-002 Pending submissions
- [ ] SCR-PLATFORM-009 Notification centre

## Booking — 7

- [ ] SCR-BOOKING-001 Slot selection
- [ ] SCR-BOOKING-002 Request review and submit
- [ ] SCR-BOOKING-003 My bookings
- [ ] SCR-BOOKING-004 Booking detail
- [ ] SCR-BOOKING-005 Alternative appointment decision
- [ ] SCR-BOOKING-006 Cancel booking
- [ ] SCR-BOOKING-016 Reschedule request

## Clinical — 7

- [ ] SCR-CLINICAL-001 My cases
- [ ] SCR-CLINICAL-002 Case summary
- [ ] SCR-CLINICAL-003 Treatment plan
- [ ] SCR-CLINICAL-004 Plan acceptance
- [ ] SCR-CLINICAL-005 Case timeline
- [ ] SCR-CLINICAL-006 Stage detail
- [ ] SCR-CLINICAL-007 Follow-ups

## Finance — 5

- [ ] SCR-FINANCE-001 Accepted financial terms
- [ ] SCR-FINANCE-002 Financial timeline
- [ ] SCR-FINANCE-003 Report external payment
- [ ] SCR-FINANCE-004 Financial event response
- [ ] SCR-FINANCE-005 Report refund execution

## Reviews — 4

- [ ] SCR-REVIEWS-001 Reviewable experiences
- [ ] SCR-REVIEWS-002 Submit review
- [ ] SCR-REVIEWS-003 My review
- [ ] SCR-REVIEWS-004 Review appeal

## Claims — 5

- [ ] SCR-CLAIMS-001 My claims
- [ ] SCR-CLAIMS-002 Refund request
- [ ] SCR-CLAIMS-003 Protection claim
- [ ] SCR-CLAIMS-004 Claim detail
- [ ] SCR-CLAIMS-005 Claim appeal

**Total: 47 screens.**

---

# 11. Copy/content rules

Patient-facing pages must not explain implementation.

Remove copy such as:
- API unavailable,
- backend contract,
- this will appear when the server supports it,
- internal eligibility calculation,
- developer/system implementation notes.

Instead use:
- actual mock data,
- a legitimate patient-facing state,
- concise recovery copy only when the state truly is error/empty/offline.

Canonical disclosure principle remains:

**task first; history and advanced detail on demand.**

---

# 12. Definition of Done — one page

A screen is not complete because its route exists.

It is **Done** only when:

### Data
- realistic coherent mock data is visible,
- no normal-state placeholder/API explanation remains,
- IDs/dates/prices/statuses agree with related screens.

### Layout
- canonical full-width header is used,
- no duplicate back control exists,
- mobile gutter follows the new density rule,
- title scale is controlled,
- no unjustified empty regions exist.

### Function
- normal-state primary action works in mock mode,
- secondary actions/navigation work,
- forms validate,
- selected/filter states are visible,
- destructive actions have the required confirmation.

### Visual
- one icon family,
- semantic tokens only,
- no gradient/glass/card-shadow slop,
- cards used only for useful independent units,
- Light and Dark both intentional.

### Arabic
- RTL correct on an English-language Android device,
- rows use application direction helpers,
- phone/OTP/Latin IDs remain LTR,
- mixed Arabic/Latin values remain BiDi-stable.

### State quality
- loading/skeleton,
- populated,
- empty,
- error/retry,
- disabled/permission state only when semantically valid,
- stale/offline state where the screen requires it.

### Accessibility
- minimum touch target,
- labels on icon controls,
- status not encoded by color alone,
- reduced motion respected,
- text remains readable at larger system type.

### Quality gate
- lint passes,
- TypeScript passes,
- Prettier passes,
- no console/runtime warnings on the reviewed route.

---

# 13. Definition of Done — entire Patient UI

The Patient UI is finished only when:

- Phase 0 foundation is stable,
- all **47/47 canonical screens** are checked,
- the Home tab is a complete patient dashboard,
- Profile includes edit/view/logout and family context,
- Discover → Provider → Booking is complete end-to-end with mock data,
- My Care → Plan → Timeline → Follow-ups is complete end-to-end,
- Finance / Reviews / Claims / Representation have populated representative states,
- primary tabs are professionally redesigned,
- all screens use the same header/spacing/type/icon/motion system,
- every screen has been reviewed in Light and Dark,
- every screen has been reviewed on an English-language Android device for Arabic RTL,
- the project contains no patient-visible backend/API implementation explanations,
- the mock data layer can later be replaced by API adapters without changing the screen layouts.
