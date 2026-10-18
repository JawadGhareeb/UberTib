# Pen V5 — finance, claims and completed-case visual reference

Scope: the six screenshots supplied on 2026-10-11. These are visual references for the **patient mobile application**, not evidence of live transactions or clinical records. The source files already implement the relevant mock journeys and must retain their pending/authoritative-response semantics.

## Reference screens mapped to existing routes

| Screenshot | Route | Component |
| --- | --- | --- |
| السجل المالي | `/care/[caseId]/financial` | `AcceptedFinancialTermsScreen` |
| تأكيد الدفعة | `/care/[caseId]/financial/timeline` | `FinancialTimelineScreen` |
| طلب الاسترداد | `/care/[caseId]/claims/refund` | `RefundRequestScreen` |
| إنشاء مشكلة أو شكوى | `/care/[caseId]/claims` | `ClaimsScreen` |
| قرار النزاع والاستئناف | `/care/[caseId]/claims/[claimId]` | `ClaimDetailScreen` |
| تقييم الحالة المكتملة | `/care/[caseId]/reviews/new` | `SubmitReviewScreen` |

## Visual contract

- Header: 64dp, centered Arabic title, back arrow points right in RTL, badge-like icon left. Use warning/success/danger icon tone where status-specific.
- Page body: `max-w-[430px]` and `px-4`, so the intended 390dp frame keeps 16dp left/right gutters and 360/430dp remain fluid.
- Cards: neutral outlines on ordinary cards, radius 14–16dp, approximately 8dp vertical separation, Arabic title aligned right. Key warning/success/info cards retain **semantic state colors**, independent of brand.
- Finance summary: accepted-plan amount/metadata, line-item card, eligibility timeline, event statuses, safety notice. Detail rows use `CareDetailRow`.
- Payment confirmation: amber **unknown state** warning, never offer or imply a second charge, same-reference verification action and dispute path.
- Refund: four numbered steps, final verification still pending until authoritative confirmation; no fabricated receipt success.
- Dispute: distinct confirmed/not-confirmed amounts, reviewed evidence, appeal deadline and CTA; no inert buttons posing as active actions.
- Review: 5 selectable stars (reference initially 4), form to report patient experience, moderation stages, submission-only after eligibility. No automatic publication.
- Complaint: one selected claim category, explicit related records, description input and evidence examples; no claim is treated as accepted merely because the button was pressed.
- Footer: `CareActionFooter` inside the `Screen` safe-area avoids a second manual inset; multi-action footer buttons are stacked and have 52dp and 44dp heights.
- `Primary = #00E0B8` on actions and branded icons, **white text on Primary solid buttons**. Do not import the old dark green from the screenshot. Preserve light theme neutrals, status warnings, RTL and responsive text.

## Payments and complaints explanatory guide

The fourth supplied panel, **الدفعات والمشكلات والتقييم**, is a Pen journey explanation rather than a separate transactional mock screen. Its mobile adaptation lives at `/care/financial-guide?caseId=case-001` and `CareFinancialGuideScreen`. It uses light, simple rows matching the board's six steps; these are **navigation only** and cannot confirm payments, authorize refunds or publish reviews.

**Entry:** `علاجي` → choose the case → `إجراءات الحالة` → `الدفعات والمشكلات والتقييم`. The accepted financial ledger also has a link to the guide. From the case ledger, a pending external payment opens `/care/[caseId]/financial/timeline`, and the claim flow reaches `/care/[caseId]/claims/refund`.

**Data safety:** At present the demo receipt, payment attempt and refund fixtures only belong to `case-001`. The three transactional pages render a safe unavailable state for other case IDs. If scenario data upgrades the accepted plan from version 2 to 3, the financial ledger labels payment events from version 2 as *historical* and does not present their stage payment amounts as obligations of the new version. Pending payment/refund confirmations disable repeat submission until the simulated authoritative response is available.

## Unified October 12 header and financial cards

- `CareV5Header` is the single reusable 64dp app bar for patient care pages. It stays outside each screen's `ScrollView`, centers the title, and places Back at the RTL start (right) and the contextual icon at the opposite side. It provides a safe return to My Care when a back stack is unavailable.
- `CareFinancialPageHeader` configures that same header for the ledger, unknown-payment confirmation, and refund screens; the unavailable state uses it as well.
- `CareFinancialCardHeading` and `CareDetailRow` unify the small status label, right-aligned Arabic card title, two-column financial detail, and semantic icon treatment. Brand colors still come from tokens, not the old screenshot's teal.
- The ledger exposes navigation to payment, refund, and complaints through shared `CareV5ActionLink` cards. The payment screen verifies the same transaction reference without initiating a new charge; refund confirmation stays pending until acknowledged by authoritative state.
- Preserve a single safe-area inset for the bottom action footer. Validate small-screen Arabic text at 360, 390 and 430dp rather than clipping descriptions to one line.

## Remaining verification

UI modifications do not establish that mock records belong to arbitrary route `caseId`/`claimId` values. Inspect scenario data and authoritative states before real backend rollout. GitHub Actions currently fail with zero job steps, so these files have **not been proven by a successful build or device screenshot diff**. Run `npm run check` plus Android/iOS screenshots at 360/390/430 widths when CI runners are available. Do not claim full pixel parity until then.
