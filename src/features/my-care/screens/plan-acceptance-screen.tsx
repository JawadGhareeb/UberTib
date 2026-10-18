import { useState } from 'react';
import { View } from 'react-native';

import { CareScreenShell } from '@/features/my-care/components/care-screen-shell';
import { getMockCareCaseForScenario } from '@/features/my-care/mocks/care.mock';
import { useAppDirection } from '@/providers/app-direction-provider';
import {
  AppText,
  Button,
  ReadStateBoundary,
  ConfirmationDialog,
  StateView,
  StatusIndicator,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { cn } from '@/shared/utils/cn';

interface PlanAcceptanceScreenProps {
  caseId: string;
}

/** Initial treatment plan approval only; plan amendment editing has no patient-facing flow. */
export function PlanAcceptanceScreen({ caseId }: PlanAcceptanceScreenProps) {
  const { rowClassName } = useAppDirection();
  const { getSurfaceState, planAcceptanceCaseIds, scenario, submitPlanAcceptance } = useMockScenario();
  const [confirmingAccept, setConfirmingAccept] = useState(false);
  const careCase = getMockCareCaseForScenario(caseId, scenario);
  const readState = getSurfaceState('care');
  const needsAcceptance = scenario.flags?.carePlanPending === true;
  const submitted = planAcceptanceCaseIds.includes(caseId);

  if (!careCase) {
    return (
      <CareScreenShell eyebrow="قبول الخطة" title="سجل الموافقة">
        <StateView title="السجل غير موجود" />
      </CareScreenShell>
    );
  }

  const statusLabel = submitted
    ? 'تم إرسال موافقتك'
    : needsAcceptance ? 'الموافقة مطلوبة' : 'تمت الموافقة';
  const statusDescription = submitted
    ? 'بانتظار تأكيد النتيجة؛ لا تصبح الخطة نافذة بمجرد إرسال الموافقة.'
    : needsAcceptance
      ? 'راجع النسخة والمبلغ قبل إرسال الموافقة.'
      : 'هذه الخطة المقبولة المعتمدة في سجل الحالة.';
  const approvalLabel = needsAcceptance || submitted ? 'حالة الموافقة' : 'تاريخ الموافقة';
  const approvalValue = submitted
    ? 'تم الإرسال · بانتظار التأكيد'
    : needsAcceptance
      ? 'بانتظار موافقة المريض'
      : careCase.planAcceptedAtLabel.replace('تمت الموافقة في ', '');

  const rows = [
    { label: 'نسخة الخطة', value: careCase.planVersionLabel },
    { label: needsAcceptance ? 'الإجمالي المعروض' : 'المبلغ المقبول', value: careCase.acceptedTotalLabel },
    { label: 'المريض', value: 'أحمد خالد' },
    { label: 'مقدم الخدمة', value: careCase.provider },
    { label: approvalLabel, value: approvalValue },
  ];

  return (
    <CareScreenShell eyebrow="قبول الخطة" title={needsAcceptance ? 'مراجعة الخطة' : 'سجل الموافقة'}>
      <ReadStateBoundary
        emptyTitle="ما في سجل خطة متاح"
        permissionDescription="التفويض الحالي ما عاد يسمح بمراجعة موافقة الخطة."
        permissionTitle="ما عاد في صلاحية لعرض الموافقة"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <View className={cn(
          'mt-5 rounded-surface border p-4',
          submitted || needsAcceptance
            ? 'border-tone-warning-border bg-tone-warning-fill'
            : 'border-tone-success-border bg-tone-success-fill',
        )}>
          <StatusIndicator
            label={statusLabel}
            tone={submitted || needsAcceptance ? 'warning' : 'success'}
          />
          <AppText className="mt-2 text-content-secondary" variant="caption">
            {statusDescription}
          </AppText>
        </View>

        <View className="mt-5 overflow-hidden rounded-surface border border-border-subtle bg-surface-default">
          {rows.map((row, index) => (
            <View
              className={cn(
                'items-center justify-between gap-4 px-4 py-3.5',
                rowClassName,
                index > 0 && 'border-t border-border-subtle',
              )}
              key={row.label}
            >
              <AppText className="text-content-secondary" variant="caption">
                {row.label}
              </AppText>
              <AppText className="min-w-0 flex-1" variant="body-strong">
                {row.value}
              </AppText>
            </View>
          ))}
        </View>

        {needsAcceptance && !submitted && readState === 'success' ? (
          <Button
            className="mt-6"
            label="إرسال الموافقة"
            onPress={() => setConfirmingAccept(true)}
          />
        ) : null}

        <ConfirmationDialog
          visible={confirmingAccept && needsAcceptance && !submitted && readState === 'success'}
          title="تأكيد قبول الخطة العلاجية"
          description="راجع النسخة والمبلغ قبل الموافقة. يُرسل قبول تجريبي قيد التأكيد، ولا يُعتبر معتمداً حتى تصل استجابة موثوقة."
          confirmLabel="تأكيد إرسال الموافقة"
          onConfirm={() => {
            if (submitted || !needsAcceptance || readState !== 'success') return;
            submitPlanAcceptance(caseId, 'accept');
            setConfirmingAccept(false);
          }}
          onCancel={() => setConfirmingAccept(false)}
        />

        {needsAcceptance && !submitted && readState !== 'success' ? (
          <AppText className="mt-5 text-content-secondary" variant="caption">
            إرسال الموافقة متوقف مؤقتاً لحين التحقق من أحدث نسخة للخطة وحالتها.
          </AppText>
        ) : null}
      </ReadStateBoundary>
    </CareScreenShell>
  );
}
