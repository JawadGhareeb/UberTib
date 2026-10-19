import {
  getMockBookingsForScenario,
  isUpcomingMockBooking,
  type MockBooking,
} from '@/features/booking/mocks/bookings.mock';
import { getMockCareCaseForScenario, mockCareCases } from '@/features/my-care/mocks/care.mock';
import { getMockNeedsAttentionForScenario } from '@/features/platform/mocks/platform.mock';
import { useMockScenario } from '@/shared/mock';

const hasAvailableData = (state: string) =>
  !['empty-no-data', 'error-permission', 'error-fetch', 'loading-initial'].includes(state);

/** Patient Home uses the same records and scenario rules as booking/care screens. */
export function usePatientHomeData() {
  const { scenario, bookingRequests, getSurfaceState } = useMockScenario();
  const bookings = hasAvailableData(getSurfaceState('booking'))
    ? [...bookingRequests, ...getMockBookingsForScenario(scenario)]
    : [];
  const upcomingBookings = bookings
    .filter((item): item is MockBooking => 'dateKey' in item && isUpcomingMockBooking(item))
    .sort((a, b) => (a.dateKey ?? '').localeCompare(b.dateKey ?? ''));
  const pendingCount = bookings.filter(
    (item) => item.status === 'pending' || item.status === 'eligibility-review',
  ).length;
  const activeCases =
    hasAvailableData(getSurfaceState('care')) && !scenario.flags?.emptyNewPatient
      ? mockCareCases
          .flatMap((item) => {
            const current = getMockCareCaseForScenario(item.id, scenario);
            return current ? [current] : [];
          })
          .filter((item) => item.progress < 100)
      : [];
  const attention = hasAvailableData(getSurfaceState('attention'))
    ? getMockNeedsAttentionForScenario(scenario)
        .filter(
          (item) =>
            item.id !== 'attention-booking' &&
            (item.id !== 'attention-follow-up' ||
              scenario.flags?.followUpDue ||
              scenario.flags?.followUpOverdue) &&
            (item.id !== 'attention-submission' || scenario.flags?.representationPending),
        )
        .slice(0, 2)
    : [];
  return {
    upcomingBookings,
    pendingCount,
    activeCases,
    attention,
    homeState: getSurfaceState('home'),
  };
}
