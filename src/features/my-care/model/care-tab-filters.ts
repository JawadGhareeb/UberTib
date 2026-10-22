import { isUpcomingMockBooking } from '@/features/booking/mocks/bookings.mock';
import type { BookingItem } from './overview-items';
import type { MockCareCase } from '../mocks/care.mock';
import type { LocalCareDraft } from '@/features/my-care/state/care-draft-provider';
import { getDraftCaseDisplay } from './care-draft-display';

export type CareMainTab = 'cases' | 'bookings';
export type CareCaseQuickFilter = 'الكل' | 'قيد العلاج' | 'مكتملة' | 'مسودة';
export type CareBookingQuickFilter = 'الكل' | 'القادمة' | 'بانتظار التأكيد';
export const caseQuickFilters: readonly CareCaseQuickFilter[] = [
  'الكل',
  'قيد العلاج',
  'مكتملة',
  'مسودة',
];
export const bookingQuickFilters: readonly CareBookingQuickFilter[] = [
  'الكل',
  'القادمة',
  'بانتظار التأكيد',
];

export type CaseAdvancedFilters = {
  actionRequired: boolean;
  provider: string;
  clinic: string;
};
export type BookingAdvancedFilters = {
  status: 'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled';
  period: 'all' | 'future' | 'past';
  dateFrom: string | null;
  dateTo: string | null;
  provider: string;
  clinic: string;
  patient: string;
};
export const defaultCaseAdvanced: CaseAdvancedFilters = {
  actionRequired: false,
  provider: '',
  clinic: '',
};
export const defaultBookingAdvanced: BookingAdvancedFilters = {
  status: 'all',
  period: 'all',
  dateFrom: null,
  dateTo: null,
  provider: '',
  clinic: '',
  patient: '',
};

function bookingDateKey(record: BookingItem) {
  return 'dateKey' in record && typeof record.dateKey === 'string' ? record.dateKey : undefined;
}
function todayDateKey(date: Date) {
  const y = date.getFullYear();
  return [
    y,
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function isCaseActionRequired(careCase: MockCareCase): boolean {
  return (
    careCase.progress < 100 &&
    Boolean(careCase.nextAction.trim() && careCase.nextAction !== 'لا يوجد إجراء مطلوب')
  );
}
export function filterCaseRecords(
  records: readonly MockCareCase[],
  quick: CareCaseQuickFilter,
  advanced: CaseAdvancedFilters,
): MockCareCase[] {
  return records
    .filter(
      (careCase) =>
        (quick === 'الكل' ||
          (quick === 'مكتملة'
            ? careCase.progress >= 100
            : quick === 'مسودة'
              ? false
              : careCase.progress < 100)) &&
        (!advanced.actionRequired || isCaseActionRequired(careCase)) &&
        (!advanced.provider || careCase.provider === advanced.provider) &&
        (!advanced.clinic || careCase.branch === advanced.clinic),
    )
    .sort(
      (a, b) =>
        Number(isCaseActionRequired(b)) - Number(isCaseActionRequired(a)) ||
        Number(a.progress >= 100) - Number(b.progress >= 100) ||
        a.id.localeCompare(b.id),
    );
}

/** A draft is a case-list status, not a separate treatment section. */
export function filterDraftCaseRecords(
  drafts: readonly LocalCareDraft[],
  quick: CareCaseQuickFilter,
  advanced: CaseAdvancedFilters,
): LocalCareDraft[] {
  if (quick !== 'الكل' && quick !== 'مسودة') return [];
  return drafts
    .filter((draft) => {
      const { provider, branch } = getDraftCaseDisplay(draft);
      return (
        (!advanced.provider || provider === advanced.provider) &&
        (!advanced.clinic || branch === advanced.clinic)
      );
      // Every unfinished draft has a user action: resume the interrupted flow.
    })
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function filterBookingRecords(
  records: readonly BookingItem[],
  quick: CareBookingQuickFilter,
  advanced: BookingAdvancedFilters,
  now = new Date(),
): BookingItem[] {
  const today = todayDateKey(now);
  return records.filter((booking) => {
    const pending = booking.status === 'pending' || booking.status === 'eligibility-review';
    const upcoming = isUpcomingMockBooking(booking, now);
    const dateKey = bookingDateKey(booking);
    const quickMatches =
      quick === 'الكل' ||
      (quick === 'القادمة' && upcoming) ||
      (quick === 'بانتظار التأكيد' && pending);
    const statusMatches =
      advanced.status === 'all' ||
      (advanced.status === 'pending' ? pending : booking.status === advanced.status);
    const periodMatches =
      (advanced.period === 'all' ||
        (advanced.period === 'future' ? upcoming : Boolean(dateKey && dateKey < today))) &&
      (!advanced.dateFrom || Boolean(dateKey && dateKey >= advanced.dateFrom)) &&
      (!advanced.dateTo || Boolean(dateKey && dateKey <= advanced.dateTo));
    return (
      quickMatches &&
      statusMatches &&
      periodMatches &&
      (!advanced.provider || booking.providerName === advanced.provider) &&
      (!advanced.clinic || booking.branch === advanced.clinic) &&
      (!advanced.patient || booking.patientName === advanced.patient)
    );
  });
}

export function caseAdvancedLabels(filters: CaseAdvancedFilters): string[] {
  return [filters.actionRequired ? 'مطلوب مني إجراء' : '', filters.provider, filters.clinic].filter(
    Boolean,
  );
}
export function bookingAdvancedLabels(filters: BookingAdvancedFilters): string[] {
  const statusLabels = {
    all: '',
    confirmed: 'مؤكد',
    pending: 'بانتظار التأكيد',
    completed: 'مكتمل',
    cancelled: 'ملغى',
  };
  const periodLabels = { all: '', future: 'القادمة', past: 'السابقة' };
  return [
    statusLabels[filters.status],
    periodLabels[filters.period],
    filters.dateFrom ? 'من ' + filters.dateFrom : '',
    filters.dateTo ? 'حتى ' + filters.dateTo : '',
    filters.provider,
    filters.clinic,
    filters.patient,
  ].filter(Boolean);
}
