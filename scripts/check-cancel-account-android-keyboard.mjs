import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const booking = read('src/features/booking/screens/booking-detail-screen.tsx');
const fixture = read('src/features/booking/mocks/bookings.mock.ts');
const profile = read('src/features/profile/screens/profile-personal-info-screen.tsx');
const security = read('src/features/profile/screens/account-security-screen.tsx');
const dialog = read('src/features/profile/components/profile-phone-change-dialogs.tsx');
const auth = read('src/features/auth/mocks/auth.mock.ts');
const authPhone = read('src/features/auth/screens/phone-entry-screen.tsx');
const phoneField = read('src/shared/components/ui/phone-number-field.tsx');
const countryDialog = read('src/shared/components/ui/country-dial-code-select.tsx');
const notification = read('src/features/platform/screens/notification-centre-screen.tsx');
const discover = read('src/features/discovery/components/discover-search-results.tsx');
const providerResults = read('src/features/discovery/screens/provider-results-screen.tsx');
const slots = read('src/features/booking/screens/slot-selection-screen.tsx');
const assessmentResult = read('src/features/assessment/screens/assessment-result-screen.tsx');
const doctorCard = read('src/features/discovery/components/discover-doctor-result-card.tsx');
const doctorProfile = read('src/features/discovery/screens/provider-decision-screen.tsx');
const screen = read('src/shared/components/ui/screen.tsx');
const providers = read('src/providers/app-providers.tsx');
const assessment = read('src/features/assessment/components/assessment-scaffold.tsx');
const packageJson = JSON.parse(read('package.json'));
const appJson = JSON.parse(read('app.json'));

assert.ok(
  !booking.includes('سبب الإلغاء') &&
    !booking.includes('اختيار موعد جديد') &&
    !fixture.includes('cancellationReason'),
  'Withdrawn cancellation-reason and rebooking UI must stay removed',
);
assert.ok(
  auth.includes("MOCK_VERIFICATION_CODE = '000000'") &&
    auth.includes('code !== MOCK_VERIFICATION_CODE'),
  'Mock authentication and phone-change OTP is 000000',
);
assert.ok(
  security.includes('الجلسات والأجهزة') && security.includes('<ProfilePhoneChangeDialogs'),
  'Keep SRS P-UI-35 devices and sessions',
);
assert.ok(
  profile.includes('<PhoneNumberField') &&
    profile.includes('setPendingVerificationPhone(newPhone)') &&
    profile.includes('onVerified={finishSave}'),
  'Verify changed phone before saving profile edits',
);
assert.ok(
  dialog.includes('requestMockVerification(initialPhone, scenario)') &&
    dialog.includes('setVerifiedPhone(pendingPhone)') &&
    dialog.includes('MOCK_VERIFICATION_CODE'),
  'Use shared OTP state machine',
);
assert.ok(
  authPhone.includes('<CountryDialCodeSelect') &&
    phoneField.includes('<CountryDialCodeSelect') &&
    countryDialog.includes('presentation="dialog"'),
  'Auth and profile must share one HeroUI country-code modal',
);
assert.ok(
  notification.includes('<SectionTabs\n          solidActive'),
  'Notification selected tab should have primary background/white text',
);
assert.ok(
  discover.includes('<DiscoverDoctorResultCard') &&
    discover.includes('النتائج ({doctors.length})') &&
    !discover.includes('matches.families.map'),
  'Discover search must return only doctors using the same result card',
);
assert.ok(
  providerResults.includes('النتائج ({doctors.length})'),
  'Service doctors list shows results count',
);
assert.ok(
  assessmentResult.includes('patientId:') &&
    providerResults.includes('patientId={params.patientId}') &&
    doctorCard.includes('...(patientId ? { patientId } : {})') &&
    doctorProfile.includes('patientId') &&
    slots.includes('canBookForPatient(patientId, scenario)') &&
    slots.includes("'/booking/review'"),
  'Assessment patient context must flow through doctor selection and skip repeat booking patient step when permitted',
);
assert.ok(
  packageJson.dependencies['react-native-keyboard-controller'] &&
    appJson.expo.android.softwareKeyboardLayoutMode === 'resize' &&
    providers.includes('<KeyboardProvider statusBarTranslucent>') &&
    screen.includes('ControlledKeyboardAvoidingView') &&
    screen.includes('behavior="padding"') &&
    assessment.includes("bottomOffset={Platform.OS === 'android' ? 16 : 85}"),
  'Use one consistent keyboard height strategy without enlarged Android scroll offset',
);
for (const page of [
  'src/features/profile/components/profile-screen-shell.tsx',
  'src/features/booking/screens/booking-review-screen.tsx',
  'src/features/booking/screens/cancel-booking-screen.tsx',
  'src/features/booking/screens/reschedule-booking-screen.tsx',
  'src/features/my-care/screens/claims-screen.tsx',
]) {
  assert.ok(
    read(page).includes('<KeyboardAwareScrollView') &&
      read(page).includes("bottomOffset={Platform.OS === 'android' ? 16 : 90}"),
    page + ' must keep Android keyboard offset compact',
  );
}
console.log(
  'Cancellation rollback, patient journey, doctor cards, phone-code modal, notification tabs and Android keyboard source contracts passed.',
);
