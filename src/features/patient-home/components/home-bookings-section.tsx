import { useRouter } from 'expo-router';
import { Card as HeroCard } from 'heroui-native';
import { Pressable, View } from 'react-native';
import type { MockBooking } from '@/features/booking/mocks/bookings.mock';
import { CenteredActionIcon } from '@/shared/components/ui/centered-action-icon';
import { AppIcon, AppText } from '@/shared/components/ui';
import { BookingRow } from '@/features/my-care/components/booking-overview-card';
import { SectionTitle } from './home-section-title';

export function HomeUpcomingBookings({ upcomingBookings }: { upcomingBookings: MockBooking[] }) {
  const router = useRouter();
  return (
    <>
      {upcomingBookings.length > 0 ? (
        <View className="gap-2.5">
          <SectionTitle
            title="مواعيدك القادمة"
            action="عرض الكل"
            onAction={() => router.push({ pathname: '/(tabs)/care', params: { tab: 'bookings' } })}
          />
          {upcomingBookings.slice(0, 3).map((item) => (
            <BookingRow
              key={item.id}
              item={item}
              onPress={() =>
                router.push({
                  pathname: '/booking/[bookingId]',
                  params: { bookingId: item.id },
                })
              }
            />
          ))}
        </View>
      ) : null}
    </>
  );
}

export function HomePendingRequests({ pendingCount }: { pendingCount: number }) {
  const router = useRouter();
  return (
    <>
      {pendingCount > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="متابعة طلبات الحجز قيد التأكيد"
          onPress={() => router.push('/(tabs)/care')}
        >
          <HeroCard
            variant="default"
            className="rounded-[16px] border border-border-subtle bg-surface-default px-3 py-3"
          >
            <View className="flex-row-reverse items-center gap-3">
              <CenteredActionIcon name="clock" frameSize={44} iconSize={22} warning />
              <View className="min-w-0 flex-1 items-end gap-1">
                <AppText align="right" variant="label" className="font-ui-semibold">
                  بانتظار تأكيد العيادة
                </AppText>
                <AppText align="right" variant="caption">
                  {pendingCount} طلب حجز غير مؤكّد
                </AppText>
              </View>
              <AppIcon
                name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                size={18}
                tone="secondary"
              />
            </View>
          </HeroCard>
        </Pressable>
      ) : null}
    </>
  );
}
