import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const failures = [];
function expect(condition, description) {
  if (!condition) failures.push(description);
}

const button = read('src/shared/components/ui/button.tsx');
expect(
  button.includes("variant === 'primary'") && button.includes('colors.text.onAction'),
  'Primary Button must resolve its label to white on-action text',
);
for (const variant of ["'primary'", "'outline'", "'soft'", "'destructive'"]) {
  expect(button.includes(variant), 'Missing Button variant: ' + variant);
}
expect(button.includes("soft: 'bg-action-subtle"), 'Soft actions must not have a border');

// AppText defaults to a dark text color; all button variants must explicitly
// override it with the correct semantic text class as well as the inline color.
const requiredButtonLabelStyles = [
  "primary: 'text-content-on-action'",
  "secondary: 'text-content-link'",
  "outline: 'text-content-link'",
  "soft: 'text-content-link'",
  "destructive: 'text-content-on-destructive'",
  "isDisabled ? 'text-content-disabled' : labelClasses[variant]",
  'color: labelColor',
  'align="center"',
];
for (const pattern of requiredButtonLabelStyles) {
  expect(button.includes(pattern), 'Shared Button foreground regression: ' + pattern);
}
const tokens = JSON.parse(read('src/shared/theme/tokens.json'));
for (const [name, palette] of [
  ['light', tokens.color],
  ['dark', tokens.darkColor],
]) {
  expect(palette.text.onAction === '#FFFFFF', name + ' filled Primary CTA must have white text');
  expect(palette.text.onDestructive === '#FFFFFF', name + ' destructive CTA must have white text');
  expect(
    palette.action.secondaryText === tokens.brand.mark,
    name + ' outline and soft CTA labels must use the Primary',
  );
}

const expected = [
  ['src/features/discovery/screens/provider-search-screen.tsx', 'label="عرض النتائج المناسبة"'],
  ['src/features/discovery/screens/provider-search-screen.tsx', 'variant="primary"'],
  ['src/features/discovery/screens/provider-decision-screen.tsx', 'label="اختر موعداً"'],
  ['src/features/discovery/screens/service-detail-screen.tsx', 'label="ابحث عن طبيب مؤهّل"'],
  ['src/features/discovery/screens/service-groups-screen.tsx', '<SearchField'],
  ['src/features/discovery/screens/service-search-results-screen.tsx', '<SearchField'],
  ['src/features/discovery/components/service-group-card.tsx', 'variant="soft"'],
  ['src/features/discovery/components/service-family-card.tsx', 'accessibilityRole="button"'],
  ['src/features/discovery/screens/provider-results-screen.tsx', 'label="عرض الطبيب"'],
  ['src/features/discovery/screens/provider-results-screen.tsx', 'variant="soft"'],
  ['src/features/discovery/screens/service-family-detail-screen.tsx', 'self-end items-center'],
  ['src/features/booking/components/booking-case-card.tsx', 'completedSteps'],
  ['src/features/booking/screens/my-bookings-screen.tsx', '<BookingCaseCard'],
  ['src/features/booking/screens/my-bookings-screen.tsx', '<CareFilterTabs'],
  ['src/features/booking/screens/booking-detail-screen.tsx', '<CareV5TimelineRow'],
  ['src/features/booking/screens/booking-detail-screen.tsx', 'variant="outline"'],
  ['src/app/(tabs)/discover.tsx', 'showBottomNav={false}'],
];
for (const [file, pattern] of expected) {
  expect(read(file).includes(pattern), file + ' must include ' + pattern);
}
const onboarding = read('src/features/app-entry/components/onboarding-illustrations.tsx');
expect(
  onboarding.includes('function useSequentialReveal(') &&
    onboarding.includes('setTimeout(() => setVisibleCount(index + 1)') &&
    onboarding.includes('return () => timers.forEach(clearTimeout)') &&
    onboarding.includes('useReducedMotion()'),
  'Onboarding stages must mount one at a time with timer cleanup and reduced-motion support',
);
expect(
  onboarding.includes('index < visibleCount') &&
    onboarding.includes('index + 1 < visibleCount') &&
    onboarding.includes('if (index >= visibleCount) return null;') &&
    onboarding.includes('STEP_REVEAL_INTERVAL = 460') &&
    onboarding.includes('CARE_REVEAL_INTERVAL = 320') &&
    onboarding.includes('ReduceMotion.System') &&
    !onboarding.includes('FadeInDown.delay(index * CARE_REVEAL_INTERVAL)'),
  'Cards and connectors in both onboarding journey steps must reveal sequentially',
);

const onboardingPager = read('src/features/app-entry/components/onboarding-screen.tsx');
const onboardingEntry = read('src/features/app-entry/screens/app-entry-screen.tsx');
expect(
  onboardingPager.includes('onGoToSlide: (target: number) => void') &&
    onboardingPager.includes('onPress={() => onGoToSlide(dotIndex)}') &&
    onboardingPager.includes('accessibilityState={{ selected: dotIndex === index }}') &&
    onboardingPager.includes('FadeInLeft : FadeInRight') &&
    onboardingEntry.includes('const goToSlide = (target: number) => {') &&
    onboardingEntry.includes('onGoToSlide={goToSlide}') &&
    onboardingEntry.includes('onBack={() => goToSlide(slideIndex - 1)}') &&
    onboardingEntry.includes('goToSlide(slideIndex + 1)'),
  'All four onboarding indicators must navigate directly with forward/backward slide animation',
);
expect(
  onboarding.includes('const activeStep = manualStep ?? Math.max(0, visibleCount - 1)') &&
    onboarding.includes('onPress={() => setManualStep(index)}') &&
    onboarding.includes('accessibilityState={{ selected: active }}') &&
    onboarding.includes("key={`${index}-${active ? 'active' : 'idle'}`}") &&
    onboarding.includes('ZoomIn') &&
    onboarding.includes('STEP_REVEAL_INTERVAL = 460'),
  'Illustrated stages 1–4 must animate active numbers and allow manual selection',
);
expect(
  onboarding.includes('const active = index === Math.max(0, visibleCount - 1)') &&
    onboarding.includes("key={`${step.label}-${active ? 'active' : 'idle'}`}"),
  'The final 1–6 care journey must also advance the active number with the reveal animation',
);

const home = read('src/features/patient-home/screens/patient-home-screen.tsx');
const homeDentalIcon = read('src/features/patient-home/components/home-care-tooth-icon.tsx');
expect(
  home.includes('<HomeCareToothIcon kind={group.tooth} />') &&
    homeDentalIcon.includes('warm.surface') &&
    homeDentalIcon.includes('colors.action.subtle'),
  'Home group icons must show the peach crescent and Primary-tinted mint corner',
);
expect(
  home.includes('style={{ backgroundColor: warm.surface }}') &&
    home.includes('function HomeSummaryCards()'),
  'Active treatment card must keep the pale peach icon tile',
);
expect(
  home.indexOf("code: 'G01'") < home.indexOf("code: 'G02'"),
  'Home care cards must stay in G01/G02/G03/G04 order',
);

const homeOutline = read('src/features/patient-home/screens/patient-home-screen.tsx');
const assessmentPatients = read('src/features/assessment/screens/assessment-patient-screen.tsx');
const bookingPatients = read('src/features/booking/screens/booking-patient-selection-screen.tsx');
const patientCard = read('src/shared/components/ui/patient-selection-card.tsx');
const bookingPermission = read('src/features/booking/utils/patient-booking-permissions.ts');
const bookingReview = read('src/features/booking/screens/booking-review-screen.tsx');
expect(
  homeOutline.includes('variant="outline"') &&
    assessmentPatients.includes('variant="outline"') &&
    bookingPatients.includes('variant="outline"'),
  'Home, assessment and booking must use the shared Primary outline button',
);
expect(
  assessmentPatients.includes('disabled: true') &&
    assessmentPatients.includes('التفويض لا يسمح بالتقييم الصحي') &&
    patientCard.includes('disabled={disabled}') &&
    patientCard.includes("ios: 'lock.fill'"),
  'Restricted assessment patients must show a locked, disabled selector',
);
expect(
  bookingPermission.includes("grant.actions.some((action) => action === 'إدارة الحجوزات')") &&
    bookingPermission.includes("grant.statusLabel === 'فعال'") &&
    bookingPatients.includes('disabled={!allowed}') &&
    bookingReview.includes('!patientCanBook'),
  'Booking eligibility must require an active action-scoped grant and be rechecked before submission',
);

const splash = read('src/features/app-entry/components/splash-screen.tsx');
const splashEntry = read('src/features/app-entry/screens/app-entry-screen.tsx');
expect(splash.includes('const PRIMARY = theme.brand.mark'), 'Splash must use current primary');
expect(
  splash.includes('UberTib') && splash.includes('منصة رعاية أسنان موثوقة'),
  'Splash lockup must match the reference',
);
expect(
  splash.includes('RadialGradient') && splash.includes('LinearGradient'),
  'Splash must contain the reference glow and background tint',
);
expect(
  splash.includes('ReduceMotion.System') && splash.includes('withRepeat('),
  'Loading bar must support reduced motion',
);
expect(
  splashEntry.includes('import { SplashScreen }') &&
    !splashEntry.includes('function SplashScreen()'),
  'Splash must be a standalone reusable component',
);
expect(
  splashEntry.includes('if (__DEV__)') &&
    splashEntry.includes('setSlideIndex(0)') &&
    splashEntry.includes('setShowOnboarding(true)') &&
    splashEntry.includes('if (accessToken || onboardingComplete)'),
  'Development must replay all onboarding slides while production respects the saved first-use state',
);
expect(
  splashEntry.includes('router.replace(nextRoute)') &&
    splashEntry.includes("accessToken ? '/(tabs)/home' : '/auth/phone'") &&
    splashEntry.includes('} catch {'),
  'Skipping or finishing intro must resolve to the correct auth destination even if storage fails',
);
const rootLayout = read('src/app/_layout.tsx');
const brandMark = read('src/shared/components/brand/brand-mark.tsx');
expect(
  splash.includes('<BrandMark size={88} />') &&
    brandMark.includes("require('../../assets/icon.png')"),
  'In-app loading must render the real bundled brand image rather than a drawn placeholder',
);
expect(
  rootLayout.includes('if (!fontsLoaded)') &&
    rootLayout.includes('<Image') &&
    rootLayout.includes("require('../shared/assets/icon.png')") &&
    !rootLayout.includes('if (!fontsLoaded) {\n    return null;'),
  'Initial font loading must display the bundled logo, never a blank frame',
);
expect(
  JSON.parse(read('app.json')).expo.plugins.some(
    (plugin) =>
      Array.isArray(plugin) &&
      plugin[0] === 'expo-splash-screen' &&
      plugin[1].backgroundColor === '#F9F9F9' &&
      plugin[1].dark?.backgroundColor === '#F9F9F9',
  ),
  'Native splash must match Light default on both operating system appearances',
);

// Reference screens: source design keeps neutral cards, status colors and one app Primary.
const profileMenu = read('src/features/profile/screens/profile-screen.tsx');
const referenceUI = read('src/features/profile/components/patient-reference-ui.tsx');
const notifications = read('src/features/platform/screens/notification-centre-screen.tsx');
const family = read('src/features/profile/screens/family-representation-screen.tsx');
const health = read('src/features/profile/screens/patient-health-information-screen.tsx');
const support = read('src/features/profile/screens/help-support-screen.tsx');
for (const route of ['/notifications', '/profile/family', '/profile/health', '/support']) {
  const screen = {
    '/notifications': 'src/app/notifications.tsx',
    '/profile/family': 'src/app/profile/family.tsx',
    '/profile/health': 'src/app/profile/health.tsx',
    '/support': 'src/app/support/index.tsx',
  }[route];
  expect(read(screen).includes('export default'), route + ' must have an Expo Router entry');
}
const profileSettings = read('src/features/profile/screens/settings-screen.tsx');
expect(
  profileMenu.includes("router.push('/profile/settings')") &&
    profileMenu.includes("router.push('/profile/security')") &&
    profileMenu.includes("router.push('/profile/privacy')") &&
    profileMenu.includes("router.push('/profile/data')") &&
    profileMenu.includes("router.push('/profile/account-closure')"),
  'Account overview must match the four Pen actions and retain its settings entrance',
);
expect(
  profileSettings.includes("router.push('/profile/health')") &&
    profileSettings.includes("router.push('/profile/family')") &&
    profileSettings.includes("router.push('/support')"),
  'Health, family and support must remain reachable from Account settings',
);
expect(
  referenceUI.includes('bg-action-subtle') && referenceUI.includes('tone="action"'),
  'All shared reference icons must use semantic Primary and not legacy dark green',
);
expect(
  notifications.includes('getMockNotificationsForScenario') &&
    notifications.includes('markNotificationRead') &&
    notifications.includes('getMockNeedsAttentionForScenario'),
  'Notification cards must use scenario actions and retain read/navigation behavior',
);
expect(
  family.includes('getMockGrantsForScenario') &&
    family.includes("router.push({ pathname: '/profile/grants/[grantId]'"),
  'Family cards must preserve permission-grant routing and scenario status',
);
expect(
  health.includes('getSurfaceState') &&
    health.includes('لا تُرسَل هذه الملاحظة إلى عيادة أو سيرفر'.replace('تُرسَل', 'تُرسل')),
  'Health edits must never imply backend persistence',
);
expect(
  support.includes('مطالبة عند وجود استحقاق') &&
    support.includes('getMockCareCaseForScenario') &&
    support.includes('disabled={item.requiresEligibility === true}') &&
    !support.includes("caseId: 'case-001'"),
  'Support must match Pen action types and never assume one hard-coded care case',
);
expect(
  support.includes('label="إرسال الطلب"') && support.includes('disabled onPress={() => {}}'),
  'Support must not fake a submitted server ticket',
);

// The OTP boxes must reopen the keyboard after Android Back dismisses it.
// Never force a code reset: a partially entered six-digit code must survive.
const otp = read('src/features/auth/screens/code-verification-screen.tsx');
expect(
  otp.includes("Keyboard.addListener('keyboardDidHide'") &&
    otp.includes('inputRef.current?.blur()') &&
    otp.includes('input.isFocused() && !keyboardVisibleRef.current') &&
    otp.includes('requestAnimationFrame(() => inputRef.current?.focus())') &&
    otp.includes('onPress={focusCodeInput}') &&
    otp.includes('showSoftInputOnFocus') &&
    otp.includes('value={code}'),
  'OTP boxes must reopen the numeric keyboard after dismissal without clearing the typed code',
);

// Search entry point and provider filters are not presentation-only.
const universalSearch = read('src/features/discovery/screens/universal-dental-search-screen.tsx');
const searchResults = read('src/features/discovery/screens/service-search-results-screen.tsx');
const providerFilters = read('src/features/discovery/screens/provider-search-screen.tsx');
const providerResults = read('src/features/discovery/screens/provider-results-screen.tsx');
const discoveryState = read('src/features/discovery/state/discovery-session-provider.tsx');
const filterEngine = read('src/features/discovery/utils/provider-filters.ts');
expect(
  home.includes('label="أبحث عن طبيب"') &&
    home.includes("onPress={() => router.push('/discover/search')}") &&
    universalSearch.includes('<SearchField') &&
    universalSearch.includes('onSubmitEditing={() => submitSearch()}') &&
    universalSearch.includes("router.push('/assessment/start')") &&
    universalSearch.includes("pathname: '/discover/search/results'"),
  'Home doctor search must open the initial interactive search page, not skip it',
);
expect(
  searchResults.includes('useLocalSearchParams') &&
    searchResults.includes('mockProviders.filter') &&
    searchResults.includes("pathname: '/discover/provider/[providerId]'"),
  'Search queries must resolve actual service, doctor and area mock results',
);
expect(
  providerFilters.includes('accessibilityRole="switch"') &&
    providerFilters.includes('checked: filters[item.key]') &&
    providerFilters.includes('setProviderFilter(serviceCode, item.key, !filters[item.key])') &&
    providerFilters.includes('applyProviderFilters(serviceCode)') &&
    providerFilters.includes('setProviderArea(serviceCode, option)') &&
    providerFilters.includes('resetProviderFilters(serviceCode)'),
  'Provider switches and region selection must change state and apply on submit',
);
expect(
  discoveryState.includes('filtersApplied: boolean') &&
    discoveryState.includes('applyProviderFilters:') &&
    providerResults.includes('filterMockProviders(') &&
    providerResults.includes('serviceState.filtersApplied') &&
    providerResults.includes('showFilterAction') &&
    filterEngine.includes('if (filters.rating') &&
    filterEngine.includes('if (filters.payment') &&
    filterEngine.includes('if (filters.branch') &&
    filterEngine.includes('if (filters.soonest'),
  'Results must apply all six provider filters with a clear path to edit them',
);

if (failures.length) {
  process.stderr.write(failures.join('\n') + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('Shared button, search, and discovery component contracts OK.\n');
}
