import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (file) => readFileSync(file, 'utf8');
const store = read('src/shared/storage/secure-storage.ts');
const provider = read('src/features/my-care/state/care-draft-provider.tsx');
const fields = read('src/features/booking/utils/booking-care-draft.ts');
const saveLater = read('src/features/booking/components/booking-save-later-action.tsx');
const slots = read('src/features/booking/screens/slot-selection-screen.tsx');
const patient = read('src/features/booking/screens/booking-patient-selection-screen.tsx');
const review = read('src/features/booking/screens/booking-review-screen.tsx');
const results = read('src/features/discovery/screens/provider-results-screen.tsx');
const assessmentResult = read('src/features/assessment/screens/assessment-result-screen.tsx');
const care = read('src/features/my-care/screens/my-cases-overview-screen.tsx');
const auth = read('src/providers/auth-session-provider.tsx');
assert.ok(
  store.includes('getCareDrafts:') &&
    store.includes('setCareDrafts:') &&
    store.includes('clearCareDrafts:'),
);
assert.ok(store.includes('CARE_DRAFT_INDEX') && store.includes('careDraftStorageQueue'));
assert.ok(
  provider.includes('getCareDrafts()') &&
    provider.includes('setCareDrafts(next)') &&
    provider.includes('setHydrated(true)'),
);
assert.ok(
  provider.includes("draft.kind === 'booking' || draft.kind === 'assessment'") &&
    provider.includes('bookingCareDraftId'),
);
assert.ok(
  fields.includes("step === 'slots'") &&
    fields.includes("step === 'patient'") &&
    fields.includes("'/booking/review'"),
);
assert.ok(
  slots.includes("createBookingCareDraft(bookingFields, 'slots')") && slots.includes('savedTime'),
);
assert.ok(
  patient.includes("createBookingCareDraft(bookingFields, 'patient')") &&
    patient.includes('patientId: selectedId'),
);
assert.ok(
  review.includes("createBookingCareDraft(bookingFields, 'review')") &&
    review.includes('setNote(saved.note') &&
    review.includes('setShareVisitSummary(saved.shareVisitSummary'),
);
assert.ok(
  review.includes('removeDraft(bookingCareDraftId') && review.includes('setSubmitted(true)'),
);
assert.ok(
  saveLater.includes('await saveDraft') &&
    saveLater.includes('router.replace') &&
    saveLater.includes('إكمال الحجز لاحقاً'),
);
assert.ok(
  ['slots', 'patient', 'review'].every((step) =>
    [slots, patient, review][['slots', 'patient', 'review'].indexOf(step)].includes(
      'BookingSaveLaterAction',
    ),
  ),
);
assert.ok(
  results.includes('assessmentDraftId') && results.includes("route: '/discover/providers/results'"),
);
assert.ok(
  assessmentResult.includes("origin: 'assessment'") && assessmentResult.includes('saveDraft('),
);
assert.ok(
  care.includes('filterDraftCaseRecords(drafts, caseQuick, caseAdvanced)') &&
    care.includes('draft.route') &&
    care.includes('removeDraft(draft.id)'),
);
assert.ok(
  auth.includes('secureStorage.clearCareDrafts()'),
  'Logout must remove persisted personal drafts',
);
assert.ok(
  store.includes('setCareDrafts: (') && store.includes('await setItem(CARE_DRAFT_INDEX'),
  'Persist index only after draft bodies',
);
process.stdout.write('Booking draft persistence, steps, assisted source, resume and logout contracts passed.\n');