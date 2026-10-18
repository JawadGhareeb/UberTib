# UperTib Patient App — User Flow Map

This map is an implementation-facing summary of the approved patient information architecture and user-flow documents. Canonical behavior remains in `UperTib-Docs`.

## Persistent navigation

```text
Patient shell
├── Home        -> SCR-PLATFORM-001
├── Discover    -> SCR-CATALOG-001
├── My care     -> SCR-CLINICAL-001
└── Profile     -> SCR-IDENTITY-004

Global utility
└── Notifications -> SCR-PLATFORM-009
```

## Public discovery and authentication gate

```text
SCR-IDENTITY-001 Patient entry
├── Browse services
│   -> SCR-CATALOG-001 Service groups
│   -> SCR-CATALOG-002 Service detail
│   -> SCR-ELIG-002 Provider results
│   ├── SCR-ELIG-001 Provider filters (optional refinement)
│   -> SCR-ELIG-003 Provider decision
│   ├── SCR-ELIG-004 Eligibility explanation
│   └── SCR-ELIG-005 Provider comparison
│
└── Verify my number
    -> SCR-IDENTITY-002 Phone entry
    -> SCR-IDENTITY-003 Code verification
    -> origin screen or SCR-PLATFORM-001
```

Authentication is a gate, not a replacement journey. Search, provider context, and comparison selection must survive the gate.

Provider filters are optional refinement, not a mandatory step. The default path shows useful provider results immediately, ordered by nearest availability, with all areas selected. Users open filters only when they need to narrow the result set.

## Booking journey

```text
Provider decision
-> SCR-BOOKING-001 Slot selection
-> SCR-BOOKING-002 Review and submit
-> SCR-BOOKING-004 Booking detail

Booking detail may branch to:
├── SCR-BOOKING-005 Alternative appointment decision
├── SCR-BOOKING-006 Cancellation
└── SCR-BOOKING-016 Reschedule request
```

The original confirmed appointment remains visible while an alternative or reschedule proposal is unresolved.

## Active care journey

```text
SCR-CLINICAL-001 My cases
-> SCR-CLINICAL-002 Case summary
├── SCR-CLINICAL-003 Treatment plan
│   -> SCR-CLINICAL-004 Plan acceptance
├── SCR-CLINICAL-005 Case timeline
├── SCR-CLINICAL-006 Stage detail
└── SCR-CLINICAL-007 Follow-ups
```

## Case-scoped records

Finance, reviews, and claims remain contextual to care rather than becoming top-level tabs.

```text
Case
├── Finance
│   ├── SCR-FINANCE-001 Accepted financial terms
│   ├── SCR-FINANCE-002 Financial timeline
│   ├── SCR-FINANCE-003 Report external payment
│   ├── SCR-FINANCE-004 Respond to financial event
│   └── SCR-FINANCE-005 Report external refund execution
├── Reviews
│   ├── SCR-REVIEWS-001 Reviewable experiences
│   ├── SCR-REVIEWS-002 Submit review
│   ├── SCR-REVIEWS-003 My review
│   └── SCR-REVIEWS-004 Review appeal
└── Claims
    ├── SCR-CLAIMS-001 My claims
    ├── SCR-CLAIMS-002 Refund request
    ├── SCR-CLAIMS-003 Protection claim
    ├── SCR-CLAIMS-004 Claim detail
    └── SCR-CLAIMS-005 Claim appeal
```

## Identity and representation

```text
SCR-IDENTITY-004 Patient profile
-> SCR-IDENTITY-005 Family and representation
├── SCR-IDENTITY-006 Create grant
│   -> SCR-IDENTITY-007 Grant detail
├── SCR-IDENTITY-008 Active patient context
└── SCR-IDENTITY-037 Add dependent

Profile also exposes SCR-PLATFORM-002 Pending submissions.
```

## Re-entry rules

- Deep-linked actionable screens re-fetch authoritative state before showing a command.
- Unknown mutation outcomes reconcile through authoritative reads before retry.
- Permission revocation removes stale actions on the next protected read/action.
- Back unwinds the current task rather than replaying tab history.
- Offline/stale UI preserves safe known context and its as-of time and withdraws unsafe committing actions.
