import { readFileSync } from 'node:fs';

const root = 'src/features/my-care/screens/';
const read = (file) => readFileSync(file, 'utf8');
const screens = {
  'accepted-financial-terms-screen.tsx': ['CareDetailRow', '<CareV5BottomNav', 'getSurfaceState'],
  'financial-timeline-screen.tsx': ['CareDetailRow', '<CareActionFooter>', 'submitFinancialEventResponse', 'financial-event-002'],
  'refund-request-screen.tsx': ['CareDetailRow', '<CareActionFooter>', 'submitFinancialEventResponse', 'refund-execution-case-001'],
  'claim-detail-screen.tsx': ['<CareV5Card', '<CareActionFooter>', 'claimId', 'appealPending'], 
  'submit-review-screen.tsx': ['<CareActionFooter>', 'submitReview', 'setRating'],
  'claims-screen.tsx': ['<CareActionFooter>', 'submitCaseIssue', 'issueTypes'],
};
const issues = [];
for (const [file, mustInclude] of Object.entries(screens)) {
  const source = read(root + file);
  if (source.includes('max-w-[390px]') || source.includes('max-w-[358px]')) {
    issues.push(file + ' retains narrow legacy max width');
  }
  if (!source.includes('<ReadStateBoundary')) {
    issues.push(file + ' lost permission/read-state protection');
  }
  for (const needle of mustInclude) {
    if (!source.includes(needle)) issues.push(file + ' missing ' + needle);
  }
}
const header = read('src/features/my-care/components/care-v5-ui.tsx');
if (!header.includes("ios: 'arrow.right'") || !header.includes('rowReverseClassName')) {
  issues.push('Patient care headers must keep the back arrow on the RTL right edge');
}
if (!header.includes('h-16') || !header.includes('bg-surface-default') || !header.includes('router.canGoBack()')) {
  issues.push('All care pages must use the shared fixed-height app bar and safe back navigation');
}
const reusable = read('src/features/my-care/components/care-financial-ui.tsx');
if (!reusable.includes('function CareActionFooter') || !reusable.includes('function CareDetailRow')) {
  issues.push('Shared finance components must exist');
}
if (!reusable.includes('function CareFinancialPageHeader') || !reusable.includes('function CareFinancialCardHeading')) {
  issues.push('Finance screens must share the same header, heading and detail-row components');
}
if (read(root + 'claim-detail-screen.tsx').includes('onPress={() => undefined}')) {
  issues.push('Inert request-for-explanation button must not reappear');
}

const financial = read(root + 'accepted-financial-terms-screen.tsx');
const payment = read(root + 'financial-timeline-screen.tsx');
const refund = read(root + 'refund-request-screen.tsx');
const careTimeline = read(root + 'case-timeline-screen.tsx');
const claims = read(root + 'claims-screen.tsx');

// Financial references keep two distinct routes and patient-safe pending semantics.
const financialRecord = read('src/features/my-care/mocks/records.mock.ts');
const financeHeader = read('src/features/my-care/components/care-financial-ui.tsx');
for (const token of [
  "tone: 'primary'",
  "payment: { title: 'تأكيد الدفعة'",
  "ledger: { title: 'السجل المالي'",
]) {
  if (!financeHeader.includes(token)) issues.push('Financial header color/title contract missing: ' + token);
}
for (const token of [
  'mockFinancialRecord.events[0].amountLabel',
  'mockFinancialRecord.events[1].amountLabel',
  'careCase.acceptedTotalLabel',
  'careCase.treatmentPlan.map',
  "pathname: '/care/[caseId]/financial/timeline'",
  '<CareV5BottomNav active="care" />',
]) {
  if (!financial.includes(token)) issues.push('Financial ledger layout or dynamic amount missing: ' + token);
}
for (const token of [
  "label: 'قيد الإرسال'",
  "label: 'غير معروف'",
  "label: 'مؤكد'",
  "label: 'متنازع'",
  "background: 'bg-tone-warning-fill'",
  "background: 'bg-tone-success-fill'",
  "background: 'bg-tone-danger-fill'",
  "pathname: '/care/[caseId]/claims'",
  "issue: 'payment'",
  "submitFinancialEventResponse('financial-event-002', 'confirmed'",
  '<ConfirmationDialog',
]) {
  if (!payment.includes(token)) issues.push('Payment confirmation visual or action contract missing: ' + token);
}
if (!financialRecord.includes("amountLabel: '750 ل.س'") ||
    !financialRecord.includes("amountLabel: '1,500 ل.س'")) {
  issues.push('Financial snapshot events must retain the approved mock amounts');
}

if (!financial.includes('getMockCareCaseForScenario') ||
    !financial.includes('careCase.acceptedTotalLabel') ||
    !financial.includes('careCase.treatmentPlan.map') ||
    !financial.includes('isAmendedPlan')) {
  issues.push('Financial ledger must reflect the selected plan and distinguish historical events');
}
if (financial.includes('متابعة الدفعات والمشكلات') ||
    financial.includes('كيف تعمل الدفعات والمشكلات والتقييم؟') ||
    careTimeline.includes('إجراءات الحالة') ||
    careTimeline.includes('CareV5ActionLink')) {
  issues.push('Unapproved shortcut cards must not be restored to Pen case/financial screens');
}
const acceptedPlan = read(root + 'treatment-plan-screen.tsx');
if (acceptedPlan.includes('title="السجل المالي والدفعات"') ||
    acceptedPlan.includes('title="إنشاء مشكلة أو شكوى"')) {
  issues.push('Treatment plan must not show non-design financial/complaint shortcuts');
}
if (!careTimeline.includes('label="خطتي العلاجية"') ||
    !careTimeline.includes('label="الشروط المالية"')) {
  issues.push('Case timeline must retain the two approved bottom actions');
}
for (const [name, source, page] of [
  ['payment', payment, 'payment'],
  ['refund', refund, 'refund'],
  ['financial', financial, 'ledger'],
]) {
  if (!source.includes(`<CareFinancialPageHeader page="${page}" />`) || !source.includes('<CareFinancialCardHeading')) {
    issues.push(name + ' must use the reusable fixed financial header and compact card headings');
  }
  if (!source.includes('contentContainerClassName="mx-auto w-full max-w-[430px]')) {
    issues.push(name + ' must retain 16px gutters and responsive content width');
  }
  if (!source.includes('FinancialCaseUnavailable') || !source.includes("caseId !== 'case-001'")) {
    issues.push(name + ' must reject unmapped demo finance cases');
  }
}
if (!payment.includes("!!pending") || !refund.includes("!!receiptResponse")) {
  issues.push('Pending verification or refund receipt confirmations must not be submitted twice');
}
if (!claims.includes("submitRefundRequest({") ||
    !claims.includes("amountLabel: `${amountValue.toLocaleString('en-US')} ل.س`") ||
    !claims.includes("claimId: `session-refund-${caseId}`") ||
    !claims.includes('validRefundAmount') ||
    !claims.includes("Number.isSafeInteger(amountValue)") ||
    !claims.includes('description.trim().length < 8') ||
    !claims.includes('!!existingRefund') ||
    claims.includes("pathname: '/care/[caseId]/claims/refund'")) {
  issues.push('Refund creation must record a reviewed pending claim with amount/reason validation rather than opening a completed refund');
}
if (!claims.includes("pathname: '/care/[caseId]/claims/[claimId]'") ||
    !claims.includes('evidenceTitles') ||
    !read(root + 'claim-detail-screen.tsx').includes('getMockClaimForScenario')) {
  issues.push('Mock complaints must retain attachments and open their own pending claim, not a fixed decision');
}
const ratingInput = read('src/shared/components/ui/rating-input.tsx');
const ratingIcon = read('src/shared/components/ui/rating-star-icon.tsx');
const submittedReview = read(root + 'submit-review-screen.tsx');
const ratingPreview = read('src/shared/components/ui/rating-stars.tsx');
if (!ratingInput.includes('[1, 2, 3, 4, 5].map') ||
    !ratingInput.includes('filled={star <= selected} outlineSelected') ||
    !ratingInput.includes('onPress={() => onChange(star)}') ||
    !ratingInput.includes("'flex-row-reverse'") ||
    !ratingInput.includes('accessibilityRole="radio"')) {
  issues.push('Interactive star rating must fill all stars through the selected value and honor RTL');
}
if (!ratingIcon.includes("fill={filled && !outlineSelected ? gold : 'none'}") ||
    !ratingPreview.includes('filled={value <= roundedRating}')) {
  issues.push('Filled/outline review stars must be visually consistent across platform and preview');
}
if (!submittedReview.includes('onChange={setRating}') ||
    !submittedReview.includes('value={rating}') ||
    !submittedReview.includes('rating,') ||
    !submittedReview.includes('disabled={Boolean(existing) || rating < 1')) {
  issues.push('Review must submit exactly the number of selected stars and reject zero stars');
}

// Confirm these are navigable Expo Router folder-index routes, not inferred .tsx files.
for (const file of [
  'src/app/care/[caseId]/reviews/new.tsx',
  'src/app/care/[caseId]/reviews/[reviewId]/index.tsx',
  'src/app/care/[caseId]/claims/index.tsx',
  'src/app/care/[caseId]/claims/[claimId]/index.tsx',
  'src/app/care/[caseId]/claims/[claimId]/appeal.tsx',
]) {
  const route = read(file);
  if (!route.includes('useLocalSearchParams') || !route.includes('caseId')) {
    issues.push('Care patient action route missing case-scoped params: ' + file);
  }
}
const claimDetail = read(root + 'claim-detail-screen.tsx');
const claimAppeal = read(root + 'claim-appeal-screen.tsx');
const scenarioStore = read('src/shared/mock/scenario-provider.tsx');
const dentalCases = read('src/features/my-care/mocks/care.mock.ts');
for (const token of [
  'label="تقديم استئناف مع دليل جديد"',
  'label={explanationPending ?',
  'requestClaimExplanation(claimId)',
  '<ConfirmationDialog',
  'decision.confirmedAmountLabel',
  'decision.unverifiedAmountLabel',
  'matchingClaim.evidence.map',
  'matchingClaim.history.map',
]) {
  if (!claimDetail.includes(token)) issues.push('Dispute decision reference/control missing: ' + token);
}
if (!claimAppeal.includes("submitClaimAppeal(claimId, { reason: reason.trim(), evidenceName: localEvidenceName })") ||
    !claimAppeal.includes('launchImageLibraryAsync') ||
    !claimAppeal.includes('appealPending') ||
    !scenarioStore.includes('claimAppealDrafts') ||
    !scenarioStore.includes('claimExplanationRequestIds')) {
  issues.push('Appeal and explanation requests must retain patient reasons and never auto-complete');
}
if (!dentalCases.includes("id: 'case-004'") ||
    !dentalCases.includes("title: 'ترميم وتاج'") ||
    !dentalCases.includes("progress: 100")) {
  issues.push('Reference case 2764 must be a completed review-eligible demo case');
}
// Completed-case review: match the Pen card hierarchy without inline
// rule/separator bars between patient-facing text values.
for (const item of [
  "الحالة #{getMockCareReferenceLabel(caseId)} مكتملة",
  "كيف كانت تجربتك الموثّقة؟",
  "تفاصيل تجربتك",
  "ما الذي يحدث بعد الإرسال؟",
  "التقييم النشط حالياً",
  "أساس التحقق",
  "الاستئناف",
  "إرسال التقييم الموثّق",
  "rounded-[15px] border border-tone-success-border bg-tone-success-fill",
  "min-h-[20px] flex-row-reverse items-start justify-between",
]) {
  if (!submittedReview.includes(item)) {
    issues.push('Completed review must preserve case facts and Pen layout: ' + item);
  }
}
if (submittedReview.includes('h-px flex-1') ||
    !submittedReview.includes('align="left"') ||
    !submittedReview.includes('align="right"') ||
    !submittedReview.includes('disabled={Boolean(existing) || rating < 1') ||
    !submittedReview.includes('getMockCareCaseForScenario(caseId, scenario)')) {
  issues.push('Completed review must have no text dividers, retain RTL facts, and guard submissions');
}

if (!submittedReview.includes('<RatingInput value={rating} onChange={setRating}') ||
    !submittedReview.includes('getMockCareReferenceLabel(caseId)')) {
  issues.push('Completed review must have dynamic stars and shared patient case number');
}

const reviewRatingInput = read('src/shared/components/ui/rating-input.tsx');
const careClaims = read(root + 'claims-screen.tsx');
if (!reviewRatingInput.includes('star <= selected') ||
    !reviewRatingInput.includes('onChange(star)') ||
    !read('src/shared/components/ui/rating-star-icon.tsx').includes('outlineSelected')) {
  issues.push('Review star selection and outline geometry must change with the selected score');
}
for (const required of ["id: 'payment'", "id: 'refund'", "id: 'treatment'"]) {
  if (!careClaims.includes(required)) issues.push('Complaint form missing issue category ' + required);
}
const caseOverview = read(root + 'my-cases-overview-screen.tsx');
if (caseOverview.includes('تقييم الحالة المكتملة') ||
    caseOverview.includes("pathname: '/care/[caseId]/reviews/new'") ||
    caseOverview.includes("pathname: '/care/[caseId]/reviews/[reviewId]'") ||
    !caseOverview.includes("pathname: '/care/[caseId]/timeline'") ||
    !careTimeline.includes('careCase.progress >= 100 && reviewsAvailable') ||
    !careTimeline.includes('reviewSubmissions.find((review) => review.caseId === caseId)') ||
    !careTimeline.includes("pathname: '/care/[caseId]/reviews/new'") ||
    !careTimeline.includes("pathname: '/care/[caseId]/reviews/[reviewId]'") ||
    !careTimeline.includes("label={submittedReview ? 'عرض تقييمي' : 'تقييم الحالة المكتملة'}")) {
  issues.push('Completed treatment detail must own review CTA, without a duplicate action in the cases list');
}
const bookingOverview = read('src/features/booking/screens/my-bookings-screen.tsx');
const tabLayout = read('src/app/(tabs)/_layout.tsx');
const tabMarks = read('src/shared/components/navigation/tab-mark.tsx');
const caseRecords = read('src/features/my-care/mocks/care.mock.ts');
for (const token of [
  "'الكل', 'قيد العلاج', 'قادمة', 'مكتملة'",
  'CareFilterTabs',
  'Math.ceil(item.progress / 25)',
  'getMockCareReferenceLabel',
  "pathname: '/care/[caseId]/timeline'",
  'CareV5BottomNav',
]) {
  if (!caseOverview.includes(token)) issues.push('Care overview screenshot UI missing: ' + token);
}
for (const token of [
  'icon={event.icon}',
  'getMockCareReferenceLabel(caseId)',
  'CareFilterTabs',
  'label="خطتي العلاجية"',
  'label="الشروط المالية"',
]) {
  if (!careTimeline.includes(token)) issues.push('Care timeline screenshot UI missing: ' + token);
}
if (!caseRecords.includes("'case-001': '2841'") ||
    !caseRecords.includes("'case-003': '2910'") ||
    !caseRecords.includes("'case-004': '2764'")) {
  issues.push('Patient-visible care case references should match the reference dataset');
}
if (!bookingOverview.includes('iconPlacement="inline"') ||
    !bookingOverview.includes('<CareFilterTabs') ||
    !caseOverview.includes('<CareFilterTabs') ||
    !careTimeline.includes('<CareFilterTabs')) {
  issues.push('Care, timeline and bookings filters must use the shared icon tabs');
}
for (const label of ['الكل', 'قيد العلاج', 'علاج', 'قادمة', 'مكتملة', 'ماليات', 'مشكلات', 'ملغاة']) {
  if (!header.includes("'" + label + "': {")) {
    issues.push('Shared care filters must define a specific icon for ' + label);
  }
}
if (!header.includes('tabIcon = icons?.[item] ?? defaultCareFilterIcons[item]') ||
    !header.includes('accessibilityRole="tab"') ||
    !header.includes('active ? \'border border-border-subtle bg-surface-default\'')) {
  issues.push('Care filters must share compact visible icons, active geometry and accessible tab states');
}
if (!payment.includes('read-only system states') ||
    !payment.includes('size={13} tone={') ||
    !payment.includes('accessibilityLabel={`${label}${selected ?') ||
    payment.includes('onPress={() => setFinancialStatus')) {
  issues.push('Financial status pills must remain read-only and show the reference icons and state colors');
}
if (!header.includes("selected && 'bg-action-subtle'") ||
    !tabLayout.includes("focused ? 'bg-action-subtle'") ||
    !tabMarks.includes("ios: 'calendar'")) {
  issues.push('All bottom nav variants must have matching subtle active state and booking icon');
}

if (!careTimeline.includes('getMockClaimsForScenario') ||
    !careTimeline.includes('event.claimId') ||
    careTimeline.includes('تقييم التجربة المكتملة') ||
    !careTimeline.includes('label="خطتي العلاجية"') ||
    !careTimeline.includes('label="الشروط المالية"')) {
  issues.push('Timeline must keep case claims linked and show only the approved plan/finance actions');
}
if (!careTimeline.includes("filter === 'مشكلات'") ||
    !careTimeline.includes('label="إنشاء شكوى"') ||
    !careTimeline.includes('label="فتح نزاع على دفعة"') ||
    !careTimeline.includes('label="طلب استرداد"') ||
    !careTimeline.includes("params: { caseId, issue: 'refund' }") ||
    !careTimeline.includes("{hasDemoFinancialRecord ? (") ||
    !careTimeline.includes("params: { caseId, issue: 'payment' }") ||
    !careTimeline.includes("pathname: '/care/[caseId]/claims'") ||
    !careTimeline.includes("disabled={claimsReadState !== 'success'}") ||
    !careTimeline.includes('...claimSubmissions.filter((claim) => claim.caseId === caseId)') ||
    !claims.includes("pathname: '/care/[caseId]/claims/[claimId]'") ||
    !claims.includes("id: 'payment'")) {
  issues.push('Issues tab must allow authorized complaint and eligible payment dispute creation, retaining existing claims and review state');
}

// Treatment-plan modifications are intentionally not exposed in the patient UI.
// Previously bookmarked amendment URLs must safely return to the accepted plan.
const treatmentPlan = read(root + 'treatment-plan-screen.tsx');
const planDecision = read(root + 'plan-acceptance-screen.tsx');
const amendmentRoute = read('src/app/care/[caseId]/plan-amendments.tsx');
const followUps = read(root + 'follow-ups-screen.tsx');
const stageDetail = read(root + 'stage-detail-screen.tsx');
const sessionStore = read('src/shared/mock/scenario-provider.tsx');
const stageRing = read('src/features/my-care/components/treatment-stage-progress.tsx');

if (!amendmentRoute.includes('<Redirect') ||
    !amendmentRoute.includes("pathname: '/care/[caseId]/plan'") ||
    amendmentRoute.includes('view="amendments"')) {
  issues.push('Deprecated amendment deep links must redirect to the accepted case plan');
}
if (treatmentPlan.includes("pathname: '/care/[caseId]/plan-amendments'") ||
    treatmentPlan.includes('function AmendmentPlan(') ||
    treatmentPlan.includes('label="قبول التعديل وإنشاء اللقطة الجديدة"') ||
    treatmentPlan.includes('label="رفض التعديل مع ذكر السبب"') ||
    treatmentPlan.includes('amendmentAvailable') ||
    planDecision.includes('submitPlanAcceptance(caseId, \'reject\'') ||
    planDecision.includes('ملخص التعديل قبل القرار')) {
  issues.push('Removed treatment-plan modification must not remain reachable from patient UI');
}
if (!stageRing.includes("stage.status === 'completed' || stage.status === 'current'") ||
    !stageRing.includes('CIRCUMFERENCE * (1 - fraction)') ||
    !stageRing.includes('accessibilityRole="progressbar"') ||
    !stageRing.includes('{reached}/{total}')) {
  issues.push('Treatment stage ring must fill dynamically from completed/current stage count');
}
if (!treatmentPlan.includes('TreatmentStageProgress stages={careCase.stages}') ||
    !treatmentPlan.includes("stage.status === 'completed' || stage.status === 'current'") ||
    treatmentPlan.includes('activeStageNumber')) {
  issues.push('Plan progress ring and bars must derive from actual stage status, not fixed positions');
}
for (const token of [
  'careCase.acceptedTotalLabel',
  'careCase.treatmentPlan[0]?.priceLabel',
  "pathname: '/care/[caseId]/follow-ups'",
  '<AcceptedPlan careCase={careCase} caseId={caseId} />',
]) {
  if (!treatmentPlan.includes(token)) issues.push('Approved plan display must retain: ' + token);
}
if (!planDecision.includes("submitPlanAcceptance(caseId, 'accept')") ||
    !planDecision.includes('<ConfirmationDialog') ||
    !planDecision.includes("scenario.flags?.carePlanPending === true")) {
  issues.push('Initial plan acceptance must retain a confirmation and pending state');
}
if (!followUps.includes('stageEvidenceDrafts') ||
    !followUps.includes("'stage-root-canal'") ||
    !followUps.includes('مسودة محلية') ||
    !stageDetail.includes('launchImageLibraryAsync') ||
    !stageDetail.includes('saveStageEvidenceDraft') ||
    !stageDetail.includes('router.replace(') ||
    !sessionStore.includes("status: 'local-draft'") ||
    !followUps.includes('accessibilityRole="button"')) {
  issues.push('Evidence must be linked to the correct case/stage and saved as an unapproved draft');
}
if (!caseRecords.includes("title: 'تقييم أولي مساعد'") ||
    !caseRecords.includes("title: 'دفعة خارجية مسجلة'") ||
    !careTimeline.includes("event.title.includes('دفعة') ? 'ماليات'")) {
  issues.push('Reference treatment case requires seven events and correct finance filtering');
}


const approvedIssueKinds = [
  "id: 'treatment'",
  "id: 'appointment'",
  "id: 'payment'",
  "id: 'refund'",
  "id: 'refund-execution'",
];
for (const item of approvedIssueKinds) {
  if (!claims.includes(item)) issues.push('Claims Pen layout must preserve approved issue kind: ' + item);
}
for (const item of [
  "['الحالة', careCase.title]",
  "['العيادة', careCase.branch]",
  "['الخطة المقبولة', careCase.planVersionLabel]",
  "['قيمة الخطة', careCase.acceptedTotalLabel]",
  "description.trim().length < 8",
  "setRefundAmount(value.replace(/[^0-9]/g, ''))",
  "evidenceTitles.length >= 3",
  "الصور المختارة محلية فقط؛ لم تُرفع إلى السيرفر أو إلى فريق الدعم.",
]) {
  if (!claims.includes(item)) issues.push('Claims must retain the same case data and safety rule: ' + item);
}
if (!claims.includes("'min-h-[42px] flex-row-reverse") ||
    !claims.includes('border-action-primary bg-action-primary') ||
    !claims.includes('min-h-[18px] flex-row-reverse') ||
    !claims.includes('min-h-[52px] flex-row-reverse') ||
    !claims.includes('ما نوع المشكلة؟') ||
    !claims.includes('السجلات المرتبطة') ||
    !claims.includes('اشرح ما حدث') ||
    !claims.includes('الأدلة الداعمة')) {
  issues.push('Claims problem view must keep the reference layout with compact RTL radio rows, case records and evidence');
}

if (issues.length) {
  process.stderr.write(issues.join('\n') + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('Six finance, review and complaint layout contracts found.\n');
}
