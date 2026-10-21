import type { MockScenarioDefinition } from '@/shared/mock';

export type MockBookingStatus =
  'confirmed' | 'pending' | 'eligibility-review' | 'cancelled' | 'completed';

export interface MockBooking {
  id: string;
  serviceCode: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  branch: string;
  patientName: string;
  dateLabel: string;
  timeLabel: string;
  priceLabel: string;
  status: MockBookingStatus;
  /** ISO local date; display labels alone are not sortable. */
  dateKey?: string;
  statusLabel: string;
  note?: string;
  cancellationConsequence?: string;
  closureReasonCode?: 'ALTERNATIVE_EXPIRED' | 'PROVIDER_ELIGIBILITY_SUSPENDED';
  eligibilityReviewDueLabel?: string;
  actionDeadlineLabel?: string;
}

export const mockBookings: MockBooking[] = [
  {
    id: 'booking-001',
    serviceCode: 'dental-checkup',
    serviceName: 'فحص الأسنان',
    providerId: 'provider-layan',
    providerName: 'د. ليان يوسف',
    branch: 'مركز نور الأسنان',
    patientName: 'أحمد خالد',
    dateKey: '2026-10-24',
    dateLabel: 'السبت 24 تشرين الأول 2026',
    timeLabel: '10:30 ص',
    priceLabel: '1,250 ل.س',
    status: 'confirmed',
    statusLabel: 'مؤكد',
    note: 'يفضل الوصول قبل الموعد بـ10 دقائق.',
    cancellationConsequence:
      'إلغاء هذا الحجز يلغي الموعد الحالي فقط. لا يوجد أثر مالي مسجل على هذا الحجز، وأي موعد جديد يحتاج طلباً جديداً.',
  },
  {
    id: 'booking-002',
    serviceCode: 'dental-cleaning',
    serviceName: 'تنظيف الأسنان',
    providerId: 'provider-rama',
    providerName: 'د. راما بركات',
    branch: 'عيادات الجميلية',
    patientName: 'أحمد خالد',
    dateKey: '2026-08-28',
    dateLabel: '28 آب 2026',
    timeLabel: '12:30 م',
    priceLabel: '1,750 ل.س',
    status: 'completed',
    statusLabel: 'مكتمل',
  },
  {
    id: 'booking-003',
    serviceCode: 'dental-cleaning',
    serviceName: 'تنظيف الأسنان',
    providerId: 'provider-layan',
    providerName: 'د. ليان يوسف',
    branch: 'مركز نور الأسنان',
    patientName: 'أحمد خالد',
    dateKey: '2026-10-26',
    dateLabel: 'الاثنين 26 تشرين الأول 2026',
    timeLabel: '10:30 ص',
    priceLabel: '1,900 ل.س',
    status: 'confirmed',
    statusLabel: 'مؤكد',
    note: 'تم تأكيد جلسة التنظيف؛ يرجى الحضور قبل الموعد بعشر دقائق.',
  },
  {
    id: 'booking-004',
    serviceCode: 'dental-checkup',
    serviceName: 'فحص الأسنان',
    providerId: 'provider-yazan',
    providerName: 'د. يزن حلاق',
    branch: 'مركز الأعظمية الطبي',
    patientName: 'أحمد خالد',
    dateKey: '2026-10-27',
    dateLabel: 'الثلاثاء 27 تشرين الأول 2026',
    timeLabel: '9:30 ص',
    priceLabel: '1,150 ل.س',
    status: 'pending',
    statusLabel: 'قيد التأكيد',
    note: 'العيادة لم تؤكد هذا الموعد بعد.',
  },
  {
    id: 'booking-005',
    serviceCode: 'dental-filling',
    serviceName: 'حشوة سن',
    providerId: 'provider-omar',
    providerName: 'د. عمر الأحمد',
    branch: 'مركز الفرقان التخصصي',
    patientName: 'أحمد خالد',
    dateKey: '2026-09-21',
    dateLabel: 'الاثنين 21 أيلول 2026',
    timeLabel: '11:00 ص',
    priceLabel: '2,500 ل.س',
    status: 'completed',
    statusLabel: 'مكتمل',
    note: 'تم إنهاء الزيارة، والتفاصيل العلاجية محفوظة في ملف الحالة.',
  },
  {
    id: 'booking-006',
    serviceCode: 'root-canal',
    serviceName: 'علاج الجذور',
    providerId: 'provider-karim',
    providerName: 'د. كريم حمدان',
    branch: 'عيادات الشفاء',
    patientName: 'أحمد خالد',
    dateKey: '2026-10-22',
    dateLabel: 'الخميس 22 تشرين الأول 2026',
    timeLabel: '10:30 ص',
    priceLabel: '750 ل.س',
    status: 'confirmed',
    statusLabel: 'مؤكد',
    note: 'موعد منفصل، لا يرتبط تلقائياً بأي حالة علاجية.',
  },
  {
    id: 'booking-007',
    serviceCode: 'teeth-whitening',
    serviceName: 'تبييض الأسنان',
    providerId: 'provider-rama',
    providerName: 'د. راما بركات',
    branch: 'عيادات الجميلية',
    patientName: 'أحمد خالد',
    dateKey: '2026-10-24',
    dateLabel: 'السبت 24 تشرين الأول 2026',
    timeLabel: '9:00 ص',
    priceLabel: '4,750 ل.س',
    status: 'cancelled',
    statusLabel: 'ملغى',
    note: 'تم إلغاء هذا الموعد؛ لا يُعد قابلاً للحضور.',
    cancellationConsequence: 'لا توجد دفعة مثبتة عليه في بيانات التجربة.',
  },
];

export const mockAlternativeAppointment = {
  bookingId: 'booking-001',
  providerId: 'provider-layan',
  serviceCode: 'dental-checkup',
  requestedDateLabel: 'السبت 24 تشرين الأول',
  requestedTimeLabel: '10:30 ص',
  proposedDateLabel: 'الأحد 25 تشرين الأول',
  proposedTimeLabel: '12:00 م',
  decisionDeadlineLabel: '23 تشرين الأول · 8:00 م',
  reason: 'تعديل على جدول العيادة.',
} as const;

export function getMockBookingsForScenario(scenario: MockScenarioDefinition): MockBooking[] {
  if (scenario.flags?.bookingEligibilityCancelled) {
    return mockBookings.map((booking, index) =>
      index === 0
        ? {
            ...booking,
            status: 'cancelled',
            statusLabel: 'أُلغي بدون عقوبة',
            closureReasonCode: 'PROVIDER_ELIGIBILITY_SUSPENDED',
            note: 'لم تُستعد أهلية مقدم الخدمة قبل مهلة المراجعة، لذلك أُلغي الموعد تلقائياً. لا توجد عقوبة على المريض.',
            cancellationConsequence:
              'يمكنك اختيار مقدم خدمة أو موعد جديد. الحجز الملغى يبقى محفوظاً كسجل ولا يعود للحالة المؤكدة.',
          }
        : booking,
    );
  }

  if (scenario.flags?.bookingEligibilityRestored) {
    return mockBookings.map((booking, index) =>
      index === 0
        ? {
            ...booking,
            status: 'confirmed',
            statusLabel: 'مؤكد بعد المراجعة',
            note: 'اكتملت مراجعة الأهلية بقرار جديد صالح، وعاد الموعد للحالة المؤكدة ويمكن حضوره.',
          }
        : booking,
    );
  }

  if (scenario.flags?.bookingAlternativeExpired) {
    return mockBookings.map((booking, index) =>
      index === 0
        ? {
            ...booking,
            status: 'cancelled',
            statusLabel: 'الموعد لم يتأكد',
            closureReasonCode: 'ALTERNATIVE_EXPIRED',
            note: 'انتهت مهلة قبول الموعد البديل، لذلك أغلق طلب الحجز بدون تأكيد. ما في أي عقوبة على المريض.',
            cancellationConsequence:
              'يمكنك إرسال طلب حجز جديد لوقت أو مقدم خدمة آخر. الاقتراح السابق ما عاد قابل للقبول.',
          }
        : booking,
    );
  }

  if (scenario.flags?.bookingEligibilityReview) {
    return mockBookings.map((booking, index) =>
      index === 0
        ? {
            ...booking,
            status: 'eligibility-review',
            statusLabel: 'تحت مراجعة الأهلية',
            eligibilityReviewDueLabel: 'يجب حسم المراجعة قبل ساعتين من الموعد',
            actionDeadlineLabel: 'القرار المتوقع قبل الموعد بساعتين',
            note: 'تم تعليق قابلية حضور الموعد مؤقتاً بعد تغيّر أهلية مقدم الخدمة. لا تتوجه للموعد قبل تحديث الحالة.',
          }
        : booking,
    );
  }

  if (scenario.flags?.bookingAlternative) {
    return mockBookings.map((booking, index) =>
      index === 0
        ? {
            ...booking,
            status: 'pending',
            statusLabel: 'بانتظار قرارك على البديل',
            actionDeadlineLabel: `مهلة القرار: ${mockAlternativeAppointment.decisionDeadlineLabel}`,
            note: 'الموعد المطلوب أصلاً لم يتم تأكيده. العيادة اقترحت وقتاً بديلاً ضمن مهلة محددة.',
          }
        : booking,
    );
  }

  if (scenario.flags?.bookingPending) {
    return mockBookings.map((booking, index) =>
      index === 0
        ? {
            ...booking,
            status: 'pending',
            statusLabel: 'قيد التأكيد',
            actionDeadlineLabel: 'الرد المتوقع خلال 30 دقيقة',
            note: 'تم إرسال طلب الحجز، والعيادة عم تراجع توفر الموعد قبل التأكيد النهائي.',
          }
        : booking,
    );
  }

  return mockBookings;
}

export function getMockBookingForScenario(
  bookingId: string | undefined,
  scenario: MockScenarioDefinition,
): MockBooking | undefined {
  return getMockBookingsForScenario(scenario).find((booking) => booking.id === bookingId);
}

export function getMockBooking(bookingId?: string): MockBooking | undefined {
  return mockBookings.find((booking) => booking.id === bookingId);
}
/** Only future confirmed slots are real upcoming visits; pending requests are not appointments. */
export function isUpcomingMockBooking(
  booking: Pick<MockBooking, 'status' | 'dateKey'>,
  today: Date = new Date(),
): boolean {
  if (booking.status !== 'confirmed' || !booking.dateKey) return false;
  const [year, month, day] = booking.dateKey.split('-').map(Number);
  if (!year || !month || !day) return false;
  return new Date(year, month - 1, day, 23, 59, 59).getTime() >= today.getTime();
}
