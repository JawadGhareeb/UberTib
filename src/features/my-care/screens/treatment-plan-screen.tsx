import { Accordion } from 'heroui-native';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import {
  CareV5Badge,
  CareV5BottomNav,
  CareV5Card,
  CareV5Header,
} from '@/features/my-care/components/care-v5-ui';
import { getCareStageSummary } from '@/features/my-care/model/care-overview-view';
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

interface TreatmentPlanScreenProps {
  caseId: string;
}

/** Patient-facing read-only plan: one case, one version, no fabricated diagnosis or pricing. */
export function TreatmentPlanScreen({ caseId }: TreatmentPlanScreenProps) {
  const router = useRouter();
  const scenario = useMockScenario((state) => state.scenario);
  const getSurfaceState = useMockScenario((state) => state.getSurfaceState);
  const planAcceptanceCaseIds = useMockScenario((state) => state.planAcceptanceCaseIds);
  const careCase = getMockCareCaseForScenario(caseId, scenario);
  const readState = getSurfaceState('care');

  if (!careCase) {
    return (
      <Screen contentClassName="px-0 py-0">
        <CareV5Header leftIcon="file" title="خطتي العلاجية" />
        <View className="px-4 pt-5">
          <StateView title="الخطة غير موجودة لهذه الحالة" />
        </View>
      </Screen>
    );
  }

  const pendingAcceptance = scenario.flags?.carePlanPending === true;
  const acceptanceSubmitted = planAcceptanceCaseIds.includes(caseId);
  const stages = getCareStageSummary(careCase);
  const currentStage = careCase.stages.find((stage) => stage.status === 'current');
  const stageStatusTone = (status: string) =>
    status === 'completed'
      ? ('success' as const)
      : status === 'current'
        ? ('info' as const)
        : ('neutral' as const);

  const go = (
    pathname:
      '/care/[caseId]/plan-acceptance' | '/care/[caseId]/follow-ups' | '/care/[caseId]/financial',
  ) => router.push({ pathname, params: { caseId } });

  return (
    <Screen contentClassName="px-0 py-0">
      <CareV5Header leftIcon="file" title="خطتي العلاجية" />
      <ReadStateBoundary
        emptyTitle="ما في خطة علاجية متاحة"
        permissionDescription="التفويض الحالي ما عاد يسمح بعرض الخطة العلاجية لهالمريض."
        permissionTitle="ما عاد في صلاحية لعرض الخطة"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <ScrollView
          contentContainerClassName="mx-auto w-full max-w-[430px] gap-3 px-4 pb-24 pt-3"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-3 rounded-[16px] border border-border-subtle bg-surface-default p-3.5">
            <View className="flex-row-reverse items-start justify-between gap-2">
              <View className="min-w-0 flex-1 items-end gap-1">
                <AppText align="right" variant="heading-4" className="font-ui-bold">
                  {careCase.title}
                </AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">
                  {careCase.provider} · {careCase.branch}
                </AppText>
              </View>
              <CareV5Badge
                label={
                  pendingAcceptance
                    ? acceptanceSubmitted
                      ? 'الموافقة قيد التحقق'
                      : 'بانتظار الموافقة'
                    : careCase.planVersionLabel + ' مقبولة'
                }
                tone={pendingAcceptance ? 'warning' : 'success'}
              />
            </View>

            <View className="flex-row-reverse items-end justify-between gap-2 rounded-[12px] bg-action-subtle p-3">
              <View className="min-w-0 flex-1 items-end gap-1">
                <AppText align="right" variant="caption" className="text-content-secondary">
                  {pendingAcceptance ? 'القيمة المعروضة للمراجعة' : 'إجمالي الخطة المقبولة'}
                </AppText>
                <AppText
                  direction="ltr"
                  variant="heading-3"
                  className="font-ui-bold text-content-link"
                >
                  {careCase.acceptedTotalLabel}
                </AppText>
              </View>
              <CareV5Badge label={careCase.planVersionLabel} tone="primary" />
            </View>

            <View className="gap-2">
              <View className="flex-row-reverse items-center justify-between">
                <AppText align="right" variant="label" className="font-ui-semibold">
                  تقدّم العلاج
                </AppText>
                <AppText
                  direction="ltr"
                  variant="caption"
                  className="font-ui-semibold text-content-link"
                >
                  {stages.finished}/{stages.total}
                </AppText>
              </View>
              <View
                accessibilityRole="progressbar"
                accessibilityValue={{ min: 0, max: 100, now: careCase.progress }}
                className="w-full overflow-hidden rounded-full bg-border-subtle"
                style={{ height: 7 }}
              >
                <View
                  className="rounded-full bg-action-primary"
                  style={{ width: `${careCase.progress}%`, height: 7 }}
                />
              </View>
              <AppText align="right" variant="caption" className="text-content-secondary">
                {currentStage
                  ? `المرحلة الحالية: ${currentStage.title}`
                  : careCase.progress >= 100
                    ? 'مراحل العلاج مكتملة'
                    : 'بانتظار تحديد المرحلة التالية'}
              </AppText>
            </View>
            <Button
              label={
                pendingAcceptance && !acceptanceSubmitted
                  ? 'مراجعة الخطة والموافقة'
                  : 'سجل الموافقة'
              }
              onPress={() => go('/care/[caseId]/plan-acceptance')}
              variant={pendingAcceptance && !acceptanceSubmitted ? 'primary' : 'outline'}
              size="sm"
            />
          </View>

          <View className="gap-2">
            <View className="flex-row-reverse items-center gap-2">
              <AppIcon
                name={{
                  ios: 'list.bullet.clipboard',
                  android: 'format_list_bulleted',
                  web: 'format_list_bulleted',
                }}
                size={19}
                tone="action"
              />
              <AppText align="right" variant="heading-4" className="font-ui-bold">
                بنود الخطة العلاجية
              </AppText>
            </View>
            {careCase.treatmentPlan.map((item) => (
              <CareV5Card key={item.id} className="gap-2 rounded-[13px] p-3">
                <View className="flex-row-reverse items-start justify-between gap-2">
                  <View className="min-w-0 flex-1 items-end gap-1">
                    <AppText align="right" variant="label" className="font-ui-bold">
                      {item.title}
                    </AppText>
                    <AppText align="right" variant="caption" className="text-content-secondary">
                      {item.quantityLabel} · {item.statusLabel}
                    </AppText>
                  </View>
                  <AppText
                    direction="ltr"
                    variant="label"
                    className="font-ui-bold text-content-link"
                  >
                    {item.priceLabel}
                  </AppText>
                </View>
              </CareV5Card>
            ))}
          </View>

          <View className="gap-2">
            <View className="flex-row-reverse items-center gap-2">
              <AppIcon
                name={{ ios: 'checklist', android: 'fact_check', web: 'fact_check' }}
                size={19}
                tone="action"
              />
              <AppText align="right" variant="heading-4" className="font-ui-bold">
                مراحل العلاج
              </AppText>
            </View>
            <AppText align="right" variant="caption" className="text-content-secondary">
              افتح أي مرحلة لعرض حالتها، تاريخها وملاحظات الطبيب. الصور والمتابعات موجودة بقسم
              «الأدلة والمتابعة».
            </AppText>
            <Accordion
              selectionMode="single"
              isCollapsible
              variant="surface"
              defaultValue={currentStage?.id}
            >
              {careCase.stages.map((stage, index) => (
                <Accordion.Item key={stage.id} value={stage.id}>
                  <Accordion.Trigger>
                    <View className="flex-row-reverse flex-1 items-center gap-2 py-1">
                      <View className="h-9 w-9 items-center justify-center rounded-[10px] bg-action-subtle">
                        {stage.status === 'completed' ? (
                          <AppIcon
                            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                            size={18}
                            tone="action"
                          />
                        ) : (
                          <AppText variant="label" className="font-ui-bold text-content-link">
                            {index + 1}
                          </AppText>
                        )}
                      </View>
                      <View className="min-w-0 flex-1 items-end gap-1">
                        <AppText align="right" variant="label" className="font-ui-semibold">
                          {stage.title}
                        </AppText>
                        <AppText align="right" variant="caption" className="text-content-secondary">
                          {stage.dateLabel}
                        </AppText>
                      </View>
                      <CareV5Badge label={stage.statusLabel} tone={stageStatusTone(stage.status)} />
                      <Accordion.Indicator />
                    </View>
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <View className="gap-2 px-2 pb-3">
                      <AppText align="right" variant="label" className="text-content-secondary">
                        {stage.note}
                      </AppText>
                      {stage.correction ? (
                        <View className="gap-1 rounded-[10px] bg-tone-warning-fill p-3">
                          <AppText
                            align="right"
                            variant="caption"
                            className="font-ui-semibold text-tone-warning-text"
                          >
                            تم تعديل حالة المرحلة
                          </AppText>
                          <AppText
                            align="right"
                            variant="caption"
                            className="text-content-secondary"
                          >
                            الحالة السابقة: {stage.correction.previousStatusLabel}
                          </AppText>
                          <AppText align="right" variant="caption">
                            {stage.correction.reason}
                          </AppText>
                          <AppText
                            align="right"
                            variant="caption"
                            className="text-content-secondary"
                          >
                            {stage.correction.correctedAtLabel}
                          </AppText>
                        </View>
                      ) : null}
                    </View>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion>
          </View>

          <CareV5Card className="gap-2 rounded-[13px] p-3">
            <View className="flex-row-reverse items-center gap-2">
              <AppIcon
                name={{ ios: 'calendar.badge.clock', android: 'event_note', web: 'event_note' }}
                tone="action"
                size={19}
              />
              <AppText align="right" variant="label" className="font-ui-bold">
                المتابعة والأدلة
              </AppText>
            </View>
            <AppText align="right" variant="caption" className="text-content-secondary">
              راجع مواعيد المتابعة والمتطلبات المرتبطة بالمراحل. المسودة المحلية لا تُعتبر دليلاً
              معتمداً.
            </AppText>
            <Button
              size="sm"
              variant="outline"
              label="عرض الأدلة والمواعيد"
              onPress={() => go('/care/[caseId]/follow-ups')}
            />
          </CareV5Card>

          {caseId === 'case-001' ? (
            <Button
              size="sm"
              variant="secondary"
              label="عرض الشروط المالية المقبولة"
              onPress={() => go('/care/[caseId]/financial')}
            />
          ) : null}
        </ScrollView>
        <CareV5BottomNav active="care" />
      </ReadStateBoundary>
    </Screen>
  );
}
