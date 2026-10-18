# UperTib Patient V5 — Backend Integration Handoff

**Date:** 2026-10-12  
**Frontend branch:** `UperTip/upertip-mobile` / `main`  
**Source of UI truth:** attached `UberTib_Patient_V5_Client_Dev_Handoff(4).pen`, format 2.19, boards **02–08**; board 11 is the interaction map and board 12 contains developer notes.  
**Status:** Frontend UI and navigation are mock-first. **Backend connection is NOT complete.** All URLs except those confirmed by backend Swagger must remain unconfigured.

## What is ready in the frontend

1. Expo Router page tree and core navigation for the seven journey groups.
2. Shared Light/Dark semantic components, Arabic/RTL layout, feedback/loading/disabled/permission states in the relevant pages.
3. Typed preliminary backend DTOs/commands at `src/shared/api/patient-v5-contract.ts`.
4. Typed **71 Expo screen → API operation mappings** in `src/shared/api/patient-v5-screen-map.ts`; use this as the screen-by-screen integration checklist.
5. Transport adapter at `src/shared/api/patient-v5-gateway.ts`: Axios client, auth bearer token, safe `Idempotency-Key` for writes, optional `If-Match`, re-verification header, predictable configuration errors.
6. Existing mock scenario providers remain separate from the new transport adapter. **No mock object should be passed off as a successful backend response.**
7. Design-unapproved permanent shortcuts were removed from case timeline, accepted financial ledger and treatment plan. The claim/payment/refund screens still exist as the design requires; navigate only from eligible contextual states.

## Required response guarantees

- **Actor ≠ patient:** every clinical/financial/read or write operation must be authorized for both `actorId` and `subjectId`. Verify representation/grant and revocation server-side; never trust a patient ID only because the client sends it.
- **Read:** provide the effective resource, an authoritative `version`, `asOf` timestamp, and action `capabilities` for the current actor/patient context. Paginated lists return `nextCursor`.
- **Mutation:** `operationId`, `status: pending | accepted | rejected | unknown`, `asOf`, and optionally `resourceId` and `reasonCode`. A button press does not imply acceptance or confirmation. Autosaved drafts may return an updated versioned resource rather than an operation receipt.
- **Unknown outcome:** retry **same** idempotency key and poll/read the authoritative operation/resource. A second payment or booking must not be created.
- **Concurrency:** accepting plan amendments, consent versions, booking alternatives and financial event decisions uses a version/ETag precondition. Return explicit conflict if stale.
- **Privacy:** immutable consent history, accepted plan snapshots and financial snapshots; support scoped access and audited corrections, rather than overwriting historical evidence.
- **Currency:** display Syrian pounds (SYP) only. The fields `amountMinor`/`totalMinor` in the *provisional* DTO are numerical representation placeholders; backend must specify canonical units/precision before mapping any values. Do not silently convert amounts.
- **Uploads:** prepare/upload/complete handshake, restricted upload token, file MIME/size validation, and evidence IDs bound to a case/actor. Neither an upload tap nor an empty image selector proves evidence exists.
- **Payment:** **external only** (clinic cash, Sham Cash where supported). UperTib must not behave as a wallet, escrow, payment processor, insurer or refund funder.

## Integration table — each journey

These are *operation names*, not declared HTTP paths. Obtain exact URL, verb, query/body, headers and response examples from Swagger/backend owner.

### 02 · البداية وإنشاء الحساب

| Screen file / Expo route | Required operations | Backend behavior / edge states |
| --- | --- | --- |
| `app-entry-screen.tsx` — `/` | `identity.profile` | initial session read; existing session → Home; no session → intro/phone; loading/error |
| `phone-entry-screen.tsx` — `/auth/phone` | `identity.sendOtp` | validated phone, purpose, challenge ID, expiry and rate-limit |
| `code-verification-screen.tsx` — `/auth/code` | `identity.verifyOtp` | OTP verification; short-lived return intent; invalid, expired, retry, lockout |
| `profile-setup-screen.tsx` — `/auth/profile-setup` | `identity.profile`, `identity.profileUpdate` | required profile fields, write validation, then return to intended safe route |

**Not live:** session and profile setup still have local/mocked behavior. Use secure token storage already configured under `src/shared/storage`.

### 03 · فهم الحالة وتحديد الحاجة

| Screen(s) / route | Required operations | Backend behavior / edge states |
| --- | --- | --- |
| `/assessment/patient` through `/assessment/health` | `assessment.save`, `profile.health` | patient-scoped draft, adaptive questions, tooth/region selection; snapshot source version |
| `/assessment/media` | `assets.prepareUpload`, `assessment.save` | upload selected dental photos/files; actual confirmed evidence IDs |
| `/assessment/review` | `assessment.read`, `assessment.submit` | explicit sharing/consent scope; submit with idempotency; prevent duplicate |
| `/assessment/processing`, `/assessment/result`, needs-more-info/manual-review | `assessment.read` | polling until result `ready / needs_more_info / manual_review`; patient-safe content, never final diagnosis |

**Not live:** assessment snapshot currently contains demonstration patient/health facts. Editing source profile must not silently rewrite historical snapshots. No clinical triage finality is allowed on device.

### 04 · استكشاف الخدمات واختيار الطبيب

| Screen(s) / route | Required operations | Backend behavior / edge states |
| --- | --- | --- |
| `/discover`, `/discover/group/[groupCode]`, family/service routes | `catalog.groups` | published catalog version, group/family/service IDs, language, availability |
| `/discover/providers/results`, search/filter | `providers.search` | patient/service/branch eligibility, assessed time and freshness, protection facts |
| `/discover/provider/[providerId]`, branch, comparison, reviews | `providers.detail` | same canonical `providerId` and `serviceCode`; never reuse ID for another doctor |
| Entry to booking | `booking.slots` | only slot/provider/service combinations backend reports as eligible |

**Not live:** `getPenDoctorsForService` now derives from the same mock provider catalog as booking. Mock coverage is incomplete; empty results are deliberate instead of inventing providers or slots. Historical mock dates cannot be treated as current availability.

### 05 · الحجز وتأكيد الموعد

| Screen / route | Required operations | Backend behavior / edge states |
| --- | --- | --- |
| `/booking/reason`, `/booking/patient`, `/booking/slots` | `booking.slots`, permission/grant read | patient choice must be authorized; changing patient invalidates assessment/share scope |
| `/booking/review` | `booking.create` | server revalidates slot, eligibility, branch, service and permission atomically; result starts pending unless authoritative confirmation |
| `/booking`, `/booking/[bookingId]`, `.../status` | `booking.list`, `booking.read` | use server booking ID, provider, service, status and optional `caseId`; never infer an unrelated care case |
| Alternative, reschedule, cancel | `booking.alternativeDecision`, `booking.reschedule`, `booking.cancel` | operation receipts; immutable proposal deadlines; preserve previous confirmed state until authoritative change |

**Not live:** new bookings are currently *in-memory pending mock requests*; they disappear after restart and are not saved to the server. No booking→care-case relation exists yet in the mock contract.

### 06 · العلاج والمتابعة

| Screen(s) / route | Required operations | Backend behavior / edge states |
| --- | --- | --- |
| `/(tabs)/care`, `/care/[caseId]/timeline` | `care.list`, `care.read`, `care.timeline` | per-patient cases, category-filtered immutable events and permissions |
| `/care/[caseId]/plan`, `.../plan-acceptance` | `care.plan`, `care.planDecision` | accepted and proposed versions; why changed, itemized financial delta, acceptance/rejection with version check |
| Stage detail, `.../follow-ups` | `care.stage`, `care.followUps`, `care.evidenceUpload`, `assets.prepareUpload` | dated follow-ups, required evidence, stage correction/reopen with audit trail |

**Not live:** accepted root-canal financial/clinical demo is populated for `case-001` only. Other cases must never inherit these values.

### 07 · الدفعات والمشكلات والتقييم

| Screen(s) / route | Required operations | Backend behavior / edge states |
| --- | --- | --- |
| `/care/[caseId]/financial` | `finance.snapshot`, `finance.events` | accepted immutable financial terms; amounts, schedule, cancellation rules |
| `.../financial/timeline`, report-payment | `finance.events`, `finance.reportExternalPayment`, `finance.verifyPayment`, `finance.respondPayment` | external payment reference; unknown != failed; verification must never charge again |
| `.../claims/refund`, refund-execution | `claims.refundCreate`, `finance.refund`, `finance.reportRefundExecution`, `finance.confirmRefundReceipt` | entitlement/affected line/window decided by backend; external execution, patient receipt confirmation |
| `.../claims`, claim detail/appeal | `claims.create`, `claims.list`, `claims.read`, `claims.appeal` | distinguish treatment complaint, appointment, payment dispute, refund and protected claim; human decision and appeal eligibility |
| `.../reviews/new`, review detail/appeal | `reviews.eligibility`, `reviews.submit`, `reviews.read`, `reviews.appeal` | only verified completed cases; single active review, moderation and appeal decisions |

**Not live:** only the first demo case has populated payment/refund sample records. The client now separates mock clinical/appointment/payment/refund-execution issues from protection claims, but their results are still **local, pending and non-authoritative**. Server must validate the issue type and capability. Do not present a complaint as a funded/protected claim without an authoritative eligibility decision.

### 08 · الحساب والعائلة والدعم

| Screen(s) / route | Required operations | Backend behavior / edge states |
| --- | --- | --- |
| `/profile/family`, dependents, grants, patient switch | `profile.family`, `profile.dependentCreate`, `profile.grantCreate`, `profile.grantRevoke` | legal basis, scoped delegation, revoke, immutable attribution |
| `/profile/health` | `profile.health`, `profile.healthUpdate` | update source record only, retain assessment snapshots |
| `/profile/security` | `profile.sessions`, `identity.reverify`, `profile.endSession`, `profile.endOtherSessions` | never revoke current session via "other sessions"; identity re-verification required |
| `/profile/privacy`, consent details | `profile.consentList`, `profile.consentRead`, `profile.consentWithdraw` | purpose-scoped versions, immutable history, withdrawal restrictions |
| `/profile/data` | `profile.exportCreate`, `profile.exportStatus` | async preparing/ready/expired/failure; signed expiring download URL |
| `/profile/account-closure` | `identity.reverify`, `profile.closureCreate`, `profile.closureStatus` | request/review/scheduled/closed; retention policy, no instant deletion |
| `/notifications`, `/needs-attention` | `platform.notifications` | unread/actionable event + deadline + safe contextual deep link |
| `/support` | `support.list`, `support.read`, `support.create`, `assets.prepareUpload` | support ticket with case scope and evidence; no direct chat/WhatsApp |

**Not live:** privacy, security, exports, closure, help tickets and family mutations currently contain mock/local presentations. The support page no longer assumes all patients' complaints belong to `case-001`. It prompts for a case when launched without scope, and funded protection-claim entry is disabled until eligible.

## Wiring an approved endpoint

The URL below is intentionally **not** given, because it has not been supplied by backend Swagger.

```ts
import { createPatientV5Gateway } from '@/shared/api/patient-v5-gateway';

const gateway = createPatientV5Gateway({
  'booking.read': {
    method: 'GET',
    path: ({ bookingId }) =>
      approvedBackendRoutes.bookingRead.replace(':bookingId', encodeURIComponent(bookingId)),
  },
  'booking.create': {
    method: 'POST',
    path: () => approvedBackendRoutes.bookingCreate,
    body: ({ scope, ...payload }) => ({
      ...payload,
      patient_id: scope.subjectId,
    }),
  },
});
```

On mutation, pass the same `idempotencyKey` through retries and use `expectedVersion` where appropriate. Refetch/poll via React Query until the backend returns an authoritative status; only then update visible case, appointment or money state. Do not connect an operation until its server DTO has been validated with tests.

## Backend team must provide

1. **Swagger/OpenAPI** with exact operation paths, verbs, auth, request/response examples, list pagination, every error code and state enumeration.
2. **Staging base URL**, access-token flow, refresh policy, actor/subject/grant authorization and re-verification contract.
3. **Canonical identity map**: service codes, provider IDs, branch IDs, booking IDs, case IDs, plan/snapshot versions, payment/claim/review IDs.
4. **Decision rules** for slot expiry, provider eligibility freshness, assessment requirements, booking state, plan revisions, payment unknown result, refunds, complaints, verified reviews, consent withdrawal, family representation and account closure.
5. **Upload handshake** and short-lived download URL contract for exports.
6. Stable server error IDs: `401`, `403`, `404`, `409/412`, `422`, `429`, `5xx`, timeout/offline, with patient-safe Arabic messages mapped by frontend (do not expose stack traces).
7. **Reconciliation endpoints** for every mutation with `pending` or `unknown` outcomes; authoritative reads after reconnect.

## Frontend acceptance checklist once APIs exist

- [ ] No duplicate booking/payment/claim on retry or timeout; no premature "confirmed" UI.
- [ ] Correct patient/permission on every tab, deep link, and write after grant revocation.
- [ ] Booking/doctor/service IDs consistent end to end; booking→case only when backend supplies `caseId`.
- [ ] Plan version acceptance doesn't overwrite previous accepted snapshots.
- [ ] Case financial screens never show another patient's or demo case's payment/refund.
- [ ] Pending, empty, permission, error, stale and retry states tested per screen.
- [ ] Arabic RTL/bidi and image upload tested on Android and iOS at 360, 390 and 430dp.
- [ ] `npm run routes:check`, `npm run check`, and device navigation tests pass.

**Important:** current GitHub Actions remain failing; static source inspection and mock UI are not evidence of a successful production build or complete backend integration.
