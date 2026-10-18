import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, View } from 'react-native';

import { getMockCareCaseForScenario, mockCareCases } from '@/features/my-care/mocks/care.mock';
import { ReferenceCard, ReferenceHeader, ReferenceIcon } from '@/features/profile/components/patient-reference-ui';
import { AppIcon, AppText, Button, Screen } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { useMockScenario } from '@/shared/mock';

type SupportKind = 'care' | 'refund' | 'payment' | 'protection';
type SupportAction = {
  id: SupportKind;
  label: string;
  description: string;
  icon: AppIconName;
  warm: boolean;
  requiresEligibility?: boolean;
};

const types: SupportAction[] = [
  {
    id: 'refund',
    label: 'طلب استرداد',
    description: 'الأهلية والتنفيذ الخارجي',
    icon: { ios: 'arrow.uturn.backward.circle', android: 'undo', web: 'undo' },
    warm: false,
  },
  {
    id: 'care',
    label: 'شكوى عن الرعاية',
    description: 'مراجعة المشكلة والرد',
    icon: { ios: 'stethoscope', android: 'stethoscope', web: 'stethoscope' },
    warm: true,
  },
  {
    id: 'protection',
    label: 'مطالبة عند وجود استحقاق',
    description: 'قرار بشري واستئناف',
    icon: { ios: 'scalemass', android: 'balance', web: 'balance' },
    warm: true,
    requiresEligibility: true,
  },
  {
    id: 'payment',
    label: 'اعتراض على دفعة',
    description: 'تحقق من مبلغ خارجي',
    icon: { ios: 'doc.text', android: 'receipt_long', web: 'receipt_long' },
    warm: false,
  },
];

const ticketStages = [
  {
    title: 'تم فتح الطلب',
    date: 'مثال',
    icon: { ios: 'checkmark.circle', android: 'check_circle', web: 'check_circle' },
    tone: 'success',
  },
  {
    title: 'راجع الفريق',
    date: 'قيد المراجعة',
    icon: { ios: 'viewfinder', android: 'center_focus_strong', web: 'center_focus_strong' },
    tone: 'action',
  },
  {
    title: 'بانتظار الإيصال',
    date: 'لم يُرفع بعد',
    icon: { ios: 'hourglass', android: 'hourglass_empty', web: 'hourglass_empty' },
    tone: 'warning',
  },
] as const;

/**
 * Global support has no implicit treatment case. A patient explicitly selects
 * the case when entering from Profile, instead of receiving the first demo
 * case's payment, refund, or claim information.
 */
export function HelpSupportScreen() {
  const router = useRouter();
  const { caseId } = useLocalSearchParams<{ caseId?: string }>();
  const { scenario } = useMockScenario();
  const [pendingKind, setPendingKind] = useState<SupportKind | null>(null);
  const [draftOpen, setDraftOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [receiptName, setReceiptName] = useState('');
  const [receiptError, setReceiptError] = useState('');
  const [policyOpen, setPolicyOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [receiptPicking, setReceiptPicking] = useState(false);
  const knownCase = caseId ? getMockCareCaseForScenario(caseId, scenario) : undefined;
  const patientCases = mockCareCases.flatMap((item) => {
    const active = getMockCareCaseForScenario(item.id, scenario);
    return active ? [active] : [];
  });

  async function pickLocalReceipt() {
    if (receiptPicking) return;
    setReceiptPicking(true);
    setReceiptError('');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        quality: 0.85,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (!asset) {
        setReceiptError('تعذر قراءة الصورة، حاول مجدداً.');
        return;
      }
      if (asset.fileSize && asset.fileSize > 25 * 1024 * 1024) {
        setReceiptError('الصورة أكبر من 25 ميغابايت.');
        return;
      }
      setReceiptName(asset.fileName || 'صورة إيصال محلية');
    } catch {
      setReceiptError('تعذر فتح معرض الصور.');
    } finally {
      setReceiptPicking(false);
    }
  }

  function navigateToCase(kind: SupportKind, targetCaseId: string) {
    const candidate = getMockCareCaseForScenario(targetCaseId, scenario);
    if (!candidate) return;
    setPendingKind(null);
    if (kind === 'refund') {
      router.push({ pathname: '/care/[caseId]/claims/refund', params: { caseId: candidate.id } });
    } else if (kind === 'payment') {
      router.push({ pathname: '/care/[caseId]/financial/timeline', params: { caseId: candidate.id } });
    } else if (kind === 'care') {
      router.push({ pathname: '/care/[caseId]/claims', params: { caseId: candidate.id } });
    }
    // Protection claims must stay unavailable until the server explicitly
    // supplies an eligible claim type for the chosen care case.
  }

  function openCategory(kind: SupportKind) {
    if (kind === 'protection') return;
    if (knownCase) navigateToCase(kind, knownCase.id);
    else setPendingKind(kind);
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <ReferenceHeader
        title="المساعدة والدعم"
        icon={{ ios: 'questionmark.circle', android: 'help_outline', web: 'help_outline' }}
      />
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-24 pt-2"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row-reverse items-center gap-2 rounded-[12px] bg-action-subtle p-3">
          <ReferenceIcon
            icon={{ ios: 'lifepreserver', android: 'support_agent', web: 'support_agent' }}
            warm
            size={39}
          />
          <View className="min-w-0 flex-1 items-end">
            <AppText align="right" className="font-ui-bold" variant="label">
              اختر نوع الطلب ليصل إلى المسار الصحيح
            </AppText>
            <AppText align="right" className="text-content-secondary" variant="caption">
              لكل طلب مهلة وأدلة وقرار مختلف
            </AppText>
          </View>
        </View>

        <View className="mt-2 flex-row-reverse flex-wrap justify-between gap-y-2">
          {types.map((item) => (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: item.requiresEligibility === true }}
              className="w-[49%]"
              disabled={item.requiresEligibility === true}
              key={item.id}
              onPress={() => openCategory(item.id)}
            >
              <ReferenceCard className="min-h-[58px] flex-row-reverse items-center gap-[7px] px-[9px] py-[7px]">
                <ReferenceIcon icon={item.icon} warm={item.warm} info={item.id === 'payment'} size={33} />
                <View className="min-w-0 flex-1 items-end">
                  <AppText align="right" className="font-ui-semibold" numberOfLines={2} style={{ fontSize: 11, lineHeight: 17 }} variant="caption">
                    {item.label}
                  </AppText>
                  <AppText align="right" className="text-content-secondary" numberOfLines={2} style={{ fontSize: 9, lineHeight: 14 }} variant="caption">
                    {item.description}
                  </AppText>
                </View>
              </ReferenceCard>
            </Pressable>
          ))}
        </View>

        <View className="mt-2 min-h-[40px] flex-row-reverse items-center gap-2 rounded-[11px] bg-surface-subtle px-3 py-[8px]">
          <AppText
            align="right"
            className="min-w-0 flex-1 text-content-secondary"
            style={{ fontSize: 10.5, lineHeight: 17 }}
            variant="caption"
          >
            المطالبة ليست بديلاً عن الشكوى أو الاسترداد، ولا تتاح إلا مع أهلية فعلية مرتبطة بالحالة.
          </AppText>
          <AppIcon name={{ ios: 'info.circle', android: 'info_outline', web: 'info_outline' }} size={17} tone="info" />
        </View>

        <View className="mt-3 flex-row-reverse items-center justify-between">
          <AppText align="right" className="font-ui-bold" variant="label">
            تذكرة نشطة
          </AppText>
          <AppText className="text-content-secondary" style={{ fontSize: 9.5 }} variant="caption">
            مثال توضيحي · ليس تذكرة مرسلة
          </AppText>
        </View>
        <ReferenceCard className="mt-[7px] gap-[8px] p-[10px]">
          <View className="flex-row-reverse items-start gap-2">
            <ReferenceIcon icon={{ ios: 'ticket', android: 'confirmation_number', web: 'confirmation_number' }} size={33} />
            <View className="min-w-0 flex-1 items-end">
              <AppText align="right" className="font-ui-bold" style={{ fontSize: 11, lineHeight: 17 }} variant="label">
                اعتراض على دفعة خارجية
              </AppText>
              <AppText align="right" className="text-content-secondary" style={{ fontSize: 9, lineHeight: 15 }} variant="caption">
                تذكرة تجريبية · غير مرتبطة بطلب حقيقي
              </AppText>
            </View>
            <View className="rounded-[8px] bg-tone-warning-fill px-[7px] py-[4px]">
              <AppText className="text-tone-warning-text" style={{ fontSize: 9, lineHeight: 14 }} variant="caption">
                بانتظار معلومات
              </AppText>
            </View>
          </View>

          <View className="flex-row-reverse items-center gap-2 rounded-[9px] bg-tone-warning-fill px-3 py-2">
            <AppIcon name={{ ios: 'doc.text', android: 'description', web: 'description' }} tone="warning" size={15} />
            <AppText align="right" className="min-w-0 flex-1 text-tone-warning-text" style={{ fontSize: 10, lineHeight: 16 }} variant="caption">
              مطلوب: صورة إيصال الدفع · تُعرض المهلة عند ربط التذكرة
            </AppText>
          </View>

          <View className="flex-row-reverse items-center gap-1 rounded-[10px] bg-surface-subtle px-2 py-[9px]">
            {ticketStages.map((step, index) => (
              <View className="min-w-0 flex-1 flex-row-reverse items-center gap-1" key={step.title}>
                <View className="min-w-0 flex-1 items-center gap-1">
                  <View
                    className={`h-[30px] w-[30px] items-center justify-center rounded-full ${
                      index === 0
                        ? 'bg-tone-success-fill'
                        : index === 2
                          ? 'bg-tone-warning-fill'
                          : 'bg-action-subtle'
                    }`}
                  >
                    <AppIcon name={step.icon} tone={step.tone} size={16} />
                  </View>
                  <AppText align="center" className="font-ui-semibold" numberOfLines={2} style={{ fontSize: 9, lineHeight: 14 }} variant="caption">
                    {step.title}
                  </AppText>
                  <AppText align="center" className="text-content-secondary" numberOfLines={1} style={{ fontSize: 8.5, lineHeight: 13 }} variant="caption">
                    {step.date}
                  </AppText>
                </View>
                {index < 2 ? (
                  <AppIcon
                    name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
                    size={14}
                    tone="secondary"
                  />
                ) : null}
              </View>
            ))}
          </View>

          {receiptName ? (
            <AppText align="right" className="text-content-link" variant="caption">
              تم اختيار {receiptName} محلياً فقط. لم يتم الرفع إلى السيرفر.
            </AppText>
          ) : null}
          {receiptError ? (
            <AppText align="right" className="text-tone-danger-text" variant="caption">
              {receiptError}
            </AppText>
          ) : null}

          <View className="flex-row-reverse gap-[6px]">
            <Button
              className="min-h-[44px] min-w-0 flex-1"
              label={receiptPicking ? 'فتح الصور...' : 'إضافة إيصال'}
              loading={receiptPicking}
              size="sm"
              onPress={pickLocalReceipt}
            />
            <Button
              className="min-h-[44px] min-w-0 flex-1"
              label="عرض السياسة المطبقة"
              size="sm"
              variant="soft"
              onPress={() => setPolicyOpen((value) => !value)}
            />
          </View>
          {policyOpen ? (
            <View className="rounded-[9px] bg-surface-subtle p-[9px]">
              <AppText align="right" className="text-content-secondary" style={{ fontSize: 10, lineHeight: 16 }} variant="caption">
                تفاصيل السياسة الحاكمة غير متاحة لهذا المثال. عند ربط التذكرة سيظهر رقم النسخة وتاريخ سريانها.
              </AppText>
            </View>
          ) : null}
        </ReferenceCard>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="السياسات والنسخ السابقة"
          accessibilityState={{ expanded: historyOpen }}
          className="mt-[7px]"
          onPress={() => setHistoryOpen((open) => !open)}
        >
          <ReferenceCard className="min-h-[54px] flex-row-reverse items-center gap-2 p-[9px]">
            <ReferenceIcon icon={{ ios: 'book.closed', android: 'menu_book', web: 'menu_book' }} size={33} />
            <View className="min-w-0 flex-1 items-end">
              <AppText align="right" className="font-ui-semibold" variant="caption">
                السياسات والنسخ السابقة
              </AppText>
              <AppText align="right" className="text-content-secondary" style={{ fontSize: 9.5, lineHeight: 15 }} variant="caption">
                اعرض النسخة الحاكمة لتاريخ الطلب
              </AppText>
            </View>
            <AppIcon
              name={{
                ios: historyOpen ? 'chevron.up' : 'chevron.left',
                android: historyOpen ? 'expand_less' : 'chevron_left',
                web: historyOpen ? 'expand_less' : 'chevron_left',
              }}
              size={15}
              tone="secondary"
            />
          </ReferenceCard>
        </Pressable>
        {historyOpen ? (
          <View className="mt-1 rounded-[10px] border border-border-subtle bg-surface-subtle px-3 py-2">
            <AppText align="right" className="text-content-secondary" style={{ fontSize: 10, lineHeight: 17 }} variant="caption">
              بعد ربط حسابك بتذكرة فعلية، ستظهر نسخة السياسة المعتمدة وتاريخ سريانها. لا توجد نسخ موثّقة ضمن المعاينة الحالية.
            </AppText>
          </View>
        ) : null}

        <View className="mt-[7px] min-h-[38px] flex-row-reverse items-center gap-2 rounded-[11px] bg-tone-info-fill px-3 py-2">
          <AppIcon name={{ ios: 'tray.full', android: 'inbox', web: 'inbox' }} size={16} tone="info" />
          <AppText align="right" className="min-w-0 flex-1 text-tone-info-text" style={{ fontSize: 10.5, lineHeight: 17 }} variant="caption">
            الدعم عبر الحالات لإجراء مراجعة واضحة ومتابعة مستمرة.
          </AppText>
        </View>

        {draftOpen ? (
          <ReferenceCard className="mt-2 gap-2">
            <AppText align="right" className="font-ui-bold" variant="label">
              إنشاء طلب دعم
            </AppText>
            <AppText align="right" className="text-content-secondary" variant="caption">
              جهّز تفاصيل طلبك، وسيصبح الإرسال متاحاً عند تفعيل الخدمة.
            </AppText>
            <TextInput
              accessibilityLabel="موضوع طلب الدعم"
              className="min-h-[44px] rounded-[11px] border border-border-subtle px-3 text-content-primary"
              onChangeText={setSubject}
              placeholder="موضوع الطلب"
              style={{ textAlign: 'right', writingDirection: 'rtl' }}
              value={subject}
            />
            <TextInput
              accessibilityLabel="تفاصيل طلب الدعم"
              className="min-h-[90px] rounded-[11px] border border-border-subtle px-3 py-2 text-content-primary"
              multiline
              onChangeText={setDescription}
              placeholder="اشرح طلبك..."
              style={{ textAlign: 'right', textAlignVertical: 'top', writingDirection: 'rtl' }}
              value={description}
            />
            <Button label="إرسال الطلب" disabled onPress={() => {}} />
          </ReferenceCard>
        ) : null}


        <Button
          className="mt-2 h-[48px]"
          label="إنشاء طلب دعم"
          onPress={() => setDraftOpen((open) => !open)}
        />
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={pendingKind !== null}
        onRequestClose={() => setPendingKind(null)}
      >
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setPendingKind(null)}>
          <Pressable
            accessibilityRole="none"
            className="rounded-t-[20px] bg-surface-default p-4"
            onPress={(event) => event.stopPropagation()}
          >
            <View className="mx-auto w-full max-w-[430px] gap-2">
              <AppText align="right" className="font-ui-bold" variant="label">
                اختر الحالة المرتبطة بالطلب
              </AppText>
              {patientCases.map((item) => (
                <Pressable
                  accessibilityRole="button"
                  className="min-h-[50px] flex-row-reverse items-center justify-between rounded-[10px] border border-border-subtle px-3"
                  key={item.id}
                  onPress={() => pendingKind && navigateToCase(pendingKind, item.id)}
                >
                  <AppText align="right" className="min-w-0 flex-1 font-ui-semibold" variant="label">
                    {item.title}
                  </AppText>
                  <AppIcon name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }} size={16} tone="action" />
                </Pressable>
              ))}
              {patientCases.length === 0 ? (
                <AppText align="right" className="text-content-secondary" variant="caption">
                  لا توجد حالات متاحة لهذا المريض.
                </AppText>
              ) : null}
              <Button label="إلغاء" onPress={() => setPendingKind(null)} variant="outline" />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
