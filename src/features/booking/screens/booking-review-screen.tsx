import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Switch, View } from 'react-native';

import { canBookForPatient } from '@/features/booking/utils/patient-booking-permissions';
import { useBookingDraft } from '@/features/booking/state/booking-draft-provider';
import {
  BookingCard,
  BookingHeader,
  BookingProviderMiniCard,
  BookingStatusBanner,
} from '@/features/booking/components/booking-v5-ui';
import { buildReturnTo } from '@/features/auth/navigation/auth-intent';
import {
  getMockProvider,
  getMockProviderPriceLabel,
} from '@/features/discovery/mocks/providers.mock';
import { useAuthSession } from '@/providers/auth-session-provider';
import { penServiceGroups } from '@/features/discovery/presentation/pen-discovery-data';
import { AppIcon, AppText, Button, Screen, StateView } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { useAppTheme } from '@/shared/theme/theme-provider';
import { useAppDirection } from '@/providers/app-direction-provider';
import { cn } from '@/shared/utils/cn';
import { useFamilyMembers } from '@/features/profile/state/family-members-provider';

export function BookingReviewScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthSession();
  const { scenario, submitBookingRequest } = useMockScenario();
  const { members } = useFamilyMembers();
  const { note, attachment, shareAttachment, clearDraft } = useBookingDraft();
  const { providerId, serviceCode, dateKey, dateLabel, timeLabel, patientId, reason } =
    useLocalSearchParams<{
      providerId?: string;
      serviceCode?: string;
      dateKey?: string;
      dateLabel?: string;
      timeLabel?: string;
      patientId?: string;
      reason?: string;
    }>();
  const [submitted, setSubmitted] = useState(false);
  const [shareVisitSummary, setShareVisitSummary] = useState(true);
  const { colors } = useAppTheme();
  const { rowClassName } = useAppDirection();
  const [revalidationFailure, setRevalidationFailure] = useState<
    'slot' | 'eligibility' | 'branch' | 'service'
  >();

  const provider = getMockProvider(providerId);
  const chosenPatient = members.find((p) => p.id === patientId);
  const patientCanBook = canBookForPatient(patientId, scenario);
  const slotStillInSnapshot = Boolean(
    provider?.availability.some(
      (day) =>
        day.dateKey === dateKey &&
        day.dateLabel === dateLabel &&
        day.slots.includes(timeLabel ?? ''),
    ),
  );
  const visitReason =
    reason === 'followup' ? 'متابعة علاج' : reason === 'other' ? 'سبب آخر' : 'زيارة أولى';
  const serviceName =
    penServiceGroups.flatMap((group) => group.families).find((family) => family.id === serviceCode)
      ?.title ?? 'الخدمة المختارة';

  if (
    !provider ||
    !dateLabel ||
    !timeLabel ||
    !slotStillInSnapshot ||
    !chosenPatient ||
    !patientCanBook ||
    !provider.serviceCodes.includes(serviceCode ?? '')
  ) {
    return (
      <Screen>
        <StateView
          actionLabel="العودة"
          onAction={() => router.back()}
          title={!patientCanBook ? 'التفويض لا يسمح بالحجز لهذا المريض' : 'بيانات الحجز غير مكتملة'}
        />
      </Screen>
    );
  }

  const submitBooking = () => {
    // Client-side demo guard; server authority must revalidate the grant at submission.
    if (!patientCanBook || !slotStillInSnapshot) return;
    if (!isAuthenticated) {
      const returnTo = buildReturnTo('/booking/review', {
        providerId,
        serviceCode,
        dateKey,
        dateLabel,
        timeLabel,
        patientId,
        reason,
      });
      router.push({ pathname: '/auth/phone', params: { returnTo } });
      return;
    }

    if (scenario.flags?.bookingRevalidationSlotUnavailable) {
      setRevalidationFailure('slot');
      return;
    }
    if (scenario.flags?.bookingRevalidationEligibilityLost) {
      setRevalidationFailure('eligibility');
      return;
    }
    if (scenario.flags?.bookingRevalidationBranchUnavailable) {
      setRevalidationFailure('branch');
      return;
    }
    if (scenario.flags?.bookingRevalidationServiceUnpublished) {
      setRevalidationFailure('service');
      return;
    }

    if (!provider.serviceCodes.includes(serviceCode ?? '')) {
      setRevalidationFailure('service');
      return;
    }

    submitBookingRequest({
      providerId: provider.id,
      providerName: provider.name,
      serviceCode: serviceCode ?? '',
      serviceName,
      branch: provider.branch,
      patientName: chosenPatient.name,
      patientNote: note.trim() || undefined,
      dateLabel,
      timeLabel,
      priceLabel: getMockProviderPriceLabel(provider, serviceCode),
      sharingConsent: {
        visitSummary: shareVisitSummary,
        photos: false, // No uploaded photos attached to this flow.
        medicalHistory: false, // No medical history is present in this flow.
      },
    });
    clearDraft();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Screen contentClassName="px-0 py-0">
        <BookingHeader showBack={false} subtitle="تم الإرسال" title="طلب الحجز" />
        <View className="mx-auto w-full max-w-[430px] flex-1 justify-center px-4">
          <View className="items-center">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-tone-warning-fill">
              <AppIcon
                name={{ ios: 'clock.fill', android: 'schedule', web: 'schedule' }}
                size={36}
                tone="warning"
              />
            </View>
            <AppText className="mt-4 font-ui-bold text-type-heading-2">طلبك قيد التأكيد</AppText>
            <AppText
              align="center"
              className="mt-2 max-w-[300px] text-type-label  text-content-secondary"
              variant="caption"
            >
              حفظنا طلبك التجريبي ضمن حجوزاتي بحالة «قيد التأكيد». ما بصير الموعد مؤكداً قبل رد
              العيادة.
            </AppText>
          </View>

          <BookingCard className="mt-5 p-3">
            <View className="flex-row items-center gap-3">
              <View className="min-w-0 flex-1 items-end">
                <AppText className="font-ui-bold text-type-label">{provider.name}</AppText>
                <AppText
                  className="mt-0.5 text-type-caption text-content-secondary"
                  variant="caption"
                >
                  {provider.branch}
                </AppText>
                <AppText
                  direction="ltr"
                  className="mt-1 text-type-label text-content-link"
                  variant="label"
                >
                  {dateLabel} · {timeLabel}
                </AppText>
              </View>
              <View className="h-12 w-12 items-center justify-center rounded-full bg-action-subtle">
                <AppIcon
                  name={{ ios: 'person.fill', android: 'person', web: 'person' }}
                  size={22}
                  tone="action"
                />
              </View>
            </View>
          </BookingCard>

          <BookingStatusBanner
            body="لا تعيد إرسال نفس الطلب. رح تتحدث الحالة تلقائياً أول ما توصل نتيجة مؤكدة."
            title="شو بصير هلق؟"
            tone="warning"
          />

          <Button className="mt-5" label="عرض مواعيدي" onPress={() => router.replace('/booking')} />
        </View>
      </Screen>
    );
  }

  const failureCopy = revalidationFailure
    ? {
        slot: {
          title: 'الموعد لم يعد متاحاً',
          body: 'تغيّر توفر الوقت قبل لحظة الإرسال. اختَر موعداً آخر.',
          action: 'اختيار موعد آخر',
        },
        eligibility: {
          title: 'تغيّرت أهلية الطبيب',
          body: 'الخيار لم يعد متاحاً لهذا السياق. ارجع لخيارات الأطباء.',
          action: 'خيارات الأطباء',
        },
        branch: {
          title: 'الفرع غير جاهز حالياً',
          body: 'تغيّرت جاهزية الفرع قبل الإرسال. اختَر فرعاً أو طبيباً آخر.',
          action: 'اختيار بديل',
        },
        service: {
          title: 'الخدمة لم تعد متاحة',
          body: 'توقفت الخدمة عن النشر قبل لحظة الإرسال. ما تم إنشاء أي طلب.',
          action: 'العودة للخدمات',
        },
      }[revalidationFailure]
    : undefined;

  return (
    <Screen contentClassName="px-0 py-0">
      <BookingHeader leadingIcon="review" title="مراجعة الطلب" />
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-[104px] pt-1"
        showsVerticalScrollIndicator={false}
      >
        <AppText align="right" className="font-ui-bold text-content-primary" variant="heading-4">
          راجع ما سيصل إلى الطبيب
        </AppText>

        <View className="mt-2 rounded-[14px] border border-tone-info-border/40 bg-tone-info-fill p-3">
          <View className={cn('items-center gap-2', rowClassName)}>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-default">
              <AppIcon
                name={{ ios: 'paperplane', android: 'send', web: 'send' }}
                size={20}
                tone="action"
              />
            </View>
            <View className="min-w-0 flex-1 items-end">
              <AppText align="right" className="font-ui-bold text-content-link" variant="label">
                الملخص الذي يمكن مشاركته مع الطبيب
              </AppText>
              <AppText align="right" className="mt-0.5 text-content-secondary" variant="caption">
                {serviceName} · {visitReason} · {provider.name}
              </AppText>
            </View>
            <View className="rounded-full bg-surface-default px-2 py-1">
              <AppText className="text-content-link" variant="badge">
                قابل للمشاركة
              </AppText>
            </View>
          </View>
          <AppText align="right" className="mt-1.5 text-content-secondary" variant="caption">
            هاي معلومات الزيارة اللي اخترتها؛ ما منضيف تشخيص أو معلومات طبية مو موجودة عندك.
          </AppText>
        </View>

        {note.trim() ? (
          <View className="mt-2 rounded-[12px] border border-border-subtle bg-surface-default p-3">
            <AppText
              align="right"
              className="font-ui-semibold text-content-primary"
              variant="label"
            >
              ملاحظتك للطبيب
            </AppText>
            <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
              {note.trim()}
            </AppText>
          </View>
        ) : null}
        {attachment ? (
          <View className="mt-2 rounded-[12px] bg-tone-info-fill p-3">
            <AppText align="right" className="font-ui-semibold text-tone-info-text" variant="label">
              الصورة المحددة محلياً
            </AppText>
            <AppText align="right" className="mt-1 text-tone-info-text" variant="caption">
              {attachment.fileName} ·{' '}
              {shareAttachment ? 'محددة للمشاركة عند إتاحة رفع الملفات' : 'غير محددة للمشاركة'}
            </AppText>
            <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
              لن تُرسل الصورة ضمن الطلب التجريبي الحالي.
            </AppText>
          </View>
        ) : null}

        <AppText
          align="right"
          className="mt-3 font-ui-semibold text-content-primary"
          variant="label"
        >
          تحكّم واضح بالمشاركة
        </AppText>
        <View className="mt-2 gap-[7px]">
          {[
            {
              id: 'summary',
              label: 'ملخص سبب الزيارة',
              description: 'الخدمة والسبب اللي اخترتهن للحجز',
              checked: shareVisitSummary,
              disabled: false,
            },
            {
              id: 'photos',
              label: 'الصور المحددة',
              description: 'ما في صور مرفقة بهالطلب حالياً',
              checked: false,
              disabled: true,
            },
            {
              id: 'history',
              label: 'سياق صحي ذو صلة',
              description: 'ما في معلومات صحية محفوظة قابلة للمشاركة حالياً',
              checked: false,
              disabled: true,
            },
          ].map((item) => (
            <View
              className={cn(
                'min-h-[63px] items-center gap-2 rounded-[12px] border border-border-subtle bg-surface-default px-3 py-2',
                rowClassName,
              )}
              key={item.id}
            >
              <View className="min-w-0 flex-1 items-end">
                <AppText
                  align="right"
                  className="font-ui-semibold text-content-primary"
                  variant="label"
                >
                  {item.label}
                </AppText>
                <AppText
                  align="right"
                  className="mt-0.5 text-content-secondary"
                  numberOfLines={2}
                  variant="caption"
                >
                  {item.description}
                </AppText>
              </View>
              <Switch
                accessibilityLabel={item.label}
                accessibilityRole="switch"
                disabled={item.disabled}
                onValueChange={item.id === 'summary' ? setShareVisitSummary : undefined}
                thumbColor={colors.surface.default}
                trackColor={{ false: colors.border.strong, true: colors.action.primary }}
                value={item.checked}
              />
            </View>
          ))}
        </View>

        <View className="mt-2">
          <BookingProviderMiniCard
            branch={provider.branch + ' · ' + provider.area}
            portraitUri={provider.imageUrl}
            providerName={provider.name}
            serviceName={serviceName}
          />
          <View className="rounded-b-[11px] bg-surface-subtle px-3 py-2">
            <AppText align="right" className="text-content-secondary" variant="caption">
              {dateLabel} · {timeLabel} · {chosenPatient.name} ·{' '}
              {getMockProviderPriceLabel(provider, serviceCode)}
            </AppText>
          </View>
        </View>

        <View
          className={cn(
            'mt-2 items-center gap-2 rounded-[10px] bg-tone-info-fill px-3 py-2',
            rowClassName,
          )}
        >
          <AppIcon
            name={{ ios: 'shield.lefthalf.filled', android: 'verified_user', web: 'verified_user' }}
            tone="info"
            size={16}
          />
          <AppText align="right" className="min-w-0 flex-1 text-tone-info-text" variant="caption">
            بتقدر تختار شو ينشارك قبل إرسال الطلب. الصور والسجل الصحي غير مرفقين حالياً.
          </AppText>
        </View>

        {failureCopy ? (
          <View className="mt-3">
            <BookingStatusBanner body={failureCopy.body} title={failureCopy.title} tone="warning" />
            <Pressable
              accessibilityRole="button"
              className="mt-2 min-h-[44px] items-center justify-center rounded-[11px] border border-action-primary bg-surface-default"
              onPress={() => {
                if (revalidationFailure === 'slot') {
                  router.replace({
                    pathname: '/booking/slots',
                    params: { providerId: providerId ?? '', serviceCode: serviceCode ?? '' },
                  });
                } else if (revalidationFailure === 'service') {
                  router.replace('/discover');
                } else {
                  router.replace({
                    pathname: '/discover/providers/results',
                    params: { serviceCode: serviceCode ?? 'dental-checkup' },
                  });
                }
              }}
            >
              <AppText className="text-content-link" variant="label">
                {failureCopy.action}
              </AppText>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-surface-canvas px-4 pb-4 pt-2">
        <View className="mx-auto w-full max-w-[398px]">
          <Button
            className="h-[50px] rounded-[12px]"
            disabled={Boolean(revalidationFailure)}
            endIcon={{ ios: 'paperplane.fill', android: 'send', web: 'send' }}
            label="إرسال طلب الحجز"
            onPress={submitBooking}
          />
        </View>
      </View>
    </Screen>
  );
}
