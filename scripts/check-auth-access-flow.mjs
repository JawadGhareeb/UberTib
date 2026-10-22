import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const protectedRoutes = [
  'src/app/(tabs)/care.tsx',
  'src/app/(tabs)/profile.tsx',
  ...[
    'health',
    'location',
    'manual-review',
    'media',
    'needs-more-info',
    'patient',
    'processing',
    'questions',
    'result',
    'review',
  ].map((name) => `src/app/assessment/${name}.tsx`),
  'src/app/notifications.tsx',
  'src/app/needs-attention.tsx',
  'src/app/booking/patient.tsx',
  ...['alternative', 'cancel', 'index', 'reschedule', 'status'].map(
    (name) => `src/app/booking/[bookingId]/${name}.tsx`,
  ),
  ...['follow-ups', 'plan-acceptance', 'plan-amendments', 'plan', 'timeline'].map(
    (name) => `src/app/care/[caseId]/${name}.tsx`,
  ),
  ...['index', 'refund'].map((name) => `src/app/care/[caseId]/claims/${name}.tsx`),
  ...['appeal', 'index'].map((name) => `src/app/care/[caseId]/claims/[claimId]/${name}.tsx`),
  ...['index', 'refund-execution', 'report-payment', 'timeline'].map(
    (name) => `src/app/care/[caseId]/financial/${name}.tsx`,
  ),
  'src/app/care/[caseId]/reviews/new.tsx',
  ...['appeal', 'index'].map((name) => `src/app/care/[caseId]/reviews/[reviewId]/${name}.tsx`),
  'src/app/care/[caseId]/stage/[stageId].tsx',
  ...[
    'account-closure',
    'active-patient',
    'data',
    'family',
    'health',
    'info',
    'privacy',
    'security',
  ].map((name) => `src/app/profile/${name}.tsx`),
  'src/app/profile/dependents/new.tsx',
  'src/app/profile/grants/new.tsx',
  'src/app/profile/grants/[grantId].tsx',
  'src/app/profile/privacy/consents/[consentId].tsx',
  'src/app/support/new.tsx',
  'src/app/support/tickets.tsx',
  'src/app/support/tickets/[ticketId].tsx',
];
for (const path of protectedRoutes) {
  const content = read(path);
  assert.ok(
    content.includes('export default withAuthRequired('),
    path + ' must block guest data access',
  );
}
for (const path of [
  'src/app/assessment/start.tsx',
  'src/app/assessment/complaint.tsx',
  'src/app/(tabs)/home.tsx',
  'src/app/(tabs)/discover.tsx',
  'src/app/discover/search/index.tsx',
  'src/app/support/index.tsx',
  'src/app/support/policies.tsx',
  'src/app/booking/slots.tsx',
  'src/app/booking/review.tsx',
]) {
  assert.ok(
    !read(path).includes('withAuthRequired('),
    path + ' remains available while browsing as guest',
  );
}
const guard = read('src/features/auth/components/with-auth-required.tsx');
assert.ok(guard.includes('if (isAuthenticated) return <Component {...props} />'));
assert.ok(guard.includes('buildReturnTo(pathname, query)'));
assert.ok(
  !guard.includes('useFocusEffect(') && !guard.includes('requireAuth('),
  'Private route must not open duplicate login dialogs',
);
assert.ok(
  guard.includes('label="تسجيل الدخول"') && guard.includes('label="إكمال التصفح كزائر"'),
  'Protected route has one sign-in/guest gate',
);
assert.ok(
  guard.includes('useLocalSearchParams()'),
  'Return intent must come from the protected screen, not an unrelated active screen',
);
assert.ok(
  guard.includes('router.replace(guestDestination(pathname))'),
  'Continue as guest exits protected route',
);
assert.ok(
  guard.includes("router.push({ pathname: '/auth/phone', params: { returnTo } })"),
  'Login maintains return destination',
);
const modal = read('src/providers/auth-access-provider.tsx');
assert.ok(modal.includes('confirmLabel="تسجيل الدخول"'));
assert.ok(modal.includes('cancelLabel="إكمال التصفح كزائر"'));
assert.ok(modal.includes('resolveSafeReturnTo(pending.returnTo)'));
assert.ok(modal.includes('if (isAuthenticated) return true'));
assert.ok(read('src/app/_layout.tsx').includes('<AuthAccessProvider>'));
const booking = read('src/features/booking/screens/booking-review-screen.tsx');
assert.ok(booking.includes('requireAuth({') && booking.includes('returnTo,'));
assert.ok(!booking.includes("router.push({ pathname: '/auth/phone', params: { returnTo } })"));
const profile = read('src/features/profile/screens/profile-screen.tsx');
assert.ok(
  profile.includes('beforeEdit={() =>') &&
    profile.includes("isAuthenticated ? name : 'حساب الزائر'"),
);
const provider = read('src/providers/auth-session-provider.tsx');
const scoped = read('src/providers/app-providers.tsx');
const storage = read('src/shared/storage/secure-storage.ts');
const intro = read('src/features/app-entry/screens/app-entry-screen.tsx');
const assessment = read('src/features/assessment/screens/assessment-start-screen.tsx');
const patientScreen = read('src/features/assessment/screens/assessment-patient-screen.tsx');
assert.ok(
  provider.includes('queryClient.clear()') &&
    provider.includes('clearAccessToken()') &&
    provider.includes('clearPreferredLocation()') &&
    provider.includes('setSessionEpoch('),
  'Sign out clears auth and patient caches',
);
assert.ok(
  scoped.includes('<SessionData key={sessionEpoch}>'),
  'Every patient provider resets after signout',
);
assert.ok(
  storage.includes('clearPreferredLocation: () => deleteItem('),
  'Personal location cache is removed',
);
assert.ok(
  intro.includes('getOnboardingComplete()') &&
    !intro.includes('__DEV__') &&
    !intro.includes('requestedStep'),
  'Intro only on first use including dev builds',
);
assert.ok(
  assessment.includes("isAuthenticated ? '/assessment/patient' : '/assessment/complaint'"),
  'Guest assessment enters complaint selection before requesting authentication',
);
assert.ok(
  patientScreen.includes('<Redirect href={returnTo ==='),
  'Direct patient step skips for guests',
);
assert.ok(
  read('src/features/profile/components/profile-menu-section.tsx').includes('await signOut()'),
  'Log out awaits cache invalidation',
);
assert.ok(
  read('src/features/auth/screens/phone-entry-screen.tsx').includes(
    "router.replace('/(tabs)/home')",
  ),
  'Auth back navigation never reopens intro',
);
console.log(
  'Single guest gate, first-launch intro, guest assessment, session reset and ' +
    protectedRoutes.length +
    ' protected routes passed.',
);
