import { getMockProvider } from '@/features/discovery/mocks/providers.mock';
import { findPenFamily } from '@/features/discovery/presentation/pen-discovery-data';
import {
  bookingCareDraftId,
  type BookingSavedFields,
  type LocalCareDraft,
} from '@/features/my-care/state/care-draft-provider';
export type BookingDraftStep = 'slots' | 'patient' | 'review';
export function createBookingCareDraft(
  data: BookingSavedFields,
  step: BookingDraftStep,
): Omit<LocalCareDraft, 'updatedAt'> {
  const provider = getMockProvider(data.providerId);
  const stage =
    step === 'slots' ? 'اختيار الموعد' : step === 'patient' ? 'تحديد المريض' : 'مراجعة الحجز';
  return {
    id: bookingCareDraftId(data.providerId, data.serviceCode),
    kind: 'booking',
    title: findPenFamily(data.serviceCode)?.title ?? 'حجز موعد',
    detail: [provider?.name ?? 'الطبيب المختار', data.dateLabel, data.timeLabel, stage]
      .filter(Boolean)
      .join(' · '),
    route:
      step === 'slots'
        ? '/booking/slots'
        : step === 'patient'
          ? '/booking/patient'
          : '/booking/review',
    params: {
      providerId: data.providerId,
      serviceCode: data.serviceCode,
      ...(data.dateKey ? { dateKey: data.dateKey } : {}),
      ...(data.dateLabel ? { dateLabel: data.dateLabel } : {}),
      ...(data.timeLabel ? { timeLabel: data.timeLabel } : {}),
      ...(data.patientId ? { patientId: data.patientId } : {}),
      ...(data.origin
        ? {
            origin: data.origin,
            ...(data.assessmentDraftId ? { assessmentDraftId: data.assessmentDraftId } : {}),
          }
        : {}),
    },
    booking: data,
  };
}
