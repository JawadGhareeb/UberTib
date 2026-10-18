import { useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { CareV5Card, CareV5Header } from '@/features/my-care/components/care-v5-ui';

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
import { ToothSvg } from '@/shared/components/ui/tooth-svg';

interface FollowUpsScreenProps {
  caseId: string;
}

export function FollowUpsScreen({ caseId }: FollowUpsScreenProps) {
  const router = useRouter();
  const { getSurfaceState, scenario, stageEvidenceDrafts } = useMockScenario();
  const evidenceDraft = stageEvidenceDrafts[caseId + ':stage-root-canal'];
  const readState = getSurfaceState('care');
  const careCase = getMockCareCaseForScenario(caseId, scenario);
  const currentStageIndex = careCase?.stages.findIndex((stage) => stage.status === 'current') ?? -1;

  if (!careCase) {
    return (
      <Screen>
        <StateView title="الحالة غير موجودة" />
      </Screen>
    );
  }

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
          contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-[86px] pt-[9px]"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center gap-[10px] rounded-[14px] border border-state-selected-border bg-action-subtle p-[11px]">
            <View className="min-w-0 flex-1 items-end">
              <AppText className="text-type-label font-ui-bold text-content-link" variant="caption">
                {caseId === 'case-001' ? `المرحلة ${currentStageIndex < 0 ? careCase.stages.length : currentStageIndex + 1} من ${careCase.stages.length}` : careCase.statusLabel}
              </AppText>
              <AppText className="mt-1 font-ui-bold text-type-body">{careCase.title}</AppText>
              <AppText className="mt-1 text-type-caption text-content-secondary" variant="caption">
                {caseId === 'case-001' ? 'المطلوب الآن: الأشعة النهائية قبل إغلاق المرحلة' : careCase.nextAction}
              </AppText>
            </View>

            {caseId === 'case-001' ? (
              <View className="relative h-[68px] w-[68px] items-center justify-center rounded-full bg-surface-default">
                <ToothSvg kind="molar" lower selected size={48} />
                <View className="absolute bottom-0 right-0 h-6 w-6 items-center justify-center rounded-full bg-action-subtle">
                  <AppText direction="ltr" className="text-type-label font-ui-bold text-content-link">
                    46
                  </AppText>
                </View>
              </View>
            ) : null}
          </View>

          {caseId === 'case-001' ? (
            <>
              <AppText className="mt-[9px] font-ui-bold text-type-label">تسلسل الأدلة المصوّرة</AppText>
    
              <View className="mt-[6px] h-[154px] flex-row gap-[6px]">
                <View className="flex-1 overflow-hidden rounded-[10px] bg-surface-subtle p-[8px]">
                  <View className="h-[78px] items-center justify-center rounded-[8px] bg-state-readonly">
                    <AppIcon
                      name={{ ios: 'viewfinder', android: 'center_focus_strong', web: 'center_focus_strong' }}
                      size={22}
                      tone="secondary"
                    />
                  </View>
                  <AppText className="mt-2 text-type-label font-ui-bold text-content-primary">
                    قبل العلاج
                  </AppText>
                  <AppText
                    className="mt-0.5 text-type-caption font-ui-bold text-tone-success-text"
                    variant="caption"
                  >
                    مقبول
                  </AppText>
                </View>
    
                <View className="flex-1 overflow-hidden rounded-[10px] bg-action-subtle p-[8px]">
                  <View className="h-[78px] items-center justify-center rounded-[8px] bg-surface-default">
                    <AppIcon
                      name={{ ios: 'photo.fill', android: 'image', web: 'image' }}
                      size={24}
                      tone="action"
                    />
                  </View>
                  <AppText className="mt-2 text-type-label font-ui-bold">أثناء العلاج</AppText>
                  <AppText
                    className="mt-0.5 text-type-caption font-ui-bold text-content-link"
                    variant="caption"
                  >
                    مقبول
                  </AppText>
                </View>
    
                <View className="flex-1 overflow-hidden rounded-[10px] bg-tone-warning-fill p-[8px]">
                  <View className="h-[78px] items-center justify-center rounded-[8px] border border-dashed border-tone-warning-border">
                    <AppIcon
                      name={{ ios: 'plus', android: 'add', web: 'add' }}
                      size={23}
                      tone="warning"
                    />
                  </View>
                  <AppText className="mt-2 text-type-label font-ui-bold">بعد العلاج</AppText>
                  <AppText
                    className="mt-0.5 text-type-caption font-ui-bold text-tone-warning-text"
                    variant="caption"
                  >
                    {evidenceDraft ? 'مسودة محلية' : 'مفقود'}
                  </AppText>
                </View>
              </View>
    
              <Pressable
                accessibilityRole="button"
                className="mt-[6px] h-[60px] flex-row items-center gap-[9px] rounded-[12px] border border-tone-warning-border bg-tone-warning-fill px-[10px]"
                onPress={() =>
                  router.push({
                    pathname: '/care/[caseId]/stage/[stageId]',
                    params: { caseId, stageId: 'stage-root-canal' },
                  })
                }
              >
                <AppText
                  className="text-type-caption font-ui-bold text-tone-warning-text"
                  variant="caption"
                >
                  {evidenceDraft ? 'مراجعة المسودة' : 'إضافة الدليل'}
                </AppText>
                <View className="min-w-0 flex-1 items-end">
                  <AppText className="font-ui-bold text-type-label">دليل مطلوب لإكمال المرحلة</AppText>
                  <AppText
                    className="mt-0.5 text-type-caption text-content-secondary"
                    variant="caption"
                  >
                    {evidenceDraft ? 'الصورة محفوظة محلياً بانتظار الرفع والمراجعة، وليست دليلاً مقبولاً.' : 'الأشعة النهائية غير مرفقة بعد.'}
                  </AppText>
                </View>
              </Pressable>

            </>
          ) : (
            <CareV5Card className="mt-2 p-3">
              <AppText align="right" className="font-ui-semibold" variant="label">
                الأدلة المرتبطة بالعلاج
              </AppText>
              <AppText align="right" className="mt-0.5 text-content-secondary" variant="caption">
                ما في صور متابعة مضافة حالياً.
              </AppText>
            </CareV5Card>
          )}

          <AppText className="mt-[9px] font-ui-bold text-type-label">المتابعة بعد العلاج</AppText>

          <View className="mt-[6px] gap-[6px]">
            {careCase.followUps.map((followUp) => {
              const tone = followUp.state === 'completed'
                ? 'success'
                : followUp.state === 'due' || followUp.state === 'overdue'
                  ? 'warning'
                  : 'info';
              return (
                <Pressable
                  accessibilityLabel={`عرض تفاصيل متابعة: ${followUp.title}`}
                  accessibilityRole="button"
                  className="min-h-[54px] flex-row items-center gap-2 rounded-[11px] border border-border-subtle bg-surface-default px-[9px] py-[7px]"
                  key={followUp.id}
                  onPress={() => {
                    const stage = careCase.stages.find((item) => item.status === 'current') ?? careCase.stages[0];
                    if (!stage) return;
                    router.push({
                      pathname: '/care/[caseId]/stage/[stageId]',
                      params: { caseId, stageId: stage.id },
                    });
                  }}
                >
                <View className="min-w-0 flex-1 items-end">
                  <AppText align="right" className="font-ui-semibold text-type-label" numberOfLines={2}>{followUp.title}</AppText>
                  <AppText
                    className="mt-0.5 text-type-caption text-content-secondary"
                    variant="caption"
                  >
                    {followUp.dateLabel} · {followUp.statusLabel}
                  </AppText>
                </View>
                <View
                  className={`h-9 w-9 items-center justify-center rounded-full ${
                    tone === 'success'
                      ? 'bg-tone-success-fill'
                      : tone === 'warning'
                        ? 'bg-tone-warning-fill'
                        : 'bg-tone-info-fill'
                  }`}
                >
                  <AppIcon
                    name={
                      tone === 'success'
                        ? {
                            ios: 'checkmark.circle.fill',
                            android: 'check_circle',
                            web: 'check_circle',
                          }
                        : { ios: 'clock.fill', android: 'schedule', web: 'schedule' }
                    }
                    size={17}
                    tone={tone === 'success' ? 'success' : tone === 'warning' ? 'warning' : 'info'}
                  />
                </View>
                </Pressable>
              );
            })}
          </View>

          {scenario.flags?.careStageReopened && caseId === 'case-001' ? (
            <View className="mt-[6px] flex-row items-center gap-2 rounded-[10px] bg-tone-danger-fill px-[9px] py-[7px]">
            <AppText
              className="min-w-0 flex-1 text-type-caption  text-content-primary"
              variant="caption"
            >
              إعادة فتح موثّقة: طلب الطبيب صورة أوضح · يبقى السجل السابق محفوظاً
            </AppText>
            <AppIcon
              name={{ ios: 'clock.arrow.circlepath', android: 'history', web: 'history' }}
              size={15}
              tone="danger"
            />
            </View>
          ) : null}
        </ScrollView>

        {caseId === 'case-001' ? (
          <View className="absolute bottom-0 left-0 right-0 h-[76px] bg-surface-canvas px-4 pt-2">
          <View className="mx-auto w-full max-w-[398px]">
            <Button
              className="h-[50px] rounded-[11px]"
              label={evidenceDraft ? 'مراجعة مسودة الأشعة النهائية' : 'إضافة الأشعة النهائية'}
              onPress={() =>
                router.push({
                  pathname: '/care/[caseId]/stage/[stageId]',
                  params: { caseId, stageId: 'stage-root-canal' },
                })
              }
            />
          </View>
          </View>
        ) : null}
      </ReadStateBoundary>
    </Screen>
  );
}
