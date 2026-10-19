import { isUpcomingMockBooking } from '@/features/booking/mocks/bookings.mock';
import type { MockCareCase, MockCareStage } from '@/features/my-care/mocks/care.mock';
import type { CareItem } from './overview-items';

export type CareOverviewCounts = {
  activeCases: number;
  completedCases: number;
  upcomingBookings: number;
  pendingBookings: number;
};

export function getCareOverviewCounts(
  records: readonly CareItem[],
  today = new Date(),
): CareOverviewCounts {
  return records.reduce<CareOverviewCounts>(
    (counts, item) => {
      if (item.kind === 'case') {
        if (item.record.progress >= 100) counts.completedCases++;
        else counts.activeCases++;
      } else if (item.record.status === 'pending' || item.record.status === 'eligibility-review') {
        counts.pendingBookings++;
      } else if (isUpcomingMockBooking(item.record, today)) {
        counts.upcomingBookings++;
      }
      return counts;
    },
    { activeCases: 0, completedCases: 0, upcomingBookings: 0, pendingBookings: 0 },
  );
}

export function getCurrentCareStage(careCase: MockCareCase): MockCareStage | undefined {
  return careCase.stages.find((stage) => stage.status === 'current');
}

export function getCareStageSummary(careCase: MockCareCase) {
  const total = careCase.stages.length;
  const finished = careCase.stages.filter((stage) => stage.status === 'completed').length;
  return { finished, total, current: getCurrentCareStage(careCase) };
}

export function partitionCareRecords(records: readonly CareItem[], today = new Date()) {
  const cases = records
    .filter((item): item is Extract<CareItem, { kind: 'case' }> => item.kind === 'case')
    .map((item) => item.record)
    .sort((a, b) => {
      const activeDiff = Number(a.progress >= 100) - Number(b.progress >= 100);
      return activeDiff || a.id.localeCompare(b.id);
    });

  const bookings = records
    .filter((item): item is Extract<CareItem, { kind: 'booking' }> => item.kind === 'booking')
    .map((item) => item.record)
    .sort((a, b) => {
      const priority = (booking: typeof a) =>
        booking.status === 'pending' || booking.status === 'eligibility-review'
          ? 0
          : isUpcomingMockBooking(booking, today)
            ? 1
            : booking.status === 'confirmed'
              ? 2
              : booking.status === 'completed'
                ? 3
                : 4;
      const result = priority(a) - priority(b);
      if (result) return result;
      const firstDate = 'dateKey' in a ? a.dateKey : undefined;
      const secondDate = 'dateKey' in b ? b.dateKey : undefined;
      if (firstDate && secondDate) {
        return priority(a) <= 2
          ? firstDate.localeCompare(secondDate)
          : secondDate.localeCompare(firstDate);
      }
      return a.id.localeCompare(b.id);
    });

  return { cases, bookings };
}
