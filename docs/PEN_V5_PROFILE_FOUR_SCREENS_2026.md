# Pen V5 — Profile, Notifications, Family, Health & Support

Screenshots received 2026-10-12: four mobile pages in Arabic. The editable `.pen` design source was not accessible through project files or in the repository in this turn. The **user-supplied screenshot** is the reference; therefore pixel parity still requires device comparison against Pen exports.

| Screenshot | Existing/new route | Scope |
| --- | --- | --- |
| الإشعارات | `/notifications` | Redesigned with segmented attention/history, dynamic scenario items, actual read state and real route actions |
| أفراد العائلة | `/profile/family` | Redesigned using active grant source, pending/revoked status, detail and revoke flow, dependents and navigation |
| معلوماتي الصحية | `/profile/health` | New read-only expandable summary reusing known assessment demo facts; clearly marks local notes as unsent, privacy links |
| المساعدة والدعم | `/support` | New support hub with refundable-payment, complaint and financial event links; support request is a local draft, not backend submission |

Visual rules: 390dp design reference, 16dp gutters, 430dp max width, RTL, 62dp header, neutral card strokes and 11–15dp radius, primary icons and CTA labels using the current `#00E0B8`. Orange/peach is an independent warm semantic accent. Solid Primary button text must remain white.

Safety/behavior constraints: **Do not copy names or real medical records from screenshot** into another patient's session. Use existing mock patient and grant data until backend is available. Health accordion is a **demo**, not an authoritative medical record. Family permissions are not instantly granted or revoked on tap; continue using existing grant-detail confirmation and server-authoritative pattern. Support tickets are not submitted to a server in this mock; the UI visibly calls them unsent drafts.

QA: run `npm run ui:check`, `npm run check`, test all four page routes on 360/390/430 Android/iOS sizes, verify RTL icon alignment, scroll and keyboard/overflow, permission errors, alert empty states, notification link actions, and status handling. UI build success and pixel parity are **not established** by source inspection alone.
