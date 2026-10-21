import { useState } from 'react';
import { View } from 'react-native';

import { CareScreenShell } from '@/features/my-care/components/care-screen-shell';
import { CareV5Badge, CareV5Card } from '@/features/my-care/components/care-v5-ui';
import { getMockCareCaseForScenario } from '@/features/my-care/mocks/care.mock';
import {
  AppIcon,
  AppText,
  Button,
  ConfirmationDialog,
  ReadStateBoundary,
  StateView,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

/** A version-aware, read-only agreement record; the only mutation is explicit confirmation. */
export function PlanAcceptanceScreen({ caseId }: { caseId: string }) {
  const { getSurfaceState, planAcceptanceCaseIds, scenario, submitPlanAcceptance } =
    useMockScenario();
  const [confirmingAccept, setConfirmingAccept] = useState(false);
  const careCase = getMockCareCaseForScenario(caseId, scenario);
  const readState = getSurfaceState('care');
  const needsAcceptance = scenario.flags?.carePlanPending === true;
  const submitted = planAcceptanceCaseIds.includes(caseId);

  if (!careCase) {
    return (
      <CareScreenShell eyebrow="سجل الموافقة" title="مراجعة الموافقة">
        <StateView title="السجل غير موجود" />
      </CareScreenShell>
    );
  }

  const statusLabel = submitted
    ? 'الموافقة قيد التأكيد'
    : needsAcceptance
      ? 'بانتظار موافقة المريض'
      : 'نسخة مقبولة';
  const approvalDate = submitted
    ? 'تم إرسال الطلب · لم يُؤكَّد بعد'
    : needsAcceptance
      ? 'بانتظار رد المريض'
      : careCase.planAcceptedAtLabel.replace('تمت الموافقة في ', '');

  return (
    <CareScreenShell
      eyebrow="سجل الموافقة"
      title={needsAcceptance ? 'مراجعة الخطة قبل الموافقة' : 'سجل موافقتك'}
      description="شوف النسخة، المبلغ والبنود المرتبطة بموافقتك."
    >
      <ReadStateBoundary
        emptyTitle="ما في سجل خطة متاح"
        permissionDescription="التفويض الحالي ما عاد يسمح بمراجعة موافقة الخطة."
        permissionTitle="ما عاد في صلاحية لعرض الموافقة"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <View className="mt-4 gap-3 rounded-[16px] border border-border-subtle bg-surface-default p-3.5">
          <View className="flex-row-reverse items-start gap-3">
            <View className="h-11 w-11 items-center justify-center rounded-[12px] bg-action-subtle">
              <AppIcon
                name={{ ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' }}
                tone="action"
                size={22}
              />
            </View>
            <View className="min-w-0 flex-1 items-end gap-1">
              <AppText align="right" variant="heading-4" className="font-ui-bold">
                {careCase.title}
              </AppText>
              <AppText align="right" variant="caption" className="text-content-secondary">
                {careCase.provider} · {careCase.branch}
              </AppText>
            </View>
          </View>
          <View className="flex-row-reverse items-center justify-between gap-2 rounded-[11px] bg-action-subtle px-3 py-2.5">
            <CareV5Badge
              label={statusLabel}
              tone={needsAcceptance || submitted ? 'warning' : 'success'}
            />
            <AppText align="right" variant="label" className="font-ui-bold">
              {careCase.planVersionLabel}
            </AppText>
          </View>
          <View className="gap-1">
            <AppText align="right" variant="caption" className="text-content-secondary">
              {needsAcceptance ? 'القيمة المقدّمة للمراجعة' : 'القيمة المقبولة في سجل الخطة'}
            </AppText>
            <AppText
              direction="ltr"
              align="right"
              variant="heading-3"
              className="font-ui-bold text-content-link"
            >
              {careCase.acceptedTotalLabel}
            </AppText>
          </View>
        </View>

        <CareV5Card className="mt-3 gap-2 rounded-[14px] p-3">
          <AppText align="right" variant="heading-4" className="font-ui-bold">
            تفاصيل السجل
          </AppText>
          <View className="flex-row-reverse items-center justify-between gap-2">
            <AppText align="right" variant="caption" className="text-content-secondary">
              نسخة الخطة
            </AppText>
            <AppText align="left" variant="label" className="font-ui-semibold">
              {careCase.planVersionLabel}
            </AppText>
          </View>
          <View className="flex-row-reverse items-start justify-between gap-2 border-t border-border-subtle pt-2">
            <AppText align="right" variant="caption" className="text-content-secondary">
              {needsAcceptance ? 'حالة الطلب' : 'تاريخ الموافقة'}
            </AppText>
            <AppText align="left" variant="label" className="min-w-0 flex-1 font-ui-semibold">
              {approvalDate}
            </AppText>
          </View>
          <View className="flex-row-reverse items-center justify-between gap-2 border-t border-border-subtle pt-2">
            <AppText align="right" variant="caption" className="text-content-secondary">
              مقدم الخدمة
            </AppText>
            <AppText align="left" variant="label" className="min-w-0 flex-1 font-ui-semibold">
              {careCase.provider}
            </AppText>
          </View>
        </CareV5Card>

        <View className="mt-3 gap-2">
          <AppText align="right" variant="heading-4" className="font-ui-bold">
            البنود المشمولة بالموافقة
          </AppText>
          {careCase.treatmentPlan.map((item) => (
            <CareV5Card key={item.id} className="gap-1.5 rounded-[12px] p-3">
              <View className="flex-row-reverse items-start justify-between gap-2">
                <View className="min-w-0 flex-1 items-end gap-1">
                  <AppText align="right" variant="label" className="font-ui-semibold">
                    {item.title}
                  </AppText>
                  <AppText align="right" variant="caption" className="text-content-secondary">
                    {item.quantityLabel}
                  </AppText>
                </View>
                <AppText direction="ltr" variant="label" className="font-ui-bold text-content-link">
                  {item.priceLabel}
                </AppText>
              </View>
            </CareV5Card>
          ))}
        </View>

        <View className="mt-3 flex-row-reverse items-start gap-2 rounded-[12px] bg-tone-info-fill p-3">
          <AppIcon
            name={{ ios: 'info.circle', android: 'info_outline', web: 'info_outline' }}
            tone="info"
            size={18}
          />
          <AppText align="right" variant="caption" className="min-w-0 flex-1 text-tone-info-text">
            {submitted
              ? 'تم إرسال موافقتك ضمن التجربة، وهي بانتظار التأكيد. لا تُعتمد الخطة تلقائياً.'
              : needsAcceptance
                ? 'قبل الموافقة، راجع البنود والمبلغ. التأكيد ينشئ طلب موافقة ولا يغيّر النسخة المقبولة دون تحقق.'
                : 'هذه موافقة النسخة المعروضة. أي تغيير مهم بالسعر أو المراحل يحتاج موافقة جديدة مع الاحتفاظ بالسجل السابق.'}
          </AppText>
        </View>

        {needsAcceptance && !submitted && readState === 'success' ? (
          <Button
            className="mt-4 min-h-[52px]"
            label="راجعت البنود، إرسال الموافقة"
            onPress={() => setConfirmingAccept(true)}
          />
        ) : null}
        {needsAcceptance && !submitted && readState !== 'success' ? (
          <AppText align="right" variant="caption" className="mt-3 text-content-secondary">
            إرسال الموافقة متوقف حتى التحقق من أحدث نسخة للخطة.
          </AppText>
        ) : null}

        <ConfirmationDialog
          visible={confirmingAccept && needsAcceptance && !submitted && readState === 'success'}
          title="تأكيد قبول الخطة العلاجية"
          description="راجع النسخة والمبلغ قبل الموافقة. سيُسجّل قبولك بانتظار التأكيد، ولا تُعتمد الخطة قبل اعتماد الطرف المعني."
          confirmLabel="تأكيد إرسال الموافقة"
          onConfirm={() => {
            if (submitted || !needsAcceptance || readState !== 'success') return;
            submitPlanAcceptance(caseId, 'accept');
            setConfirmingAccept(false);
          }}
          onCancel={() => setConfirmingAccept(false)}
        />
      </ReadStateBoundary>
    </CareScreenShell>
  );
}
