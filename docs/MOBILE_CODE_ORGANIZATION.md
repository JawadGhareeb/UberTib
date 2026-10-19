# UberTib Patient Mobile — Code Organization Contract

> Scope: all patient-mobile features, including previously implemented flows. This is an architectural convention, **not** a product-feature change.
> Baseline commit before this refactor: `b15ccdd` on `feat/heroui-native-foundation`.

## Core ownership

```
src/features/<feature>/
  screens/        Route-screen composition, layout, lifecycle and navigation.
  components/     One coherent piece of presentation per module. Reusable only within this feature.
  hooks/          Feature state, scenario selectors and effects; no large view trees.
  model/          View-model types, filter logic and pure domain-facing transforms.
  mocks/          Existing mock fixtures/scenario mappings (no duplicate facts in JSX).
  utils/          Pure utility functions without React or navigation.
  state/          Feature provider/context where actually required.
  api/            Approved API contract access when available.
  index.ts        Explicit public exports only.
src/shared/
  components/     Truly cross-feature, brand-specific reusable primitives.
  theme/          Brand tokens and design system; don't hard-code alternative palettes.
```

### Conventions

- Keep screen files thin: compose sections, connect their data hooks, own route params and top-level structural states.
- Extract any independent repeated card, picker, header action, filter bar, modal or sizable artwork into a **named file**. Avoid "mega-components" and burying helpers inside screens.
- Keep display data and filter conditions in a feature hook/model; JSX only renders the supplied values. Preserve mock scenario edge cases.
- Define shared layout/navigation once (e.g. `AppHeader`, `PatientBottomBar`), without copying the component for a separate screen.
- Keep Arabic-first RTL behavior and visual hierarchy intact. Use HeroUI Native for available UI primitives; custom SVGs only for genuinely specialized components.
- Maintain existing route paths, button actions, error/empty/loading states, auth intent, and patient/case/booking separation through *refactor-only* changes.
- Prefer clear semantic component names. Local relative imports within one feature; alias imports for cross-feature/shared dependencies.
- Do not add new workflows or data merely to support a refactor.
- Do not commit, push or merge a refactor until explicitly approved.

## Refactored in the current organization pass

| Area | Extracted responsibility |
| --- | --- |
| Home | `usePatientHomeData`; assessment, services, actions, appointments, pending requests, care cards, section title |
| My Care overview | `useCareOverviewRecords`, typed booking/case union/filter model, filter strip, result list, separate booking/case cards |
| Discover universal search | search action hook, quick-type/recent-search option data and presentation components |
| Account overview | account header/summary, menu card/group, appearance modal/settings |
| Shared navigation | notification bell, location selector, tab destination configuration, tab item, composition-only header and bar |
| Intro | dental illustration separate from onboarding control flow |
| Auth | pure phone-digit, OTP-format/timer and basic-profile formatting helpers outside screens |

## Remaining large-screen refactor queue

The following older screens were identified as long and should be handled **in isolated, tested batches**, not all at once:

- Booking: `booking-review-screen`, `booking-status-screen`, `booking-visit-reason-screen`.
- Treatment/claims: `treatment-plan-screen`, `case-timeline-screen`, `claims-screen`.
- Discovery: `provider-results-screen`, `service-detail-screen`.
- Profile: `help-support-screen`, `patient-health-information-screen`, `family-representation-screen`.
- Assessment: `assessment-media-screen`.
- Auth screens: move form sections and any nontrivial asynchronous state into isolated components/hooks in subsequent review batches; pure utilities are already extracted.

Queue order should follow which screens the user is actively reviewing. Preserve all real domain flows and state variants. Not every smaller screen needs fragmentation; split by responsibility, not an arbitrary line count.

## Verification gates

For each changed batch:

1. `npm run lint`
2. `npm run typecheck`
3. `npm run build:ios` and `npm run build:android`
4. Review runtime on phone (visual confirmation is separate from compilation).
5. Check `git diff --check`, `git status` and screen routes before requesting a commit.

The architecture goal is **no visual or behavioral changes** while extracting components. Any product/UX changes must be reviewed separately.
