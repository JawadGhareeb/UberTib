import { Radio } from 'heroui-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { getMockCareCaseForScenario, mockCareCases } from '@/features/my-care/mocks/care.mock';
import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import {
  type SupportTicketTopic,
  topicTitle,
  useSupportTickets,
} from '@/features/profile/state/support-tickets-provider';
import { AppIcon, AppText, Button, ReadStateBoundary, TextField } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

type CaseIssueType = 'care' | 'payment' | 'refund';
type IssueType = SupportTicketTopic | CaseIssueType;
const options: { id: IssueType; label: string; detail: string }[] = [
  { id: 'app', label: 'مشكلة بالتطبيق', detail: 'خلل تقني أو مشكلة باستخدام التطبيق' },
  { id: 'account', label: 'مشكلة بالحساب', detail: 'الملف الشخصي أو الدخول أو إعدادات الحساب' },
  { id: 'booking', label: 'مشكلة بحجز أو موعد', detail: 'استفسار عن الحجز أو حالة الموعد' },
  { id: 'care', label: 'شكوى عن علاج أو متابعة', detail: 'مرتبطة بحالة علاجية محددة' },
  { id: 'payment', label: 'اعتراض على دفعة', detail: 'دفعة خارجية مرتبطة بحالة علاجية' },
  { id: 'refund', label: 'طلب استرداد', detail: 'بحسب شروط وأهلية الحالة العلاجية' },
];
const isCaseIssue = (type: IssueType): type is CaseIssueType =>
  type === 'care' || type === 'payment' || type === 'refund';

export function CreateSupportTicketScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ caseId?: string; type?: string }>();
  const { scenario, getSurfaceState } = useMockScenario();
  const { saveLocalTicket } = useSupportTickets();
  const [type, setType] = useState<IssueType>(
    options.some((o) => o.id === params.type) ? (params.type as IssueType) : 'app',
  );
  const [chosenCaseId, setChosenCaseId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [evidence, setEvidence] = useState<string[]>([]);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState('');

  const cases = mockCareCases.flatMap((entry) => {
    const item = getMockCareCaseForScenario(entry.id, scenario);
    return item ? [item] : [];
  });
  const caseId = chosenCaseId ?? (cases.some((c) => c.id === params.caseId) ? params.caseId : null);
  const canSave = subject.trim().length >= 5 && details.trim().length >= 10 && !picking;

  const attach = async () => {
    if (picking || evidence.length >= 3) return;
    setPicking(true);
    setError('');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]) return;
      const file = result.assets[0];
      if (file.fileSize && file.fileSize > 25 * 1024 * 1024) {
        setError('الصورة أكبر من الحد المسموح 25 ميغابايت.');
        return;
      }
      setEvidence((current) => [...current, file.fileName || 'صورة مرفقة']);
    } catch {
      setError('تعذّر اختيار الصورة. حاول مرة ثانية.');
    } finally {
      setPicking(false);
    }
  };
  const goToIssue = () => {
    if (!isCaseIssue(type) || !caseId) return;
    // The claims form already handles type, evidence, eligibility and submitted-case state.
    router.push({
      pathname: '/care/[caseId]/claims',
      params: { caseId, issue: type === 'care' ? 'treatment' : type },
    });
  };
  const save = () => {
    if (isCaseIssue(type) || !canSave) return;
    const ticketId = saveLocalTicket({
      topic: type,
      subject: subject.trim(),
      description: details.trim(),
      evidenceNames: evidence,
    });
    router.replace({ pathname: '/support/tickets/[ticketId]', params: { ticketId } });
  };
  return (
    <ProfileScreenShell eyebrow="المساعدة" title="إنشاء طلب دعم">
      <ReadStateBoundary
        state={getSurfaceState('profile')}
        emptyTitle="إنشاء طلب الدعم غير متاح"
        permissionTitle="ليس لديك صلاحية لعرض الدعم"
      >
        <View className="gap-5">
          <View className="gap-2">
            <AppText variant="heading-4" align="right">
              نوع المشكلة
            </AppText>
            <View className="overflow-hidden rounded-[15px] border border-border-subtle bg-surface-default">
              {options.map((item, index) => {
                const selected = item.id === type;
                return (
                  <Radio
                    key={item.id}
                    isSelected={selected}
                    onSelectedChange={() => {
                      setType(item.id);
                      setError('');
                    }}
                    className={
                      'min-h-[65px] flex-row-reverse items-center gap-3 px-3 py-3 ' +
                      (index ? 'border-t border-border-subtle ' : '') +
                      (selected ? 'bg-action-subtle' : '')
                    }
                  >
                    <Radio.Indicator />
                    <View className="min-w-0 flex-1 items-end gap-1">
                      <AppText variant="label" align="right" className="font-ui-semibold">
                        {item.label}
                      </AppText>
                      <AppText variant="caption" align="right" className="text-content-secondary">
                        {item.detail}
                      </AppText>
                    </View>
                  </Radio>
                );
              })}
            </View>
          </View>

          {isCaseIssue(type) ? (
            <View className="gap-3">
              <AppText variant="heading-4" align="right">
                اختر الحالة العلاجية
              </AppText>
              <AppText variant="caption" align="right" className="text-content-secondary">
                لازم نربط الشكوى أو الاعتراض بالحالة الصحيحة. اختيار الحالة مو إثبات أهلية لاسترداد
                أو حماية.
              </AppText>
              {cases.length ? (
                cases.map((careCase) => (
                  <Radio
                    key={careCase.id}
                    isSelected={caseId === careCase.id}
                    onSelectedChange={() => setChosenCaseId(careCase.id)}
                    className={
                      'min-h-[64px] flex-row-reverse items-center justify-between gap-3 rounded-[13px] border px-3 py-3 ' +
                      (caseId === careCase.id
                        ? 'border-action-primary bg-action-subtle'
                        : 'border-border-subtle bg-surface-default')
                    }
                  >
                    <View className="min-w-0 flex-1 items-end gap-1">
                      <AppText variant="label" align="right" className="font-ui-semibold">
                        {careCase.title}
                      </AppText>
                      <AppText variant="caption" align="right" className="text-content-secondary">
                        {careCase.branch}
                      </AppText>
                    </View>
                    <Radio.Indicator />
                  </Radio>
                ))
              ) : (
                <AppText variant="label" align="right" className="text-content-secondary">
                  ما في حالة علاجية متاحة لهالطلب؛ ما فينا نربط شكوى بحالة غير معروفة.
                </AppText>
              )}
              <Button label="متابعة إلى تفاصيل المشكلة" disabled={!caseId} onPress={goToIssue} />
            </View>
          ) : (
            <View className="gap-3">
              <AppText variant="heading-4" align="right">
                {topicTitle[type]}
              </AppText>
              <TextField
                label="عنوان الطلب"
                value={subject}
                onChangeText={setSubject}
                maxLength={100}
                placeholder="اكتب عنواناً مختصراً وواضحاً"
              />
              <TextField
                label="تفاصيل الطلب"
                value={details}
                onChangeText={setDetails}
                multiline
                numberOfLines={5}
                maxLength={2000}
                placeholder="اشرح المشكلة والتفاصيل المهمة"
              />
              <View className="gap-2">
                <AppText variant="label" align="right" className="font-ui-semibold">
                  مرفقات (اختيارية)
                </AppText>
                <Button
                  variant="outline"
                  label={picking ? 'جاري فتح الصور...' : 'إضافة صورة'}
                  loading={picking}
                  disabled={picking || evidence.length >= 3}
                  onPress={() => void attach()}
                />
                {evidence.map((name, index) => (
                  <View
                    key={index}
                    className="flex-row-reverse items-center justify-between rounded-[11px] bg-surface-subtle p-2"
                  >
                    <AppText variant="caption" className="min-w-0 flex-1" numberOfLines={1}>
                      {name}
                    </AppText>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={'حذف ' + name}
                      className="px-2 py-1"
                      onPress={() => setEvidence((curr) => curr.filter((_, i) => i !== index))}
                    >
                      <AppIcon
                        name={{ ios: 'xmark', android: 'close', web: 'close' }}
                        size={17}
                        tone="secondary"
                      />
                    </Pressable>
                  </View>
                ))}
              </View>
              {error ? (
                <AppText variant="caption" className="text-tone-danger-text" align="right">
                  {error}
                </AppText>
              ) : null}
              <View className="gap-2 rounded-[12px] bg-surface-subtle p-3">
                <AppText variant="caption" align="right" className="text-content-secondary">
                  بالنسخة التجريبية رح ينحفظ الطلب والمرفقات كأسماء فقط على هالجهاز، بدون إرسال
                  للسيرفر. ما في رقم تذكرة رسمي أو SLA قبل قبول الطلب من خدمة الدعم.
                </AppText>
              </View>
              <Button label="حفظ الطلب التجريبي" disabled={!canSave} onPress={save} />
            </View>
          )}
        </View>
      </ReadStateBoundary>
    </ProfileScreenShell>
  );
}
