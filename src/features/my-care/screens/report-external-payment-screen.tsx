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

interface ReportExternalPaymentScreenProps {
  caseId: string;
}

export function ReportExternalPaymentScreen({ caseId }: ReportExternalPaymentScreenProps) {
  const router = useRouter();
  const { financialSubmissions, getSurfaceState, submitExternalPayment } = useMockScenario();
  const readState = getSurfaceState('finance');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [confirmingReport, setConfirmingReport] = useState(false);
  const canConfirmReport = readState === 'success' && Boolean(amount.trim());
  const submission = financialSubmissions.find(
    (event) => event.caseId === caseId && event.kind === 'external-payment',
  );

  return (
    <CareScreenShell eyebrow="تسجيل دفع خارجي" title="سجل دفعة تمت مباشرة مع العيادة">
      <ReadStateBoundary
        emptyTitle="السجل المالي غير متاح"
        permissionDescription="التفويض الحالي ما عاد يسمح بتسجيل أحداث مالية لهالمريض."
        permissionTitle="ما عاد في صلاحية لتسجيل الدفعة"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        {submission ? (
          <View className="mt-5">
            <StatusIndicator label={submission.statusLabel} tone="warning" />
            <AppText className="mt-2 text-content-secondary">
              تم تسجيل {submission.amountLabel} كدفعة تمت خارج المنصة، بدون اعتبارها مؤكدة نهائياً.
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
            <View className="mt-5 gap-4">
              <TextField
                direction="ltr"
                keyboardType="numeric"
                label="المبلغ بالليرة السورية"
                onChangeText={setAmount}
                placeholder="مثال: 2500"
                value={amount}
              />
              <TextField
                label="مرجع أو ملاحظة"
                onChangeText={setReference}
                placeholder="رقم إيصال أو ملاحظة قصيرة"
                value={reference}
              />
            </View>

            <AppText className="mt-4 text-content-secondary" variant="caption">
              هذا تسجيل لحدث حصل خارج UperTib، وليس عملية دفع داخل التطبيق.
            </AppText>

            {readState === 'success' ? (
              <Button
                className="mt-6"
                disabled={!amount.trim()}
                label="تسجيل الدفعة"
                onPress={() => setConfirmingReport(true)}
              />
            ) : (
              <AppText className="mt-5 text-content-secondary" variant="caption">
                تسجيل الحدث متوقف مؤقتاً لحد ما نتحقق من أحدث حالة للسجل المالي.
              </AppText>
            )}
          </>
        )}
        <ConfirmationDialog
          visible={confirmingReport && !submission}
          title="تسجيل دفعة خارجية؟"
          description="تأكد أن الدفعة حصلت فعلاً خارج التطبيق، ولا يُعد التسجيل التجريبي تأكيداً باستلام العيادة للمبلغ."
          confirmLabel="تسجيل الدفعة"
          onCancel={() => setConfirmingReport(false)}
          onConfirm={() => {
            if (!canConfirmReport) return;
            submitExternalPayment({
              caseId,
              amountLabel: `${amount.trim()} ل.س`,
              reference: reference.trim(),
            });
            setConfirmingReport(false);
          }}
        />
      </ReadStateBoundary>
    </CareScreenShell>
  );
}
