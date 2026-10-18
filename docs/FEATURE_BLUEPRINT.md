# Feature Blueprint

Use `src/features/example` as an executable reference.

For a typical server-backed feature:

```text
features/orders/
  api/orders.api.ts
  queries/order.keys.ts
  queries/use-orders-query.ts
  queries/use-create-order-mutation.ts
  components/order-card.tsx
  screens/orders-screen.tsx
  types/order.types.ts
  index.ts
```

## Build order

1. Define domain/request/response types from the backend contract.
2. Add API functions with no UI concerns.
3. Add stable query keys.
4. Wrap transport in query/mutation hooks and define cache behavior.
5. Build focused feature components.
6. Compose the feature screen including loading/error/empty states.
7. Add a thin Expo Router route.
8. Export only stable entry points through the feature `index.ts`.
9. Run `npm run check`.

## Review questions

- Is backend logic leaking into the route or component?
- Is server state duplicated in local/global state?
- Can this shared component truly be reused without knowing the feature?
- Are query invalidations narrower than `invalidate everything`?
- Are errors visible and actionable?
- Is the new abstraction solving a current problem rather than a hypothetical one?
