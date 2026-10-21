import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const base = 'src/features/my-care/';
const booking = read('src/features/booking/screens/booking-detail-screen.tsx');
const mainTabs = read(base + 'components/care-main-tabs.tsx');
const careTabs = read(base + 'components/care-v5-ui.tsx');
const sharedTabs = read('src/shared/components/ui/section-tabs.tsx');
const timeline = read(base + 'screens/case-timeline-screen.tsx');
const plan = read(base + 'screens/treatment-plan-screen.tsx');
const finance = read(base + 'screens/accepted-financial-terms-screen.tsx');
const followUps = read(base + 'screens/follow-ups-screen.tsx');
const acceptance = read(base + 'screens/plan-acceptance-screen.tsx');
const claimForm = read(base + 'screens/claims-screen.tsx');
const slotSelection = read('src/features/booking/screens/slot-selection-screen.tsx');
const bookingHeader = read('src/features/booking/components/booking-v5-ui.tsx');
const careHeader = read(base + 'components/care-v5-ui.tsx');
const appHeader = read('src/shared/components/navigation/app-header.tsx');

assert.ok(
  sharedTabs.includes('bg-action-primary') && sharedTabs.includes('text-content-on-action'),
);
assert.ok(
  mainTabs.includes('solidActive') && careTabs.includes('solidActive'),
  'Care primary and filter HeroUI tabs must have on-brand fill and on-action white text',
);
assert.ok(
  finance.includes('<SectionTabs') && finance.includes('solidActive'),
  'Ledger tabs must use the same real HeroUI tabs as other care screens',
);

for (const name of ['الكل', 'علاج', 'ماليات', 'مشكلات']) {
  assert.ok(timeline.includes(name), 'Missing case history tab: ' + name);
}
assert.ok(
  timeline.includes("filter === 'علاج'") &&
    timeline.includes("filter === 'ماليات'") &&
    timeline.includes("filter === 'مشكلات'"),
  'Case hub tabs must have distinct relevant contextual sections',
);
assert.ok(
  timeline.includes("pathname: '/care/[caseId]/plan'") &&
    timeline.includes("pathname: '/care/[caseId]/financial'"),
  'Hub must lead to separate plan and ledger',
);
assert.ok(
  timeline.includes('event.claimId') &&
    timeline.includes('params: { caseId, claimId: event.claimId }'),
  'Only case-owned complaint events open claim detail',
);
assert.ok(
  timeline.includes('label="الإبلاغ عن مشكلة"') &&
    timeline.includes('disabled={claimsReadState !==') &&
    timeline.includes('submittedRefund ?') &&
    !timeline.includes('label="فتح نزاع على دفعة"'),
  'Issues tab should have one complaint entry and conditional refund follow-up, not duplicate finance shortcuts',
);

assert.ok(
  plan.includes('getMockCareCaseForScenario(caseId, scenario)') &&
    plan.includes('careCase.treatmentPlan.map') &&
    plan.includes('careCase.stages.map') &&
    plan.includes('<Accordion') &&
    plan.includes('<Accordion.Trigger>') &&
    plan.includes('<Accordion.Content>'),
  'Every patient plan must have data-backed line items and HeroUI expandable stages',
);
assert.ok(
  !plan.includes('التهاب لبي غير عكوس') && !plan.includes('careCase.treatmentPlan[0]?.priceLabel'),
  'Treatment plan must not assert hardcoded case-001 diagnosis or fake fallback prices',
);
assert.ok(
  !plan.includes('label="تفاصيل المرحلة والأدلة"') &&
    plan.includes("'/care/[caseId]/plan-acceptance'") &&
    plan.includes("'/care/[caseId]/follow-ups'") &&
    followUps.includes("pathname: '/care/[caseId]/stage/[stageId]'"),
  'Stage accordion is sufficient; upload/evidence actions remain reachable in follow-ups',
);

assert.ok(
  finance.includes('caseId !== record.caseId') &&
    finance.includes('getMockFinancialRecordForScenario') &&
    finance.includes('getMockFinancialEventsForScenario') &&
    finance.includes('financialSubmissions.filter((event) => event.caseId === caseId)'),
  'Finance terms/events must be case-scoped and scenario-derived, not unrelated demo data',
);
assert.ok(
  finance.includes("value: 'terms'") &&
    finance.includes("value: 'transactions'") &&
    finance.includes('terms.snapshotReference') &&
    finance.includes('terms.cancellationTermsLabel') &&
    finance.includes('terms.refundTermsLabel'),
  'Financial snapshot retains its immutable terms, version and refund rules',
);
assert.ok(
  finance.includes("event.state === 'confirmed'") &&
    finance.includes("event.id === 'financial-event-002'") &&
    finance.includes("pathname: '/care/[caseId]/financial/timeline'") &&
    !finance.includes('فتح نزاع على هذه الدفعة'),
  'Only confirmed events count as confirmed; financial ledger removes the duplicate dispute button',
);
assert.ok(
  finance.includes('if (submittedRefund)') &&
    finance.includes("pathname: '/care/[caseId]/claims/refund'"),
  'Refund follow-up must distinguish an existing request from a new eligible demo',
);

assert.ok(
  booking.includes('canReschedule = isConfirmed') &&
    booking.includes('canCancel =') &&
    booking.includes('visible={actionsOpen && canManage}') &&
    booking.includes('leftIcon={canManage ?') &&
    booking.includes('bookingRequests.find((request) => request.id === bookingId)'),
  'Booking management actions must reflect booking status and never act on a different request',
);
assert.ok(
  booking.includes('booking.patientName') &&
    booking.includes('booking.priceLabel') &&
    booking.includes('booking.dateLabel') &&
    booking.includes('booking.timeLabel') &&
    booking.includes("pathname: '/booking/[bookingId]/status'") &&
    !booking.includes("pathname: '/care/[caseId]/timeline'"),
  'Booking details must use the selected booking and not infer an unrelated treatment case',
);

assert.ok(
  appHeader.includes('onBackPress') &&
    appHeader.includes('endContent') &&
    bookingHeader.includes('<AppHeader') &&
    careHeader.includes('<AppHeader') &&
    !bookingHeader.includes('max-w-[430px] items-center justify-between px-4'),
  'Booking and care headers must delegate to the single edge-to-edge AppHeader',
);
assert.ok(
  slotSelection.includes('BookingHeader title="اختيار الموعد"') &&
    slotSelection.includes('Radio') &&
    slotSelection.includes('bg-action-primary') &&
    slotSelection.includes('text-content-on-action') &&
    slotSelection.includes("pathname: '/booking/patient'") &&
    slotSelection.includes("setSlot('')"),
  'Appointment selection uses on-brand states and keeps per-day slot reset and patient route',
);
assert.ok(
  acceptance.includes('careCase.treatmentPlan.map') &&
    acceptance.includes("submitPlanAcceptance(caseId, 'accept')") &&
    acceptance.includes('<ConfirmationDialog') &&
    !acceptance.includes("value: 'أحمد خالد'"),
  'Agreement record uses the selected plan and guarded confirmation without fake patient identity',
);
assert.ok(
  followUps.includes('stageEvidenceDrafts') &&
    followUps.includes('<AssessmentImagePreview') &&
    followUps.includes('rootDraft?.localUri') &&
    followUps.includes("name={{ ios: 'eye'") &&
    followUps.includes('متابعة') &&
    followUps.includes("openStage('stage-root-canal')"),
  'Follow-up evidence eye button only previews real locally saved photos, with upload route preserved',
);
assert.ok(
  claimForm.includes('<TextField') &&
    claimForm.includes('evidenceImages.map') &&
    claimForm.includes('<AssessmentImagePreview') &&
    claimForm.includes('submitCaseIssue') &&
    claimForm.includes('submitRefundRequest') &&
    claimForm.includes("readState !== 'success'"),
  'Issue form keeps HeroUI input, local preview/delete, validation and mock submission flows',
);

process.stdout.write(
  'Care hub, HeroUI tabs, plan accordion, financial terms/events, booking semantics checked.\\n',
);
