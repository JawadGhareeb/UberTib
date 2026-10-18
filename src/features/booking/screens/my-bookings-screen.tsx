import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { BookingCaseCard } from '@/features/booking/components/booking-case-card';
import {
  getMockBookingsForScenario,
  type MockBooking,
} from '@/features/booking/mocks/bookings.mock';
import {
  CareFilterTabs,
  CareV5Badge,
  CareV5BottomNav,
  CareV5Header,
} from '@/features/my-care/components/care-v5-ui';
import { AppText, Screen } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

const filters = ['الكل', 'قادمة', 'مكتملة', 'ملغاة'] as const;
type BookingFilter = (typeof filters)[number];

function bookingFilter(booking: MockBooking): Exclude<BookingFilter, 'الكل'> {
  if (booking.status === 'completed') return 'مكتملة';
  if (booking.status === 'cancelled') return 'ملغاة';
  return 'قادمة';
}

export function MyBookingsScreen({ showBottomNav = true }: { showBottomNav?: boolean }) {
  const router = useRouter();
  const { scenario, bookingRequests } = useMockScenario();
  const [filter, setFilter] = useState<BookingFilter>('الكل');
  // Use canonical booking IDs/data rather than a separate visual-only case list.
  const bookings = [...bookingRequests, ...getMockBookingsForScenario(scenario)];
  const visibleBookings =
    filter === 'الكل' ? bookings : bookings.filter((booking) => bookingFilter(booking) === filter);
  const upcomingCount = bookings.filter((booking) => bookingFilter(booking) === 'قادمة').length;

  return (
    <Screen contentClassName="px-0 py-0">
      <CareV5Header leftIcon="calendar" right="bell" title="حجوزاتي" />
      <ScrollView
        contentContainerClassName={showBottomNav
          ? "mx-auto w-full max-w-[430px] px-4 pb-[86px] pt-[7px]"
          : "mx-auto w-full max-w-[430px] px-4 pb-4 pt-[7px]"}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between gap-3">
          <CareV5Badge label={`${upcomingCount} حجوزات قادمة`} />
          <View className="min-w-0 flex-1 items-end">
            <AppText align="right" className="font-ui-bold" variant="heading-4">
              مواعيدي وحجوزاتي
            </AppText>
          </View>
        </View>

        <CareFilterTabs
          iconPlacement="inline"
          items={filters}
          onChange={(next) => setFilter(next as BookingFilter)}
          selected={filter}
        />

        <View className="mt-[7px] gap-[7px]">
          {visibleBookings.map((booking) => {
            const tone =
              booking.status === 'pending' || booking.status === 'eligibility-review'
                ? 'warning'
                : booking.status === 'completed'
                  ? 'primary'
                  : 'info';
            return (
              <BookingCaseCard
                careCase={{
                  id: booking.id,
                  bookingId: booking.id,
                  title: booking.serviceName,
                  meta: `${booking.providerName} · ${booking.branch} · ${booking.patientName}`,
                  status: booking.statusLabel,
                  tone,
                  amount: booking.priceLabel,
                  note: booking.note ?? `${booking.dateLabel} · ${booking.timeLabel}`,
                  completedSteps: booking.status === 'completed' ? 4
                    : booking.status === 'confirmed' ? 2
                    : booking.status === 'cancelled' ? 0 : 1,
                }}
                key={booking.id}
                onPress={() =>
                  router.push({
                    pathname: '/booking/[bookingId]',
                    params: { bookingId: booking.id },
                  })
                }
              />
            );
          })}
          {visibleBookings.length === 0 ? (
            <View className="items-center rounded-[12px] bg-surface-default px-4 py-6">
              <AppText align="center" className="font-ui-semibold" variant="label">
                ما في حجوزات ضمن هذا التصنيف
              </AppText>
            </View>
          ) : null}
        </View>

      </ScrollView>
      {showBottomNav ? <CareV5BottomNav active="bookings" /> : null}
    </Screen>
  );
}
