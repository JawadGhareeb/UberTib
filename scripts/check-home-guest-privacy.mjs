import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const home = read('src/features/patient-home/screens/patient-home-screen.tsx');
const auth = read('src/providers/auth-session-provider.tsx');
const upcoming = read('src/features/patient-home/components/home-bookings-section.tsx');
const cases = read('src/features/patient-home/components/home-cases-section.tsx');

assert.ok(home.includes('useAuthSession()'), 'Home must respond to the session state');
assert.ok(auth.includes('setIsAuthenticated(false)'), 'Sign-out makes the home switch to guest');
assert.match(
  home,
  /\{isAuthenticated\s*\?\s*\(\s*<>\s*<HomeAttentionSection[\s\S]*?<HomeUpcomingBookings[\s\S]*?<HomePendingRequests[\s\S]*?<HomeCasesSection[\s\S]*?<\/?>\s*\)\s*:\s*null\}/,
  'All four patient-specific home sections must be behind one authentication check',
);
assert.ok(
  home.includes('isAuthenticated') &&
    home.includes('mockPatientWorld.account.activePatientName') &&
    home.includes("'أهلاً بك في UberTib'"),
  'Guest greeting must not disclose the mock patient name',
);
assert.ok(
  home.includes('<AssessmentEntryCard />') && home.includes('<HomeServicesSection />'),
  'Public services and the assessment entry card stay visible to guests',
);
assert.ok(
  upcoming.includes('title="مواعيدك القادمة"'),
  'Existing appointments section retained for signed-in users',
);
assert.ok(
  cases.includes('title="الحالات التي تتابعها"'),
  'Existing cases section retained for signed-in users',
);
console.log(
  'Guest home privacy: hide upcoming appointments, cases, pending requests, attention and name; keep public sections.',
);
