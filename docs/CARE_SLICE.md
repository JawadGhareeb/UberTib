# Patient Mobile — My Care Slice

This slice implements the approved Patient clinical route hierarchy without inventing clinical data or business rules that are not yet exposed by the backend.

## Canonical screen chain

```text
My care
└── My cases                    SCR-CLINICAL-001
    └── Case summary            SCR-CLINICAL-002
        ├── Treatment plan      SCR-CLINICAL-003
        │   └── Plan acceptance SCR-CLINICAL-004
        ├── Case timeline       SCR-CLINICAL-005
        │   └── Stage detail    SCR-CLINICAL-006
        └── Follow-ups          SCR-CLINICAL-007
```

## Backend ownership

The canonical contracts are:

- `API-CLINICAL-001` — case list/summary and follow-up context.
- `API-CLINICAL-002` — treatment plan read.
- `API-CLINICAL-003` — treatment-plan acceptance.
- `API-CLINICAL-004` — ordered case timeline and patient-safe stage detail.

These routes are documented in `UperTib-Docs`, but are not currently exposed by backend `main`. The mobile implementation therefore prepares the route hierarchy, Arabic/RTL composition, and safe unavailable states while withholding authoritative clinical facts and all committing actions.

## Safety and UX rules

- A missing clinical read is not rendered as an empty case, no outstanding action, no follow-up due, or an empty timeline.
- A partial treatment plan never renders a total.
- Plan acceptance is never shown without the current complete plan, its material changes, amounts, terms, and actor authority.
- Accepted plans remain immutable in the client.
- Timeline corrections and reversals append; the client never edits history.
- A stage reopening must include its reason before the UI presents it as understandable history.
- Private clinical evidence, storage paths, and signed links never belong in patient projections.
- Follow-up due state comes from authoritative clinical data, not from notification delivery.
- RTL ordering is logical. Dates, times, amounts, currency codes, record IDs, and Latin clinic names are bidi-isolated when they are eventually rendered.

## Current implementation boundary

The following screens exist now and intentionally show non-fabricated unavailable states until the server contracts are implemented:

- My cases.
- Case summary.
- Treatment plan.
- Plan acceptance.
- Case timeline.
- Stage detail.
- Follow-ups.

When each backend contract lands, add transport/query modules inside `src/features/my-care/` and replace only the unavailable state for the affected screen. The route tree and visual hierarchy should not need to change.
