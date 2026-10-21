import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { getMockBookingForScenario } from '@/features/booking/mocks/bookings.mock';
import { BookingCard } from '@/features/booking/components/booking-v5-ui';
import { CareV5Badge, CareV5Header } from '@/features/my-care/components/care-v5-ui';
import { AppIcon, AppText, Button, Screen, StateView } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

export function BookingDetailScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const { scenario, bookingRequests } = useMockScenario();
  const booking =
    bookingRequests.find((request) => request.id === bookingId) ??
    getMockBookingForScenario(bookingId, scenario);
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

  const actionDeadlineLabel =
    'actionDeadlineLabel' in booking && typeof booking.actionDeadlineLabel === 'string'
      ? booking.actionDeadlineLabel
      : undefined;
  const isConfirmed = booking.status === 'confirmed';
  const isClosed = booking.status === 'completed' || booking.status === 'cancelled';
  const isSessionRequest = bookingRequests.some((request) => request.id === booking.id);
  const hasAlternative =
    booking.id === 'booking-001' &&
    scenario.flags?.bookingAlternative === true &&
    booking.status === 'pending';
  const canReschedule = isConfirmed && !isSessionRequest;
  const canCancel =
    !isClosed &&
    !isSessionRequest &&
    'cancellationConsequence' in booking &&
    Boolean(booking.cancellationConsequence);
  const canManage = canReschedule || canCancel || hasAlternative;
  const tone =
    booking.status === 'cancelled'
      ? 'danger'
      : isConfirmed || booking.status === 'completed'
        ? 'success'
        : 'warning';

  return (
    <Screen contentClassName="px-0 py-0">
      <CareV5Header
        leftIcon={canManage ? 'more' : 'calendar'}
        onLeftPress={canManage ? () => setActionsOpen(true) : undefined}
        title="تفاصيل الحجز"
      />

      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-[120px] pt-2"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-3 rounded-[16px] border border-border-subtle bg-surface-default p-3.5">
          <View className="flex-row-reverse items-center justify-between gap-2">
            <AppText align="right" variant="caption" className="text-content-secondary">
              {isConfirmed ? 'موعدك المؤكد' : isClosed ? 'الحجز في السجل' : 'طلب موعد'}
            </AppText>
            <CareV5Badge label={booking.statusLabel} tone={tone} />
          </View>
          <AppText align="right" variant="heading-3" className="font-ui-bold">
            {booking.serviceName}
          </AppText>
          <View className="flex-row-reverse items-center gap-2.5">
            <View className="h-11 w-11 items-center justify-center rounded-[12px] bg-action-subtle">
              <AppIcon
                name={{
                  ios: 'person.crop.circle',
                  android: 'person_outline',
                  web: 'person_outline',
                }}
                size={21}
                tone="action"
              />
            </View>
            <View className="min-w-0 flex-1 items-end gap-0.5">
              <AppText align="right" variant="label" className="font-ui-semibold">
                {booking.providerName}
              </AppText>
              <AppText align="right" variant="caption" className="text-content-secondary">
                {booking.branch}
              </AppText>
            </View>
          </View>
          <View className="flex-row-reverse gap-2 border-t border-border-subtle pt-3">
            <View className="min-w-0 flex-1 items-end gap-1 rounded-[12px] bg-surface-subtle p-3">
              <AppIcon
                name={{ ios: 'calendar', android: 'event', web: 'event' }}
                tone="secondary"
                size={18}
              />
              <AppText align="right" variant="caption" className="text-content-secondary">
                التاريخ {isConfirmed ? 'المؤكد' : 'المطلوب'}
              </AppText>
              <AppText align="right" variant="label" className="font-ui-bold">
                {booking.dateLabel}
              </AppText>
            </View>
            <View className="min-w-0 flex-1 items-end gap-1 rounded-[12px] bg-surface-subtle p-3">
              <AppIcon
                name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
                tone="secondary"
                size={18}
              />
              <AppText align="right" variant="caption" className="text-content-secondary">
                الوقت {isConfirmed ? 'المؤكد' : 'المطلوب'}
              </AppText>
              <AppText align="right" variant="label" className="font-ui-bold">
                {booking.timeLabel}
              </AppText>
            </View>
          </View>
        </View>
        <View
          className={`mt-3 gap-2 rounded-[13px] p-3 ${booking.status === 'cancelled' ? 'bg-tone-danger-fill' : isConfirmed || booking.status === 'completed' ? 'bg-tone-success-fill' : 'bg-tone-warning-fill'}`}
        >
          <View className="flex-row-reverse items-center gap-2">
            <AppIcon
              name={{
                ios: isConfirmed ? 'checkmark.circle' : 'info.circle',
                android: isConfirmed ? 'check_circle' : 'info',
                web: isConfirmed ? 'check_circle' : 'info',
              }}
              tone={
                booking.status === 'cancelled'
                  ? 'danger'
                  : isConfirmed || booking.status === 'completed'
                    ? 'success'
                    : 'warning'
              }
              size={19}
            />
            <AppText align="right" variant="label" className="min-w-0 flex-1 font-ui-bold">
              {isConfirmed
                ? 'العيادة أكدت موعدك'
                : isClosed
                  ? 'الحجز محفوظ في السجل'
                  : 'الطلب بانتظار قرار العيادة'}
            </AppText>
          </View>
          <AppText align="right" variant="caption" className="text-content-secondary">
            {booking.note ?? 'لا تعتبر الموعد مؤكداً قبل وصول قرار العيادة.'}
          </AppText>
          {actionDeadlineLabel ? (
            <AppText
              align="right"
              variant="caption"
              className="font-ui-semibold text-tone-warning-text"
            >
              {actionDeadlineLabel}
            </AppText>
          ) : null}
        </View>
        <BookingCard className="mt-3 gap-2 rounded-[14px] p-3">
          <AppText align="right" variant="label" className="font-ui-bold">
            معلومات الحجز
          </AppText>
          <View className="flex-row-reverse items-center justify-between gap-2">
            <AppText align="right" variant="caption" className="text-content-secondary">
              المريض
            </AppText>
            <AppText align="left" variant="label" className="min-w-0 flex-1 font-ui-semibold">
              {booking.patientName}
            </AppText>
          </View>
          <View className="flex-row-reverse items-center justify-between gap-2 border-t border-border-subtle pt-2">
            <AppText align="right" variant="caption" className="text-content-secondary">
              السعر المعروض
            </AppText>
            <AppText direction="ltr" variant="label" className="font-ui-semibold">
              {booking.priceLabel}
            </AppText>
          </View>
          <AppText align="right" variant="caption" className="text-content-secondary">
            السعر عند طلب الموعد لا يمثل موافقة على خطة علاجية لاحقة.
          </AppText>
        </BookingCard>
        {'patientNote' in booking &&
        typeof booking.patientNote === 'string' &&
        booking.patientNote.trim() ? (
          <BookingCard className="mt-3 gap-1 rounded-[14px] p-3">
            <AppText align="right" variant="label" className="font-ui-semibold">
              ملاحظتك عند الحجز
            </AppText>
            <AppText align="right" variant="caption" className="text-content-secondary">
              {booking.patientNote}
            </AppText>
          </BookingCard>
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
            label={
              isConfirmed ? 'عرض تأكيد الحجز' : isClosed ? 'عرض حالة الحجز' : 'متابعة حالة الطلب'
            }
            onPress={() =>
              router.push({
                pathname: '/booking/[bookingId]/status',
                params: { bookingId: booking.id },
              })
            }
          />
        </View>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={() => setActionsOpen(false)}
        transparent
        visible={actionsOpen && canManage}
      >
        <Pressable className="flex-1 justify-end bg-black/30" onPress={() => setActionsOpen(false)}>
          <Pressable
            className="rounded-t-[22px] bg-surface-default px-4 pb-6 pt-4"
            onPress={(event) => event.stopPropagation()}
          >
            <View className="mx-auto w-full max-w-[430px] gap-2">
              <AppText align="right" className="font-ui-bold" variant="label">
                إدارة الموعد
              </AppText>
              {hasAlternative ? (
                <Button
                  label="الرد على الموعد البديل"
                  onPress={() => {
                    setActionsOpen(false);
                    router.push({
                      pathname: '/booking/[bookingId]/alternative',
                      params: { bookingId },
                    });
                  }}
                  variant="outline"
                />
              ) : null}
              {canReschedule ? (
                <Button
                  label="طلب إعادة الجدولة"
                  onPress={() => {
                    setActionsOpen(false);
                    router.push({
                      pathname: '/booking/[bookingId]/reschedule',
                      params: { bookingId },
                    });
                  }}
                  variant="secondary"
                />
              ) : null}
              {canCancel ? (
                <Button
                  label="طلب إلغاء الحجز"
                  onPress={() => {
                    setActionsOpen(false);
                    router.push({ pathname: '/booking/[bookingId]/cancel', params: { bookingId } });
                  }}
                  variant="destructive"
                />
              ) : null}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
