# Architecture

## Goal

Keep product growth predictable by separating routing, product features, shared infrastructure, and app-wide composition.

## Dependency direction

```text
app  ──────> features ──────> shared
 │                              ▲
 └────────> providers ──────────┘
```

Dependencies point inward toward reusable code. `shared` never knows product features.

## Folder responsibilities

### `src/app`

Expo Router entry points only. A normal route should mostly import a feature screen and render it. Route params may be normalized here or in a tiny adapter.

### `src/features/<feature>`

Each business capability owns its API contracts, query/mutation hooks, feature UI, screens, and types. Prefer this internal shape when needed:

```text
feature/
  api/
  components/
  hooks/
  queries/
  screens/
  types/
  utils/
  index.ts
```

Do not create empty folders preemptively. Add a folder when the feature actually needs that responsibility.

### `src/shared`

Cross-feature, product-agnostic code: API client, storage adapters, design tokens, common UI primitives, common types, and pure utilities.

### `src/providers`

Composition root for React Query and future app-wide providers. Product business decisions do not belong here.

## State strategy

Use React Query for remote/server state. Use component state for ephemeral UI state. Introduce a global client-state library only when state is genuinely shared across unrelated feature trees and cannot be derived from server state/navigation.

## Public feature API

Other layers import a feature from `@/features/example`, not from its internal paths. The feature's `index.ts` intentionally exposes only stable entry points.

## Scaling rule

Start simple inside a feature. Split files when responsibilities become distinct, not merely to satisfy a folder pattern. Avoid both giant files and architecture ceremony.
