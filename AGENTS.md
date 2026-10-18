# UperTib Mobile Engineering Rules

## Sources of truth

1. `UperTip/UperTib-Docs` owns product behavior, UX contracts, design tokens, component contracts, API contracts, permissions, lifecycle/state machines and implementation plans.
2. This repository owns the Patient React Native implementation.
3. Laravel is authoritative for business truth once live integration is enabled. Never recreate domain decisions in the mobile client.

When code and canonical documentation disagree, reconcile the mismatch instead of inventing a fallback.

## Dependency rules

- `src/app` may import `features`, `providers` and `shared`.
- `src/features/<feature>` may import `shared` and its own files.
- Cross-feature access goes through the feature public `index.ts`.
- `src/shared` never imports from `features` or `app`.
- `src/providers` composes infrastructure and contains no product business rules.

## Responsibilities

- Route files select feature screens and configure navigation only.
- Feature screens orchestrate one patient use case.
- Query/mutation hooks own async state and cache behavior.
- Feature-local mock modules own development fixtures and simulated latency.
- API modules own transport calls only when live integration is explicitly enabled.
- Shared UI contains product-agnostic primitives and canonical cross-cutting components.
- Utilities are pure where possible.

## Current mock-first rule

- Patient flows do not call live APIs in the current development phase.
- Use feature-local mocks under `mocks/` and keep their response shapes explicit.
- Mock success must never be presented as backend truth outside development/demo flows.
- Do not require `EXPO_PUBLIC_API_URL` while mock-first mode is active.
- When live transport is enabled later, all HTTP goes through `shared/api/http-client.ts`.

## Mobile correctness

- TypeScript strict mode; no `any`.
- React Query may own asynchronous mock/server state where caching is useful.
- Sensitive credentials go through Secure Store when real authentication exists.
- A real mutation timeout means unknown outcome, not failure; reconcile before creating a new command when idempotency applies.
- Never expose internal eligibility/classification mechanics or protected backend identifiers.

## UX and identity

- Arabic-first, RTL-first, WCAG 2.2 AA.
- Use semantic theme roles; do not hardcode design colors in components.
- The Patient app now supports light and dark themes by explicit product direction.
- Light and dark use the exact October 2026 UberTeb identity swatches: primary #00E0B8, neutral ink #111111, charcoal #2A2A2A and white. The primary swatch must never shift by appearance. See docs/BRAND_THEME_2026.md.
- Neutrals carry surfaces; canonical action primary and logo mark are both `#00E0B8` in both themes. Never silently substitute a darker action teal.
- Filled primary and destructive actions display white labels and white icons; primary uses solid #00E0B8 and destructive uses red. Note: white normal text on #00E0B8 is below WCAG AA; do not claim that pairing passes contrast or change the brand swatch without explicit approval.
- On neutral surfaces, use semantic text.link for small teal text/icons when contrast is required; that does not change the primary fill. Keep brand artwork and primary fills exactly #00E0B8.
- No gradients, glassmorphism, decorative dashboards, pill status chips, emoji or shadow on resting cards.
- Status is never color alone; render the complete governed state treatment.
- Use logical start/end semantics rather than physical left/right assumptions.
- Do not manually reverse a row to compensate for RTL; the Arabic root direction owns row flow.
- Phone numbers, OTPs, codes and machine identifiers remain LTR inside the RTL shell.
- IBM Plex Sans Arabic is the UI family; non-zero letter spacing is prohibited for Arabic.
- Controls use the canonical 48px height and at least 44px comfortable target.
- Control radius is 8px and reading surfaces use 12px unless a governed component token says otherwise.

## Completion checklist

Remove debug logs and dead code, verify feature boundaries, Arabic/RTL and accessibility, light/dark contrast, loading/empty/error/recovery states, then run `npm run check`.
