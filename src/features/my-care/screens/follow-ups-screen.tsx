import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AssessmentImagePreview } from '@/features/assessment/components/assessment-image-preview';
import { CareV5Badge, CareV5Card, CareV5Header } from '@/features/my-care/components/care-v5-ui';
import { getMockCareCaseForScenario } from '@/features/my-care/mocks/care.mock';
import {
  AppIcon,
  AppText,
  Button,
  ReadStateBoundary,
  Screen,
  StateView,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

export function FollowUpsScreen({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const getSurfaceState = useMockScenario((state) => state.getSurfaceState);
  const scenario = useMockScenario((state) => state.scenario);
  const stageEvidenceDrafts = useMockScenario((state) => state.stageEvidenceDrafts);
  const readState = getSurfaceState('care');
  const careCase = getMockCareCaseForScenario(caseId, scenario);
  const availablePhotos = Object.values(stageEvidenceDrafts)
    .filter((item) => item.caseId === caseId && Boolean(item.localUri))
    .map((item) => ({ uri: item.localUri, fileName: item.fileName }));
  const rootDraft = stageEvidenceDrafts[caseId + ':stage-root-canal'];
  const canAddRootEvidence =
    caseId === 'case-001' && careCase?.stages.some((stage) => stage.id === 'stage-root-canal');

  if (!careCase) {
    return (
      <Screen contentClassName="px-0 py-0">
        <CareV5Header leftIcon="image" title="الأدلة والمتابعة" />
        <View className="px-4 pt-6">
          <StateView title="الحالة غير موجودة" />
        </View>
      </Screen>
    );
  }

  const currentStage = careCase.stages.find((item) => item.status === 'current');
  const stageIndex = careCase.stages.findIndex((item) => item.status === 'current');
  const openStage = (stageId: string) =>
    router.push({
      pathname: '/care/[caseId]/stage/[stageId]',
      params: { caseId, stageId },
    });

  return (
    <Screen contentClassName="px-0 py-0">
      <CareV5Header leftIcon="image" title="الأدلة والمتابعة" />
      <ReadStateBoundary
        emptyDescription="لما ينضاف دليل أو متابعة رح تظهر هون."
        emptyTitle="ما في أدلة أو متابعات حالياً"
        permissionDescription="التفويض الحالي ما عاد يسمح بعرض أدلة ومتابعات هالحالة."
        permissionTitle="ما عاد في صلاحية لعرض الأدلة"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <ScrollView
          contentContainerClassName="mx-auto w-full max-w-[430px] gap-3 px-4 pb-24 pt-3"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-2 rounded-[16px] border border-border-subtle bg-surface-default p-3.5">
            <View className="flex-row-reverse items-center justify-between gap-2">
              <View className="min-w-0 flex-1 items-end gap-1">
                <AppText align="right" variant="heading-4" className="font-ui-bold">
                  {careCase.title}
                </AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">
                  {careCase.provider} · {careCase.branch}
                </AppText>
              </View>
              <CareV5Badge
                label={careCase.statusLabel}
                tone={careCase.progress >= 100 ? 'success' : 'primary'}
              />
            </View>
            <View className="flex-row-reverse items-center gap-2 rounded-[11px] bg-action-subtle p-3">
              <AppIcon
                name={{ ios: 'calendar.badge.clock', android: 'event_note', web: 'event_note' }}
                size={19}
                tone="action"
              />
              <View className="min-w-0 flex-1 items-end gap-0.5">
                <AppText align="right" variant="label" className="font-ui-semibold">
                  {currentStage
                    ? `المرحلة ${stageIndex + 1} من ${careCase.stages.length}: ${currentStage.title}`
                    : 'مراحل العلاج'}
                </AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">
                  {careCase.nextAction}
                </AppText>
              </View>
            </View>
          </View>

          <View className="gap-2">
            <View className="flex-row-reverse items-center justify-between gap-2">
              <AppText align="right" variant="heading-4" className="font-ui-bold">
                الأدلة العلاجية
              </AppText>
              <AppText variant="caption" className="text-content-secondary">
                صور حسب المرحلة
              </AppText>
            </View>
            <AppText align="right" variant="caption" className="text-content-secondary">
              المعاينة متاحة للصور المحفوظة على جهازك. قد تحتوي السجلات الأخرى على أسماء مرفقات دون
              صور.
            </AppText>
            {caseId === 'case-001' ? (
              <View className="gap-2">
                {[
                  {
                    key: 'before',
                    title: 'قبل العلاج',
                    subtitle: 'مرجع توثيق ما قبل العلاج',
                    state: 'مقبول',
                    tone: 'success' as const,
                  },
                  {
                    key: 'during',
                    title: 'أثناء العلاج',
                    subtitle: 'سجل توثيق مرحلة العلاج',
                    state: 'مقبول',
                    tone: 'success' as const,
                  },
                  {
                    key: 'after',
                    title: 'بعد العلاج',
                    subtitle: 'الأشعة النهائية للمرحلة الحالية',
                    state: rootDraft ? 'مسودة محلية' : 'دليل مطلوب',
                    tone: 'warning' as const,
                  },
                ].map((evidence) => (
                  <CareV5Card
                    key={evidence.key}
                    className="min-h-[73px] flex-row-reverse items-center gap-3 rounded-[13px] p-3"
                  >
                    <View className="h-11 w-11 items-center justify-center rounded-[11px] bg-action-subtle">
                      <AppIcon
                        name={{ ios: 'photo.on.rectangle', android: 'image', web: 'image' }}
                        tone="action"
                        size={22}
                      />
                    </View>
                    <View className="min-w-0 flex-1 items-end gap-1">
                      <AppText align="right" variant="label" className="font-ui-semibold">
                        {evidence.title}
                      </AppText>
                      <AppText align="right" variant="caption" className="text-content-secondary">
                        {evidence.subtitle}
                      </AppText>
                      <CareV5Badge label={evidence.state} tone={evidence.tone} />
                    </View>
                    {evidence.key === 'after' && rootDraft?.localUri ? (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="معاينة الأشعة المختارة"
                        className="h-10 w-10 items-center justify-center rounded-[11px] bg-action-subtle"
                        onPress={() => setPreviewUri(rootDraft.localUri)}
                      >
                        <AppIcon
                          name={{ ios: 'eye', android: 'visibility', web: 'visibility' }}
                          size={20}
                          tone="action"
                        />
                      </Pressable>
                    ) : null}
                  </CareV5Card>
                ))}
                {canAddRootEvidence ? (
                  <View className="gap-2 rounded-[13px] bg-tone-warning-fill p-3">
                    <AppText align="right" variant="label" className="font-ui-semibold">
                      {rootDraft
                        ? 'المسودة بحاجة لإرسال ومراجعة'
                        : 'الأشعة النهائية مطلوبة لإغلاق المرحلة'}
                    </AppText>
                    <AppText align="right" variant="caption" className="text-content-secondary">
                      الصورة المختارة محلياً لا تُحسب مقبولة ولا تُرسل للطبيب تلقائياً.
                    </AppText>
                    <Button
                      size="sm"
                      label={rootDraft ? 'تحديث صورة الأشعة' : 'إضافة صورة الأشعة'}
                      onPress={() => openStage('stage-root-canal')}
                    />
                  </View>
                ) : null}
              </View>
            ) : (
              <CareV5Card className="rounded-[13px] p-3">
                <AppText align="right" variant="label" className="font-ui-semibold">
                  الأدلة المرتبطة بالحالة
                </AppText>
                <AppText align="right" variant="caption" className="mt-1 text-content-secondary">
                  ما في صور طبية قابلة للمعاينة ضمن بيانات هذه الحالة.
                </AppText>
              </CareV5Card>
            )}
          </View>

          {availablePhotos.length && caseId !== 'case-001' ? (
            <View className="gap-2">
              {availablePhotos.map((photo) => (
                <CareV5Card key={photo.uri} className="flex-row-reverse items-center gap-2 p-3">
                  <AppText align="right" variant="label" className="min-w-0 flex-1">
                    {photo.fileName}
                  </AppText>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={'عرض ' + photo.fileName}
                    className="h-10 w-10 items-center justify-center rounded-[10px] bg-action-subtle"
                    onPress={() => setPreviewUri(photo.uri)}
                  >
                    <AppIcon
                      name={{ ios: 'eye', android: 'visibility', web: 'visibility' }}
                      size={19}
                      tone="action"
                    />
                  </Pressable>
                </CareV5Card>
              ))}
            </View>
          ) : null}

          <View className="gap-2">
            <AppText align="right" variant="heading-4" className="font-ui-bold">
              مواعيد المتابعة
            </AppText>
            {careCase.followUps.length ? (
              careCase.followUps.map((followUp) => (
                <CareV5Card
                  key={followUp.id}
                  className="flex-row-reverse items-center gap-3 rounded-[13px] p-3"
                >
                  <View className="h-11 w-11 items-center justify-center rounded-[11px] bg-surface-subtle">
                    <AppIcon
                      name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
                      tone="action"
                      size={19}
                    />
                  </View>
                  <View className="min-w-0 flex-1 items-end gap-1">
                    <AppText align="right" variant="label" className="font-ui-semibold">
                      {followUp.title}
                    </AppText>
                    <AppText align="right" variant="caption" className="text-content-secondary">
                      {followUp.dateLabel}
                    </AppText>
                  </View>
                  <CareV5Badge
                    label={followUp.statusLabel}
                    tone={
                      followUp.state === 'completed'
                        ? 'success'
                        : followUp.state === 'due' || followUp.state === 'overdue'
                          ? 'warning'
                          : 'info'
                    }
                  />
                </CareV5Card>
              ))
            ) : (
              <View className="rounded-[12px] bg-surface-subtle p-3">
                <AppText align="right" variant="caption" className="text-content-secondary">
                  ما في مواعيد متابعة مسجلة لهذه الحالة.
                </AppText>
              </View>
            )}
          </View>

          {scenario.flags?.careStageReopened && caseId === 'case-001' ? (
            <View className="gap-1 rounded-[12px] bg-tone-warning-fill p-3">
              <AppText align="right" variant="label" className="font-ui-bold">
                إعادة فتح المرحلة موثقة
              </AppText>
              <AppText align="right" variant="caption" className="text-content-secondary">
                طلب الطبيب صورة أوضح. السجل السابق محفوظ، والمسودة الحالية تحتاج مراجعة.
              </AppText>
            </View>
          ) : null}
        </ScrollView>
        <AssessmentImagePreview
          images={availablePhotos}
          activeUri={previewUri}
          onChange={setPreviewUri}
          onClose={() => setPreviewUri(null)}
        />
      </ReadStateBoundary>
    </Screen>
  );
}
