import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { BookingHeader, BookingStatusBanner } from '@/features/booking/components/booking-v5-ui';
import { getMockBookingForScenario } from '@/features/booking/mocks/bookings.mock';
import { AppText, Button, ConfirmationDialog, Screen, StateView, TextField } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

export function CancelBookingScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const { getBookingMutation, scenario, submitBookingCancellation } = useMockScenario();
  const booking = getMockBookingForScenario(bookingId, scenario);
  const mutation = getBookingMutation(bookingId);
  const [reason, setReason] = useState('');
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const cancellationPending = mutation?.cancellation?.status === 'pending';

  if (!booking || !bookingId) {
    return (
      <Screen>
        <StateView actionLabel="العودة" onAction={() => router.back()} title="الحجز غير موجود" />
      </Screen>
    );
  }

  if (cancellationPending) {
    return (
      <Screen contentClassName="px-0 py-0">
        <BookingHeader showBack={false} subtitle="قيد المعالجة" title="طلب الإلغاء" />
        <View className="mx-auto w-full max-w-[390px] flex-1 justify-center px-4">
          <BookingStatusBanner
            body="استلمنا طلب الإلغاء. موعدك الحالي ما زال هو المرجع لحد ما توصل الحالة المؤكدة."
            title="طلب الإلغاء قيد المعالجة"
            tone="warning"
          />
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

  return (
    <Screen contentClassName="px-0 py-0">
      <BookingHeader subtitle="إجراء حساس" title="إلغاء الحجز" />

      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[390px] px-4 pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppText className="font-ui-bold text-type-heading-3">تأكد قبل الإلغاء</AppText>
        <AppText className="mt-1 text-type-label  text-content-secondary" variant="caption">
          {booking.providerName} · {booking.dateLabel} · {booking.timeLabel}
        </AppText>

        <View className="mt-3">
          <BookingStatusBanner
            body={
              booking.cancellationConsequence ??
              'تعذر تحميل أثر الإلغاء، لذلك لا يمكن إرسال الطلب الآن.'
            }
            title="شو رح يصير بعد الإلغاء؟"
            tone="danger"
          />
        </View>

        <View className="mt-4">
          <TextField
            label="سبب الإلغاء"
            multiline
            onChangeText={setReason}
            placeholder="اكتب سبباً مختصراً"
            value={reason}
          />
        </View>

        <View className="mt-3">
          <BookingStatusBanner
            body="حتى بعد ضغط تأكيد الإلغاء، ما بنعرض الموعد كملغى قبل وصول النتيجة النهائية."
            title="حالة الطلب"
            tone="info"
          />
        </View>

        <View className="mt-4 gap-2">
          <Button
            disabled={!booking.cancellationConsequence || reason.trim().length < 3}
            label="تأكيد طلب الإلغاء"
            onPress={() => setConfirmingCancel(true)}
            variant="destructive"
          />
          <Button label="الاحتفاظ بالموعد" onPress={() => router.back()} variant="secondary" />
        </View>
      </ScrollView>
      <ConfirmationDialog
        visible={confirmingCancel && !cancellationPending}
        title="تأكيد طلب إلغاء الحجز"
        description="لن يُعتبر الموعد ملغى قبل وصول رد العيادة. سيتم إرسال طلب الإلغاء التجريبي مع الاحتفاظ بالحالة المؤكدة الحالية."
        confirmLabel="إرسال طلب الإلغاء"
        destructive
        onCancel={() => setConfirmingCancel(false)}
        onConfirm={() => {
          if (!booking.cancellationConsequence || reason.trim().length < 3 || cancellationPending) return;
          submitBookingCancellation(bookingId);
          setConfirmingCancel(false);
        }}
      />
    </Screen>
  );
}
