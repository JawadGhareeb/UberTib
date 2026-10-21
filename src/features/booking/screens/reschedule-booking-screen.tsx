import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { KeyboardResponsiveScrollView } from '@/shared/components/ui/keyboard-responsive-scroll-view';

import {
  BookingCard,
  BookingHeader,
  BookingStatusBanner,
} from '@/features/booking/components/booking-v5-ui';
import { getMockBookingForScenario } from '@/features/booking/mocks/bookings.mock';
import { getMockProvider } from '@/features/discovery/mocks/providers.mock';
import {
  AppText,
  Button,
  ConfirmationDialog,
  Screen,
  StateView,
  TextField,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { cn } from '@/shared/utils/cn';

export function RescheduleBookingScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const { getBookingMutation, scenario, submitBookingReschedule } = useMockScenario();
  const booking = getMockBookingForScenario(bookingId, scenario);
  const provider = getMockProvider(booking?.providerId);
  const pendingProposal = getBookingMutation(bookingId)?.reschedule;
  const [dateKey, setDateKey] = useState(provider?.availability[0]?.dateKey ?? '');
  const [slot, setSlot] = useState('');
  const [reason, setReason] = useState('');
  const [confirmingReschedule, setConfirmingReschedule] = useState(false);

  const selectedDay = useMemo(
    () => provider?.availability.find((day) => day.dateKey === dateKey),
    [dateKey, provider],
  );

  if (!booking || !provider || !bookingId) {
    return (
      <Screen>
        <StateView actionLabel="العودة" onAction={() => router.back()} title="الحجز غير موجود" />
      </Screen>
    );
  }

  if (pendingProposal) {
    return (
      <Screen contentClassName="px-0 py-0" keyboardAvoiding={false}>
        <BookingHeader subtitle="قيد الرد" title="إعادة الجدولة" />
        <View className="mx-auto w-full max-w-[390px] flex-1 justify-center px-4">
          <BookingStatusBanner
            body="الموعد الحالي ما زال هو المرجع، وما رح يتغير قبل اعتماد الاقتراح بشكل مؤكد."
            title="اقتراح تغيير الموعد قيد الرد"
            tone="warning"
          />

          <BookingCard className="mt-3 p-3">
            <AppText className="text-type-caption text-content-secondary" variant="caption">
              الموعد الحالي
            </AppText>
            <AppText direction="ltr" className="mt-1 font-ui-bold text-type-label">
              {booking.dateLabel} · {booking.timeLabel}
            </AppText>
          </BookingCard>

          <BookingCard className="mt-2 border-state-selected-border bg-action-subtle p-3">
            <AppText className="text-type-caption text-content-link" variant="caption">
              الموعد المقترح
            </AppText>
            <AppText
              direction="ltr"
              className="mt-1 font-ui-bold text-type-label text-content-link"
            >
              {pendingProposal.proposedDateLabel} · {pendingProposal.proposedTimeLabel}
            </AppText>
          </BookingCard>

          <Button
            className="mt-5"
            label="العودة لتفاصيل الحجز"
            onPress={() =>
              router.replace({
                pathname: '/booking/[bookingId]',
                params: { bookingId },
              })
            }
          />
        </View>
      </Screen>
    );
  }

  if (booking.status !== 'confirmed') {
    return (
      <Screen>
        <StateView
          actionLabel="العودة للحجز"
          description="إعادة الجدولة متاحة للحجز المؤكد فقط."
          onAction={() => router.back()}
          title="إعادة الجدولة غير متاحة"
        />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <BookingHeader subtitle="تعديل الموعد" title="إعادة الجدولة" />

      <KeyboardResponsiveScrollView
                  bottomOffset={16}
        contentContainerClassName="mx-auto w-full max-w-[390px] px-4 pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BookingStatusBanner
          body={`${booking.dateLabel} · ${booking.timeLabel} — ${booking.providerName}`}
          title="الموعد الحالي ما زال هو المرجع"
          tone="success"
        />

        <View className="mt-4">
          <AppText className="font-ui-bold text-type-label">اختر اليوم المقترح</AppText>
          <ScrollView
            className="mt-2"
            contentContainerClassName="gap-2"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {provider.availability.map((day) => {
              const selected = day.dateKey === dateKey;

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  className={cn(
                    'h-[58px] min-w-[96px] items-center justify-center rounded-[12px] border px-3',
                    selected
                      ? 'border-action-primary bg-action-subtle'
                      : 'border-border-default bg-surface-default',
                  )}
                  key={day.dateKey}
                  onPress={() => {
                    setDateKey(day.dateKey);
                    setSlot('');
                  }}
                >
                  <AppText
                    align="center"
                    className={cn(
                      'text-type-caption',
                      selected && 'font-ui-bold text-content-link',
                    )}
                    variant="label"
                  >
                    {day.dateLabel}
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View className="mt-4">
          <AppText className="font-ui-bold text-type-label">الوقت المقترح</AppText>
          <View className="mt-2 flex-row flex-wrap justify-between gap-y-2">
            {selectedDay?.slots.map((time) => {
              const selected = slot === time;

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  className={cn(
                    'h-11 w-[31.5%] items-center justify-center rounded-[11px] border',
                    selected
                      ? 'border-action-primary bg-action-primary'
                      : 'border-border-default bg-surface-default',
                  )}
                  key={time}
                  onPress={() => setSlot(time)}
                >
                  <AppText
                    direction="ltr"
                    className={cn(
                      'text-type-label',
                      selected ? 'font-ui-bold text-content-on-action' : 'text-content-primary',
                    )}
                    variant="label"
                  >
                    {time}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-4">
          <TextField
            label="سبب التغيير (اختياري)"
            multiline
            onChangeText={setReason}
            placeholder="اكتب ملاحظة قصيرة للعيادة"
            value={reason}
          />
        </View>

        <View className="mt-3">
          <BookingStatusBanner
            body="إرسال الاقتراح لا يغيّر الموعد فوراً. الموعد القديم يبقى المرجع حتى تصل النتيجة المؤكدة."
            title="قبل الإرسال"
            tone="info"
          />
        </View>

        <Button
          className="mt-4"
          disabled={!selectedDay || !slot}
          label="إرسال اقتراح الموعد الجديد"
          onPress={() => setConfirmingReschedule(true)}
        />
      </KeyboardResponsiveScrollView>
      <ConfirmationDialog
        visible={confirmingReschedule && !pendingProposal}
        title="إرسال اقتراح الموعد الجديد؟"
        description="سيُرسل الموعد المختار إلى العيادة كمقترح تجريبي، ويبقى الحجز الحالي كما هو حتى يصل رد مؤكد."
        confirmLabel="إرسال الاقتراح"
        onCancel={() => setConfirmingReschedule(false)}
        onConfirm={() => {
          if (!selectedDay || !slot || pendingProposal || booking.status !== 'confirmed') return;
          submitBookingReschedule(bookingId, {
            proposedDateLabel: selectedDay.dateLabel,
            proposedTimeLabel: slot,
          });
          setConfirmingReschedule(false);
        }}
      />
    </Screen>
  );
}
