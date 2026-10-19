import { isUpcomingMockBooking, type MockBooking } from '@/features/booking/mocks/bookings.mock';
import type { MockCareCase } from '@/features/my-care/mocks/care.mock';
import type { MockBookingRequest } from '@/shared/mock/scenario-provider';

export const careFilters = [
  'الكل',
  'بانتظار التأكيد',
  'القادمة',
  'قيد العلاج',
  'مكتملة',
  'ملغاة',
] as const;
export type CareFilter = (typeof careFilters)[number];
export type BookingItem = MockBooking | MockBookingRequest;
export type CareItem =
  { kind: 'booking'; record: BookingItem } | { kind: 'case'; record: MockCareCase };

export function matchesFilter(item: CareItem, filter: CareFilter) {
  if (filter === 'الكل') return true;
  if (item.kind === 'case') {
    return filter === (item.record.progress >= 100 ? 'مكتملة' : 'قيد العلاج');
  }
  const status = item.record.status;
  if (filter === 'بانتظار التأكيد') return status === 'pending' || status === 'eligibility-review';
  if (filter === 'القادمة') return status === 'confirmed' && isUpcomingMockBooking(item.record);
  if (filter === 'مكتملة') return status === 'completed';
  return filter === 'ملغاة' && status === 'cancelled';
}
