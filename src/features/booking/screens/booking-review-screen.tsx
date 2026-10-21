import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Accordion, Radio, RadioGroup } from 'heroui-native';
import { useEffect, useState } from 'react';
import { Platform, Pressable, Switch, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { AssessmentImagePreview } from '@/features/assessment/components/assessment-image-preview';
import { buildReturnTo } from '@/features/auth/navigation/auth-intent';
import { BookingJourneyProgress } from '@/features/booking/components/booking-journey-progress';
import {
  BookingCard,
  BookingHeader,
  BookingProviderMiniCard,
  BookingStatusBanner,
} from '@/features/booking/components/booking-v5-ui';
import {
  useBookingDraft,
  type BookingVisitReason,
} from '@/features/booking/state/booking-draft-provider';
import { canBookForPatient } from '@/features/booking/utils/patient-booking-permissions';
import {
  getMockProvider,
  getMockProviderPriceLabel,
} from '@/features/discovery/mocks/providers.mock';
import { penServiceGroups } from '@/features/discovery/presentation/pen-discovery-data';
import { useFamilyMembers } from '@/features/profile/state/family-members-provider';
import { useAuthSession } from '@/providers/auth-session-provider';
import { AppIcon, AppText, Button, Screen, StateView, TextField } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { useAppTheme } from '@/shared/theme/use-app-theme';

const visitReasons: { value: BookingVisitReason; label: string }[] = [
  { value: 'new', label: 'زيارة أولى' },
  { value: 'followup', label: 'متابعة علاج' },
  { value: 'other', label: 'استشارة أخرى' },
];

function canPreviewImage(file: { mimeType?: string; fileName: string }) {
  return (
    file.mimeType?.startsWith('image/') === true ||
    /\.(jpe?g|png|webp|heic|heif)$/i.test(file.fileName)
  );
}

export function BookingReviewScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthSession();
  const { scenario, submitBookingRequest } = useMockScenario();
  const { members } = useFamilyMembers();
  const {
    reason,
    setReason,
    note,
    setNote,
    attachment,
    setAttachment,
    prepareForService,
    clearDraft,
  } = useBookingDraft();
  const {
    providerId,
    serviceCode,
    dateKey,
    dateLabel,
    timeLabel,
    patientId,
    reason: legacyReason,
  } = useLocalSearchParams<{
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
  const [reasonSelection, setReasonSelection] = useState<BookingVisitReason | null>(null);
  const [selectingFile, setSelectingFile] = useState(false);
  const [attachmentError, setAttachmentError] = useState('');
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const { colors } = useAppTheme();
  const [revalidationFailure, setRevalidationFailure] = useState<
    'slot' | 'eligibility' | 'branch' | 'service'
  >();

  useEffect(() => {
    if (providerId && serviceCode) prepareForService(providerId + ':' + serviceCode);
  }, [providerId, serviceCode, prepareForService]);

  const provider = getMockProvider(providerId);
  const chosenPatient = members.find((person) => person.id === patientId);
  const patientCanBook = canBookForPatient(patientId, scenario);
  const slotStillInSnapshot = Boolean(
    provider?.availability.some(
      (day) =>
        day.dateKey === dateKey &&
        day.dateLabel === dateLabel &&
        day.slots.includes(timeLabel ?? ''),
    ),
  );
  const activeReason: BookingVisitReason =
    reasonSelection ??
    (legacyReason === 'followup' || legacyReason === 'other' || legacyReason === 'new'
      ? legacyReason
      : reason);
  const visitReasonLabel =
    visitReasons.find((item) => item.value === activeReason)?.label ?? 'زيارة أولى';
  const serviceName =
    penServiceGroups.flatMap((group) => group.families).find((family) => family.id === serviceCode)
      ?.title ?? 'الخدمة المختارة';

  const pickAttachment = async () => {
    if (selectingFile) return;
    setSelectingFile(true);
    setAttachmentError('');
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets[0]) return;
      const file = result.assets[0];
      if (!file.uri) return;
      if (file.size && file.size > 25 * 1024 * 1024) {
        setAttachmentError('حجم الملف أكبر من 25 ميغابايت.');
        return;
      }
      setAttachment({
        uri: file.uri,
        fileName: file.name || 'مرفق محلي',
        mimeType: file.mimeType,
      });
    } catch {
      setAttachmentError('تعذّر اختيار الملف من الجهاز. حاول مرة ثانية.');
    } finally {
      setSelectingFile(false);
    }
  };

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
    if (!patientCanBook || !slotStillInSnapshot || submitted) return;
    if (!isAuthenticated) {
      const returnTo = buildReturnTo('/booking/review', {
        providerId,
        serviceCode,
        dateKey,
        dateLabel,
        timeLabel,
        patientId,
        reason: activeReason,
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
    if (
      scenario.flags?.bookingRevalidationServiceUnpublished ||
      !provider.serviceCodes.includes(serviceCode ?? '')
    ) {
      setRevalidationFailure('service');
      return;
    }

    // Only text selected for visit-summary sharing is sent by the mock.
    // Local files are NEVER uploaded; the request must explicitly say photos: false.
    const summaryText = shareVisitSummary
      ? [visitReasonLabel, note.trim()].filter(Boolean).join(' · ')
      : undefined;
    submitBookingRequest({
      providerId: provider.id,
      providerName: provider.name,
      serviceCode: serviceCode ?? '',
      serviceName,
      branch: provider.branch,
      patientName: chosenPatient.name,
      patientNote: summaryText || undefined,
      dateLabel,
      timeLabel,
      priceLabel: getMockProviderPriceLabel(provider, serviceCode),
      sharingConsent: {
        visitSummary: shareVisitSummary,
        photos: false,
        medicalHistory: false,
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
            <AppText align="center" variant="heading-3" className="mt-4 font-ui-bold">
              طلبك قيد التأكيد
            </AppText>
            <AppText
              align="center"
              variant="caption"
              className="mt-2 max-w-[300px] text-content-secondary"
            >
              حفظنا طلبك التجريبي ضمن حجوزاتي. الموعد ما بيصير مؤكداً قبل رد العيادة.
            </AppText>
          </View>
          <BookingCard className="mt-5 gap-1 p-3">
            <AppText align="right" variant="label" className="font-ui-bold">
              {provider.name}
            </AppText>
            <AppText align="right" variant="caption" className="text-content-secondary">
              {provider.branch} · {serviceName}
            </AppText>
            <AppText align="right" variant="label" className="text-content-link">
              {dateLabel} · {timeLabel}
            </AppText>
          </BookingCard>
          <BookingStatusBanner
            body="لا تعيد إرسال نفس الطلب. حالة الطلب رح تتحدث بعد وصول قرار العيادة."
            title="شو بصير هلق؟"
            tone="warning"
          />
          <Button
            className="mt-5"
            label="عرض مواعيدي"
            onPress={() =>
              router.replace({ pathname: '/(tabs)/care', params: { tab: 'bookings' } })
            }
          />
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

  const imagePreview =
    attachment && canPreviewImage(attachment)
      ? [{ uri: attachment.uri, fileName: attachment.fileName }]
      : [];

  return (
    <Screen contentClassName="px-0 py-0">
      <BookingHeader title="مراجعة الحجز" />
      <KeyboardAwareScrollView
        bottomOffset={Platform.OS === 'android' ? 16 : 90}
        contentContainerClassName="mx-auto w-full max-w-[430px] gap-3 px-4 pb-28 pt-3"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BookingJourneyProgress step={3} />
        <View className="gap-1">
          <AppText align="right" variant="heading-4" className="font-ui-bold">
            راجع تفاصيل حجزك
          </AppText>
          <AppText align="right" variant="caption" className="text-content-secondary">
            شيّك الموعد والمريض، وأضف معلومات للطبيب فقط إذا بتحب.
          </AppText>
        </View>
        <BookingCard className="gap-3 rounded-[14px] p-3">
          <BookingProviderMiniCard
            branch={provider.branch + ' · ' + provider.area}
            portraitUri={provider.imageUrl}
            providerName={provider.name}
            serviceName={serviceName}
          />
          <View className="gap-2 border-t border-border-subtle pt-3">
            <View className="flex-row-reverse items-center justify-between gap-2">
              <AppText align="right" variant="caption" className="text-content-secondary">
                المريض
              </AppText>
              <AppText align="left" variant="label" className="min-w-0 flex-1 font-ui-semibold">
                {chosenPatient.name}
              </AppText>
            </View>
            <View className="flex-row-reverse items-center justify-between gap-2">
              <AppText align="right" variant="caption" className="text-content-secondary">
                الموعد المطلوب
              </AppText>
              <AppText align="left" variant="label" className="min-w-0 flex-1 font-ui-semibold">
                {dateLabel} · {timeLabel}
              </AppText>
            </View>
            <View className="flex-row-reverse items-center justify-between gap-2">
              <AppText align="right" variant="caption" className="text-content-secondary">
                السعر المعروض
              </AppText>
              <AppText direction="ltr" variant="label" className="font-ui-bold text-content-link">
                {getMockProviderPriceLabel(provider, serviceCode)}
              </AppText>
            </View>
          </View>
        </BookingCard>

        <Accordion
          selectionMode="single"
          isCollapsible
          variant="surface"
          defaultValue={legacyReason || note.trim() || attachment ? 'visit-info' : undefined}
          className="rounded-[14px] border border-border-subtle bg-surface-default"
        >
          <Accordion.Item value="visit-info">
            <Accordion.Trigger>
              <View className="flex-row-reverse flex-1 items-center gap-3 py-1">
                <View className="h-10 w-10 items-center justify-center rounded-[11px] bg-action-subtle">
                  <AppIcon
                    name={{ ios: 'text.bubble', android: 'edit_note', web: 'edit_note' }}
                    tone="action"
                    size={21}
                  />
                </View>
                <View className="min-w-0 flex-1 items-end gap-1">
                  <AppText align="right" variant="label" className="font-ui-bold">
                    معلومات أولية للطبيب (اختياري)
                  </AppText>
                  <AppText align="right" variant="caption" className="text-content-secondary">
                    سبب الزيارة، ملاحظة أو مرفق محفوظ على جهازك
                  </AppText>
                </View>
                <Accordion.Indicator />
              </View>
            </Accordion.Trigger>
            <Accordion.Content>
              <View className="gap-4 border-t border-border-subtle px-3 pb-3 pt-3">
                <View className="gap-2">
                  <AppText align="right" variant="label" className="font-ui-semibold">
                    سبب الزيارة
                  </AppText>
                  <RadioGroup
                    value={activeReason}
                    onValueChange={(next) => {
                      setReason(next as BookingVisitReason);
                      setReasonSelection(next as BookingVisitReason);
                    }}
                    className="gap-2"
                  >
                    {visitReasons.map((item) => (
                      <RadioGroup.Item
                        key={item.value}
                        value={item.value}
                        className={
                          'min-h-[44px] flex-row-reverse items-center justify-between rounded-[11px] border px-3 py-2 ' +
                          (activeReason === item.value
                            ? 'border-action-primary bg-action-subtle'
                            : 'border-border-subtle bg-surface-default')
                        }
                      >
                        <AppText
                          align="right"
                          variant="label"
                          className="min-w-0 flex-1 font-ui-semibold"
                        >
                          {item.label}
                        </AppText>
                        <Radio />
                      </RadioGroup.Item>
                    ))}
                  </RadioGroup>
                </View>

                <TextField
                  label="ملاحظة للطبيب (اختيارية)"
                  value={note}
                  onChangeText={setNote}
                  placeholder="مثلاً: سبب الموعد أو سؤال بدك تسأله للطبيب"
                  multiline
                  maxLength={500}
                  helperText={`${note.length}/500`}
                />

                <View className="gap-2">
                  <AppText align="right" variant="label" className="font-ui-semibold">
                    مرفق محلي (اختياري)
                  </AppText>
                  <Button
                    label={attachment ? 'تغيير الملف' : 'اختيار صورة أو PDF'}
                    size="sm"
                    variant="outline"
                    loading={selectingFile}
                    onPress={() => void pickAttachment()}
                  />
                  {attachment ? (
                    <View className="flex-row-reverse items-center gap-2 rounded-[11px] bg-surface-subtle p-2.5">
                      <AppIcon
                        name={{
                          ios: 'doc.text',
                          android: 'insert_drive_file',
                          web: 'insert_drive_file',
                        }}
                        tone="action"
                        size={19}
                      />
                      <View className="min-w-0 flex-1 items-end gap-0.5">
                        <AppText
                          align="right"
                          variant="label"
                          numberOfLines={1}
                          className="w-full font-ui-semibold"
                        >
                          {attachment.fileName}
                        </AppText>
                        <AppText align="right" variant="caption" className="text-content-secondary">
                          على جهازك فقط
                        </AppText>
                      </View>
                      {canPreviewImage(attachment) ? (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={'عرض ' + attachment.fileName}
                          className="h-10 w-10 items-center justify-center rounded-[10px] bg-action-subtle"
                          onPress={() => setPreviewUri(attachment.uri)}
                        >
                          <AppIcon
                            name={{ ios: 'eye', android: 'visibility', web: 'visibility' }}
                            size={19}
                            tone="action"
                          />
                        </Pressable>
                      ) : null}
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={'حذف ' + attachment.fileName}
                        className="h-10 w-10 items-center justify-center rounded-[10px] bg-surface-default"
                        onPress={() => {
                          setPreviewUri(null);
                          setAttachment(null);
                        }}
                      >
                        <AppIcon
                          name={{ ios: 'trash', android: 'delete_outline', web: 'delete_outline' }}
                          size={19}
                          tone="danger"
                        />
                      </Pressable>
                    </View>
                  ) : null}
                  {attachmentError ? (
                    <AppText align="right" variant="caption" className="text-tone-danger-text">
                      {attachmentError}
                    </AppText>
                  ) : null}
                  <View className="flex-row-reverse items-start gap-2 rounded-[10px] bg-tone-info-fill p-2.5">
                    <AppIcon
                      name={{ ios: 'info.circle', android: 'info_outline', web: 'info_outline' }}
                      tone="info"
                      size={17}
                    />
                    <AppText
                      align="right"
                      variant="caption"
                      className="min-w-0 flex-1 text-tone-info-text"
                    >
                      الصورة أو PDF للمعاينة المحلية فقط، ولا تُرفع أو تُرسل للطبيب ضمن نسخة Mock.
                    </AppText>
                  </View>
                </View>
              </View>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>

        <View className="flex-row-reverse items-center gap-3 rounded-[12px] bg-surface-subtle p-3">
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" variant="label" className="font-ui-semibold">
              مشاركة سبب الزيارة والملاحظة
            </AppText>
            <AppText align="right" variant="caption" className="text-content-secondary">
              عند التفعيل، تُدرج المعلومات النصية ضمن طلب الحجز. لا يشمل الصور أو السجل الصحي.
            </AppText>
          </View>
          <Switch
            accessibilityLabel="مشاركة سبب الزيارة والملاحظة"
            accessibilityRole="switch"
            value={shareVisitSummary}
            onValueChange={setShareVisitSummary}
            thumbColor={colors.surface.default}
            trackColor={{ false: colors.border.strong, true: colors.action.primary }}
          />
        </View>
        <View className="flex-row-reverse items-start gap-2 rounded-[11px] bg-tone-info-fill p-3">
          <AppIcon
            name={{ ios: 'shield.lefthalf.filled', android: 'verified_user', web: 'verified_user' }}
            size={18}
            tone="info"
          />
          <AppText align="right" variant="caption" className="min-w-0 flex-1 text-tone-info-text">
            إرسال الطلب لا يؤكد الموعد. اسم المريض والخدمة والوقت يذهبون ضمن طلب الحجز، وما في رفع
            للملفات الطبية بهالنسخة.
          </AppText>
        </View>

        {failureCopy ? (
          <View className="gap-2">
            <BookingStatusBanner body={failureCopy.body} title={failureCopy.title} tone="warning" />
            <Button
              label={failureCopy.action}
              variant="outline"
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
            />
          </View>
        ) : null}
      </KeyboardAwareScrollView>
      <View className="border-t border-border-subtle bg-surface-canvas px-4 pb-3 pt-3">
        <View className="mx-auto w-full max-w-[430px]">
          <Button
            className="min-h-[52px] rounded-[12px]"
            disabled={Boolean(revalidationFailure)}
            endIcon={{ ios: 'paperplane.fill', android: 'send', web: 'send' }}
            label="إرسال طلب الحجز"
            onPress={submitBooking}
          />
        </View>
      </View>
      <AssessmentImagePreview
        images={imagePreview}
        activeUri={previewUri}
        onChange={setPreviewUri}
        onClose={() => setPreviewUri(null)}
      />
    </Screen>
  );
}
