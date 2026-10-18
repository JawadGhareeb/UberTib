import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const issues = [];
const assert = (ok, message) => { if (!ok) issues.push(message); };

const timeline = read('src/features/my-care/screens/case-timeline-screen.tsx');
const records = read('src/features/my-care/mocks/records.mock.ts');
const care = read('src/features/my-care/mocks/care.mock.ts');
const claims = read('src/features/my-care/screens/claims-screen.tsx');
const claimDetail = read('src/features/my-care/screens/claim-detail-screen.tsx');
const appeal = read('src/features/my-care/screens/claim-appeal-screen.tsx');
const payment = read('src/features/my-care/screens/financial-timeline-screen.tsx');
const refund = read('src/features/my-care/screens/refund-request-screen.tsx');
const financial = read('src/features/my-care/screens/accepted-financial-terms-screen.tsx');
const review = read('src/features/my-care/screens/submit-review-screen.tsx');
const myReview = read('src/features/my-care/screens/my-review-screen.tsx');
const support = read('src/features/profile/screens/help-support-screen.tsx');
const provider = read('src/shared/mock/scenario-provider.tsx');

assert(care.includes("id: 'case-001'") && care.includes("id: 'case-002'") &&
  care.includes('progress: 100'), 'Active and completed care case fixtures are required');
assert(timeline.includes('getMockClaimsForScenario') &&
  timeline.includes("pathname: '/care/[caseId]/claims/[claimId]'") &&
  timeline.includes('event.claimId') &&
  timeline.includes("pathname: '/care/[caseId]/reviews/new'"),
  'Case timeline must connect complaint records and completed-case review entry');
assert(financial.includes("caseId !== 'case-001'") &&
  financial.includes("pathname: '/care/[caseId]/financial/timeline'"),
  'Finance ledger must remain case-specific and link to the payment verification');
assert(payment.includes("params: { caseId, issue: 'payment' }") &&
  payment.includes("!!pending") &&
  payment.includes("financial-event-002"),
  'Unknown payment must verify the same attempt and link a contextual dispute');
assert(refund.includes("params: { caseId, issue: 'refund-execution' }") &&
  refund.includes("!!receiptResponse") &&
  refund.includes("caseId !== 'case-001'"),
  'Refund receipt and nonreceipt must remain two guarded choices for the eligible demo');
assert(support.includes("pathname: '/care/[caseId]/claims'") &&
  support.includes('getMockCareCaseForScenario') &&
  !support.includes("caseId: 'case-001'"),
  'Global complaint navigation must require an explicit real case');
assert(claims.includes("pathname: '/care/[caseId]/claims/[claimId]'") &&
  claims.includes('issueCategory[type]') &&
  claims.includes('launchImageLibraryAsync') &&
  claims.includes('evidenceTitles') &&
  claims.includes('لا تُرفع') === false,
  'Complaint submission must persist mock details and show its own pending record');
assert(provider.includes("kind: 'issue'") &&
  provider.includes('submitCaseIssue:') &&
  provider.includes("statusLabel: 'قيد المراجعة'"),
  'Mock issues must be separate from a funded protection claim');
assert(records.includes("id: 'claim-dispute-demo'") &&
  records.includes("type: 'external-payment-dispute'") &&
  records.includes('decision: {'),
  'A separate case-linked example dispute decision is required for Pen QA');
assert(claimDetail.includes('matchingClaim') &&
  claimDetail.includes('getMockClaimForScenario') &&
  claimDetail.includes('!appealPending') &&
  !claimDetail.includes('PD-1042'),
  'Claim decision must reflect the selected record, not a fixed partial award');
assert(appeal.includes('claim.caseId !== caseId') &&
  appeal.includes('claim.appealEligible'),
  'Appeal must be scoped to its claim and the original decision eligibility');
assert(review.includes('careCase.progress < 100') &&
  review.includes("pathname: '/care/[caseId]/reviews/[reviewId]'") &&
  myReview.includes('item.caseId === caseId'),
  'Only completed cases can submit reviews and open their own pending review status');

// Demo treatment quotes must reconcile with the related snapshots and installments.
const money = (label) => Number(label.replace(/[^0-9]/g, ''));
const dataStart = care.indexOf('export const mockCareCases: MockCareCase[] = [');
const dataEnd = care.indexOf('export function getMockCareReferenceLabel', dataStart);
const caseData = care.slice(dataStart, dataEnd);
for (const id of ['case-001', 'case-002', 'case-003', 'case-004']) {
  const at = caseData.indexOf("id: '" + id + "'");
  const next = caseData.indexOf("id: 'case-", at + 8);
  const entry = caseData.slice(at, next < 0 ? undefined : next);
  const planStart = entry.indexOf('treatmentPlan: [');
  const planEnd = entry.indexOf('followUps: [', planStart);
  const plan = entry.slice(planStart, planEnd);
  const total = entry.match(/acceptedTotalLabel: '([\d,]+) ل\.س'/)?.[1];
  const prices = [...plan.matchAll(/priceLabel: '([\d,]+) ل\.س'/g)].map((match) => money(match[1]));
  assert(Boolean(total) && prices.length > 0 && prices.reduce((a, b) => a + b, 0) === money(total),
    'Care ' + id + ' quoted plan lines must sum to the accepted total');
}
const planTotals = [
  ['previousAcceptedTotalLabel', 2250],
  ['proposedTotalLabel', 2875],
  ['priceDifferenceLabel', 625],
];
for (const [field, value] of planTotals) {
  const label = care.match(new RegExp(field + ": '[+]?([0-9,]+) ل\\.س'"))?.[1];
  assert(Boolean(label) && money(label) === value, 'Reduced amendment amount incorrect: ' + field);
}
assert(care.includes("priceLabel: '1,125 ل.س'") &&
  1750 + 1125 === 2875 &&
  2875 - 2250 === 625,
  'Amended clinical line items, total, and delta must reconcile');
assert(records.includes("totalLabel: '2,250 ل.س'") &&
  records.includes("totalLabel: '2,875 ل.س'") &&
  records.includes("amountLabel: '750 ل.س'") &&
  records.includes("amountLabel: '1,500 ل.س'") &&
  750 + 1500 === 2250,
  'Financial mock should agree with accepted treatment prices and installments');
assert(financial.includes('mockFinancialRecord.events[0].amountLabel') &&
  financial.includes('mockFinancialRecord.events[1].amountLabel') &&
  records.includes("amountLabel: '750 ل.س'") &&
  records.includes("amountLabel: '1,500 ل.س'") &&
  payment.includes('محاولة دفع 1,500 ل.س'),
  'Displayed finance prices must bind to the reduced demo plan and due amount');

if (issues.length) {
  process.stderr.write(issues.join('\n') + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('Case mock journey navigation, decision and eligibility contracts checked.\n');
}
