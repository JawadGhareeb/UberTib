import { Radio } from 'heroui-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { KeyboardResponsiveScrollView } from '@/shared/components/ui/keyboard-responsive-scroll-view';

import { AssessmentImagePreview } from '@/features/assessment/components/assessment-image-preview';
import { CareActionFooter } from '@/features/my-care/components/care-financial-ui';
import { CareV5Badge, CareV5Card, CareV5Header } from '@/features/my-care/components/care-v5-ui';
import {
  getMockCareCaseForScenario,
  getMockCareReferenceLabel,
} from '@/features/my-care/mocks/care.mock';
import {
  AppIcon,
  AppText,
  Button,
  ReadStateBoundary,
  Screen,
  StateView,
  TextField,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

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

type IssueType = (typeof issueTypes)[number]['id'];
type LocalEvidence = { uri: string; fileName: string };

export function ClaimsScreen({ caseId }: { caseId: string }) {
  const router = useRouter();
  const params = useLocalSearchParams<{ issue?: string }>();
  const { claimSubmissions, getSurfaceState, submitCaseIssue, submitRefundRequest, scenario } =
    useMockScenario();
  const readState = getSurfaceState('claims');
  const financeAvailable = caseId === 'case-001';
  const availableTypes = issueTypes.filter(
    (item) =>
      (item.id !== 'refund-execution' || params.issue === 'refund-execution') &&
      (financeAvailable ||
        (item.id !== 'payment' && item.id !== 'refund' && item.id !== 'refund-execution')),
  );
  const initialType: IssueType =
    availableTypes.find((item) => item.id === params.issue)?.id ?? 'treatment';
  const [choice, setChoice] = useState<{ issue: string | undefined; type: IssueType }>();
  const type = choice && choice.issue === params.issue ? choice.type : initialType;
  const [description, setDescription] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [evidenceImages, setEvidenceImages] = useState<LocalEvidence[]>([]);
  const evidenceTitles = evidenceImages.map((item) => item.fileName);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [attachmentError, setAttachmentError] = useState('');
  const careCase = getMockCareCaseForScenario(caseId, scenario);
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
        <CareV5Header title="الإبلاغ عن مشكلة" leftIcon="shield" />
        <View className="px-4 pt-5">
          <StateView title="الحالة غير موجودة" />
        </View>
      </Screen>
    );
  }

  const addEvidence = async () => {
    if (picking || evidenceImages.length >= 3) return;
    setPicking(true);
    setAttachmentError('');
    try {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        quality: 0.8,
      });
      if (response.canceled || !response.assets[0]) return;
      const asset = response.assets[0];
      if (!asset.uri) return;
      if (asset.fileSize && asset.fileSize > 25 * 1024 * 1024) {
        setAttachmentError('حجم الصورة أكبر من 25 ميغابايت.');
        return;
      }
      setEvidenceImages((current) =>
        current.some((image) => image.uri === asset.uri)
          ? current
          : [
              ...current,
              { uri: asset.uri, fileName: asset.fileName || `صورة ${current.length + 1}` },
            ],
      );
    } catch {
      setAttachmentError('تعذّر فتح الصور، حاول مرة ثانية.');
    } finally {
      setPicking(false);
    }
  };

  const submit = () => {
    if (description.trim().length < 8 || readState !== 'success') return;
    if (type === 'refund') {
      if (!financeAvailable || existingRefund || !validRefundAmount) return;
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
      <CareV5Header leftIcon="shield" title="الإبلاغ عن مشكلة" />
      <ReadStateBoundary
        emptyTitle="إنشاء المشكلة غير متاح"
        permissionDescription="التفويض الحالي ما عاد يسمح بإرسال مشكلة أو شكوى لهالمريض."
        permissionTitle="ما عاد في صلاحية لإرسال المشكلة"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <KeyboardResponsiveScrollView
          contentContainerClassName="mx-auto w-full max-w-[430px] gap-3 px-4 pb-28 pt-3"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-2 rounded-[14px] bg-action-subtle p-3">
            <View className="flex-row-reverse items-center gap-2">
              <AppIcon
                name={{
                  ios: 'exclamationmark.bubble',
                  android: 'report_problem',
                  web: 'report_problem',
                }}
                tone="action"
                size={22}
              />
              <View className="min-w-0 flex-1 items-end gap-0.5">
                <AppText align="right" variant="heading-4" className="font-ui-bold">
                  خبرنا شو صار معك
                </AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">
                  المشكلة مرتبطة بهذه الحالة تحديداً
                </AppText>
              </View>
            </View>
            <View className="flex-row-reverse justify-between border-t border-action-primary/20 pt-2">
              <AppText align="right" variant="caption" className="text-content-secondary">
                الحالة #{getMockCareReferenceLabel(caseId)}
              </AppText>
              <AppText align="left" variant="caption" className="min-w-0 flex-1 font-ui-semibold">
                {careCase.title}
              </AppText>
            </View>
          </View>

          <View className="gap-2">
            <AppText align="right" variant="heading-4" className="font-ui-bold">
              1. نوع المشكلة
            </AppText>
            {availableTypes.map((item) => {
              const selected = item.id === type;
              return (
                <Radio
                  key={item.id}
                  isSelected={selected}
                  onSelectedChange={() => setChoice({ issue: params.issue, type: item.id })}
                  accessibilityLabel={item.label}
                  className={`min-h-[55px] flex-row-reverse items-center gap-3 rounded-[12px] border px-3 py-2 ${selected ? 'border-action-primary bg-action-subtle' : 'border-border-subtle bg-surface-default'}`}
                >
                  <View className="h-9 w-9 items-center justify-center rounded-[10px] bg-action-subtle">
                    <AppIcon name={item.icon} size={19} tone="action" />
                  </View>
                  <AppText
                    align="right"
                    variant="label"
                    className={
                      selected
                        ? 'min-w-0 flex-1 font-ui-semibold text-content-link'
                        : 'min-w-0 flex-1 text-content-primary'
                    }
                  >
                    {item.label}
                  </AppText>
                  <Radio.Indicator />
                </Radio>
              );
            })}
          </View>

          <CareV5Card className="gap-1 rounded-[13px] p-3">
            <AppText align="right" variant="label" className="font-ui-bold">
              مرجع المشكلة
            </AppText>
            <AppText align="right" variant="caption" className="text-content-secondary">
              {careCase.provider} · {careCase.branch} · {careCase.planVersionLabel}
            </AppText>
            <AppText align="right" variant="caption" className="text-content-secondary">
              إجمالي الخطة: {careCase.acceptedTotalLabel}
            </AppText>
          </CareV5Card>

          {type === 'refund' ? (
            <View className="gap-2">
              <TextField
                label="مبلغ الاسترداد المطلوب (ل.س)"
                placeholder="أدخل المبلغ"
                direction="ltr"
                keyboardType="number-pad"
                maxLength={9}
                value={refundAmount}
                onChangeText={(value) => setRefundAmount(value.replace(/[^0-9]/g, ''))}
                error={
                  refundAmount.length > 0 && !validRefundAmount
                    ? 'أدخل مبلغاً صحيحاً لا يتجاوز إجمالي الخطة المرتبطة بالحالة.'
                    : undefined
                }
                helperText="المبلغ يخضع للتحقق من الدفعات الفعلية والشروط؛ إرسال الطلب لا يعني الموافقة."
              />
              {existingRefund ? (
                <View className="rounded-[12px] bg-tone-warning-fill p-3">
                  <CareV5Badge label="قيد المراجعة" tone="warning" />
                  <AppText align="right" variant="caption" className="mt-2 text-content-secondary">
                    في طلب استرداد مرسل لهذه الحالة، ما في داعي تعيد إرساله.
                  </AppText>
                </View>
              ) : null}
            </View>
          ) : null}

          <View className="gap-1">
            <AppText align="right" variant="heading-4" className="font-ui-bold">
              2. تفاصيل المشكلة
            </AppText>
            <TextField
              label={type === 'refund' ? 'سبب طلب الاسترداد' : 'اشرح ما حدث'}
              multiline
              maxLength={500}
              placeholder={
                type === 'refund'
                  ? 'خبرنا ليش عم تطلب الاسترداد'
                  : 'اشرح المشكلة والأثر عليك، وأي معلومات بتساعد بالمراجعة'
              }
              value={description}
              onChangeText={setDescription}
              helperText={`${description.length}/500 · الحد الأدنى 8 أحرف`}
              error={
                description.trim().length > 0 && description.trim().length < 8
                  ? 'وصف المشكلة لازم يكون 8 أحرف على الأقل.'
                  : undefined
              }
            />
          </View>

          {type !== 'refund' ? (
            <View className="gap-2">
              <View className="flex-row-reverse items-center justify-between gap-2">
                <AppText align="right" variant="heading-4" className="font-ui-bold">
                  3. الصور الداعمة
                </AppText>
                <AppText variant="caption" className="text-content-secondary">
                  اختيارية · حتى 3 صور
                </AppText>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="إضافة صورة داعمة من المعرض"
                disabled={picking || evidenceImages.length >= 3}
                className="min-h-[89px] items-center justify-center gap-2 rounded-[13px] border-2 border-dashed border-action-primary/30 bg-action-subtle p-3"
                onPress={() => void addEvidence()}
              >
                <AppIcon
                  name={{
                    ios: 'photo.badge.plus',
                    android: 'add_photo_alternate',
                    web: 'add_photo_alternate',
                  }}
                  tone="action"
                  size={25}
                />
                <AppText variant="label" className="font-ui-semibold text-content-link">
                  {evidenceImages.length >= 3 ? 'وصلت للحد الأقصى' : 'إضافة صورة من الجهاز'}
                </AppText>
              </Pressable>
              {evidenceImages.map((image) => (
                <CareV5Card
                  key={image.uri}
                  className="min-h-[58px] flex-row-reverse items-center gap-2 rounded-[12px] p-2"
                >
                  <View className="h-10 w-10 items-center justify-center rounded-[9px] bg-action-subtle">
                    <AppIcon
                      name={{ ios: 'photo', android: 'image', web: 'image' }}
                      size={19}
                      tone="action"
                    />
                  </View>
                  <AppText
                    align="right"
                    variant="caption"
                    numberOfLines={1}
                    className="min-w-0 flex-1 font-ui-semibold"
                  >
                    {image.fileName}
                  </AppText>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={'معاينة ' + image.fileName}
                    className="h-10 w-10 items-center justify-center rounded-[10px] bg-action-subtle"
                    onPress={() => setPreviewUri(image.uri)}
                  >
                    <AppIcon
                      name={{ ios: 'eye', android: 'visibility', web: 'visibility' }}
                      tone="action"
                      size={19}
                    />
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={'حذف ' + image.fileName}
                    className="h-10 w-10 items-center justify-center rounded-[10px] bg-surface-subtle"
                    onPress={() =>
                      setEvidenceImages((current) =>
                        current.filter((item) => item.uri !== image.uri),
                      )
                    }
                  >
                    <AppIcon
                      name={{ ios: 'trash', android: 'delete_outline', web: 'delete_outline' }}
                      tone="danger"
                      size={19}
                    />
                  </Pressable>
                </CareV5Card>
              ))}
              <View className="flex-row-reverse items-start gap-2 rounded-[11px] bg-tone-warning-fill p-3">
                <AppIcon
                  name={{ ios: 'lock.shield', android: 'lock', web: 'lock' }}
                  tone="warning"
                  size={18}
                />
                <AppText
                  align="right"
                  variant="caption"
                  className="min-w-0 flex-1 text-tone-warning-text"
                >
                  الصور المختارة قابلة للمعاينة على جهازك، ويُحفظ اسم الملف فقط.
                </AppText>
              </View>
            </View>
          ) : (
            <View className="rounded-[11px] bg-tone-info-fill p-3">
              <AppText align="right" variant="caption" className="text-tone-info-text">
                إثبات الدفع والاسترداد يخضع لمراجعة الجهة المختصة. مرفقات هذا الطلب محفوظة على
                جهازك.
              </AppText>
            </View>
          )}

          {attachmentError ? (
            <AppText align="right" variant="caption" className="text-tone-danger-text">
              {attachmentError}
            </AppText>
          ) : null}
        </KeyboardResponsiveScrollView>
        <CareActionFooter>
          <Button
            className="min-h-[52px] rounded-[12px]"
            disabled={
              readState !== 'success' ||
              description.trim().length < 8 ||
              (type === 'refund' &&
                (!financeAvailable || Boolean(existingRefund) || !validRefundAmount))
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
        <AssessmentImagePreview
          images={evidenceImages}
          activeUri={previewUri}
          onChange={setPreviewUri}
          onClose={() => setPreviewUri(null)}
        />
      </ReadStateBoundary>
    </Screen>
  );
}
