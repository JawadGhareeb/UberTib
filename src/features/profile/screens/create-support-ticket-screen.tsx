import { Radio } from 'heroui-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, Keyboard, Pressable, View } from 'react-native';

import { getMockCareCaseForScenario, mockCareCases } from '@/features/my-care/mocks/care.mock';
import { AssessmentImagePreview } from '@/features/assessment/components/assessment-image-preview';
import { MediaSourceDialog, type MediaSource } from '@/shared/components/media/media-source-dialog';
import {
  pickMediaFromDevice,
  type SelectedMediaFile,
} from '@/shared/components/media/media-picker';
import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import {
  type SupportTicketTopic,
  topicTitle,
  useSupportTickets,
} from '@/features/profile/state/support-tickets-provider';
import { AppIcon, AppText, Button, ReadStateBoundary, TextField } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

const MAX_SUPPORT_IMAGES = 3;
const MAX_IMAGE_BYTES = 25 * 1024 * 1024;

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
  const [evidence, setEvidence] = useState<SelectedMediaFile[]>([]);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [sourceDialogOpen, setSourceDialogOpen] = useState(false);
  const launchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState('');

  const cases = mockCareCases.flatMap((entry) => {
    const item = getMockCareCaseForScenario(entry.id, scenario);
    return item ? [item] : [];
  });
  const caseId = chosenCaseId ?? (cases.some((c) => c.id === params.caseId) ? params.caseId : null);
  const canSave = subject.trim().length >= 5 && details.trim().length >= 10 && !picking;

  useEffect(
    () => () => {
      if (launchTimer.current) clearTimeout(launchTimer.current);
    },
    [],
  );

  const openMediaSource = () => {
    if (picking) return;
    if (evidence.length >= MAX_SUPPORT_IMAGES) {
      setError('يمكنك إرفاق 3 صور فقط في طلب الدعم.');
      return;
    }
    Keyboard.dismiss();
    setError('');
    setSourceDialogOpen(true);
  };

  const selectMediaSource = (source: MediaSource) => {
    if (picking) return;
    setSourceDialogOpen(false);
    setPicking(true);
    setError('');
    // The HeroUI portal must close before the native image/camera picker opens.
    launchTimer.current = setTimeout(() => {
      launchTimer.current = null;
      void (async () => {
        try {
          const selected = await pickMediaFromDevice(source, { quality: 0.8 });
          if (!selected?.length) return;
          const accepted = selected.filter((file) => {
            if (file.size && file.size > MAX_IMAGE_BYTES) {
              setError('الصورة أكبر من الحد المسموح 25 ميغابايت.');
              return false;
            }
            return true;
          });
          setEvidence((current) => {
            const remaining = MAX_SUPPORT_IMAGES - current.length;
            return [
              ...current,
              ...accepted
                .filter((file) => !current.some((item) => item.uri === file.uri))
                .slice(0, remaining),
            ];
          });
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : 'تعذّر اختيار الصورة. حاول مرة ثانية.');
        } finally {
          setPicking(false);
        }
      })();
    }, 400);
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
      evidenceNames: evidence.map((file) => file.fileName),
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
                <View className="flex-row-reverse items-center justify-between">
                  <AppText variant="label" align="right" className="font-ui-semibold">
                    مرفقات (اختيارية)
                  </AppText>
                  <AppText variant="caption" className="text-content-secondary">
                    {evidence.length}/{MAX_SUPPORT_IMAGES}
                  </AppText>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="إضافة صورة من الكاميرا أو المعرض"
                  accessibilityState={{
                    disabled: picking || evidence.length >= MAX_SUPPORT_IMAGES,
                  }}
                  disabled={picking || evidence.length >= MAX_SUPPORT_IMAGES}
                  onPress={openMediaSource}
                  className="min-h-[122px] items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-action-primary/40 bg-action-subtle px-3"
                >
                  <AppIcon
                    name={{ ios: 'camera', android: 'photo_camera', web: 'photo_camera' }}
                    size={26}
                    tone="action"
                  />
                  <AppText variant="label" className="font-ui-semibold text-content-link">
                    {picking ? 'جاري اختيار الصورة...' : 'إضافة صورة'}
                  </AppText>
                  <AppText variant="caption" className="text-content-secondary">
                    التقط صورة أو اختر من المعرض
                  </AppText>
                </Pressable>
                {evidence.map((file) => (
                  <View
                    key={file.uri}
                    className="min-h-[58px] flex-row-reverse items-center gap-2 rounded-[12px] border border-border-subtle bg-surface-default p-2"
                  >
                    <Image
                      source={{ uri: file.uri }}
                      accessibilityLabel={'الصورة المختارة ' + file.fileName}
                      className="h-11 w-11 rounded-[8px] bg-surface-subtle"
                      resizeMode="cover"
                    />
                    <AppText
                      align="right"
                      variant="caption"
                      className="min-w-0 flex-1 font-ui-semibold"
                      numberOfLines={1}
                    >
                      {file.fileName}
                    </AppText>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={'معاينة ' + file.fileName}
                      className="h-11 w-11 items-center justify-center rounded-[10px] bg-action-subtle"
                      onPress={() => setPreviewUri(file.uri)}
                    >
                      <AppIcon
                        name={{ ios: 'eye', android: 'visibility', web: 'visibility' }}
                        size={19}
                        tone="action"
                      />
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={'حذف ' + file.fileName}
                      className="h-11 w-11 items-center justify-center rounded-[10px] bg-surface-subtle"
                      onPress={() =>
                        setEvidence((current) => current.filter((item) => item.uri !== file.uri))
                      }
                    >
                      <AppIcon
                        name={{ ios: 'trash', android: 'delete_outline', web: 'delete_outline' }}
                        size={19}
                        tone="danger"
                      />
                    </Pressable>
                  </View>
                ))}
                <AppText variant="caption" align="right" className="text-content-secondary">
                  لحد 3 صور، 25 ميغابايت لكل صورة. الصور المختارة موجودة محلياً ولم تُرفع للسيرفر.
                </AppText>
              </View>
              {error ? (
                <AppText variant="caption" className="text-tone-danger-text" align="right">
                  {error}
                </AppText>
              ) : null}
              <View className="gap-2 rounded-[12px] bg-surface-subtle p-3">
                <AppText variant="caption" align="right" className="text-content-secondary">
                  سيُحفظ الطلب على هذا الجهاز مع أسماء المرفقات. يظهر رقم التذكرة وموعد الرد بعد
                  استلام فريق الدعم للطلب.
                </AppText>
              </View>
              <Button label="حفظ الطلب" disabled={!canSave} onPress={save} />
            </View>
          )}
        </View>
      </ReadStateBoundary>
      <MediaSourceDialog
        visible={sourceDialogOpen}
        onClose={() => setSourceDialogOpen(false)}
        onSelect={selectMediaSource}
        allowFiles={false}
        busy={picking}
        title="إضافة صورة لطلب الدعم"
        description="اختر صورة من المعرض أو التقط صورة جديدة"
      />
      <AssessmentImagePreview
        images={evidence}
        activeUri={previewUri}
        onChange={setPreviewUri}
        onClose={() => setPreviewUri(null)}
      />
    </ProfileScreenShell>
  );
}
