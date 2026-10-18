import { useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import {
  CareV5ActionLink,
  CareV5Badge,
  CareV5BottomNav,
  CareV5Card,
  CareV5Header,
} from '@/features/my-care/components/care-v5-ui';
import { getMockCareCaseForScenario, type MockCareCase } from '@/features/my-care/mocks/care.mock';
import { AppIcon, AppText, ReadStateBoundary, Screen, StateView } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { ToothSvg } from '@/shared/components/ui/tooth-svg';
import { TreatmentStageProgress } from '@/features/my-care/components/treatment-stage-progress';

interface TreatmentPlanScreenProps {
  caseId: string;
}

function ProcedureLine({
  stage,
  title,
  total,
  context,
  includes,
  option,
  thirdParty,
  evidence,
  followUp,
}: {
  stage: string;
  title: string;
  total: string;
  context: string;
  includes: string;
  option: string;
  thirdParty: string;
  evidence: string;
  followUp: string;
}) {
  return (
    <CareV5Card className="p-[10px]">
      <View className="flex-row items-center justify-between gap-[6px]">
        <CareV5Badge label={stage} />
        <AppText
          align="right"
          className="min-w-0 flex-1 font-ui-bold"
          numberOfLines={2}
          style={{ fontSize: 12, lineHeight: 18 }}
          variant="label"
        >
          {title}
        </AppText>
      </View>

      <View className="mt-[5px] flex-row items-center justify-between gap-[6px]">
        <AppText direction="ltr" className="font-ui-bold text-type-caption">
          {total}
        </AppText>
        <AppText
          align="right"
          className="min-w-0 flex-1 text-content-secondary"
          numberOfLines={2}
          style={{ fontSize: 9.5, lineHeight: 15 }}
          variant="caption"
        >
          {context}
        </AppText>
      </View>

      <View className="mt-[5px] flex-row gap-[5px]">
        {[
          ['يشمل', includes],
          ['الخيار', option],
          ['طرف ثالث', thirdParty],
        ].map(([label, value]) => (
          <View className="min-w-0 flex-1 rounded-[7px] bg-surface-subtle p-[5px]" key={label}>
            <AppText
              align="right"
              className="text-content-placeholder"
              style={{ fontSize: 9, lineHeight: 14 }}
              variant="caption"
            >
              {label}
            </AppText>
            <AppText
              align="right"
              className="mt-0.5"
              numberOfLines={2}
              style={{ fontSize: 10, lineHeight: 16 }}
              variant="caption"
            >
              {value}
            </AppText>
          </View>
        ))}
      </View>

      <View className="mt-[5px] flex-row justify-end gap-[5px]">
        <CareV5Badge label={evidence} tone="warning" />
        <CareV5Badge label={followUp} tone="info" />
      </View>
    </CareV5Card>
  );
}

function AcceptedPlan({ caseId, careCase }: { caseId: string; careCase: MockCareCase }) {
  const router = useRouter();
  return (
    <>
      <CareV5Header
        leftIcon="file"
        onLeftPress={() =>
          router.push({
            pathname: '/care/[caseId]/timeline',
            params: { caseId },
          })
        }
        right="chevron"
        title="خطتي العلاجية"
      />

      <ScrollView
        className="flex-1 bg-surface-canvas"
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-[88px] pt-2"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-[10px] rounded-[12px] border border-tone-success-border bg-tone-success-fill p-[9px]">
          <View className="min-w-0 flex-1">
            <View className="flex-row items-center justify-between gap-2">
              <CareV5Badge label="مقبولة ونافذة" tone="success" />
              <AppText className="font-ui-bold text-type-body">
                الخطة العلاجية · {careCase.planVersionLabel}
              </AppText>
            </View>
            <AppText className="mt-1 text-type-caption  text-content-secondary" variant="caption">
              {careCase.provider} · {careCase.planAcceptedAtLabel}
            </AppText>
            <View className="mt-[6px] flex-row gap-1">
              {careCase.stages.map((stage) => (
                <View
                  className={`h-[7px] flex-1 rounded-full ${stage.status === 'completed' || stage.status === 'current' ? 'bg-action-primary' : 'bg-border-subtle'}`}
                  key={stage.id}
                />
              ))}
            </View>
          </View>

          <TreatmentStageProgress stages={careCase.stages} />
        </View>

        <View className="mt-[7px] flex-row items-center gap-2 rounded-[11px] bg-tone-info-fill p-[9px]">
          <CareV5Badge label="تشخيص الطبيب" tone="info" />
          <View className="min-w-0 flex-1 items-end">
            <AppText className="font-ui-bold text-type-label">
              التهاب لبي غير عكوس · الضرس 46
            </AppText>
            <AppText className="mt-0.5 text-type-caption text-content-secondary" variant="caption">
              عائلة الخدمة: G03 علاج الجذور
            </AppText>
          </View>
          <View className="h-[38px] w-[108px] flex-row items-center justify-center gap-[3px] rounded-[10px] bg-surface-default">
            {(['premolar', 'premolar', 'molar', 'molar', 'molar'] as const).map((kind, index) => (
              <ToothSvg kind={kind} key={index} lower selected={index === 3} size={24} />
            ))}
          </View>
        </View>

        <View className="mt-[7px] gap-[7px]">
          <ProcedureLine
            context={`ضرس سفلي أيمن · ${careCase.treatmentPlan[0]?.quantityLabel ?? '1 سن'}`}
            evidence="أشعة نهائية مطلوبة"
            followUp="مراجعة 7 أيام"
            includes="فتح وتنظيف وإغلاق القنوات"
            option="ترميم مؤقت مشمول"
            stage="المرحلة 1"
            thirdParty="لا يوجد"
            title={careCase.treatmentPlan[0]?.title ?? 'علاج جذور الضرس 46'}
            total={careCase.treatmentPlan[0]?.priceLabel ?? '1,750 ل.س'}
          />
          <ProcedureLine
            context={`بعد إغلاق القنوات · ${careCase.treatmentPlan[1]?.quantityLabel ?? '1 سن'}`}
            evidence="صورة بعد العلاج"
            followUp="فحص بعد 14 يوماً"
            includes="ترميم كومبوزيت نهائي"
            option={
              careCase.treatmentPlan[1]?.title.includes('خزفي') ? 'ترميم خزفي مختبري' : 'لون قياسي'
            }
            stage="المرحلة 2"
            thirdParty="لا يوجد"
            title={careCase.treatmentPlan[1]?.title ?? 'ترميم نهائي للضرس 46'}
            total={careCase.treatmentPlan[1]?.priceLabel ?? '500 ل.س'}
          />
        </View>

        <CareV5Card className="mt-[7px] p-[9px]">
          <View className="flex-row items-center justify-between gap-[6px]">
            <CareV5Badge label="لا تكتمل بعد" tone="warning" />
            <AppText className="min-w-0 flex-1 text-right font-ui-bold text-type-caption">
              تقدم المراحل والأدلة
            </AppText>
            <AppIcon
              name={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }}
              size={16}
              tone="warning"
            />
          </View>

          <View className="mt-[6px] flex-row gap-[6px]">
            {[
              {
                label: 'قبل العلاج',
                state: 'مقبولة',
                tone: 'bg-surface-subtle',
                text: 'text-content-primary',
              },
              {
                label: 'أثناء العلاج',
                state: 'مقبولة',
                tone: 'bg-action-subtle',
                text: 'text-content-link',
              },
              {
                label: 'بعد العلاج',
                state: 'مطلوبة',
                tone: 'bg-tone-warning-fill',
                text: 'text-tone-warning-text',
              },
            ].map((item) => (
              <Pressable
                accessibilityLabel={`${item.label}، ${item.state}، عرض الأدلة`}
                accessibilityRole="button"
                className={`min-h-[78px] min-w-0 flex-1 items-center justify-center rounded-[9px] p-[6px] ${item.tone}`}
                key={item.label}
                onPress={() =>
                  router.push({ pathname: '/care/[caseId]/follow-ups', params: { caseId } })
                }
              >
                <AppIcon
                  name={
                    item.label === 'قبل العلاج'
                      ? {
                          ios: 'viewfinder',
                          android: 'center_focus_strong',
                          web: 'center_focus_strong',
                        }
                      : item.label === 'أثناء العلاج'
                        ? { ios: 'camera', android: 'photo_camera', web: 'photo_camera' }
                        : { ios: 'photo', android: 'image', web: 'image' }
                  }
                  size={20}
                  tone={item.label === 'بعد العلاج' ? 'warning' : 'action'}
                />
                <AppText
                  align="center"
                  className={`mt-1 font-ui-semibold ${item.text}`}
                  variant="caption"
                >
                  {item.label}
                </AppText>
                <AppText align="center" className={item.text} variant="badge">
                  {item.state}
                </AppText>
              </Pressable>
            ))}
          </View>
        </CareV5Card>

        <View className="mt-[7px] flex-row items-center justify-between gap-2 rounded-[11px] bg-action-subtle p-[9px]">
          <AppText direction="ltr" className="font-ui-bold text-type-body text-content-link">
            {careCase.acceptedTotalLabel}
          </AppText>
          <View className="min-w-0 flex-1 items-end">
            <AppText className="font-ui-bold text-type-label text-content-link" variant="label">
              إجمالي الخطة المقبولة
            </AppText>
            <AppText className="mt-0.5 text-type-caption text-content-link" variant="caption">
              750 عند البدء + 1,500 قبل المرحلة 2
            </AppText>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          className="mt-[7px] flex-row items-center gap-2 rounded-[10px] border border-tone-warning-border bg-tone-warning-fill px-[9px] py-[7px]"
          onPress={() =>
            router.push({
              pathname: '/care/[caseId]/follow-ups',
              params: { caseId },
            })
          }
        >
          <AppText
            className="min-w-0 flex-1 text-type-caption font-ui-semibold  text-tone-warning-text"
            variant="caption"
          >
            المتابعة 23 حزيران • تذكير مُرسل • إعادة الجدولة والإلغاء متاحان مع حفظ السجل.
          </AppText>
          <AppIcon
            name={{ ios: 'clock.fill', android: 'schedule', web: 'schedule' }}
            size={15}
            tone="warning"
          />
        </Pressable>
      </ScrollView>

      <CareV5BottomNav active="care" />
    </>
  );
}

/** Different cases must show their own plan; only case-001 has the Pen V5 root-canal demo. */
function OtherCarePlan({ caseId, careCase }: { caseId: string; careCase: MockCareCase }) {
  const router = useRouter();
  return (
    <>
      <CareV5Header leftIcon="file" title="خطتي العلاجية" />
      <ScrollView
        className="flex-1 bg-surface-canvas"
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-24 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-[14px] border border-tone-success-border bg-tone-success-fill p-3">
          <AppText align="right" className="font-ui-bold" variant="label">
            {careCase.title}
          </AppText>
          <AppText align="right" className="mt-0.5 text-content-secondary" variant="caption">
            {careCase.provider} · {careCase.branch}
          </AppText>
          <View className="mt-2 flex-row items-center justify-between">
            <CareV5Badge label={careCase.planVersionLabel} tone="success" />
            <AppText direction="ltr" className="font-ui-bold text-content-link" variant="label">
              {careCase.acceptedTotalLabel}
            </AppText>
          </View>
        </View>
        <AppText align="right" className="mb-1 mt-3 font-ui-bold" variant="label">
          بنود الخطة العلاجية
        </AppText>
        <View className="gap-[7px]">
          {careCase.treatmentPlan.map((item) => (
            <CareV5Card className="gap-1 p-[10px]" key={item.id}>
              <View className="flex-row items-center justify-between gap-2">
                <CareV5Badge label={item.statusLabel} tone="info" />
                <AppText align="right" className="min-w-0 flex-1 font-ui-bold" variant="label">
                  {item.title}
                </AppText>
              </View>
              <AppText align="right" className="text-content-secondary" variant="caption">
                {item.quantityLabel}
              </AppText>
              <AppText
                direction="ltr"
                className="font-ui-semibold text-content-link"
                variant="label"
              >
                {item.priceLabel}
              </AppText>
            </CareV5Card>
          ))}
        </View>
        <AppText align="right" className="mb-1 mt-3 font-ui-bold" variant="label">
          مراحل العلاج
        </AppText>
        <View className="gap-[7px]">
          {careCase.stages.map((stage) => (
            <CareV5Card className="p-[10px]" key={stage.id}>
              <View className="flex-row items-center gap-2">
                <CareV5Badge
                  label={stage.statusLabel}
                  tone={
                    stage.status === 'completed'
                      ? 'success'
                      : stage.status === 'current'
                        ? 'info'
                        : 'neutral'
                  }
                />
                <AppText align="right" className="min-w-0 flex-1 font-ui-bold" variant="label">
                  {stage.title}
                </AppText>
              </View>
              <AppText align="right" className="mt-0.5 text-content-secondary" variant="caption">
                {stage.dateLabel} · {stage.note}
              </AppText>
            </CareV5Card>
          ))}
        </View>
        <View className="mt-3 gap-[6px]">
          <CareV5ActionLink
            title="الأدلة والمتابعة"
            description="اطّلع على المواعيد والتحديثات المرتبطة بهذه الحالة"
            icon={{ ios: 'photo.fill', android: 'image', web: 'image' }}
            onPress={() =>
              router.push({ pathname: '/care/[caseId]/follow-ups', params: { caseId } })
            }
          />
        </View>
      </ScrollView>
    </>
  );
}

export function TreatmentPlanScreen({ caseId }: TreatmentPlanScreenProps) {
  const { getSurfaceState, scenario } = useMockScenario();
  const careCase = getMockCareCaseForScenario(caseId, scenario);
  const readState = getSurfaceState('care');

  if (!careCase) {
    return (
      <Screen>
        <StateView title="الخطة غير موجودة" />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <ReadStateBoundary
        emptyTitle="ما في خطة علاجية متاحة"
        permissionDescription="التفويض الحالي ما عاد يسمح بعرض الخطة العلاجية لهالمريض."
        permissionTitle="ما عاد في صلاحية لعرض الخطة"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        {caseId === 'case-001' ? (
          <AcceptedPlan careCase={careCase} caseId={caseId} />
        ) : (
          <OtherCarePlan careCase={careCase} caseId={caseId} />
        )}
      </ReadStateBoundary>
    </Screen>
  );
}
