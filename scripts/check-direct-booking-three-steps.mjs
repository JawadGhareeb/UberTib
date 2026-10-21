import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (file) => readFileSync(file, 'utf8');
const progress = read('src/features/booking/components/booking-journey-progress.tsx');
const slots = read('src/features/booking/screens/slot-selection-screen.tsx');
const patient = read('src/features/booking/screens/booking-patient-selection-screen.tsx');
const review = read('src/features/booking/screens/booking-review-screen.tsx');
const legacy = read('src/features/booking/screens/booking-visit-reason-screen.tsx');
const status = read('src/features/booking/screens/booking-status-screen.tsx');
const grants = read('src/features/booking/utils/patient-booking-permissions.ts');

assert.ok(
  progress.includes('step: 1 | 2 | 3') && progress.includes('accessibilityRole="progressbar"'),
);
assert.ok(
  slots.includes('<BookingJourneyProgress step={1}') &&
    slots.includes("'/booking/patient'") &&
    slots.includes('canBookForPatient(patientId, scenario)') &&
    slots.includes("setSlot('')"),
  'Slots must be step 1/3 and clear the previously selected hour when day changes',
);
assert.ok(
  patient.includes('<BookingJourneyProgress step={2}') &&
    patient.includes("pathname: '/booking/review'") &&
    !patient.includes("pathname: '/booking/reason'") &&
    patient.includes('<RadioGroup') &&
    patient.includes('<RadioGroup.Item') &&
    patient.includes('isDisabled={!allowed}') &&
    patient.includes("'/profile/dependents/new'"),
  'Booking patient selection reuses assessment-style HeroUI cards and grants without extra step',
);
assert.ok(
  patient.includes('useFamilyMembers()') && patient.includes('canBookForPatient'),
  'Only case-matching family data, not hardcoded assessment fixtures, is eligible',
);
assert.ok(
  grants.includes("action === 'إدارة الحجوزات'"),
  'Health access must not be treated as booking permission',
);
assert.ok(
  review.includes('<BookingJourneyProgress step={3}') &&
    review.includes("pathname: '/booking/slots'") &&
    review.includes('slotStillInSnapshot') &&
    review.includes('bookingRevalidationSlotUnavailable') &&
    review.includes('bookingRevalidationEligibilityLost') &&
    review.includes('buildReturnTo') &&
    review.includes('submitBookingRequest({'),
  'Review preserves booking date, authentication return-to and eligibility revalidation',
);
assert.ok(
  review.includes('<Accordion') &&
    review.includes('<Accordion.Item') &&
    review.includes('<Accordion.Trigger>') &&
    review.includes('<Accordion.Content>') &&
    review.includes('<RadioGroup') &&
    review.includes('<TextField') &&
    review.includes('DocumentPicker.getDocumentAsync') &&
    review.includes('onPress={() => void pickAttachment()}') &&
    review.includes('setAttachment(null)') &&
    review.includes('<AssessmentImagePreview'),
  'Optional reason, note and local photo/PDF picker must now live inside review',
);
assert.ok(
  review.includes('photos: false') &&
    review.includes('medicalHistory: false') &&
    review.includes('على جهازك فقط') &&
    !review.includes('محددة للمشاركة عند إتاحة رفع الملفات'),
  'Locally picked files must never be falsely marked as uploaded or shared',
);
assert.ok(
  legacy.includes('<Redirect') &&
    legacy.includes("pathname: '/booking/review'") &&
    legacy.includes("pathname: '/booking/slots'"),
  'Legacy reason URLs transparently reroute to the new journey without an orphan step',
);
assert.ok(
  status.includes("pathname: '/booking/slots'"),
  'Booking status starts another request directly from slot selection',
);
process.stdout.write(
  'Three-step direct booking, optional local file review, family grants, legacy deep links passed.\n',
);
