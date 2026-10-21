import { View } from 'react-native';

import { BookingCard } from '@/features/booking/components/booking-v5-ui';
import { type MockBooking } from '@/features/booking/mocks/bookings.mock';
import { ProviderPortrait } from '@/features/discovery/components/provider-photo-gallery';
import { AppIcon, AppText } from '@/shared/components/ui';

type ConfirmedBookingInfo = Pick<
  MockBooking,
  'serviceName' | 'providerName' | 'branch' | 'patientName' | 'dateLabel' | 'timeLabel' | 'note'
>;

export function ConfirmedBookingSummary({
  booking,
  portraitUri,
  completed,
}: {
  booking: ConfirmedBookingInfo;
  portraitUri?: string;
  completed: boolean;
}) {
  return (
    <View className="gap-3">
      <View className="items-center gap-2 px-3 pb-2 pt-5">
        <View className="h-[76px] w-[76px] items-center justify-center rounded-full bg-tone-success-fill">
          <AppIcon
            name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
            size={43}
            tone="success"
          />
        </View>
        <AppText align="center" variant="heading-3" className="font-ui-bold">
          {completed ? 'اكتملت زيارتك' : 'تم تأكيد موعدك!'}
        </AppText>
        <AppText align="center" variant="label" className="max-w-[320px] text-content-secondary">
          {completed
            ? 'تفاصيل الزيارة محفوظة ضمن سجل حجوزاتك.'
            : 'العيادة أكدت موعد زيارتك. احتفظ بالتفاصيل وراجع تعليمات الحضور.'}
        </AppText>
      </View>

      <BookingCard className="gap-3 rounded-[16px] p-3.5">
        <View className="flex-row-reverse items-center justify-between gap-2">
          <AppText align="right" variant="label" className="font-ui-bold">
            تفاصيل الموعد
          </AppText>
          <View className="rounded-full bg-tone-success-fill px-3 py-1">
            <AppText variant="caption" className="font-ui-semibold text-tone-success-text">
              {completed ? 'مكتمل' : 'مؤكد'}
            </AppText>
          </View>
        </View>

        <View className="flex-row-reverse items-center gap-3">
          <ProviderPortrait size={46} uri={portraitUri} />
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" variant="label" className="font-ui-bold">
              {booking.providerName}
            </AppText>
            <AppText align="right" variant="caption" className="text-content-secondary">
              {booking.serviceName}
            </AppText>
          </View>
        </View>

        <View className="flex-row-reverse gap-2 border-t border-border-subtle pt-3">
          <View className="min-w-0 flex-1 items-end gap-1 rounded-[11px] bg-surface-subtle p-3">
            <AppIcon
              name={{ ios: 'calendar', android: 'event', web: 'event' }}
              tone="action"
              size={17}
            />
            <AppText align="right" variant="caption" className="text-content-secondary">
              تاريخ الزيارة
            </AppText>
            <AppText align="right" variant="label" className="font-ui-semibold">
              {booking.dateLabel}
            </AppText>
          </View>
          <View className="min-w-0 flex-1 items-end gap-1 rounded-[11px] bg-surface-subtle p-3">
            <AppIcon
              name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
              tone="action"
              size={17}
            />
            <AppText align="right" variant="caption" className="text-content-secondary">
              الساعة
            </AppText>
            <AppText direction="ltr" align="right" variant="label" className="font-ui-semibold">
              {booking.timeLabel}
            </AppText>
          </View>
        </View>

        <View className="gap-2 border-t border-border-subtle pt-3">
          <View className="flex-row-reverse items-center gap-2">
            <AppIcon
              name={{ ios: 'person', android: 'person_outline', web: 'person_outline' }}
              tone="secondary"
              size={17}
            />
            <View className="min-w-0 flex-1 items-end gap-0.5">
              <AppText align="right" variant="caption" className="text-content-secondary">
                المريض
              </AppText>
              <AppText align="right" variant="label" className="font-ui-semibold">
                {booking.patientName}
              </AppText>
            </View>
          </View>
          <View className="flex-row-reverse items-center gap-2">
            <AppIcon
              name={{ ios: 'mappin', android: 'place', web: 'place' }}
              tone="secondary"
              size={17}
            />
            <View className="min-w-0 flex-1 items-end gap-0.5">
              <AppText align="right" variant="caption" className="text-content-secondary">
                الفرع
              </AppText>
              <AppText align="right" variant="label" className="font-ui-semibold">
                {booking.branch}
              </AppText>
            </View>
          </View>
        </View>
      </BookingCard>

      {booking.note && !completed ? (
        <View className="flex-row-reverse items-start gap-2 rounded-[12px] bg-tone-info-fill p-3">
          <AppIcon
            name={{ ios: 'info.circle', android: 'info_outline', web: 'info_outline' }}
            size={18}
            tone="info"
          />
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" variant="label" className="font-ui-semibold text-tone-info-text">
              تعليمات العيادة
            </AppText>
            <AppText align="right" variant="caption" className="text-tone-info-text">
              {booking.note}
            </AppText>
          </View>
        </View>
      ) : null}
    </View>
  );
}
