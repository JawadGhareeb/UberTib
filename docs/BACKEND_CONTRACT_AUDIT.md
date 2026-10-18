> **2026-10-12 handoff update:** This file is the September baseline, not a verification of today's backend. Use [PATIENT_V5_BACKEND_HANDOFF_2026-10-12.md](PATIENT_V5_BACKEND_HANDOFF_2026-10-12.md) and the typed client contract in `src/shared/api/patient-v5-contract.ts` for the current seven-journey requirements. No new live API integration is claimed.

# Patient Mobile — Backend Contract Audit

Audit date: 2026-09-17.

## Implemented in `UperTip/UperTib-Backend`

The current `routes/api.php` exposes one V1 patient-facing route:

- `GET /api/v1/catalog/service-groups` — implemented and used by the mobile app as `API-CATALOG-001`.

## Documented but not implemented in backend routes yet

The canonical UX/API documentation defines identity, eligibility, booking, clinical, finance, reviews, claims and platform contracts. They are not currently exposed by `routes/api.php` on backend `main`.

Until those routes exist, the mobile app follows these rules:

- Do not fabricate provider results, eligibility decisions, slots, booking states, deadlines, sessions, clinical cases, treatment plans, follow-up due states, timeline events, financial positions, review eligibility, claim state, evidence completeness, identity grants, active-subject authority or pending-submission outcomes.
- Build the approved route hierarchy, Arabic/RTL behaviour, loading/recovery states and screen composition.
- Withdraw committing actions whose authoritative contract is unavailable.
- Keep catalog discovery functional because its read contract exists.
- Add transport/query/mutation modules inside the owning feature when each server contract becomes available.

## Next backend gates

1. `API-IDENTITY-001` and `API-IDENTITY-002` — phone challenge and OTP verification.
2. `API-ELIG-001` and `API-ELIG-002` — provider eligibility results and patient-safe explanation.
3. `API-BOOKING-001..007` — booking commits, reads and proposal/reschedule decisions.
4. `API-CLINICAL-001..004` — cases, treatment plans, acceptance, timeline and stages.
5. `API-FINANCE-001..005` — accepted terms, financial history and external-execution records.
6. `API-REVIEWS-001..002` — verified-experience reviews and appeals.
7. `API-CLAIMS-001..005` — refund/protection claims, reads, decisions and appeals.
8. `API-PLATFORM-001` — evidence transfer boundary.
9. `API-IDENTITY-003` — patient profile plus both directions of representation.
10. `API-IDENTITY-004` — scoped grant creation.
11. `API-IDENTITY-005` — grant read/revocation with historical attribution preserved.
12. `API-IDENTITY-006` — dependent/legal-basis representation request.
13. Authoritative booking/claims/finance reads required by `SCR-PLATFORM-002` pending-submission reconciliation.

The client does not reproduce authorization, eligibility, booking, clinical, finance, review, claim, deadline or reconciliation rules locally.
