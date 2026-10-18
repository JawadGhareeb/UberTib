import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const failures = [];

const contract = read('src/shared/api/patient-v5-contract.ts');
const gateway = read('src/shared/api/patient-v5-gateway.ts');
const support = read('src/features/profile/screens/help-support-screen.tsx');
const timeline = read('src/features/my-care/screens/case-timeline-screen.tsx');
const financial = read('src/features/my-care/screens/accepted-financial-terms-screen.tsx');
const treatment = read('src/features/my-care/screens/treatment-plan-screen.tsx');
const issues = read('src/features/my-care/screens/claims-screen.tsx');
const mockProvider = read('src/shared/mock/scenario-provider.tsx');

const journeys = {
  identity: ['identity.sendOtp', 'identity.verifyOtp', 'identity.profile', 'identity.reverify'],
  assessment: ['assessment.save', 'assessment.submit', 'assessment.read', 'assets.prepareUpload'],
  discovery: ['catalog.groups', 'providers.search', 'providers.detail', 'booking.slots'],
  booking: ['booking.create', 'booking.read', 'booking.list', 'booking.alternativeDecision', 'booking.reschedule', 'booking.cancel'],
  care: ['care.list', 'care.read', 'care.timeline', 'care.plan', 'care.planDecision', 'care.followUps', 'care.evidenceUpload'],
  finance: ['finance.snapshot', 'finance.events', 'finance.verifyPayment', 'finance.refund', 'finance.confirmRefundReceipt'],
  claimsAndReviews: ['claims.create', 'claims.refundCreate', 'claims.appeal', 'reviews.eligibility', 'reviews.submit', 'reviews.appeal'],
  account: ['profile.family', 'profile.grantCreate', 'profile.consentList', 'profile.consentWithdraw', 'profile.exportCreate', 'profile.closureCreate', 'profile.endSession', 'platform.notifications', 'support.create'],
};

let checked = 0;
for (const [journey, keys] of Object.entries(journeys)) {
  for (const key of keys) {
    checked++;
    if (!contract.includes("'" + key + "':")) {
      failures.push(journey + ': missing typed operation ' + key);
    }
  }
}

for (const token of [
  'Idempotency-Key', 'If-Match', 'PatientV5BackendNotConfiguredError',
  'createPatientV5Gateway', 'createPatientV5Gateway({})',
]) {
  if (!gateway.includes(token)) failures.push('Backend gateway missing safety feature: ' + token);
}

if (!support.includes('getMockCareCaseForScenario') ||
  support.includes("caseId: 'case-001'") ||
  !support.includes('disabled={item.requiresEligibility === true}')) {
  failures.push('Global support must require selected case context and respect protection eligibility');
}

if (existsSync('src/app/care/financial-guide.tsx') ||
  existsSync('src/features/my-care/screens/care-financial-guide-screen.tsx')) {
  failures.push('Explanation board is documentation, not an extra patient page');
}

if (timeline.includes('إجراءات الحالة') ||
  financial.includes('متابعة الدفعات والمشكلات') ||
  treatment.includes('title="السجل المالي والدفعات"') ||
  treatment.includes('title="إنشاء مشكلة أو شكوى"')) {
  failures.push('Unapproved shortcut actions have returned to the Pen V5 screens');
}

if (!mockProvider.includes('submitCaseIssue:') ||
  !issues.includes('submitCaseIssue(') ||
  issues.includes('submitProtectionClaim(')) {
  failures.push('Clinical complaints must be distinct from protection claims');
}
if (!read('docs/PATIENT_V5_BACKEND_HANDOFF_2026-10-12.md').includes('Backend connection is NOT complete')) {
  failures.push('The handoff document must disclose pending backend integration');
}

const mapSource = read('src/shared/api/patient-v5-screen-map.ts');
let mappedScreens = 0;
for (const match of mapSource.matchAll(/^  '(\/[^']+)': \[([^\]]+)\],?$/gm)) {
  const route = match[1];
  const operations = [...match[2].matchAll(/'([^']+)'/g)].map((value) => value[1]);
  const src = 'src/app' + (route === '/' ? '/index' : route);
  if (!existsSync(src + '.tsx') && !existsSync(src + '/index.tsx')) {
    failures.push('Screen API map has no route component: ' + route);
  }
  for (const operation of operations) {
    if (!contract.includes("'" + operation + "':")) {
      failures.push(route + ': unknown backend operation ' + operation);
    }
  }
  mappedScreens++;
}
if (mappedScreens < 65) {
  failures.push('Too few mapped Patient V5 routes: ' + mappedScreens);
}

if (failures.length) {
  process.stderr.write(failures.join('\n') + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('Patient V5 backend boundary and ' + checked + ' operation contracts checked.\n');
}
