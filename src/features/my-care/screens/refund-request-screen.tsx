import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  CareActionFooter,
  CareDetailRow,
  CareFinancialCardHeading,
  CareFinancialPageHeader,
  FinancialCaseUnavailable,
} from '@/features/my-care/components/care-financial-ui';

import { CareV5Badge, CareV5Card } from '@/features/my-care/components/care-v5-ui';
import {
  AppIcon,
  AppText,
  Button,
  ConfirmationDialog,
  ReadStateBoundary,
  Screen,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

interface RefundRequestScreenProps {
  caseId: string;
}

export function RefundRequestScreen({ caseId }: RefundRequestScreenProps) {
  const router = useRouter();
  const [confirmingReceipt, setConfirmingReceipt] = useState(false);
  const { financialEventResponses, getSurfaceState, submitFinancialEventResponse } =
    useMockScenario();
  const readState = getSurfaceState('claims');
  const receiptResponse = financialEventResponses['refund-execution-case-001'];

  if (caseId !== 'case-001') {
    return <FinancialCaseUnavailable title="طلب الاسترداد" />;
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <CareFinancialPageHeader page="refund" />

      <ReadStateBoundary
        emptyTitle="طلب الاسترداد غير متاح"
        permissionDescription="التفويض الحالي ما عاد يسمح بعرض حالة الاسترداد لهالمريض."
        permissionTitle="ما عاد في صلاحية لعرض الاسترداد"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <ScrollView
          contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-[122px] pt-2"
          showsVerticalScrollIndicator={false}
        >
          <View className="rounded-[15px] border border-tone-success-border bg-tone-success-fill p-[11px]">
            <CareFinancialCardHeading
              title="استرداد لسطر خدمة غير منفّذ"
              status="مؤهل ضمن النافذة"
              tone="success"
              iconOnWhite
              icon={{ ios: 'arrow.uturn.backward.circle.fill', android: 'undo', web: 'undo' }}
            />
            <AppText
              align="right"
              className="mt-1 text-content-secondary"
              style={{ fontSize: 9.5, lineHeight: 15 }}
              variant="caption"
            >
              الطلب RF-208 · الحالة #2841 · الخطة المالية المقبولة 2
            </AppText>
            <View className="mt-[6px] flex-row items-end justify-between gap-2">
              <AppText
                direction="ltr"
                className="font-ui-bold text-tone-success-text"
                style={{ fontSize: 19, lineHeight: 27 }}
              >
                375 ل.س
              </AppText>
              <AppText align="right" className="text-content-secondary" variant="caption">
                قيمة الاستحقاق الموافق عليها
              </AppText>
            </View>
          </View>

          <CareV5Card className="mt-2 gap-[5px] p-[10px]">
            <AppText align="right" className="font-ui-bold" variant="label">
              الاستحقاق والنافذة
            </AppText>
            <CareDetailRow label="السطر المتأثر" value="بناء قلب للضرس 46 · لم يُنفّذ" />
            <CareDetailRow label="الأساس" value="شروط الإلغاء في اللقطة 2" />
            <CareDetailRow label="نافذة الطلب" value="حتى 28 حزيران 2026" />
            <CareDetailRow label="القرار" value="استرداد كامل لهذا السطر فقط" />
          </CareV5Card>

          <CareV5Card className="mt-2 p-[10px]">
            <AppText align="right" className="font-ui-bold" variant="label">
              مسار الاسترداد
            </AppText>
            <View className="mt-[6px] gap-[5px]">
              {[
                { num: '1', title: 'قُدّم الطلب', state: '22 حزيران', tone: 'success' as const },
                {
                  num: '2',
                  title: 'قرار بشري موثّق',
                  state: '23 حزيران',
                  tone: 'success' as const,
                },
                {
                  num: '3',
                  title: 'أبلغت العيادة التنفيذ الخارجي',
                  state: '24 حزيران',
                  tone: 'info' as const,
                },
                {
                  num: '4',
                  title: 'تأكيد الاستلام من المريض',
                  state: receiptResponse ? 'قيد التحقق' : 'بانتظارك',
                  tone: 'warning' as const,
                },
              ].map(({ num, title, state, tone }) => (
                <View className="min-h-[34px] flex-row items-center gap-2" key={num}>
                  <CareV5Badge label={state} tone={tone} />
                  <AppText
                    align="right"
                    className="min-w-0 flex-1 font-ui-semibold"
                    numberOfLines={2}
                    style={{ fontSize: 10.5, lineHeight: 17 }}
                    variant="caption"
                  >
                    {title}
                  </AppText>
                  <View
                    className={`h-7 w-7 items-center justify-center rounded-full ${
                      tone === 'success'
                        ? 'bg-tone-success-fill'
                        : tone === 'info'
                          ? 'bg-tone-info-fill'
                          : 'bg-tone-warning-fill'
                    }`}
                  >
                    <AppText
                      direction="ltr"
                      className={`text-type-caption font-ui-bold ${
                        tone === 'success'
                          ? 'text-tone-success-text'
                          : tone === 'info'
                            ? 'text-tone-info-text'
                            : 'text-tone-warning-text'
                      }`}
                    >
                      {num}
                    </AppText>
                  </View>
                </View>
              ))}
            </View>
          </CareV5Card>

          <View className="mt-2 rounded-[12px] bg-tone-info-fill p-[10px]">
            <CareFinancialCardHeading
              title="إعادة عبر شام كاش من العيادة"
              status="تنفيذ خارجي"
              tone="info"
            />
            <AppText className="mt-1 text-type-caption  text-content-primary" variant="caption">
              مرجع العيادة SC-RF-208 • 24 حزيران، 3:10 م. أوبرطب يتابع الحالة ولا يمول الاسترداد ولا
              يحتفظ بالأموال.
            </AppText>
          </View>

          <View className="mt-2 flex-row items-center gap-2 rounded-[10px] bg-tone-warning-fill px-[10px] py-[9px]">
            <AppText
              className="min-w-0 flex-1 text-type-caption font-ui-semibold  text-tone-warning-text"
              variant="caption"
            >
              لم يصل المبلغ؟ افتح مشكلة تنفيذ استرداد مرتبطة بنفس الطلب، دون إنشاء طلب استرداد جديد.
            </AppText>
            <AppIcon
              name={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }}
              size={15}
              tone="warning"
            />
          </View>
        </ScrollView>

        <CareActionFooter>
          <Button
            className="h-12 rounded-[12px]"
            disabled={readState !== 'success' || !!receiptResponse}
            endIcon={{
              ios: 'checkmark.circle.fill',
              android: 'check_circle',
              web: 'check_circle',
            }}
            label={receiptResponse ? 'تأكيد الاستلام قيد التحقق' : 'تأكيد استلام الاسترداد'}
            onPress={() => setConfirmingReceipt(true)}
          />
          <Button
            className="h-11 rounded-[11px]"
            endIcon={{
              ios: 'exclamationmark.bubble.fill',
              android: 'report_problem',
              web: 'report_problem',
            }}
            label="الإبلاغ عن عدم الاستلام"
            size="sm"
            onPress={() =>
              router.push({
                pathname: '/care/[caseId]/claims',
                params: { caseId, issue: 'refund-execution' },
              })
            }
            variant="secondary"
          />
        </CareActionFooter>
        <ConfirmationDialog
          visible={confirmingReceipt && !receiptResponse}
          title="هل استلمت مبلغ الاسترداد؟"
          description="أكد فقط إذا وصل المبلغ إليك فعلياً من العيادة. لا يتم تحويل أي أموال داخل التطبيق، ويبقى تسجيل الاستلام بانتظار التحقق."
          confirmLabel="نعم، استلمت المبلغ"
          onCancel={() => setConfirmingReceipt(false)}
          onConfirm={() => {
            if (receiptResponse || readState !== 'success') return;
            submitFinancialEventResponse(
              'refund-execution-case-001',
              'confirmed',
              'أكد المريض استلام الاسترداد الخارجي',
            );
            setConfirmingReceipt(false);
          }}
        />
      </ReadStateBoundary>
    </Screen>
  );
}
