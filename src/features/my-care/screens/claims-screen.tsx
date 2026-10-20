import { Radio } from 'heroui-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';

import { CareV5Badge, CareV5Card, CareV5Header } from '@/features/my-care/components/care-v5-ui';
import {
  getMockCareCaseForScenario,
  getMockCareReferenceLabel,
} from '@/features/my-care/mocks/care.mock';
import { CareActionFooter } from '@/features/my-care/components/care-financial-ui';
import {
  AppIcon,
  AppText,
  Button,
  ReadStateBoundary,
  Screen,
  StateView,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { cn } from '@/shared/utils/cn';

interface ClaimsScreenProps {
  caseId: string;
}

const issueTypes = [
  {
    id: 'treatment',
    label: 'مشكلة في العلاج أو المتابعة',
    icon: { ios: 'cross.case.fill', android: 'medical_services', web: 'medical_services' },
  },
  {
    id: 'appointment',
    label: 'مشكلة في الموعد أو التواصل',
    icon: { ios: 'calendar.badge.exclamationmark', android: 'event_busy', web: 'event_busy' },
  },
  {
    id: 'payment',
    label: 'نزاع على دفعة خارجية',
    icon: { ios: 'banknote.fill', android: 'payments', web: 'payments' },
  },
  {
    id: 'refund',
    label: 'طلب استرداد وفق الشروط',
    icon: { ios: 'arrow.uturn.backward.circle.fill', android: 'undo', web: 'undo' },
  },
  {
    id: 'refund-execution',
    label: 'مشكلة في تنفيذ الاسترداد',
    icon: { ios: 'exclamationmark.bubble.fill', android: 'report_problem', web: 'report_problem' },
  },
] as const;

export function ClaimsScreen({ caseId }: ClaimsScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{ issue?: string }>();
  const { colors } = useAppTheme();
  const { claimSubmissions, getSurfaceState, submitCaseIssue, submitRefundRequest, scenario } =
    useMockScenario();
  const readState = getSurfaceState('claims');
  const initialType = issueTypes.some((item) => item.id === params.issue)
    ? (params.issue as (typeof issueTypes)[number]['id'])
    : 'treatment';
  const [choice, setChoice] = useState<{
    issue: string | undefined;
    type: (typeof issueTypes)[number]['id'];
  }>();
  // URL issue changes update the selection without a synchronous effect/state update.
  const type = choice && choice.issue === params.issue ? choice.type : initialType;
  const [description, setDescription] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [evidenceTitles, setEvidenceTitles] = useState<string[]>([]);
  const [picking, setPicking] = useState(false);
  const [attachmentError, setAttachmentError] = useState('');
  const careCase = getMockCareCaseForScenario(caseId, scenario);
  const financeAvailable = caseId === 'case-001';
  const existingRefund = claimSubmissions.find(
    (claim) => claim.caseId === caseId && claim.id === `session-refund-${caseId}`,
  );
  const acceptedTotal = Number(careCase?.acceptedTotalLabel.replace(/[^0-9]/g, '') ?? 0);
  const amountValue = Number(refundAmount);
  const validRefundAmount =
    refundAmount.trim().length > 0 &&
    Number.isSafeInteger(amountValue) &&
    amountValue > 0 &&
    amountValue <= acceptedTotal;

  if (!careCase) {
    return (
      <Screen contentClassName="px-0 py-0">
        <CareV5Header leftIcon="shield" leftTone="danger" title="إنشاء مشكلة أو شكوى" />
        <View className="px-4 pt-4">
          <StateView title="الحالة غير موجودة" />
        </View>
      </Screen>
    );
  }

  const addEvidence = async () => {
    if (picking || evidenceTitles.length >= 3) return;
    setPicking(true);
    setAttachmentError('');
    try {
      const selection = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        quality: 0.8,
      });
      if (selection.canceled) return;
      const attachment = selection.assets[0];
      if (!attachment) return;
      if (attachment.fileSize && attachment.fileSize > 25 * 1024 * 1024) {
        setAttachmentError('حجم الصورة كبير جداً.');
        return;
      }
      setEvidenceTitles((current) => [
        ...current,
        attachment.fileName || `صورة ${current.length + 1}`,
      ]);
    } catch {
      setAttachmentError('تعذّر فتح الصور، حاول مجدداً.');
    } finally {
      setPicking(false);
    }
  };

  const submit = () => {
    if (type === 'refund') {
      if (
        !financeAvailable ||
        existingRefund ||
        !validRefundAmount ||
        description.trim().length < 8
      )
        return;
      submitRefundRequest({
        caseId,
        amountLabel: `${amountValue.toLocaleString('en-US')} ل.س`,
        reason: description.trim(),
      });
      router.push({
        pathname: '/care/[caseId]/claims/[claimId]',
        params: { caseId, claimId: `session-refund-${caseId}` },
      });
      return;
    }

    const issueLabel = issueTypes.find((item) => item.id === type)?.label ?? 'مشكلة';
    const issueCategory = {
      treatment: 'clinical',
      appointment: 'appointment',
      payment: 'external-payment-dispute',
      'refund-execution': 'refund-execution',
    } as const;
    submitCaseIssue({
      caseId,
      type: issueCategory[type],
      reason: `${issueLabel}: ${description.trim()}`,
      evidenceTitles,
    });
    router.push({
      pathname: '/care/[caseId]/claims/[claimId]',
      params: { caseId, claimId: `session-issue-${caseId}-${issueCategory[type]}` },
    });
  };

  return (
    <Screen contentClassName="px-0 py-0">
      <CareV5Header leftIcon="shield" leftTone="danger" title="إنشاء مشكلة أو شكوى" />

      <ReadStateBoundary
        emptyTitle="إنشاء المشكلة غير متاح"
        permissionDescription="التفويض الحالي ما عاد يسمح بإرسال مشكلة أو شكوى لهالمريض."
        permissionTitle="ما عاد في صلاحية لإرسال المشكلة"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <ScrollView
          contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-[74px] pt-2"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="min-h-[60px] rounded-[13px] bg-tone-info-fill px-3 py-[10px]">
            <View className="flex-row-reverse items-center gap-[6px]">
              <AppIcon
                name={{
                  ios: 'bubble.left',
                  android: 'chat_bubble_outline',
                  web: 'chat_bubble_outline',
                }}
                size={17}
                tone="info"
              />
              <AppText
                align="right"
                className="min-w-0 flex-1 font-ui-bold text-content-primary"
                variant="label"
              >
                ما نوع المشكلة؟
              </AppText>
              <CareV5Badge label="مرتبطة بهذه الحالة" tone="info" />
            </View>
            <AppText className="mt-1 text-type-caption  text-content-primary" variant="caption">
              الحالة #{getMockCareReferenceLabel(caseId)} · اختر نوع المشكلة حتى نوجّه طلبك إلى مسار
              المراجعة الصحيح.
            </AppText>
          </View>

          <View className="mt-2 gap-[7px]">
            {issueTypes
              .filter(
                (item) =>
                  (item.id !== 'refund-execution' || params.issue === 'refund-execution') &&
                  (financeAvailable ||
                    (item.id !== 'payment' &&
                      item.id !== 'refund' &&
                      item.id !== 'refund-execution')),
              )
              .map((item) => {
                const selected = item.id === type;
                return (
                  <Radio
                    isSelected={selected}
                    onSelectedChange={() => setChoice({ issue: params.issue, type: item.id })}
                    className={cn(
                      'min-h-[42px] flex-row-reverse items-center gap-2 rounded-[12px] border px-3 py-[6px]',
                      selected
                        ? 'border-action-primary bg-action-subtle'
                        : 'border-border-default bg-surface-default',
                    )}
                    key={item.id}
                  >
                    <AppIcon name={item.icon} size={16} tone={selected ? 'action' : 'secondary'} />
                    <AppText
                      align="right"
                      className={cn(
                        'min-w-0 flex-1 text-type-label',
                        selected ? 'font-ui-bold text-content-link' : 'text-content-primary',
                      )}
                      variant="label"
                    >
                      {item.label}
                    </AppText>
                    <Radio.Indicator />
                  </Radio>
                );
              })}
          </View>

          <CareV5Card className="mt-2 gap-[2px] rounded-[13px] px-3 py-[8px]">
            <AppText
              align="right"
              className="font-ui-bold text-content-primary"
              style={{ fontSize: 12, lineHeight: 20 }}
              variant="label"
            >
              السجلات المرتبطة
            </AppText>
            {[
              ['الحالة', careCase.title],
              ['العيادة', careCase.branch],
              ['الخطة المقبولة', careCase.planVersionLabel],
              ['قيمة الخطة', careCase.acceptedTotalLabel],
            ].map(([label, value]) => (
              <View
                className="min-h-[18px] flex-row-reverse items-center justify-between gap-2"
                key={label}
              >
                <AppText
                  align="right"
                  className="shrink-0 text-content-secondary"
                  style={{ fontSize: 10, lineHeight: 16 }}
                  variant="caption"
                >
                  {label}
                </AppText>
                <AppText
                  align="left"
                  className="min-w-0 flex-1 font-ui-semibold text-content-primary"
                  style={{ fontSize: 10.5, lineHeight: 17 }}
                  variant="caption"
                >
                  {value}
                </AppText>
              </View>
            ))}
          </CareV5Card>

          {type === 'refund' ? (
            <CareV5Card className="mt-2 gap-2 rounded-[12px] p-3">
              <AppText
                align="right"
                className="font-ui-semibold text-content-primary"
                variant="label"
              >
                مبلغ الاسترداد المطلوب (ل.س)
              </AppText>
              <TextInput
                accessibilityLabel="مبلغ الاسترداد المطلوب بالليرة السورية"
                className="min-h-[42px] rounded-[9px] border border-border-subtle bg-surface-subtle px-3 font-ui-semibold text-content-primary"
                keyboardType="number-pad"
                maxLength={9}
                onChangeText={(value) => setRefundAmount(value.replace(/[^0-9]/g, ''))}
                placeholder="أدخل المبلغ"
                placeholderTextColor={colors.text.placeholder}
                style={{ textAlign: 'right', writingDirection: 'ltr' }}
                value={refundAmount}
              />
              <AppText align="right" className="text-content-secondary" variant="caption">
                قيمة الخطة المقبولة: {careCase.acceptedTotalLabel}. الطلب يخضع للتحقق من الدفعات
                والشروط، ولا يعني الموافقة على الاسترداد.
              </AppText>
              {refundAmount.length > 0 && !validRefundAmount ? (
                <AppText align="right" className="text-tone-danger-text" variant="caption">
                  أدخل مبلغاً صحيحاً لا يتجاوز إجمالي الخطة المرتبطة بالحالة.
                </AppText>
              ) : null}
            </CareV5Card>
          ) : null}

          {type === 'refund' && existingRefund ? (
            <CareV5Card className="mt-2 gap-2 rounded-[12px] p-3">
              <CareV5Badge label="قيد المراجعة" tone="warning" />
              <AppText align="right" className="text-content-primary" variant="caption">
                في طلب استرداد مرسل لهالحالة. بتقدر تراجع تفاصيله بدون إعادة إرساله.
              </AppText>
            </CareV5Card>
          ) : null}

          <View className="mt-2 min-h-[86px] rounded-[13px] border border-border-default bg-surface-default px-3 py-[10px]">
            <AppText align="right" className="font-ui-bold text-content-primary" variant="label">
              {type === 'refund' ? 'ليش عم تطلب الاسترداد؟' : 'اشرح ما حدث'}
            </AppText>
            <TextInput
              className="mt-1 min-h-[45px] p-0 font-ui-regular text-sm leading-5 text-content-primary"
              multiline
              maxLength={500}
              onChangeText={setDescription}
              placeholder={type === 'refund' ? 'اكتب سبب طلب الاسترداد' : 'اكتب تفاصيل المشكلة'}
              placeholderTextColor={colors.text.placeholder}
              style={{ textAlign: 'right', textAlignVertical: 'top', writingDirection: 'rtl' }}
              value={description}
            />
            <AppText
              direction="ltr"
              className="mt-1 text-type-caption text-content-placeholder"
              variant="caption"
            >
              {description.length} / 500
            </AppText>
          </View>

          {type !== 'refund' ? (
            <>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="إضافة صورة داعمة من الجهاز"
                disabled={picking || evidenceTitles.length >= 3}
                onPress={() => void addEvidence()}
              >
                <CareV5Card className="mt-2 min-h-[52px] flex-row-reverse items-center gap-2 rounded-[13px] px-[9px] py-[7px]">
                  <View className="flex-row-reverse items-center gap-[4px]">
                    <View className="h-[28px] w-[28px] items-center justify-center rounded-[8px] bg-tone-info-fill">
                      <AppIcon
                        name={{
                          ios: 'message',
                          android: 'chat_bubble_outline',
                          web: 'chat_bubble_outline',
                        }}
                        size={15}
                        tone="info"
                      />
                    </View>
                    <View className="h-[28px] w-[28px] items-center justify-center rounded-[8px] bg-action-subtle">
                      <AppIcon
                        name={{ ios: 'photo', android: 'image', web: 'image' }}
                        size={15}
                        tone="action"
                      />
                    </View>
                    <AppIcon
                      name={{ ios: 'paperclip', android: 'attach_file', web: 'attach_file' }}
                      size={17}
                      tone="secondary"
                    />
                  </View>
                  <View className="min-w-0 flex-1 items-end">
                    <AppText align="right" className="font-ui-bold text-type-label">
                      الأدلة الداعمة
                    </AppText>
                    <AppText
                      align="right"
                      className="mt-0.5 text-type-caption text-content-secondary"
                      variant="caption"
                    >
                      {evidenceTitles.length
                        ? `${evidenceTitles.length} صور مختارة محلياً: ${evidenceTitles.join('، ')}`
                        : 'إضافة صورة داعمة من الجهاز (حد أقصى 3)'}
                    </AppText>
                  </View>
                  <CareV5Badge label="محلي" tone="primary" />
                </CareV5Card>
              </Pressable>

              <View className="mt-2 flex-row-reverse items-center gap-2 rounded-[11px] bg-tone-warning-fill px-3 py-[9px]">
                <AppIcon
                  name={{
                    ios: 'person.crop.circle',
                    android: 'support_agent',
                    web: 'support_agent',
                  }}
                  size={17}
                  tone="warning"
                />
                <AppText
                  align="right"
                  className="min-w-0 flex-1 text-tone-warning-text"
                  variant="caption"
                >
                  الصور المختارة محلية فقط؛ لم تُرفع إلى السيرفر أو إلى فريق الدعم.
                </AppText>
              </View>
            </>
          ) : (
            <View className="mt-2 rounded-[10px] bg-tone-info-fill px-3 py-2">
              <AppText align="right" className="text-tone-info-text" variant="caption">
                إثباتات الدفع تُراجع لاحقاً ضمن طلب الاسترداد. حالياً هذا الطلب تجريبي ولا تُرسل
                ملفات للسيرفر.
              </AppText>
            </View>
          )}

          {attachmentError ? (
            <AppText align="right" className="mt-2 text-tone-danger-text" variant="caption">
              {attachmentError}
            </AppText>
          ) : null}
        </ScrollView>

        <CareActionFooter>
          <Button
            className="h-[52px] rounded-[12px]"
            disabled={
              readState !== 'success' ||
              description.trim().length < 8 ||
              (type === 'refund' && (!financeAvailable || !!existingRefund || !validRefundAmount))
            }
            endIcon={{ ios: 'paperplane.fill', android: 'send', web: 'send' }}
            label={
              type === 'refund'
                ? existingRefund
                  ? 'طلب الاسترداد قيد المراجعة'
                  : 'إرسال طلب الاسترداد للمراجعة'
                : 'إرسال المشكلة للمراجعة'
            }
            onPress={submit}
          />
        </CareActionFooter>
      </ReadStateBoundary>
    </Screen>
  );
}
