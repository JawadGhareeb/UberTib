import { getMockBookingsForScenario } from '@/features/booking/mocks/bookings.mock';
import { getMockCareCaseForScenario, mockCareCases } from '@/features/my-care/mocks/care.mock';
import { useMockScenario } from '@/shared/mock';
import type { CareItem } from '../model/overview-items';

const isVisibleRead = (state: string) =>
  !['empty-no-data', 'loading-initial', 'error-fetch', 'error-permission'].includes(state);

export function useCareOverviewRecords() {
  const { scenario, bookingRequests, getSurfaceState } = useMockScenario();
  const bookingState = getSurfaceState('booking');
  const careState = getSurfaceState('care');
  const bookings = isVisibleRead(bookingState)
    ? [...bookingRequests, ...getMockBookingsForScenario(scenario)]
    : [];
  const cases =
    isVisibleRead(careState) && !scenario.flags?.emptyNewPatient
      ? mockCareCases.flatMap((item) => {
          const current = getMockCareCaseForScenario(item.id, scenario);
          return current ? [current] : [];
        })
      : [];
  const records: CareItem[] = [
    ...bookings.map((record): CareItem => ({ kind: 'booking', record })),
    ...cases.map((record): CareItem => ({ kind: 'case', record })),
  ];
  return { records, bookingState, careState };
}
