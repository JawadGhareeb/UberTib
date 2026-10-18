# Patient Mobile — Records & Trust Slice

This slice extends the case-scoped Patient experience into financial records, reviews, claims, evidence requirements and appeals without inventing server-owned facts or implying that UperTib moves money.

## Canonical route hierarchy

```text
Case summary
├── Financial records
│   ├── Accepted financial terms      SCR-FINANCE-001
│   ├── Financial timeline            SCR-FINANCE-002
│   ├── Report external payment       SCR-FINANCE-003
│   ├── Financial event response      SCR-FINANCE-004
│   └── Report refund execution       SCR-FINANCE-005
├── Reviews
│   ├── Reviewable experiences        SCR-REVIEWS-001
│   ├── Submit review                 SCR-REVIEWS-002
│   ├── My review                     SCR-REVIEWS-003
│   └── Review appeal                 SCR-REVIEWS-004
└── Claims
    ├── My claims                     SCR-CLAIMS-001
    ├── Refund request                SCR-CLAIMS-002
    ├── Protection claim              SCR-CLAIMS-003
    ├── Claim detail                  SCR-CLAIMS-004
    └── Claim appeal                  SCR-CLAIMS-005
```

## Backend ownership

The canonical server contracts for this slice are:

- `API-FINANCE-001..005` for accepted financial terms, ordered financial events and append-only external payment/refund assertions and responses.
- `API-REVIEWS-001..002` for verified reviews and review appeals.
- `API-CLAIMS-001..005` for refund requests, protection claims, scoped claim reads and appeals.
- `API-PLATFORM-001` for the evidence transfer boundary used by claims and appeals.

Backend `main` currently exposes only the public catalog route. None of the contracts above is exposed by `routes/api.php` yet.

## Trust rules

- The app never implies that UperTib collects, holds, transfers, captures, settles or refunds money. V1 records what parties agreed or asserted and any approved external obligation.
- Historical agreed amounts remain in the currency captured at acceptance and are never recomputed using a later exchange rate.
- Financial assertions and responses append; they never rewrite the original event.
- A partial financial event read produces no derived position.
- Only verified completed experiences that are still within their review window can become reviewable.
- A retired review remains visible with its governed reason; it never silently disappears.
- Review appeal scope is explained before input: eligibility, verification and policy compliance are contestable; rating and review text are not.
- Refund approval records an external obligation and never means a platform refund occurred.
- Protection entitlement gates entry to a protection claim rather than failing after the patient submits.
- Missing evidence is explicit. An evidence requirement whose state failed to load is never treated as satisfied.
- Evidence upload/transfer is not invented as a local mechanism; it stops at the `API-PLATFORM-001` boundary and the vendor decision referenced by the canonical docs.
- Claim appeals use the historical policy snapshot and historical appeal window that governed the original decision; the original decision remains visible.
- All screens remain Arabic-first and RTL-first. Directional navigation mirrors logically while amounts, currency codes, timestamps, identifiers and Latin names must be bidi-isolated when authoritative values are rendered.

## Current implementation boundary

The full route hierarchy and safe unavailable states exist now. Because the backend contracts are not implemented, the client does not render fabricated amounts, review eligibility, claim deadlines, evidence completeness, decisions, appeal windows or money movement. Committing actions remain withdrawn until the authoritative contracts are available.
