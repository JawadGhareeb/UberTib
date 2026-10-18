import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';

import {
  BookingCard,
  BookingHeader,
  BookingProviderMiniCard,
} from '@/features/booking/components/booking-v5-ui';
import {
  getMockBookingForScenario,
  mockAlternativeAppointment,
} from '@/features/booking/mocks/bookings.mock';
import { getMockProvider, type MockProvider } from '@/features/discovery/mocks/providers.mock';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button, ConfirmationDialog, Screen, StateView } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { cn } from '@/shared/utils/cn';

function BookingChecklistItem({
  title,
  complete,
  onPress,
}: {
  title: string;
  complete: boolean;
  onPress?: () => void;
}) {
  const { rowClassName } = useAppDirection();
  const body = (
    <View className={cn('min-h-[29px] items-center gap-2 px-2 py-1', rowClassName)}>
      <AppText
        align="right"
        className={cn('min-w-0 flex-1', complete ? 'text-content-primary' : 'text-content-secondary')}
        variant="caption"
      >
        {title}
      </AppText>
      <View className={cn(
        'h-[23px] w-[23px] items-center justify-center rounded-full border',
        complete ? 'border-tone-success-border bg-tone-success-fill' : 'border-border-default bg-surface-default',
      )}>
        {complete ? (
          <AppIcon name={{ ios: 'checkmark', android: 'check', web: 'check' }} size={13} tone="success" />
        ) : null}
      </View>
    </View>
  );
  return onPress ? (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: complete }}
      onPress={onPress}
    >
      {body}
    </Pressable>
  ) : body;
}

/**
 * Offer an event only for a matching, future calendar day from the selected
 * provider's sample slots. Do not export a hard-coded event for an old date.
 * The user must still save the event in Google Calendar.
 */
function calendarDraftUrl({
  dateLabel,
  timeLabel,
  providerName,
  serviceName,
  branch,
  patientName,
}: {
  dateLabel: string;
  timeLabel: string;
  providerName: string;
  serviceName: string;
  branch: string;
  patientName: string;
}, provider: MockProvider | undefined): string | undefined {
  const day = provider?.availability.find(
    (entry) => entry.dateLabel === dateLabel && entry.slots.includes(timeLabel),
  );
  if (!day) return undefined;

  const timeMatch = /^(\d{1,2}):(\d{2})\s*([صم])$/.exec(timeLabel);
  if (!timeMatch) return undefined;
  let hour = Number(timeMatch[1]) % 12;
  if (timeMatch[3] === 'م') hour += 12;

  const parts = day.dateKey.split('-').map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) return undefined;
  const start = new Date(parts[0]!, parts[1]! - 1, parts[2]!, hour, Number(timeMatch[2]));
  if (!Number.isFinite(start.getTime()) || start.getTime() <= Date.now()) return undefined;
  const end = new Date(start.getTime() + 45 * 60 * 1000);
  const format = (value: Date) =>
    [value.getFullYear(), String(value.getMonth() + 1).padStart(2, '0'), String(value.getDate()).padStart(2, '0')].join('') +
    'T' + String(value.getHours()).padStart(2, '0') +
    String(value.getMinutes()).padStart(2, '0') + '00';

  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
    encodeURIComponent('زيارة أسنان · ' + providerName) +
    '&dates=' + format(start) + '/' + format(end) +
    '&ctz=Asia%2FDamascus&details=' +
    encodeURIComponent(serviceName + ' · ' + branch + ' · ' + patientName);
}

export function BookingStatusScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const { scenario, bookingRequests, getBookingMutation, submitBookingAlternativeDecision } = useMockScenario();
  const [instructionsRead, setInstructionsRead] = useState(false);
  const [alternativeDecision, setAlternativeDecision] = useState<'accept' | 'decline' | null>(null);
  const booking = bookingRequests.find((request) => request.id === bookingId)
    ?? getMockBookingForScenario(bookingId, scenario);

  if (!booking) {
    return (
      <Screen>
        <StateView title="الحجز غير موجود" actionLabel="العودة للحجوزات" onAction={() => router.replace('/booking')} />
      </Screen>
    );
  }

  const confirmed = booking.status === 'confirmed';
  const completed = booking.status === 'completed';
  const cancelled = booking.status === 'cancelled';
  const eligibilityUnderReview = booking.status === 'eligibility-review';
  const provider = getMockProvider(booking.providerId);
  const pendingDecision = getBookingMutation(booking.id)?.alternative;
  const hasAlternative = booking.status === 'pending' &&
    booking.id === mockAlternativeAppointment.bookingId &&
    Boolean(scenario.flags?.bookingAlternative) &&
    !scenario.flags?.bookingAlternativeExpired;
  const calendarUrl = confirmed ? calendarDraftUrl(booking, provider) : undefined;
  const navigateToBooking = () => router.push({
    pathname: '/booking/[bookingId]',
    params: { bookingId: booking.id },
  });
  const startNewRequest = () => router.push({
    pathname: '/booking/reason',
    params: { providerId: booking.providerId, serviceCode: booking.serviceCode },
  });

  return (
    <Screen contentClassName="px-0 py-0">
      <BookingHeader
        onBackPress={() => {
          if (router.canGoBack()) return router.back();
          return router.replace({
            pathname: '/booking/[bookingId]',
            params: { bookingId: booking.id },
          });
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
          <>
            <View className="rounded-[15px] border border-tone-success-border bg-tone-success-fill p-3">
              <View className={cn('items-center gap-2', rowClassName)}>
                <View className="h-2 w-2 rounded-full bg-tone-success-text" />
                <View className="min-w-0 flex-1 items-end">
                  <AppText align="right" className="font-ui-bold text-tone-success-text" variant="heading-4">
                    {completed ? 'تمت الزيارة' : 'تم تأكيد الحجز'}
                  </AppText>
                  <AppText align="right" className="mt-0.5 text-content-primary" variant="caption">
                    {booking.dateLabel} · {booking.timeLabel}
                  </AppText>
                </View>
                <View className="h-[49px] w-[49px] items-center justify-center rounded-full border border-tone-success-border bg-surface-default">
                  <AppIcon name={{ ios: 'checkmark', android: 'check', web: 'check' }} size={27} tone="success" />
                </View>
              </View>
            </View>

            <View className="mt-2">
              <BookingProviderMiniCard
                branch={booking.branch}
                portraitUri={provider?.imageUrl}
                providerName={booking.providerName}
                serviceName={booking.serviceName}
              />
            </View>

            <AppText align="right" className="mt-3 font-ui-bold text-content-primary" variant="label">
              {completed ? 'سجل الزيارة' : 'قبل الزيارة'}
            </AppText>
            <BookingCard className="mt-2 py-2">
              <BookingChecklistItem complete title="تفاصيل الزيارة محفوظة ضمن الحجز" />
              <BookingChecklistItem
                complete={Boolean(bookingRequests.find((request) => request.id === booking.id)?.sharingConsent?.visitSummary)}
                title="تمت مشاركة ملخص التقييم الأولي بموافقتك"
              />
              <BookingChecklistItem
                complete={Boolean(bookingRequests.find((request) => request.id === booking.id)?.sharingConsent?.photos)}
                title="تمت مشاركة الصور والأشعة المحددة"
              />
              <BookingChecklistItem
                complete={instructionsRead}
                onPress={confirmed ? () => setInstructionsRead((previous) => !previous) : undefined}
                title="قرأت تعليمات العيادة قبل الموعد"
              />
              <BookingChecklistItem complete title="لا يوجد ملف إضافي مطلوب في بيانات الحجز الحالية" />
            </BookingCard>

            <View className={cn('mt-2 items-center gap-2 rounded-[12px] border border-border-subtle bg-surface-subtle p-3', rowClassName)}>
              <View className="min-w-0 flex-1 items-end">
                <AppText align="right" className="font-ui-semibold text-content-primary" variant="label">
                  موقع الموعد
                </AppText>
                <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
                  {booking.branch} · {provider?.area ?? 'الموقع التفصيلي غير متوفر'}
                </AppText>
              </View>
              <AppIcon name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }} size={18} tone="action" />
            </View>
          </>
        ) : (
          <>
            <View className={cn('items-center gap-2 rounded-[15px] border border-tone-warning-border bg-tone-warning-fill p-3', rowClassName)}>
              <View className="h-[46px] w-[46px] items-center justify-center rounded-full bg-surface-default">
                <AppIcon name={{ ios: 'clock', android: 'schedule', web: 'schedule' }} tone="warning" size={23} />
              </View>
              <View className="min-w-0 flex-1 items-end">
                <AppText align="right" className="font-ui-bold text-tone-warning-text" variant="label">
                  {cancelled ? 'الطلب مغلق' : pendingDecision
                    ? 'قرارك قيد التحقق'
                    : eligibilityUnderReview ? 'تحت مراجعة أهلية الطبيب' : 'بانتظار رد العيادة'}
                </AppText>
                <AppText align="right" className="mt-1 text-content-secondary" numberOfLines={2} variant="caption">
                  {booking.serviceName} · {booking.providerName} · {booking.branch}
                </AppText>
              </View>
              {'actionDeadlineLabel' in booking && typeof booking.actionDeadlineLabel === 'string' && booking.actionDeadlineLabel && !cancelled ? (
                <View className="max-w-[112px] rounded-full bg-surface-default px-2 py-1">
                  <AppText align="center" className="text-tone-warning-text" variant="badge">
                    {booking.actionDeadlineLabel}
                  </AppText>
                </View>
              ) : null}
            </View>

            <View className={cn(
              'mt-2 rounded-[12px] p-3',
              cancelled ? 'bg-tone-danger-fill' : eligibilityUnderReview ? 'bg-tone-warning-fill' : 'bg-tone-success-fill',
            )}>
              <AppText align="right" className={cn(
                'font-ui-semibold',
                cancelled ? 'text-tone-danger-text' : eligibilityUnderReview ? 'text-tone-warning-text' : 'text-tone-success-text',
              )} variant="label">
                {cancelled ? 'الطلب محفوظ في السجل' : eligibilityUnderReview ? 'أهلية مقدم الخدمة قيد المراجعة' : 'الطلب مسجّل وقيد مراجعة العيادة'}
              </AppText>
              <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
                {cancelled
                  ? booking.note ?? 'يمكنك العودة إلى حجوزاتك أو إنشاء طلب جديد.'
                  : eligibilityUnderReview
                  ? booking.note ?? 'لا تتوجه إلى الموعد قبل تأكيد الأهلية من العيادة.'
                  : 'العيادة لم ترسل تأكيداً نهائياً للموعد بعد. لا تتوجّه قبل وصول الرد المعتمد.'}
              </AppText>
            </View>

            <BookingCard className="mt-2 gap-2 p-3">
              {([
                {
                  title: 'تم إرسال الطلب',
                  detail: 'محفوظ في حجوزاتي',
                  icon: { ios: 'checkmark', android: 'check', web: 'check' },
                  tone: 'success',
                },
                {
                  title: hasAlternative ? 'قدّمت العيادة موعداً بديلاً' : 'بانتظار مراجعة العيادة',
                  detail: hasAlternative ? 'اقتراح موجود' : 'قيد المراجعة',
                  icon: { ios: 'eye', android: 'visibility', web: 'visibility' },
                  tone: hasAlternative ? 'success' : 'warning',
                },
                {
                  title: cancelled ? 'الطلب مغلق' : 'الرد قيد الانتظار',
                  detail: cancelled ? 'مغلق' : pendingDecision ? 'القرار قيد التحقق' : 'لم يصل تأكيد',
                  icon: { ios: 'clock', android: 'schedule', web: 'schedule' },
                  tone: 'warning',
                },
              ] as const).map((event) => (
                <View className={cn('min-h-[27px] items-center gap-2', rowClassName)} key={event.title}>
                  <AppText align="right" className="min-w-0 flex-1 text-content-primary" variant="caption">
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
              <View className={cn('mt-2 items-start gap-2 rounded-[13px] border border-border-subtle bg-surface-subtle p-3', rowClassName)}>
                <View className="min-w-0 flex-1 items-end">
                  <AppText align="right" className="font-ui-bold text-content-primary" variant="label">
                    موعد بديل مؤهل لنفس الخدمة
                  </AppText>
                  <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
                    {mockAlternativeAppointment.proposedDateLabel} · {mockAlternativeAppointment.proposedTimeLabel}
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
                <AppText align="center" className="font-ui-semibold text-tone-danger-text" variant="caption">
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

        <View className={cn('mt-2 items-center gap-2 rounded-[10px] bg-tone-info-fill px-3 py-2', rowClassName)}>
          <AppIcon name={{ ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' }} tone="info" size={16} />
          <AppText align="right" className="min-w-0 flex-1 text-tone-info-text" variant="caption">
            {confirmed || completed
              ? 'السعر والخطة وفق سجل الحجز؛ أي تغيير أو خدمة إضافية يحتاج موافقتك.'
              : 'لا يُعتمد الموعد البديل أو تغيير حالة الحجز قبل رد العيادة المعتمد.'}
          </AppText>
        </View>

        {confirmed && !calendarUrl ? (
          <AppText align="right" className="mt-2 text-content-secondary" variant="caption">
            إضافة التقويم غير متاحة لأن موعد الحجز في البيانات الحالية قديم أو بلا تاريخ قابل للتحقق.
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
                endIcon={{ ios: 'calendar.badge.clock', android: 'event_repeat', web: 'event_repeat' }}
                label="اختيار موعد آخر"
                onPress={startNewRequest}
                variant="outline"
              />
            </>
          ) : (
            <>
              <Button
                className="h-[52px] rounded-[12px]"
                endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
                label={confirmed || completed ? 'عرض تفاصيل الحجز' : 'عرض تفاصيل الطلب'}
                onPress={navigateToBooking}
              />
              {confirmed ? (
                <Button
                  className="h-[46px] rounded-[12px]"
                  disabled={!calendarUrl}
                  endIcon={{ ios: 'calendar.badge.plus', android: 'event', web: 'event' }}
                  label="إضافة إلى التقويم"
                  onPress={() => { if (calendarUrl) void Linking.openURL(calendarUrl); }}
                  variant="outline"
                />
              ) : (
                <Button
                  className="h-[46px] rounded-[12px]"
                  endIcon={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
                  label={cancelled ? 'طلب حجز جديد' : 'العودة إلى حجوزاتي'}
                  onPress={() => router.replace(cancelled ? '/discover' : '/booking')}
                  variant="outline"
                />
              )}
            </>
          )}
        </View>
      </View>

      <ConfirmationDialog
        visible={hasAlternative && alternativeDecision !== null && !pendingDecision}
        title={alternativeDecision === 'accept' ? 'قبول الموعد البديل؟' : 'رفض الموعد البديل؟'}
        description={alternativeDecision === 'accept'
          ? 'سيُحفظ قبولك بانتظار نتيجة العيادة. الموعد لن يتحوّل إلى مؤكد بمجرد الضغط.'
          : 'سيُحفظ رفضك كقرار قيد المعالجة. حالة الطلب لا تتغير حتى يصدر رد العيادة.'}
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
