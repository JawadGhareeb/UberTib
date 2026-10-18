import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { getMockBookingForScenario } from '@/features/booking/mocks/bookings.mock';
import { BookingCard, BookingStatusBanner } from '@/features/booking/components/booking-v5-ui';
import {
  CareV5Badge,
  CareV5Header,
} from '@/features/my-care/components/care-v5-ui';
import { AppText, Button, Screen, StateView } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

export function BookingDetailScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const { scenario, bookingRequests } = useMockScenario();
  const booking = bookingRequests.find((request) => request.id === bookingId)
    ?? getMockBookingForScenario(bookingId, scenario);
  const [actionsOpen, setActionsOpen] = useState(false);

  if (!bookingId || !booking) {
    return (
      <Screen>
        <StateView
          actionLabel="العودة للمواعيد"
          onAction={() => router.replace('/booking')}
          title="الحجز غير موجود"
        />
      </Screen>
    );
  }

  const actionDeadlineLabel = 'actionDeadlineLabel' in booking && typeof booking.actionDeadlineLabel === 'string' ? booking.actionDeadlineLabel : undefined;
  const isConfirmed = booking.status === 'confirmed';
  const isClosed = booking.status === 'completed' || booking.status === 'cancelled';
  const isSessionRequest = bookingRequests.some((request) => request.id === booking.id);
  const hasAlternative = booking.id === 'booking-001' &&
    scenario.flags?.bookingAlternative === true && booking.status === 'pending';
  const tone = booking.status === 'cancelled'
    ? 'danger'
    : isConfirmed || booking.status === 'completed' ? 'success' : 'warning';

  return (
    <Screen contentClassName="px-0 py-0">
      <CareV5Header
        leftIcon="more"
        onLeftPress={!isClosed && !isSessionRequest ? () => setActionsOpen(true) : undefined}
        title="تفاصيل الحجز"
      />

      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-[120px] pt-2"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-[14px] border border-action-primary/55 bg-action-subtle p-3">
          <View className="flex-row items-center justify-between gap-2">
            <CareV5Badge label={booking.statusLabel} tone={tone} />
            <AppText align="right" className="min-w-0 flex-1 font-ui-bold" numberOfLines={2} variant="body-strong">
              {booking.serviceName}
            </AppText>
          </View>
          <AppText align="right" className="mt-1 text-content-secondary" style={{ fontSize: 10.5, lineHeight: 17 }} variant="caption">
            {booking.providerName} · {booking.branch}
          </AppText>
          <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
            {booking.patientName} · {booking.dateLabel} · {booking.timeLabel}
          </AppText>
        </View>

        <BookingCard className="mt-2 gap-[7px] p-3">
          <AppText align="right" className="font-ui-bold" variant="label">
            تفاصيل الموعد
          </AppText>
          {[
            ['الخدمة', booking.serviceName],
            ['الطبيب', booking.providerName],
            ['الفرع', booking.branch],
            ['المريض', booking.patientName],
            ['التاريخ', booking.dateLabel],
            ['الوقت', booking.timeLabel],
            ['السعر المعروض', booking.priceLabel],
          ].map(([label, value]) => (
            <View className="flex-row items-center justify-between gap-2 rounded-[9px] bg-surface-subtle px-3 py-2" key={label}>
              <AppText align="left" className="min-w-0 flex-1 font-ui-semibold" numberOfLines={2} variant="caption">
                {value}
              </AppText>
              <AppText align="right" className="text-content-secondary" variant="caption">
                {label}
              </AppText>
            </View>
          ))}
        </BookingCard>

        {'patientNote' in booking && typeof booking.patientNote === 'string' && booking.patientNote.trim() ? (
          <BookingCard className="mt-2 p-3">
            <AppText align="right" className="font-ui-semibold text-content-primary" variant="label">
              ملاحظة المريض عند الحجز
            </AppText>
            <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
              {booking.patientNote}
            </AppText>
          </BookingCard>
        ) : null}

        <BookingStatusBanner
          title={isConfirmed ? 'موعد مؤكّد' : isClosed ? 'الحجز محفوظ في السجل' : 'الطلب لم يتأكد بعد'}
          body={booking.note ?? 'تابع حالة الحجز؛ لا تعتبر الموعد مؤكداً قبل وصول قرار العيادة.'}
          tone={booking.status === 'cancelled' ? 'danger' : isConfirmed || booking.status === 'completed' ? 'info' : 'warning'}
        />

        {actionDeadlineLabel ? (
          <View className="mt-2 rounded-[10px] bg-tone-warning-fill p-3">
            <AppText align="right" className="text-tone-warning-text" variant="caption">
              {actionDeadlineLabel}
            </AppText>
          </View>
        ) : null}

        {hasAlternative ? (
          <Button
            className="mt-3"
            label="مراجعة الموعد البديل"
            onPress={() =>
              router.push({
                pathname: '/booking/[bookingId]/alternative',
                params: { bookingId: booking.id },
              })
            }
          />
        ) : null}

      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-surface-canvas px-4 pb-2 pt-2">
        <View className="mx-auto w-full max-w-[430px] gap-2">
          <Button
            label={isConfirmed ? 'عرض تأكيد الحجز' : isClosed ? 'عرض حالة الحجز' : 'متابعة حالة الطلب'}
            onPress={() =>
              router.push({
                pathname: '/booking/[bookingId]/status',
                params: { bookingId: booking.id },
              })
            }
          />
          <Button
            label="عرض حالاتي العلاجية"
            onPress={() => router.push('/(tabs)/care')}
            size="sm"
            variant="outline"
          />
        </View>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={() => setActionsOpen(false)}
        transparent
        visible={actionsOpen && !isSessionRequest}
      >
        <Pressable className="flex-1 justify-end bg-black/30" onPress={() => setActionsOpen(false)}>
          <Pressable
            className="rounded-t-[22px] bg-surface-default px-4 pb-6 pt-4"
            onPress={(event) => event.stopPropagation()}
          >
            <View className="mx-auto w-full max-w-[430px] gap-2">
              <AppText align="right" className="font-ui-bold" variant="label">إدارة الموعد</AppText>
              {hasAlternative ? (
                <Button
                  label="الرد على الموعد البديل"
                  onPress={() => {
                    setActionsOpen(false);
                    router.push({ pathname: '/booking/[bookingId]/alternative', params: { bookingId } });
                  }}
                  variant="outline"
                />
              ) : null}
              <Button
                label="إعادة جدولة الموعد"
                onPress={() => {
                  setActionsOpen(false);
                  router.push({ pathname: '/booking/[bookingId]/reschedule', params: { bookingId } });
                }}
                variant="secondary"
              />
              <Button
                label="إلغاء الحجز"
                onPress={() => {
                  setActionsOpen(false);
                  router.push({ pathname: '/booking/[bookingId]/cancel', params: { bookingId } });
                }}
                variant="destructive"
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
