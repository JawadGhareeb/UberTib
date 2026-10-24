import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (name) => readFileSync(resolve(process.cwd(), name), 'utf8');

const model = read('src/features/discovery/model/provider-presentation.ts');
const grade = read('src/features/discovery/model/doctor-classification.ts');
const card = read('src/features/discovery/components/discover-doctor-result-card.tsx');
const searchResults = read('src/features/discovery/components/discover-search-results.tsx');
const comparison = read('src/features/discovery/model/provider-comparison.ts');
const comparisonRoute = read('src/features/discovery/screens/provider-comparison-screen.tsx');
const profile = read('src/features/discovery/screens/provider-decision-screen.tsx');
const results = read('src/features/discovery/screens/provider-results-screen.tsx');
const handoff = read('docs/patient-doctor-backend-handoff.md');

const assertIncludes = (source, text, context) =>
  assert(source.includes(text), context + ': ' + text);
for (const field of [
  'providerId:',
  'branchId:',
  'branchName:',
  'serviceCode:',
  'domainCode:',
  'verifiedAt:',
  'distanceKm:',
  'scientific:',
  'pricing:',
  'protection:',
  'evidenceStatus:',
]) {
  assertIncludes(model, field, 'Presentation DTO field');
}
assertIncludes(model, "eligibility: 'pending'", 'Mock must not be declared eligible');
assertIncludes(model, 'verifiedAt: null', 'Mock cannot claim a verified date');
assertIncludes(
  model,
  'distanceKm: getMockProviderDistanceKm(provider)',
  'Mock preview distance has a value',
);
assertIncludes(model, 'verifiedVisitCount: null', 'Demo review count is not verified visits');
assertIncludes(grade, "'F' | 'pending'", 'F and pending clinical grade support');
assertIncludes(grade, "scientific !== 'F'", 'F must not permit an automatic price level');
assert(
  !card.includes('ProviderServiceFactsStrip'),
  'Doctor result cards no longer show extra S/P/H badges',
);
assertIncludes(
  card,
  'getMockProviderDistanceKm(provider).toFixed(1)',
  'Doctor cards show mock distances',
);
assertIncludes(
  card,
  "{serviceCode ? 'سعر الخدمة' : 'الخدمات المتاحة'}",
  'Same card structure adapts details without a preselected service',
);
assertIncludes(model, 'getEligibilityDisplay', 'Service eligibility display is modeled');
for (const row of [
  'scientific',
  'pricing',
  'protection',
  'eligibility',
  'verification',
  'distance',
  'rating',
  'price',
  'appointment',
]) {
  assertIncludes(comparison, "key: '" + row + "'", 'Comparison row');
}
assertIncludes(
  comparisonRoute,
  '...(serviceCode ? { serviceCode } : {})',
  'General comparison must not silently select a service',
);
assert(
  !comparisonRoute.includes('?? getMockProvider(providerId)?.serviceCodes[0]'),
  'No inferred booking service from comparison',
);
assertIncludes(
  profile,
  'provider?.serviceCodes.includes(requestedServiceCode)',
  'Profile must validate explicit service',
);
assertIncludes(
  profile,
  "label={serviceCode ? 'اختر موعداً' : 'اختر خدمة للحجز'}",
  'Booking requires explicit service',
);
assert(
  !results.includes('الترتيب الافتراضي لعرض البيانات التجريبية'),
  'Remove unwanted explanatory copy from results UI',
);
assertIncludes(searchResults, '<FlatList', 'Explore doctor results are windowed');
assertIncludes(searchResults, 'initialNumToRender={5}', 'Initial doctor cards are limited');
assertIncludes(handoff, 'eligible', 'Document the backend eligibility contract');

const favoriteStore = read('src/features/discovery/state/doctor-favorites-provider.tsx');
const favoritePage = read('src/features/discovery/screens/doctor-favorites-screen.tsx');
const favoriteStorage = read('src/shared/storage/secure-storage.ts');
const auth = read('src/providers/auth-session-provider.tsx');
const branchOptions = read('src/features/discovery/model/provider-branch-options.ts');
const branchChooser = read('src/features/discovery/components/provider-branch-chooser.tsx');
const slotScreen = read('src/features/booking/screens/slot-selection-screen.tsx');
const patientScreen = read('src/features/booking/screens/booking-patient-selection-screen.tsx');
const bookingReview = read('src/features/booking/screens/booking-review-screen.tsx');
const bookingAvailability = read('src/features/discovery/mocks/providers.mock.ts');

assertIncludes(favoriteStore, 'useDoctorFavorites', 'Saved doctor state');
assertIncludes(favoriteStorage, 'getDoctorFavorites', 'Device-local favorite storage');
assertIncludes(favoriteStorage, 'clearDoctorFavorites', 'Favorite privacy cleanup');
assertIncludes(auth, 'secureStorage.clearDoctorFavorites()', 'Favorites cleared on sign out');
assertIncludes(favoritePage, 'chosen?.serviceCode', 'Compare only same-service saved choices');
assertIncludes(favoritePage, 'getMockProvider', 'Favorite list uses saved provider records');
assertIncludes(card, 'toggleFavorite(doctor.id, serviceCode)', 'Favorite from results');
assertIncludes(profile, 'toggleFavorite(doctor.id, serviceCode)', 'Favorite from doctor profile');
assertIncludes(branchOptions, 'branchId: null', 'Mock must never generate a canonical branch ID');
assertIncludes(
  branchChooser,
  'if (branches.length < 2) return null',
  'No invented second branch UI',
);
assertIncludes(profile, 'setServiceCode(null);', 'Branch change resets service selection');
assertIncludes(
  profile,
  'isBranchServiceAvailable(selectedBranch, serviceCode)',
  'Booking stays branch scoped',
);
assertIncludes(bookingAvailability, 'getNonPastMockAvailability', 'Exclude past calendar days');
for (const [name, content] of [
  ['slot', slotScreen],
  ['patient', patientScreen],
  ['review', bookingReview],
]) {
  assertIncludes(content, 'getNonPastMockAvailability', name + ' must exclude past days');
}
assertIncludes(slotScreen, 'priceAtSelection', 'Capture price quote at slot selection');
assertIncludes(patientScreen, 'priceAtSelection', 'Forward quote through patient selection');
assertIncludes(bookingReview, 'quotedPriceChanged', 'Show changed quote in review');
assertIncludes(bookingReview, 'priceChangeApproved', 'Require explicit patient price consent');
assertIncludes(
  bookingReview,
  'approvedPriceLabel === currentPriceLabel',
  'Changed quote resets consent',
);
assertIncludes(
  bookingReview,
  'bookingRevalidationBranchUnavailable',
  'Existing backend-ready branch revalidation state',
);
assertIncludes(
  comparisonRoute,
  "fromSearch === 'favorites'",
  'Favorites comparison returns to favorites',
);

const favoritePageMarkup = read('src/features/discovery/screens/doctor-favorites-screen.tsx');
const doctorBrowseMarkup = read(
  'src/features/discovery/screens/universal-dental-search-screen.tsx',
);
const discoverySession = read('src/features/discovery/state/discovery-session-provider.tsx');

assertIncludes(
  favoritePageMarkup,
  'ubertip-empty-transparent.png',
  'Favorites empty state reuses the bundled image',
);
assertIncludes(
  favoritePageMarkup,
  "android: 'delete_outline'",
  'Trash icon uses supported icon name',
);
assert(!favoritePageMarkup.includes('heart_broken'), 'Unrecognized question-mark fallback removed');
assert(
  !profile.includes('linkLabel="تفاصيل الفرع"'),
  'Branch detail button removed from section title',
);
assertIncludes(profile, 'onPress={openBranch}', 'Branch card remains clickable');
assertIncludes(
  profile,
  "'border-action-primary bg-action-primary'",
  'Saved doctor button has active background',
);
assertIncludes(
  profile,
  'tone={isFavorite(doctor.id, serviceCode) ?',
  'Saved doctor icon changes to on-action color',
);
assertIncludes(
  card,
  "favorite ? 'bg-action-primary' : 'bg-action-subtle'",
  'Favorite icon has active background',
);
assertIncludes(
  card,
  "tone={favorite ? 'onAction' : 'action'}",
  'Favorite icon uses white on action',
);
assertIncludes(
  doctorBrowseMarkup,
  'allowGeneralComparison',
  'Explore doctors enables compare button',
);
assertIncludes(
  doctorBrowseMarkup,
  "fromSearch: isDoctorBrowse ? 'doctors'",
  'Explore doctors comparison uses same table',
);
assertIncludes(
  discoverySession,
  'toggleDoctorBrowseComparisonProvider',
  'Doctor browse has independent selection context',
);
assertIncludes(
  comparisonRoute,
  "fromSearch === 'doctors'",
  'Edit/remove comparison returns to explore doctors',
);
const serviceCatalog = read('src/features/discovery/screens/service-catalog-tab-screen.tsx');
const transitions = read('src/shared/navigation/navigation-transitions.ts');
const tabLayout = read('src/app/(tabs)/_layout.tsx');
assertIncludes(serviceCatalog, '<FlatList', 'Services tab uses a virtualized list');
assertIncludes(tabLayout, 'lazy: true', 'Tabs do not mount every screen at launch');
assertIncludes(transitions, 'PAGE_PUSH_DURATION_MS = 220', 'Slide navigation is shorter');
assertIncludes(transitions, 'TAB_TRANSITION_DURATION_MS = 190', 'Tab slide navigation is shorter');
assertIncludes(
  comparison,
  "label: 'التصنيف العلمي'",
  'Comparison uses readable classification label',
);
assert(!comparison.includes("label: 'التصنيف العلمي S'"), 'No bare classification code in labels');

// Doctor-scoped UI categories: badge display must not depend on service selection.
const gradeModel = read('src/features/discovery/model/doctor-classification.ts');
const gradeChips = read('src/features/discovery/components/doctor-classification-chips.tsx');
const gradeTabs = read('src/features/discovery/components/doctor-grade-tabs.tsx');
assertIncludes(
  gradeModel,
  'getDoctorCategoryBadges(provider: MockProvider)',
  'Doctor category source',
);
assert(
  !gradeModel.includes('scientificByService'),
  'Doctor badges do not recalculate grade by service',
);
assertIncludes(
  gradeModel,
  'badge.key === category && badge.grade === grade',
  'Doctors appear in tabs for the matching classification category and level',
);
assertIncludes(
  gradeChips,
  "import { Chip } from 'heroui-native'",
  'HeroUI Native classification badges',
);
assertIncludes(
  gradeChips,
  'getDoctorCategoryBadges(provider)',
  'Cards and profile share doctor category badges',
);
assertIncludes(gradeTabs, "import { Tabs } from 'heroui-native'", 'HeroUI Native grade tabs');
assertIncludes(
  card,
  '<DoctorClassificationChips provider={provider} compact />',
  'Doctor card displays all badges',
);
assertIncludes(
  profile,
  '<DoctorClassificationChips provider={provider} />',
  'Profile shows grades without service selection',
);
assertIncludes(searchResults, '<DoctorGradeTabs', 'Discover results allow grade tabs');
assertIncludes(results, '<DoctorGradeTabs', 'Service-based results allow grade tabs');
assertIncludes(
  searchResults,
  'matchesDoctorGrade(provider, activeTab)',
  'Doctor discover tabs filter correctly',
);
assertIncludes(
  results,
  'matchesDoctorGrade(provider, activeTab)',
  'Provider results tabs filter correctly',
);

assertIncludes(
  gradeModel,
  'getDoctorClassification(provider);',
  'Grade chips do not need an explicitly chosen service',
);
assertIncludes(
  comparison,
  'getDoctorClassification(provider)',
  'Unscoped doctor comparison retains provider-level classifications',
);
assertIncludes(
  profile,
  '<DoctorClassificationDetails provider={provider} serviceCode={serviceCode} />',
  'Doctor classification details render in profile',
);
assertIncludes(
  favoritePageMarkup,
  '<DoctorClassificationChips provider={doctor} compact />',
  'Saved-doctor cards show the same badges',
);
assertIncludes(
  gradeTabs,
  '{doctorGradeTabs.map((tab) => (',
  'All category tabs remain accessible, including grades with zero doctors',
);
assertIncludes(
  searchResults,
  'لا يوجد أطباء ضمن هذا التصنيف في النتائج الحالية.',
  'Browse grades have an empty state',
);
assertIncludes(
  results,
  'لا يوجد أطباء ضمن هذا التصنيف في النتائج الحالية.',
  'Service results grades have an empty state',
);
assertIncludes(
  gradeModel,
  'label: facts.scientificLabel',
  'Clinical badge uses Arabic display name, not letter code',
);
assertIncludes(
  gradeModel,
  'label: facts.pricingLabel',
  'Price badge uses Arabic display name, not letter code',
);
assertIncludes(
  gradeModel,
  'label: facts.protectionLabel',
  'Protection badge uses Arabic display name, not letter code',
);
assertIncludes(
  gradeModel,
  'label: scientificLabels[grade]',
  'Scientific grade tab uses its Arabic name',
);
assertIncludes(
  gradeModel,
  'label: pricingLabels[grade]',
  'Pricing grade tab uses its Arabic name',
);
assertIncludes(
  gradeModel,
  'label: protectionLabels[grade]',
  'Protection grade tab uses its Arabic name',
);
assertIncludes(
  gradeTabs,
  "'bg-action-primary'",
  'Active HeroUI tab uses primary background',
);
assertIncludes(
  gradeTabs,
  "'text-content-on-action'",
  'Active HeroUI tab uses white text',
);
const profileGradeDetails = read('src/features/discovery/components/doctor-classification-details.tsx');
assert(!profileGradeDetails.includes("'S · '"), 'Profile must not display scientific letter codes');
assert(!profileGradeDetails.includes("'P · '"), 'Profile must not display pricing letter codes');
assert(!profileGradeDetails.includes("'H · '"), 'Profile must not display protection letter codes');
console.log('Patient doctor presentation UI contracts: PASS');
