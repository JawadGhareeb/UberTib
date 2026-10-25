import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';

import { BookingCard, BookingHeader } from '@/features/booking/components/booking-v5-ui';
import { ConfirmedBookingSummary } from '@/features/booking/components/confirmed-booking-summary';
import {
  getBookingCalendarStart,
  openBookingCalendarEditor,
} from '@/features/booking/utils/booking-calendar';
import {
  getMockBookingForScenario,
  mockAlternativeAppointment,
} from '@/features/booking/mocks/bookings.mock';
import { getMockProvider } from '@/features/discovery/mocks/providers.mock';
import { useAppDirection } from '@/shared/utils/app-direction';
import {
  AppIcon,
  AppText,
  Button,
  ConfirmationDialog,
  Screen,
  StateView,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { cn } from '@/shared/utils/cn';

export function BookingStatusScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const scenario = useMockScenario((state) => state.scenario);
  const bookingRequests = useMockScenario((state) => state.bookingRequests);
  const getBookingMutation = useMockScenario((state) => state.getBookingMutation);
  const submitBookingAlternativeDecision = useMockScenario(
    (state) => state.submitBookingAlternativeDecision,
  );
  useMockScenario((state) => state.bookingMutations);
  const [calendarBusy, setCalendarBusy] = useState(false);
  const [calendarError, setCalendarError] = useState('');
  const [alternativeDecision, setAlternativeDecision] = useState<'accept' | 'decline' | null>(null);
  const booking =
    bookingRequests.find((request) => request.id === bookingId) ??
    getMockBookingForScenario(bookingId, scenario);

  if (!booking) {
    return (
      <Screen>
        <StateView
          title="الحجز غير موجود"
          actionLabel="العودة للحجوزات"
          onAction={() => router.replace({ pathname: '/(tabs)/care', params: { tab: 'bookings' } })}
        />
      </Screen>
    );
  }

  const confirmed = booking.status === 'confirmed';
  const completed = booking.status === 'completed';
  const cancelled = booking.status === 'cancelled';
  const eligibilityUnderReview = booking.status === 'eligibility-review';
  const provider = getMockProvider(booking.providerId);
  const pendingDecision = getBookingMutation(booking.id)?.alternative;
  const hasAlternative =
    booking.status === 'pending' &&
    booking.id === mockAlternativeAppointment.bookingId &&
    Boolean(scenario.flags?.bookingAlternative) &&
    !scenario.flags?.bookingAlternativeExpired;
  const calendarBooking = {
    status: booking.status,
    dateKey:
      'dateKey' in booking && typeof booking.dateKey === 'string' ? booking.dateKey : undefined,
    timeLabel: booking.timeLabel,
    serviceName: booking.serviceName,
    providerName: booking.providerName,
    branch: booking.branch,
  };
  const calendarAvailable = confirmed && Boolean(getBookingCalendarStart(calendarBooking));
  const addToCalendar = async () => {
    if (!calendarAvailable || calendarBusy) return;
    setCalendarBusy(true);
    setCalendarError('');
    try {
      await openBookingCalendarEditor(calendarBooking);
    } catch (error) {
      const cause = error instanceof Error ? error.message : '';
      const message =
        cause === 'calendar_permission_denied'
          ? 'الوصول إلى التقويم غير مسموح. اسمح بإضافة الأحداث من إعدادات الجهاز.'
          : cause === 'calendar_date_unverified'
            ? 'تعذّر التحقق من تاريخ الموعد. راجع تفاصيل الحجز.'
            : 'تعذّر فتح تقويم الجهاز. يتطلب التقويم نسخة تطبيق مثبتة تدعم هذه الميزة.';
      setCalendarError(message);
      Alert.alert('تعذّر فتح التقويم', message);
    } finally {
      setCalendarBusy(false);
    }
  };
  const navigateToBooking = () =>
    router.replace({
      pathname: '/booking/[bookingId]',
      params: { bookingId: booking.id },
    });
  const startNewRequest = () =>
    router.push({
      pathname: '/booking/slots',
      params: { providerId: booking.providerId, serviceCode: booking.serviceCode },
    });

  return (
    <Screen contentClassName="px-0 py-0">
      <BookingHeader
        onBackPress={() => {
          router.replace({ pathname: '/(tabs)/care', params: { tab: 'bookings' } });
        }}
        leadingIcon={confirmed || completed ? 'confirmed' : 'pending'}
        leadingTone={confirmed || completed ? 'success' : 'warning'}
        title={confirmed ? 'تم تأكيد الحجز' : completed ? 'اكتملت الزيارة' : 'حالة الطلب'}
      />
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-5 pb-[164px] pt-1"
        showsVerticalScrollIndicator={false}
      >
        {confirmed || completed ? (
          <ConfirmedBookingSummary
            booking={booking}
            portraitUri={provider?.imageUrl}
            completed={completed}
          />
        ) : (
          <>
            <View
              className={cn(
                'items-center gap-2 rounded-[15px] border border-tone-warning-border bg-tone-warning-fill p-3',
                rowClassName,
              )}
            >
              <View className="h-[46px] w-[46px] items-center justify-center rounded-full bg-surface-default">
                <AppIcon
                  name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
                  tone="warning"
                  size={23}
                />
              </View>
              <View className="min-w-0 flex-1 items-end">
                <AppText
                  align="right"
                  className="font-ui-bold text-tone-warning-text"
                  variant="label"
                >
                  {cancelled
                    ? 'الطلب مغلق'
                    : pendingDecision
                      ? 'قرارك قيد التحقق'
                      : eligibilityUnderReview
                        ? 'تحت مراجعة أهلية الطبيب'
                        : 'بانتظار رد العيادة'}
                </AppText>
                <AppText
                  align="right"
                  className="mt-1 text-content-secondary"
                  numberOfLines={2}
                  variant="caption"
                >
                  {booking.serviceName} · {booking.providerName} · {booking.branch}
                </AppText>
              </View>
              {'actionDeadlineLabel' in booking &&
              typeof booking.actionDeadlineLabel === 'string' &&
              booking.actionDeadlineLabel &&
              !cancelled ? (
                <View className="max-w-[112px] rounded-full bg-surface-default px-2 py-1">
                  <AppText align="center" className="text-tone-warning-text" variant="badge">
                    {booking.actionDeadlineLabel}
                  </AppText>
                </View>
              ) : null}
            </View>

            <View
              className={cn(
                'mt-2 rounded-[12px] p-3',
                cancelled
                  ? 'bg-tone-danger-fill'
                  : eligibilityUnderReview
                    ? 'bg-tone-warning-fill'
                    : 'bg-tone-success-fill',
              )}
            >
              <AppText
                align="right"
                className={cn(
                  'font-ui-semibold',
                  cancelled
                    ? 'text-tone-danger-text'
                    : eligibilityUnderReview
                      ? 'text-tone-warning-text'
                      : 'text-tone-success-text',
                )}
                variant="label"
              >
                {cancelled
                  ? 'الطلب محفوظ في السجل'
                  : eligibilityUnderReview
                    ? 'أهلية مقدم الخدمة قيد المراجعة'
                    : 'الطلب مسجّل وقيد مراجعة العيادة'}
              </AppText>
              <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
                {cancelled
                  ? (booking.note ?? 'يمكنك العودة إلى حجوزاتك أو إنشاء طلب جديد.')
                  : eligibilityUnderReview
                    ? (booking.note ?? 'لا تتوجه إلى الموعد قبل تأكيد الأهلية من العيادة.')
                    : 'العيادة لم ترسل تأكيداً نهائياً للموعد بعد. لا تتوجّه قبل وصول الرد المعتمد.'}
              </AppText>
            </View>

            <BookingCard className="mt-2 gap-2 p-3">
              {(
                [
                  {
                    title: 'تم إرسال الطلب',
                    detail: 'محفوظ في حجوزاتي',
                    icon: { ios: 'checkmark', android: 'check', web: 'check' },
                    tone: 'success',
                  },
                  {
                    title: hasAlternative
                      ? 'قدّمت العيادة موعداً بديلاً'
                      : 'بانتظار مراجعة العيادة',
                    detail: hasAlternative ? 'اقتراح موجود' : 'قيد المراجعة',
                    icon: { ios: 'eye', android: 'visibility', web: 'visibility' },
                    tone: hasAlternative ? 'success' : 'warning',
                  },
                  {
                    title: cancelled ? 'الطلب مغلق' : 'الرد قيد الانتظار',
                    detail: cancelled
                      ? 'مغلق'
                      : pendingDecision
                        ? 'القرار قيد التحقق'
                        : 'لم يصل تأكيد',
                    icon: { ios: 'clock', android: 'schedule', web: 'schedule' },
                    tone: 'warning',
                  },
                ] as const
              ).map((event) => (
                <View
                  className={cn('min-h-[27px] items-center gap-2', rowClassName)}
                  key={event.title}
                >
                  <AppText
                    align="right"
                    className="min-w-0 flex-1 text-content-primary"
                    variant="caption"
                  >
                    {event.title}
                  </AppText>
                  <AppText className="text-content-secondary" variant="badge">
                    {event.detail}
                  </AppText>
                  <AppIcon name={event.icon} tone={event.tone} size={16} />
                </View>
              ))}
            </BookingCard>

            {hasAlternative ? (
              <View
                className={cn(
                  'mt-2 items-start gap-2 rounded-[13px] border border-border-subtle bg-surface-subtle p-3',
                  rowClassName,
                )}
              >
                <View className="min-w-0 flex-1 items-end">
                  <AppText
                    align="right"
                    className="font-ui-bold text-content-primary"
                    variant="label"
                  >
                    موعد بديل مؤهل لنفس الخدمة
                  </AppText>
                  <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
                    {mockAlternativeAppointment.proposedDateLabel} ·{' '}
                    {mockAlternativeAppointment.proposedTimeLabel}
                  </AppText>
                  <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
                    {mockAlternativeAppointment.reason}
                  </AppText>
                </View>
                <View className="rounded-full bg-tone-warning-fill px-2 py-1">
                  <AppText className="text-tone-warning-text" variant="badge">
                    {mockAlternativeAppointment.decisionDeadlineLabel}
                  </AppText>
                </View>
              </View>
            ) : null}

            {hasAlternative && !pendingDecision ? (
              <Pressable
                accessibilityLabel="رفض الموعد البديل"
                accessibilityRole="button"
                className="mt-2 min-h-[40px] items-center justify-center rounded-[10px]"
                onPress={() => setAlternativeDecision('decline')}
              >
                <AppText
                  align="center"
                  className="font-ui-semibold text-tone-danger-text"
                  variant="caption"
                >
                  رفض الموعد البديل
                </AppText>
              </Pressable>
            ) : null}

            <AppText align="right" className="mt-2 text-content-secondary" variant="caption">
              {hasAlternative
                ? 'القبول يرسل قرارك للمراجعة فقط، ولا يؤكّد الموعد تلقائياً. اختيار موعد آخر يبدأ طلباً منفصلاً ولا يلغي الحالي.'
                : 'تابع حالة الحجز، ولا تعتبر وقت الزيارة مؤكداً قبل رد العيادة.'}
            </AppText>
          </>
        )}

        <View
          className={cn(
            'mt-2 items-center gap-2 rounded-[10px] bg-tone-info-fill px-3 py-2',
            rowClassName,
          )}
        >
          <AppIcon
            name={{ ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' }}
            tone="info"
            size={16}
          />
          <AppText align="right" className="min-w-0 flex-1 text-tone-info-text" variant="caption">
            {confirmed || completed
              ? 'السعر والخطة وفق سجل الحجز؛ أي تغيير أو خدمة إضافية يحتاج موافقتك.'
              : 'لا يُعتمد الموعد البديل أو تغيير حالة الحجز قبل رد العيادة المعتمد.'}
          </AppText>
        </View>

        {confirmed && !calendarAvailable ? (
          <AppText align="right" variant="caption" className="mt-2 text-content-secondary">
            إضافة التقويم غير متاحة: تاريخ الموعد ليس مستقبلياً أو لا يحتوي على ساعة وتاريخ موثوقين.
          </AppText>
        ) : null}
        {calendarError ? (
          <View className="mt-2 rounded-[11px] bg-tone-warning-fill p-3">
            <AppText align="right" variant="caption" className="text-tone-warning-text">
              {calendarError}
            </AppText>
          </View>
        ) : null}
        {confirmed && calendarAvailable ? (
          <AppText align="right" variant="caption" className="mt-2 text-content-secondary">
            سيتم فتح نموذج تقويم الجهاز. راجع مدة الموعد واضغط حفظ بنفسك؛ فتح النموذج لا يعني
            الإضافة.
          </AppText>
        ) : null}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-border-subtle bg-surface-canvas px-5 pb-3 pt-2">
        <View className="mx-auto w-full max-w-[430px] gap-2">
          {hasAlternative && !pendingDecision ? (
            <>
              <Button
                className="h-[52px] rounded-[12px]"
                endIcon={{ ios: 'checkmark', android: 'check', web: 'check' }}
                label="قبول الموعد البديل"
                onPress={() => setAlternativeDecision('accept')}
              />
              <Button
                className="h-[46px] rounded-[12px]"
                endIcon={{
                  ios: 'calendar.badge.clock',
                  android: 'event_repeat',
                  web: 'event_repeat',
                }}
                label="اختيار موعد آخر"
                onPress={startNewRequest}
                variant="outline"
              />
            </>
          ) : (
            <>
              {confirmed || completed ? (
                <Button
                  className="h-[52px] rounded-[12px]"
                  endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
                  label="عرض تفاصيل الحجز"
                  onPress={navigateToBooking}
                />
              ) : (
                <Button
                  className="h-[52px] rounded-[12px]"
                  label="العودة إلى حجوزاتي"
                  onPress={() =>
                    router.replace({ pathname: '/(tabs)/care', params: { tab: 'bookings' } })
                  }
                />
              )}
              {confirmed ? (
                <Button
                  className="h-[46px] rounded-[12px]"
                  disabled={!calendarAvailable}
                  loading={calendarBusy}
                  endIcon={{ ios: 'calendar.badge.plus', android: 'event', web: 'event' }}
                  label="إضافة إلى التقويم"
                  onPress={() => void addToCalendar()}
                  variant="outline"
                />
              ) : completed ? (
                <Button
                  className="h-[46px] rounded-[12px]"
                  label="العودة إلى حجوزاتي"
                  onPress={() =>
                    router.replace({ pathname: '/(tabs)/care', params: { tab: 'bookings' } })
                  }
                  variant="outline"
                />
              ) : cancelled ? (
                <Button
                  className="h-[46px] rounded-[12px]"
                  label="طلب حجز جديد"
                  onPress={() => router.replace('/discover')}
                  variant="outline"
                />
              ) : null}
              {confirmed ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="العودة إلى حجوزاتي"
                  className="min-h-9 items-center justify-center"
                  onPress={() =>
                    router.replace({ pathname: '/(tabs)/care', params: { tab: 'bookings' } })
                  }
                >
                  <AppText variant="label" className="font-ui-semibold text-content-link">
                    العودة إلى حجوزاتي
                  </AppText>
                </Pressable>
              ) : null}
            </>
          )}
        </View>
      </View>

      <ConfirmationDialog
        visible={hasAlternative && alternativeDecision !== null && !pendingDecision}
        title={alternativeDecision === 'accept' ? 'قبول الموعد البديل؟' : 'رفض الموعد البديل؟'}
        description={
          alternativeDecision === 'accept'
            ? 'سيُحفظ قبولك بانتظار نتيجة العيادة. الموعد لن يتحوّل إلى مؤكد بمجرد الضغط.'
            : 'سيُحفظ رفضك كقرار قيد المعالجة. حالة الطلب لا تتغير حتى يصدر رد العيادة.'
        }
        confirmLabel={alternativeDecision === 'accept' ? 'إرسال القبول' : 'إرسال الرفض'}
        destructive={alternativeDecision === 'decline'}
        onCancel={() => setAlternativeDecision(null)}
        onConfirm={() => {
          if (!hasAlternative || pendingDecision || !alternativeDecision) return;
          submitBookingAlternativeDecision(booking.id, alternativeDecision);
          setAlternativeDecision(null);
        }}
      />
    </Screen>
  );
}
