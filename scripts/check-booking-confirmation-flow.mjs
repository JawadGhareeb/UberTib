import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf8');
const status = read('src/features/booking/screens/booking-status-screen.tsx');
const detail = read('src/features/booking/screens/booking-detail-screen.tsx');
const success = read('src/features/booking/components/confirmed-booking-summary.tsx');
const calendar = read('src/features/booking/utils/booking-calendar.ts');
const review = read('src/features/booking/screens/booking-review-screen.tsx');
const careOverview = read('src/features/my-care/screens/my-cases-overview-screen.tsx');
const bookingHeader = read('src/features/booking/components/booking-v5-ui.tsx');
const pkg = JSON.parse(read('package.json'));
const expo = JSON.parse(read('app.json')).expo;

assert.ok(
  success.includes('تم تأكيد موعدك!') &&
    success.includes('booking.patientName') &&
    success.includes('booking.dateLabel') &&
    success.includes('booking.timeLabel') &&
    success.includes('booking.providerName') &&
    success.includes('booking.branch') &&
    success.includes('booking.note && !completed'),
  'Confirmed screen must have a compact genuine case-specific success summary and only real instructions',
);
assert.ok(
  status.includes('<ConfirmedBookingSummary') &&
    status.includes('completed={completed}') &&
    status.includes("const confirmed = booking.status === 'confirmed'") &&
    !status.includes('BookingChecklistItem'),
  'Confirmed and completed states must render safely, no unrelated claims/checklist for saved mock evidence',
);
assert.ok(
  status.includes('const navigateToBooking') &&
    status.includes('router.replace({') &&
    status.includes('label="عرض تفاصيل الحجز"') &&
    !status.includes('calendarDraftUrl') &&
    !status.includes('https://calendar.google.com'),
  'Status details navigation replaces stack and no external-only calendar URL remains',
);
assert.ok(
  detail.includes("isConfirmed || isClosed ? 'العودة إلى حجوزاتي'") &&
    detail.includes("pathname: '/(tabs)/care'") &&
    detail.includes("pathname: '/booking/[bookingId]/status'"),
  'Details must not return confirmed bookings to success; pending retains tracking path',
);
assert.ok(
  pkg.dependencies['expo-calendar'] &&
    expo.plugins.some(
      (plugin) =>
        Array.isArray(plugin) &&
        plugin[0] === 'expo-calendar' &&
        plugin[1]?.writeOnlyAccess === true,
    ),
  'Native Expo Calendar has SDK compatible dependency and write-only iOS permissions',
);
assert.ok(
  calendar.includes("booking.status !== 'confirmed'") &&
    calendar.includes('booking.dateKey') &&
    calendar.includes('matchTime') &&
    calendar.includes('date.getTime() <= Date.now()') &&
    calendar.includes('createEventInCalendarAsync') &&
    !/^\s*endDate:/m.test(calendar) &&
    !calendar.includes('45 * 60'),
  'Only upcoming verified confirmed booking data may prefill a native calendar editor, never invent duration',
);
assert.ok(
  status.includes('calendarBusy') &&
    status.includes('disabled={!calendarAvailable}') &&
    status.includes('openBookingCalendarEditor') &&
    !status.includes('تمت الإضافة إلى التقويم'),
  'Calendar button cannot auto-insert or falsely report calendar save',
);
assert.ok(
  review.includes("from 'heroui-native'") &&
    review.includes('<Accordion') &&
    review.includes('<Accordion.Item') &&
    review.includes('<Accordion.Trigger>') &&
    review.includes('<Accordion.Indicator />') &&
    review.includes('<Accordion.Content>') &&
    !review.includes('extraOpen') &&
    review.includes('DocumentPicker.getDocumentAsync') &&
    review.includes('<AssessmentImagePreview'),
  'Optional preliminary booking info must use real HeroUI Native Accordion while preserving attachment flow',
);
const target = "pathname: '/(tabs)/care', params: { tab: 'bookings' }";
for (const [sourceName, code] of [
  ['booking confirmation', status],
  ['booking details', detail],
  ['post-request summary', review],
  ['booking header fallback', bookingHeader],
]) {
  assert.ok(code.includes(target), sourceName + ' should navigate to My Care > Bookings');
  assert.ok(
    !code.includes("router.replace('/booking')"),
    sourceName + ' must not return to the standalone bookings page',
  );
}
assert.ok(
  careOverview.includes("requestedTab === 'cases' || requestedTab === 'bookings'"),
  'My Care must honor the bookings tab parameter',
);
console.log(
  'Confirmed booking, loop-free routing, native calendar safety and HeroUI Accordion verified.',
);
