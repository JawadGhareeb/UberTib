import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const issues = [];
const warnings = [];
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.posix.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
const files = walk('src');
const sourceFiles = files.filter((file) => /\.(tsx?|jsx?)$/.test(file));
const routeFiles = files.filter(
  (file) => file.startsWith('src/app/') && file.endsWith('.tsx') && !file.endsWith('/_layout.tsx'),
);
const screenFiles = files.filter((file) => /\/screens\/[^/]+\.tsx$/.test(file));
function routePath(file) {
  const route = file
    .slice('src/app'.length)
    .replace(/\.tsx$/, '')
    .replace(/\/index$/, '')
    .replace(/\/\([^/]+\)/g, '');
  return route || '/';
}
const routePatterns = routeFiles.map((file) => {
  const raw = routePath(file)
    .split('/')
    .map((segment) =>
      /^\[\.\.\..+\]$/.test(segment)
        ? '.+'
        : /^\[[^/]+\]$/.test(segment)
          ? '[^/]+'
          : segment.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
    )
    .join('/');
  return new RegExp('^' + raw + '/?$');
});
function moduleExists(modulePath) {
  return [
    modulePath,
    ...['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.png', '.svg', '.native.tsx', '.web.tsx']
      .map((extension) => modulePath + extension),
    ...['/index.ts', '/index.tsx', '/index.js'].map((extension) => modulePath + extension),
  ].some((candidate) => existsSync(candidate));
}
let checkedDestinations = 0;
let checkedImports = 0;
for (const file of sourceFiles) {
  const source = readFileSync(file, 'utf8');
  if (routeFiles.includes(file) && !/\bexport\s+default\b/.test(source)) {
    issues.push(file + ': missing default Expo route export');
  }
  const destinations = [
    ...source.matchAll(/(?:pathname\s*:\s*|href\s*=\s*|(?:router|navigation)\.(?:push|replace|navigate)\s*\(\s*)['"](\/[^'"]+)['"]/g),
  ];
  for (const match of destinations) {
    checkedDestinations += 1;
    const target = match[1].replace(/\/\([^/]+\)/g, '').split(/[?#]/)[0] || '/';
    if (!routePatterns.some((pattern) => pattern.test(target))) {
      issues.push(file + ': invalid route destination ' + match[1]);
    }
  }
  const imports = [
    ...source.matchAll(/(?:from\s*|import\s*)['"]((?:@\/|\.\.?\/)[^'"]+)['"]/g),
  ];
  for (const match of imports) {
    checkedImports += 1;
    const resolved = match[1].startsWith('@/')
      ? path.posix.join('src', match[1].slice(2))
      : path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1]));
    if (!moduleExists(resolved)) issues.push(file + ': missing import ' + match[1]);
  }
}
const bookings = readFileSync('src/features/booking/screens/my-bookings-screen.tsx', 'utf8');
const bookingIds = [...bookings.matchAll(/bookingId:\s*'([^']+)'/g)].map((match) => match[1]);
const duplicates = bookingIds.filter((id, i) => bookingIds.indexOf(id) !== i);
if (duplicates.length) warnings.push('Reused booking IDs in case cards: ' + [...new Set(duplicates)].join(', '));
// Provider results and booking must resolve the same canonical data, not two
// presentation-only records with a reused provider ID.
const penProviderData = readFileSync(
  'src/features/discovery/presentation/pen-discovery-data.ts', 'utf8',
);
if (!penProviderData.includes('getMockProviders(serviceCode)')) {
  issues.push('Provider presentation must use the booking provider catalog');
}
const detail = readFileSync('src/features/booking/screens/booking-detail-screen.tsx', 'utf8');
if (detail.includes("params: { caseId: 'case-001' }")) {
  warnings.push('Booking details link every booking to care case-001');
}
if (detail.includes('علاج جذور الضرس 46')) {
  warnings.push('Booking details show fixed root-canal text regardless of booking');
}
if (!readFileSync('src/features/discovery/screens/provider-results-screen.tsx', 'utf8')
    .includes('getPenDoctorsForService(serviceCode)')) {
  issues.push('Provider results must be filtered by serviceCode and bookable provider ID');
}
if (!bookings.includes('getMockBookingsForScenario') ||
    !detail.includes('getMockBookingForScenario')) {
  issues.push('Bookings list and details must resolve the same scenario booking records');
}
const mockScenarioProvider = readFileSync('src/shared/mock/scenario-provider.tsx', 'utf8');
const bookingReview = readFileSync('src/features/booking/screens/booking-review-screen.tsx', 'utf8');
const bookingStatus = readFileSync('src/features/booking/screens/booking-status-screen.tsx', 'utf8');
if (!mockScenarioProvider.includes('bookingRequests: MockBookingRequest[]') ||
    !mockScenarioProvider.includes("status: 'pending'") ||
    !mockScenarioProvider.includes('submitBookingRequest:')) {
  issues.push('New mock booking requests must remain pending and available to the booking screens');
}
if (!bookingReview.includes('submitBookingRequest({') ||
    !bookings.includes('...bookingRequests') ||
    !detail.includes('bookingRequests.find(') ||
    !bookingStatus.includes('bookingRequests.find(')) {
  issues.push('New booking requests must remain reachable from list, detail and status');
}
if (detail.includes("params: { caseId: 'case-001' }")) {
  issues.push('Booking detail must not navigate to another case financial or treatment records');
}
if (!readFileSync('src/features/app-entry/screens/app-entry-screen.tsx', 'utf8')
    .includes('getOnboardingComplete')) {
  issues.push('Entry flow must check persisted first-use onboarding completion');
}

// Seven Pen journey groups: verify the actual button destination for each
// required transition, not just the existence of the target screen file.
const journeyTransitions = {
  '01 البداية وإنشاء الحساب': [
    ['src/features/app-entry/screens/app-entry-screen.tsx', '/auth/phone'],
    ['src/features/auth/screens/phone-entry-screen.tsx', '/auth/code'],
    ['src/features/auth/screens/code-verification-screen.tsx', '/auth/profile-setup'],
  ],
  '02 فهم الحالة': [
    ['src/features/patient-home/screens/patient-home-screen.tsx', '/assessment/start'],
    ['src/features/assessment/screens/assessment-start-screen.tsx', '/assessment/patient'],
    ['src/features/assessment/screens/assessment-patient-screen.tsx', '/assessment/complaint'],
    ['src/features/assessment/screens/assessment-complaint-screen.tsx', '/assessment/location'],
    ['src/features/assessment/screens/assessment-location-screen.tsx', '/assessment/questions'],
    ['src/features/assessment/screens/assessment-questions-screen.tsx', '/assessment/health'],
    ['src/features/assessment/screens/assessment-health-screen.tsx', '/assessment/media'],
    ['src/features/assessment/screens/assessment-media-screen.tsx', '/assessment/review'],
    ['src/features/assessment/screens/assessment-review-screen.tsx', '/assessment/processing'],
    ['src/features/assessment/screens/assessment-processing-screen.tsx', '/assessment/result'],
    ['src/features/assessment/screens/assessment-result-screen.tsx', '/discover/providers/results'],
  ],
  '03 الخدمات والأطباء': [
    ['src/features/discovery/screens/service-groups-screen.tsx', '/discover/group/[groupCode]'],
    ['src/features/discovery/screens/service-group-detail-screen.tsx', '/discover/family/[familyCode]'],
    ['src/features/discovery/screens/service-family-detail-screen.tsx', '/discover/providers/results'],
    ['src/features/discovery/screens/provider-results-screen.tsx', '/discover/provider/[providerId]'],
    ['src/features/discovery/screens/provider-decision-screen.tsx', '/booking/slots'],
  ],
  '04 الحجز': [
    ['src/features/booking/screens/slot-selection-screen.tsx', '/booking/patient'],
    ['src/features/booking/screens/booking-patient-selection-screen.tsx', '/booking/review'],
    ['src/features/booking/screens/booking-visit-reason-screen.tsx', '/booking/review'],
    ['src/features/booking/screens/booking-review-screen.tsx', '/booking'],
    ['src/features/booking/screens/my-bookings-screen.tsx', '/booking/[bookingId]'],
    ['src/features/booking/screens/booking-detail-screen.tsx', '/booking/[bookingId]/status'],
    ['src/features/booking/screens/booking-detail-screen.tsx', '/booking/[bookingId]/reschedule'],
    ['src/features/booking/screens/booking-detail-screen.tsx', '/booking/[bookingId]/cancel'],
  ],
  '05 العلاج والمتابعة': [
    ['src/features/my-care/screens/my-cases-overview-screen.tsx', '/care/[caseId]/timeline'],
    ['src/features/my-care/screens/case-timeline-screen.tsx', '/care/[caseId]/plan'],
    ['src/features/my-care/screens/treatment-plan-screen.tsx', '/care/[caseId]/follow-ups'],
  ],
  '06 الدفعات والمشكلات والتقييم': [
    ['src/features/my-care/screens/case-timeline-screen.tsx', '/care/[caseId]/financial'],
    ['src/features/my-care/screens/accepted-financial-terms-screen.tsx', '/care/[caseId]/financial/timeline'],
    ['src/features/my-care/screens/financial-timeline-screen.tsx', '/care/[caseId]/claims'],
    ['src/features/my-care/screens/claims-screen.tsx', '/care/[caseId]/claims/refund'],
    ['src/features/my-care/screens/refund-request-screen.tsx', '/care/[caseId]/claims'],
    ['src/features/profile/screens/help-support-screen.tsx', '/care/[caseId]/claims'],
  ],
  '07 الحساب والعائلة والدعم': [
    ['src/features/profile/screens/profile-screen.tsx', '/profile/settings'],
    ['src/features/profile/screens/profile-screen.tsx', '/profile/security'],
    ['src/features/profile/screens/profile-screen.tsx', '/profile/privacy'],
    ['src/features/profile/screens/profile-screen.tsx', '/profile/data'],
    ['src/features/profile/screens/profile-screen.tsx', '/profile/account-closure'],
    ['src/features/profile/screens/settings-screen.tsx', '/profile/family'],
    ['src/features/profile/screens/settings-screen.tsx', '/profile/health'],
    ['src/features/profile/screens/settings-screen.tsx', '/support'],
    ['src/features/profile/screens/settings-screen.tsx', '/profile/privacy'],
    ['src/features/profile/screens/settings-screen.tsx', '/profile/security'],
    ['src/features/profile/screens/settings-screen.tsx', '/profile/data'],
    ['src/features/profile/screens/settings-screen.tsx', '/profile/account-closure'],
    ['src/features/profile/screens/privacy-consents-screen.tsx', '/profile/privacy/consents/[consentId]'],
  ],
};
let checkedJourneyTransitions = 0;
for (const [group, transitions] of Object.entries(journeyTransitions)) {
  for (const [source, destination] of transitions) {
    checkedJourneyTransitions++;
    const code = readFileSync(source, 'utf8');
    if (!code.includes("'" + destination + "'") &&
        !code.includes('"' + destination + '"')) {
      issues.push(group + ': disconnected button ' + source + ' → ' + destination);
    }
    const route = destination.replace(/\/\([^/]+\)/g, '');
    if (!routePatterns.some((pattern) => pattern.test(route))) {
      issues.push(group + ': missing route ' + destination);
    }
  }
}
const assessmentHealth = readFileSync(
  'src/features/assessment/screens/assessment-health-screen.tsx', 'utf8',
);
if (assessmentHealth.includes('onPress={() => undefined}')) {
  issues.push('Health edit button in assessment is inert');
}
if (routeFiles.length < 60 || screenFiles.length < 60) issues.push('Unexpected route/screen count drop');
process.stdout.write(
  'Route audit: ' + routeFiles.length + ' routes, ' + screenFiles.length +
  ' feature screens, ' + checkedDestinations + ' static navigation targets, ' +
  checkedJourneyTransitions + ' grouped journey transitions, ' +
  checkedImports + ' local imports.\n',
);
for (const warning of warnings) process.stdout.write('KNOWN GAP: ' + warning + '\n');
if (issues.length) {
  for (const issue of issues) process.stderr.write('ERROR: ' + issue + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('All statically discovered route targets and local imports resolve.\n');
}
