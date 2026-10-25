import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { CareScreenShell } from '@/features/my-care/components/care-screen-shell';
import {
  AppText,
  Button,
  ConfirmationDialog,
  ReadStateBoundary,
  StatusIndicator,
  TextField,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

interface ReportRefundExecutionScreenProps {
  caseId: string;
}

export function ReportRefundExecutionScreen({ caseId }: ReportRefundExecutionScreenProps) {
  const router = useRouter();
  const financialSubmissions = useMockScenario((state) => state.financialSubmissions);
  const getSurfaceState = useMockScenario((state) => state.getSurfaceState);
  const submitRefundExecution = useMockScenario((state) => state.submitRefundExecution);
  useMockScenario((state) => state.scenarioId);
  const readState = getSurfaceState('finance');
  const [reference, setReference] = useState('');
  const [confirmingReport, setConfirmingReport] = useState(false);
  const submission = financialSubmissions.find(
    (event) => event.caseId === caseId && event.kind === 'refund-execution',
  );

  return (
    <CareScreenShell eyebrow="تنفيذ استرداد خارجي" title="تسجيل تنفيذ خارج المنصة">
      <ReadStateBoundary
        emptyTitle="السجل المالي غير متاح"
        permissionDescription="التفويض الحالي ما عاد يسمح بتسجيل تنفيذ الاسترداد لهالمريض."
        permissionTitle="ما عاد في صلاحية لتسجيل التنفيذ"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        {submission ? (
          <View className="mt-5">
            <StatusIndicator label={submission.statusLabel} tone="warning" />
            <AppText className="mt-2 text-content-secondary" variant="caption">
              السجل يوثق تنفيذاً تم خارج المنصة، ولا يعني أن UperTib نفّذ الاسترداد أو أكده.
            </AppText>
            <Button
              className="mt-6"
              label="عرض السجل المالي"
              onPress={() =>
                router.replace({
                  pathname: '/care/[caseId]/financial/timeline',
                  params: { caseId },
                })
              }
            />
          </View>
        ) : (
          <>
            <View className="mt-5">
              <TextField
                label="مرجع التنفيذ"
                onChangeText={setReference}
                placeholder="رقم إيصال أو مرجع تحويل خارجي"
                value={reference}
              />
            </View>
            <AppText className="mt-4 text-content-secondary" variant="caption">
              هذا السجل لا يعني أن UperTib نفّذ الاسترداد؛ هو يوثق تنفيذاً تم خارج المنصة.
            </AppText>

            {readState === 'success' ? (
              <Button
                className="mt-6"
                disabled={!reference.trim()}
                label="تسجيل التنفيذ"
                onPress={() => setConfirmingReport(true)}
              />
            ) : (
              <AppText className="mt-5 text-content-secondary" variant="caption">
                تسجيل التنفيذ متوقف مؤقتاً لحد ما نتحقق من أحدث قرار استرداد.
              </AppText>
            )}
          </>
        )}
        <ConfirmationDialog
          visible={confirmingReport && !submission}
          title="تسجيل تنفيذ الاسترداد؟"
          description="هل نفذت العيادة الاسترداد خارج التطبيق؟ تسجيل المرجع محلي فقط، ولا يؤكد وصول المبلغ للمريض."
          confirmLabel="تسجيل التنفيذ"
          onCancel={() => setConfirmingReport(false)}
          onConfirm={() => {
            if (readState !== 'success' || !reference.trim()) return;
            submitRefundExecution({ caseId, reference: reference.trim() });
            setConfirmingReport(false);
          }}
        />
      </ReadStateBoundary>
    </CareScreenShell>
  );
}
