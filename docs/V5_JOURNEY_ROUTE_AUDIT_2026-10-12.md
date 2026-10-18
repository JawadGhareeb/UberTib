> **2026-10-12 follow-up:** The Pen-only UI cleanup removed generic shortcuts and the explanatory financial-guide page. Support no longer hard-codes `case-001`; mock issues now have distinct types. The source-of-truth integration handoff is [PATIENT_V5_BACKEND_HANDOFF_2026-10-12.md](PATIENT_V5_BACKEND_HANDOFF_2026-10-12.md).

# UperTib patient — seven journey groups route audit (2026-10-12)

Source: uploaded `UberTib_Patient_V5_Client_Dev_Handoff(4).pen`, boards 02–08 plus board 11 Interaction Map. Audited the `UperTip/upertip-mobile` Expo Router tree on `main`.

**Scope:** Static route/interaction inspection and corrective code changes, **not** a completed runtime test or confirmation of backend/API behavior. Test with `npm run routes:check`, `npm run check`, and real device navigation when CI is operational.

## 01 — البداية وإنشاء الحساب

`/` → onboarding / session check → `/auth/phone` → `/auth/code` → `/auth/profile-setup` → `/(tabs)/home` or a validated return destination.

**Fixed:** development startup no longer forces the onboarding carousel on every boot; persisted onboarding/session state controls the route.

## 02 — فهم الحالة وتحديد الحاجة

`/(tabs)/home` → `/assessment/start` → `/assessment/patient` → `/assessment/complaint` → `/assessment/location` → `/assessment/questions` → `/assessment/health` → `/assessment/media` → `/assessment/review` → `/assessment/processing` → `/assessment/result` → `/discover/providers/results`.

**Fixed:** the health and dental history edit actions, including `تحديث المعلومات`, open `/profile/health` instead of doing nothing.

**Gap:** The assessment contains demo health/patient context; editing the source health profile must eventually refresh the assessment snapshot explicitly rather than silently presenting another patient's fixed facts.

## 03 — استكشاف الخدمات واختيار الطبيب

`/discover` → `/discover/group/[groupCode]` → `/discover/family/[familyCode]` → `/discover/providers/results?serviceCode=...` → `/discover/provider/[providerId]` → provider branch / reviews / comparison → `/booking/reason`.

**Fixed:** provider cards, details, comparison and branch now derive from the same `mockProviders` list used by slot selection. Former Pen data reused IDs for different doctor names and included `provider-rima` without a booking record; these must not be treated as bookable people. Service-specific results show an explicit empty state when no matching provider exists.

**Gap:** Only a subset of service codes has mock bookable providers. The catalog needs authoritative eligible provider/service/branch data before full production coverage.

## 04 — الحجز وتأكيد الموعد

`/booking/reason` → `/booking/patient` → `/booking/slots` → `/booking/review` → pending submission → `/booking` → `/booking/[bookingId]` → `/booking/[bookingId]/status`; reschedule, cancel and conditional alternative screens are scoped to the selected `bookingId`.

**Fixed:** the booking list previously displayed three unrelated case cards pointing at only two mock booking IDs. The list and details now use canonical scenario booking data. Each new mock request is stored in the in-memory scenario session with an individual `session-booking-...` ID, appears as **قيد التأكيد**, and can be opened from the list and status route. Such requests do not claim appointment confirmation and cannot open actions that do not support the temporary request. Repeated identical submissions are deduplicated within the session.

**Gaps:** New submissions are local simulation, not backend appointments and not persisted across restart. Provider slot dates are historical mock dates and must be replaced by server availability before production booking.

## 05 — العلاج والمتابعة

`/(tabs)/care` → `/care/[caseId]/timeline` → `/care/[caseId]/plan` → `/care/[caseId]/plan-acceptance`, stage details and `/care/[caseId]/follow-ups`.

**Fixed earlier:** cards are scoped to the selected `caseId`; non-first cases use their own plan/timeline rather than the root-canal reference.

**Gap:** Current mock bookings are not linked to a canonical `bookingId → caseId` relation. Therefore a booking must not automatically open an unrelated care plan.

## 06 — الدفعات والمشكلات والتقييم

`/care/[caseId]/financial` → `/care/[caseId]/financial/timeline` (payment check) and `/care/[caseId]/claims/refund`; complaints at `/care/[caseId]/claims`. Completed cases only: `/care/[caseId]/reviews/new`.

**Fixed:** the completed-case review CTA is reachable from the timeline, and direct review access rejects missing/incomplete cases. The review form uses the actual selected case/provider and no fabricated numeric scores or expiry date.

**Gaps:** Payment/refund sample fixtures currently belong only to `case-001`. Confirmations, financial events and reviews remain mock/pending and require authoritative backend reconciliation.

## 07 — الحساب والعائلة والدعم

`/(tabs)/profile` → `/profile/settings`, `/profile/family`, `/profile/health`, `/notifications`, `/support`; settings → `/profile/security`, `/profile/privacy` → `/profile/privacy/consents/[consentId]`, `/profile/data`, `/profile/account-closure`.

**Fixed earlier:** consistent compact profile screens, navigable consent details, data-export states and account security controls.

**Gaps:** Support, identity re-verification, exports and account closure remain mock/client workflows in the current project; they are not proven live backend operations.

## Test and release status

- `scripts/audit-routes.mjs` now covers the seven primary routes groups, validates their inter-screen destination references, enforces one provider catalog, and protects against the earlier booking→wrong care case regression.
- Static source checks do **not** guarantee deep-link params, authorization, service availability, backend state, or success/failure behaviors.
- GitHub Actions Quality / Visual QA are failing before usable jobs finish. **No successful device/TypeScript/visual acceptance test is claimed.**
- Complete Android/iOS testing (360/390/430dp), server-backed identity, provider/service availability, case association and secure mutation responses before marking the full journeys production-ready.
