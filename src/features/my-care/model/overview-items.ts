import type { MockBooking } from '@/features/booking/mocks/bookings.mock';
import type { MockCareCase } from '@/features/my-care/mocks/care.mock';
import type { MockBookingRequest } from '@/shared/mock/scenario-provider';

/** Booking and clinical cases remain separate domain records. */
export type BookingItem = MockBooking | MockBookingRequest;
export type CareItem =
  | { kind: 'booking'; record: BookingItem }
  | { kind: 'case'; record: MockCareCase };
