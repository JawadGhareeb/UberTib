# Patient V5 backend handoff – compatibility entry

**Backend connection is NOT complete.**

This document is restored at the historical path expected by `scripts/check-patient-v5-contract.mjs`. It is a **current integration status note (24 October 2026)**, not evidence of a completed 12 October backend delivery.

- The Patient V5 API types and operation names live in `src/shared/api/patient-v5-contract.ts`.
- The gateway and missing-backend behavior live in `src/shared/api/patient-v5-gateway.ts`.
- Patient screen-to-operation mapping lives in `src/shared/api/patient-v5-screen-map.ts`.
- **Doctor listings, per-service/per-branch classification/trust/grade/availability presentation**: see `docs/patient-doctor-backend-handoff.md`.
- The mobile frontend still contains demo data and no backend credentials/eligibility service connected. All booking, classified provider, protection, rating, map and verification claims must be validated against approved API payloads before release.
- Clinical classifications and eligibility must be produced by the backend; the mobile app **only renders approved facts** and must never calculate or assign authoritative S/P/H.
- The `npm run backend-contract:check` script verifies API interface structure, **not** live integration or clinical readiness.

Pending for release: deploy and authenticate real endpoints; map canonical provider/service/branch identities and statuses; integrate consent/booking/claims records; test first-run and existing-patient journeys with backend and real devices; conduct clinical and privacy acceptance review.
