import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { getMockCareCaseForScenario, mockCareCases } from '@/features/my-care/mocks/care.mock';
import { AppHeader } from '@/shared/components/navigation';
import { AppIcon, AppText, Button, Screen, TextField } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { useMockScenario } from '@/shared/mock';

type SupportKind = 'care' | 'refund' | 'payment' | 'protection';
const supportTypes: {
  kind: SupportKind;
  title: string;
  summary: string;
  icon: AppIconName;
  requiresEligibility?: boolean;
}[] = [
  {
    kind: 'care',
    title: 'مشكلة بزيارة أو علاج',
    summary: 'فتح مراجعة مرتبطة بالحالة',
    icon: { ios: 'heart.text.square', android: 'monitor_heart', web: 'monitor_heart' },
  },
  {
    kind: 'refund',
    title: 'طلب استرداد',
    summary: 'الرجوع لمسار الاسترداد',
    icon: { ios: 'arrow.uturn.backward', android: 'undo', web: 'undo' },
  },
  {
    kind: 'payment',
    title: 'اعتراض على دفعة',
    summary: 'مراجعة السجل المالي للحالة',
    icon: { ios: 'creditcard', android: 'credit_card', web: 'credit_card' },
  },
  {
    kind: 'protection',
    title: 'مطالبة حماية',
    summary: 'تتطلب أهلية معتمدة',
    icon: { ios: 'shield.lefthalf.filled', android: 'verified_user', web: 'verified_user' },
    requiresEligibility: true,
  },
];

const questions = [
  {
    title: 'كيف أتابع حجزي؟',
    answer: 'من صفحة علاجي، افتح حجوزاتي واختار الموعد حتى تشوف حالة التأكيد والتفاصيل.',
  },
  {
    title: 'كيف أتابع علاجي؟',
    answer: 'من علاجي، افتح الحالة العلاجية لتشوف مراحل العلاج، الخطة والخطوة القادمة.',
  },
  {
    title: 'كيف أقدّم اعتراض أو طلب استرداد؟',
    answer:
      'اختار نوع المشكلة من هون وحدّد الحالة العلاجية المرتبطة فيها، حتى تروح للمسار المناسب.',
  },
] as const;

export function HelpSupportScreen() {
  const router = useRouter();
  const { caseId } = useLocalSearchParams<{ caseId?: string }>();
  const { scenario } = useMockScenario();
  const [pendingKind, setPendingKind] = useState<SupportKind | null>(null);
  const [openedFaq, setOpenedFaq] = useState<number | null>(null);
  const [draftOpen, setDraftOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const cases = mockCareCases.flatMap((item) => {
    const active = getMockCareCaseForScenario(item.id, scenario);
    return active ? [active] : [];
  });
  const chosenCase = caseId ? getMockCareCaseForScenario(caseId, scenario) : undefined;

  const goToCase = (kind: SupportKind, id: string) => {
    const candidate = getMockCareCaseForScenario(id, scenario);
    if (!candidate || kind === 'protection') return;
    setPendingKind(null);
    if (kind === 'refund') {
      router.push({ pathname: '/care/[caseId]/claims/refund', params: { caseId: id } });
    } else if (kind === 'payment') {
      router.push({ pathname: '/care/[caseId]/financial/timeline', params: { caseId: id } });
    } else {
      router.push({ pathname: '/care/[caseId]/claims', params: { caseId: id } });
    }
  };
  return (
    <Screen
      contentClassName="px-0 py-0"
      header={<AppHeader title="المساعدة والدعم" variant="detail" showBack />}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerClassName="mx-auto w-full max-w-[430px] gap-5 px-4 pb-20 pt-5"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row-reverse items-center gap-3 rounded-[16px] bg-action-subtle p-4">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-surface-default">
            <AppIcon
              name={{ ios: 'lifepreserver', android: 'support_agent', web: 'support_agent' }}
              size={25}
              tone="action"
            />
          </View>
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText variant="body-strong" align="right">
              كيف فينا نساعدك؟
            </AppText>
            <AppText variant="label" align="right" className="text-content-secondary">
              اختار نوع المشكلة لحتى تروح للمسار الصحيح.
            </AppText>
          </View>
        </View>

        <View className="gap-2">
          <AppText align="right" variant="heading-4">
            بشو بتحتاج مساعدة؟
          </AppText>
          <View className="overflow-hidden rounded-[15px] border border-border-subtle bg-surface-default">
            {supportTypes.map((item, index) => (
              <Pressable
                key={item.kind}
                accessibilityRole="button"
                accessibilityLabel={item.title}
                accessibilityState={{ disabled: Boolean(item.requiresEligibility) }}
                disabled={Boolean(item.requiresEligibility)}
                onPress={() => {
                  if (chosenCase) goToCase(item.kind, chosenCase.id);
                  else setPendingKind(item.kind);
                }}
                className={
                  'min-h-[74px] flex-row-reverse items-center gap-3 px-3 py-3 ' +
                  (index ? 'border-t border-border-subtle' : '')
                }
              >
                <View className="h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-action-subtle">
                  <AppIcon name={item.icon} tone="action" size={20} />
                </View>
                <View className="min-w-0 flex-1 items-end gap-1">
                  <AppText align="right" variant="label" className="font-ui-semibold">
                    {item.title}
                  </AppText>
                  <AppText align="right" variant="caption" className="text-content-secondary">
                    {item.summary}
                  </AppText>
                </View>
                <AppIcon
                  name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                  size={16}
                  tone="secondary"
                />
              </Pressable>
            ))}
          </View>
        </View>

        <View className="gap-2">
          <AppText variant="heading-4" align="right">
            أسئلة شائعة
          </AppText>
          <View className="overflow-hidden rounded-[15px] border border-border-subtle bg-surface-default">
            {questions.map((item, index) => (
              <View key={item.title} className={index ? 'border-t border-border-subtle' : ''}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: openedFaq === index }}
                  className="min-h-[54px] flex-row-reverse items-center justify-between gap-2 px-3 py-3"
                  onPress={() => setOpenedFaq(openedFaq === index ? null : index)}
                >
                  <AppText
                    variant="label"
                    className="min-w-0 flex-1 font-ui-semibold"
                    align="right"
                  >
                    {item.title}
                  </AppText>
                  <AppIcon
                    name={{
                      ios: openedFaq === index ? 'chevron.up' : 'chevron.down',
                      android: openedFaq === index ? 'expand_less' : 'expand_more',
                      web: openedFaq === index ? 'expand_less' : 'expand_more',
                    }}
                    size={18}
                    tone="secondary"
                  />
                </Pressable>
                {openedFaq === index ? (
                  <AppText
                    variant="label"
                    align="right"
                    className="px-3 pb-4 text-content-secondary"
                  >
                    {item.answer}
                  </AppText>
                ) : null}
              </View>
            ))}
          </View>
        </View>

        <View className="gap-3 rounded-[15px] border border-border-subtle bg-surface-default p-4">
          <AppText align="right" variant="heading-4">
            مشكلة عامة؟
          </AppText>
          <AppText align="right" variant="label" className="text-content-secondary">
            بتقدر تحضّر وصف للمشكلة. إرسال تذكرة الدعم العامة مش مفعّل بالعرض التجريبي.
          </AppText>
          {draftOpen ? (
            <View className="gap-3">
              <TextField
                label="موضوع الطلب"
                value={subject}
                onChangeText={setSubject}
                placeholder="اكتب موضوع المشكلة"
              />
              <TextField
                label="تفاصيل المشكلة"
                value={description}
                onChangeText={setDescription}
                multiline
                placeholder="اشرح المشكلة..."
                numberOfLines={4}
              />
              <Button label="الإرسال غير متاح بالنسخة التجريبية" disabled onPress={() => {}} />
            </View>
          ) : null}
          <Button
            label={draftOpen ? 'إخفاء المسودة' : 'كتابة طلب دعم'}
            variant="outline"
            onPress={() => setDraftOpen(!draftOpen)}
          />
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={pendingKind !== null}
        onRequestClose={() => setPendingKind(null)}
      >
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setPendingKind(null)}>
          <Pressable
            className="rounded-t-[20px] bg-surface-default px-4 pb-7 pt-4"
            onPress={(event) => event.stopPropagation()}
          >
            <View className="mx-auto w-full max-w-[430px] gap-3">
              <AppText align="right" variant="heading-4">
                اختار الحالة المرتبطة بالطلب
              </AppText>
              {cases.map((item) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  onPress={() => pendingKind && goToCase(pendingKind, item.id)}
                  className="min-h-[54px] flex-row-reverse items-center justify-between rounded-[12px] border border-border-subtle px-3"
                >
                  <AppText
                    align="right"
                    variant="label"
                    className="min-w-0 flex-1 font-ui-semibold"
                  >
                    {item.title}
                  </AppText>
                  <AppIcon
                    name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                    size={18}
                    tone="secondary"
                  />
                </Pressable>
              ))}
              {!cases.length ? (
                <AppText variant="label" align="right">
                  ما في حالات علاجية متاحة حالياً.
                </AppText>
              ) : null}
              <Button label="إلغاء" variant="outline" onPress={() => setPendingKind(null)} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
