# Patient V5 — Payment, claims and review demo flows

**Scope:** clickable local-only mock QA for the six Pen screenshots: completed-treatment review, human dispute decision/appeal, create care issue, refund request/receipt, payment verification, and accepted financial ledger. No real backend action is implied.

## Demo patient cases

- **case-001** — ongoing root-canal care with the example accepted financial terms, unknown payment attempt and pre-approved partial refund. Its ledger/payment/refund screens use this case only.
- **case-002** — completed restoration, valid mock review target. A review can be submitted and inspected but remains unverified/not published.
- **case-003 and case-004** — care timeline and treatment plan data; no unrelated financial/payment/refund fixtures are borrowed.

## Navigate / verify each Pen screenshot

| Pen screen | Entry point | Test action | Expected client-only state |
| --- | --- | --- | --- |
| السجل المالي | علاجي → case-001 → الحالة → الشروط المالية المقبولة | open pending 300,000 SYP line | confirmation/verification page, same case ID |
| تأكيد الدفعة | السجل المالي → pending payment | «التحقق من العملية نفسها» or «فتح نزاع على الدفعة» | verification stays pending for the **same** financial event ID; dispute preselects payment issue type, never creates a new charge |
| إنشاء مشكلة أو شكوى | Profile → Settings → المساعدة والدعم → شكوى عن الرعاية → select case; or payment → فتح نزاع | select problem type, enter >=8 characters, optionally select up to three photos, submit | `session-issue-{caseId}-{type}` created in mock scenario, navigates to its own detail **قيد المراجعة**; attachments are local, not uploaded |
| قرار النزاع والاستئناف | علاجي → case-001 → «مشكلات» → «قرار نزاع على دفعة شام كاش» | view example human decision; if eligible open appeal | opens seeded `claim-dispute-demo`, limited to case-001; for new local issues, show pending details with no invented decision or appeal right |
| طلب الاسترداد | Profile → Settings → Support → طلب استرداد → case-001 (or case issue option طلب استرداد) | «تأكيد استلام الاسترداد» or «الإبلاغ عن عدم الاستلام» | first stores `refund-execution-case-001` response in pending state; second goes to refund-execution complaint **for same case**, not new refund claim |
| تقييم الحالة المكتملة | علاجي → case-002 → case timeline → «تقييم التجربة المكتملة» | stars + comment → «إرسال التقييم الموثق» | local `session-review-case-002` created, routes to review detail and remains under experience verification; case-001 cannot submit an incomplete-case review |

### When to complain (Pen workflow)

- Clinical harm/poor treatment/follow-up: **شكوى عن الرعاية** while the relevant case exists; this does **not** require treatment completion.
- Clinic delay/booking/communication: **شكوى عن الموعد** on that patient's care context, or a booking-specific support ticket if there is no case yet (requires backend booking scope).
- Unknown external payment: **verify the same reference first**; if disputed, route to a specific payment dispute. The app never charges again or acts as a wallet.
- Canceled/unperformed eligible service: **طلب استرداد** under accepted terms and the applicable eligibility window; do not treat a complaint as an approved refund.
- Agreed refund not received: **الإبلاغ عن عدم الاستلام** from the refund screen to a *refund execution issue*, not a duplicate refund request.
- Appeal: only after an authoritative, appeal-eligible decision with its deadline; never on a newly filed pending issue.
- Review: only for a verified completed care experience, independently of claim submission.

### Developer notes

- All mock mutations live in `src/shared/mock/scenario-provider.tsx` and are reset when selecting another scenario; they do not survive app restart.
- The demo dispute decision comes from `src/features/my-care/mocks/records.mock.ts`; it is separate from newly submitted pending issues.
- The client UI has no authority to confirm external payments, refunds, clinical decisions or publish reviews. The backend handoff operations are mapped in `src/shared/api/patient-v5-screen-map.ts`.
- Test with `npm run care-mock:check` and `npm run care-ui:check`, then perform Android/iOS interaction testing. Static audits alone cannot prove a build or runtime flow.
