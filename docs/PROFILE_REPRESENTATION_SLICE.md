# Patient Mobile — Profile & Representation Slice

This slice implements the approved Patient identity, family and representation route hierarchy without inventing authorization state that is not yet exposed by the backend.

## Canonical screen chain

```text
Profile                     SCR-IDENTITY-004
├── Family & representation SCR-IDENTITY-005
│   ├── Create grant        SCR-IDENTITY-006
│   ├── Grant detail        SCR-IDENTITY-007
│   └── Add dependent       SCR-IDENTITY-037
├── Active patient context  SCR-IDENTITY-008
└── Pending submissions     SCR-PLATFORM-002
```

## Authorization rules

- Representation has two distinct directions: grants the patient gave and grants the actor holds. They are never merged into one ambiguous list.
- A grant with unknown scope offers no action. Unknown scope must never read as full scope.
- Grant creation requires the full action scope, data scope, purpose, effective period and basis to be legible before commit.
- A guardian cannot self-authorize a dependent. The legal-basis path is reviewed outside the guardian's own authority.
- Revocation is unconditional for future actions. Existing care history is preserved and no prior action is deleted.
- Selecting another patient changes context only. It grants no authority; every protected request is re-evaluated server-side.
- Only subjects backed by an active grant are selectable.

## Pending submissions

Unknown, failed and completed are distinct outcomes. An unknown outcome never enables a duplicate command. The client reconciles through authoritative reads before retrying or discarding an attempt.

## Backend boundary

The documented contracts for this slice are `API-IDENTITY-003` through `API-IDENTITY-006`, plus authoritative booking, claims and finance reads used by pending-submission reconciliation. Backend `main` does not currently expose these routes.

Until those contracts exist, the mobile app provides the approved route hierarchy and safe unavailable states. It does not fabricate profile identity, grant scope, dependent verification, active-subject authority or submission outcomes.
