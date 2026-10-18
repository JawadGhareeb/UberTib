# UperTib Mobile Foundation

`UperTip/UperTib-Docs` is the canonical source of truth for product behavior, UX contracts, design tokens, component contracts, API contracts and lifecycle rules. This repository owns the Patient React Native implementation.

## Architecture

```text
src/
  app/            Expo Router only; routes stay thin
  features/       Patient capabilities isolated by domain/use case
  providers/      App-wide infrastructure composition
  shared/
    api/           Transport only
    assets/        Product-owned runtime assets
    components/
      brand/       Brand presentation
      ui/          Product-agnostic native primitives
    config/        Runtime configuration
    query/         React Query client
    storage/       Device persistence adapters
    theme/         Resolved semantic design tokens
    types/         Shared transport/platform types
    utils/         Pure helpers
```

A feature owns its API contracts, queries/mutations, feature UI, screens, types and local utilities. Features may consume `shared`; `shared` never imports a feature. Cross-feature access goes through a feature public `index.ts`.

## Patient capability boundaries

Split work by the documented capabilities rather than by screens alone: identity/session, guardian context, catalog, provider discovery/eligibility, booking, clinical case/treatment plans, financial records, reviews, claims and connectivity/recovery.

Laravel remains authoritative for business truth. Mobile must not reimplement eligibility, booking capacity/state, treatment acceptance, financial history, review eligibility, claims, policy, authorization or audit rules.

## Design system

- Light-only for V1.
- Arabic-first and RTL-first.
- IBM Plex Sans Arabic is the UI family.
- Neutral surfaces carry the interface.
- Canonical action teal is `#0F766E`.
- The supplied logo mark is `#00C9B1`; it is reserved for brand artwork rather than white-on-teal primary actions or body text.
- 48px Patient controls and a 44px comfortable primary-target floor.
- Modest radii and flat resting surfaces.
- No gradients, glassmorphism, decorative dashboards, pill status chips or emoji.
- Status and safety information are never communicated by color alone.

Do not pre-build every documented `CMP-*`. Add a semantic component when the first real feature needs its contract. Shared UI primitives exist to enforce typography, spacing, accessibility and interaction consistency.

## Naming note

Canonical documentation uses `UperTib`, while the supplied concept board contains the wordmark `UberTeb` and GitHub uses `UperTip` in places. Until Product explicitly reconciles the spelling, runtime code uses the canonical documentation spelling `UperTib` and the supplied symbol mark only; the conflicting wordmark artwork is not used.
