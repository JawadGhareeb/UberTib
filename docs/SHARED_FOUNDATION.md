# Shared foundation — Patient Mobile

October 2026 update: HeroUI Native 1.0.10 / Uniwind 1.12.2 / Tailwind 4 have been installed on branch `feat/heroui-native-foundation`. The canonical brand tokens are compiled using `scripts/generate-uniwind-theme.mjs` into `src/shared/theme/uniwind-theme.css`; do not edit generated CSS. NativeWind 4 and the legacy Tailwind 3 config have been removed. A developer-only preview exists at `/dev/ui-kit`. Backend remains mock-first.


This is an additive foundation for the forthcoming HeroUI Native redesign and eventual Laravel integration. **Current screens remain mock-first; this change does not enable a backend.**

## Ownership

- `src/shared/icons/icons.ts`: semantic icon names (`icons.home`, `icons.calendar`, etc.). Existing `AppIcon` renders them through expo-symbols today. When the UI system moves to HeroUI Native, replace the rendering adapter or mapped glyphs centrally, not across every feature screen. Keep dental/tooth illustrations inside their feature.
- `src/shared/api/http-client.ts`: the existing Axios client, authorization from Secure Store, API base URL and network error conversion. Do not instantiate additional Axios clients in feature modules.
- `src/shared/api/base-api.service.ts`: small typed convenience facade over the same Axios client. GET and mutating requests are supported. Write commands require a caller-provided idempotency key; `If-Match` supports optimistic concurrency. Do not create arbitrary new idempotency keys when retrying an unknown outcome.
- `src/shared/api/patient-v5-contract.ts` and `patient-v5-gateway.ts`: existing typed patient operation contracts and endpoint registry. Keep the empty registry until real backend routes and DTO validation are approved. Avoid independently wiring guessed URLs through the new facade.
- `src/shared/query/query-client.ts`: the sole React Query client. Do not introduce another global query client.
- `src/shared/config/env.ts`: API environment configuration, which must remain optional in mock mode.
- `src/shared/storage/secure-storage.ts`: token storage and other protected preferences.

## Service and hook placement

Use feature-owned modules for business operations and feature-specific React Query hooks:

```text
src/
  shared/
    icons/icons.ts
    api/
      http-client.ts
      base-api.service.ts
      patient-v5-contract.ts
      patient-v5-gateway.ts
    query/query-client.ts
    config/env.ts
    storage/secure-storage.ts
  features/
    booking/
      api/booking.service.ts         # only after backend contract approval
      queries/use-bookings-query.ts  # query hooks, alongside existing conventions
      hooks/                       # only when there is real reusable feature behavior
      mocks/
      screens/
```

**Do not create empty feature service/hook folders ahead of use.** Cross-feature, domain-independent React hooks can live in `src/shared/hooks/` when there is a concrete need; booking, family, care and finance hooks belong to their features.

## Integration sequence

1. Keep the existing mocked screen adapters and immutable business rules.
2. Validate HeroUI Native + Uniwind on physical/simulated Android and iOS without changing existing API contracts.
3. Migrate reusable icon usage to the semantic registry during UI work.
4. When Laravel API endpoints, access rules and DTO shapes are approved, implement a feature-local service using the existing gateway/transport. Validate responses at the boundary; do not assume API responses match mock objects.
5. Introduce feature query/mutation hooks using the existing QueryClient, scoped query keys, safe pending states, idempotency and server-authoritative reconciliation.
6. Switch one feature at a time from mock to live behind explicit configuration and test both mobile platforms.

## Family rule

There is **no global account or active-patient switching**. The authenticated account is always the actor; an authorized relative can be selected as the patient/subject of a specific booking or permitted assessment. The backend enforces the grant and scope before permitting actions. Family identity does not change the active login.
