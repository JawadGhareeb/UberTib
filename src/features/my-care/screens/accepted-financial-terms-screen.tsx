import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  CareDetailRow,
  CareFinancialPageHeader,
  FinancialCaseUnavailable,
} from '@/features/my-care/components/care-financial-ui';
import { CareV5Badge, CareV5BottomNav, CareV5Card } from '@/features/my-care/components/care-v5-ui';
import { getMockCareCaseForScenario } from '@/features/my-care/mocks/care.mock';
import {
  getMockFinancialEventsForScenario,
  getMockFinancialRecordForScenario,
} from '@/features/my-care/mocks/records.mock';
import { AppIcon, AppText, Button, ReadStateBoundary, Screen } from '@/shared/components/ui';
import { SectionTabs } from '@/shared/components/ui/section-tabs';
import { useMockScenario } from '@/shared/mock';

type FinanceTab = 'transactions' | 'terms';
const tabs: { value: FinanceTab; label: string }[] = [
  { value: 'transactions', label: 'حركات الدفعات' },
  { value: 'terms', label: 'الشروط المقبولة' },
];

/** Terms are a versioned snapshot; payment events are independent external assertions. */
export function AcceptedFinancialTermsScreen({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<FinanceTab>('transactions');
  const { claimSubmissions, financialSubmissions, getSurfaceState, scenario } = useMockScenario();
  const careCase = getMockCareCaseForScenario(caseId, scenario);
  const readState = getSurfaceState('finance');
  const record = getMockFinancialRecordForScenario(scenario);
  const terms = record.acceptedTerms;
  const events = getMockFinancialEventsForScenario(scenario);
  const amended = terms.planVersionLabel !== 'الخطة 2';
  const submittedRefund = claimSubmissions.find(
    (claim) => claim.caseId === caseId && claim.kind === 'refund',
  );
  const reportedEvents = financialSubmissions.filter((event) => event.caseId === caseId);
  const confirmedEvents = events.filter((event) => event.state === 'confirmed');
  const reviewPayment = () =>
    router.push({ pathname: '/care/[caseId]/financial/timeline', params: { caseId } });
  const reviewRefund = () => {
    if (submittedRefund) {
      router.push({
        pathname: '/care/[caseId]/claims/[claimId]',
        params: { caseId, claimId: submittedRefund.id },
      });
      return;
    }
    router.push({ pathname: '/care/[caseId]/claims/refund', params: { caseId } });
  };

  if (!careCase || caseId !== record.caseId) {
    return <FinancialCaseUnavailable title="السجل المالي" />;
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <CareFinancialPageHeader page="ledger" />
      <ReadStateBoundary
        emptyDescription="ما في شروط مالية مقبولة مرتبطة بهالحالة حالياً."
        emptyTitle="ما في سجل مالي بعد"
        permissionDescription="التفويض الحالي ما عاد يسمح بعرض السجل المالي لهالمريض."
        permissionTitle="ما عاد في صلاحية لعرض السجل المالي"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <ScrollView
          contentContainerClassName="mx-auto w-full max-w-[430px] gap-3 px-4 pb-24 pt-3"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-3 rounded-[16px] border border-border-subtle bg-surface-default p-3.5">
            <View className="flex-row-reverse items-center justify-between gap-2">
              <View className="min-w-0 flex-1 items-end gap-1">
                <AppText align="right" variant="heading-4" className="font-ui-bold">
                  السجل المالي
                </AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">
                  {careCase.title} · {terms.planVersionLabel}
                </AppText>
              </View>
              <CareV5Badge label="دفع خارجي" tone="info" />
            </View>
            <View className="flex-row-reverse items-end justify-between gap-2 rounded-[12px] bg-action-subtle p-3">
              <View className="min-w-0 flex-1 items-end gap-1">
                <AppText align="right" variant="caption" className="text-content-secondary">
                  قيمة الخطة المقبولة
                </AppText>
                <AppText
                  direction="ltr"
                  variant="heading-3"
                  className="font-ui-bold text-content-link"
                >
                  {terms.totalLabel}
                </AppText>
              </View>
              <AppIcon
                name={{ ios: 'doc.text', android: 'receipt_long', web: 'receipt_long' }}
                tone="action"
                size={24}
              />
            </View>
            <AppText align="right" variant="caption" className="text-content-secondary">
              المبلغ الكلي ليس إثباتاً للدفع. تحويل المال يتم مباشرة للعيادة، وليس داخل أوبرطب.
            </AppText>
          </View>

          <SectionTabs items={tabs} value={tab} onValueChange={setTab} solidActive />

          {tab === 'transactions' ? (
            <View className="gap-3">
              <View className="flex-row-reverse gap-2">
                <View className="min-w-0 flex-1 items-end gap-1 rounded-[12px] border border-border-subtle bg-surface-default p-3">
                  <AppText align="right" variant="caption" className="text-content-secondary">
                    دفعات مؤكدة مسجلة
                  </AppText>
                  <AppText align="right" variant="label" className="font-ui-bold">
                    {confirmedEvents.length}
                  </AppText>
                </View>
                <View className="min-w-0 flex-1 items-end gap-1 rounded-[12px] border border-border-subtle bg-surface-default p-3">
                  <AppText align="right" variant="caption" className="text-content-secondary">
                    أحداث بحاجة لمراجعة
                  </AppText>
                  <AppText align="right" variant="label" className="font-ui-bold">
                    {events.length - confirmedEvents.length + reportedEvents.length}
                  </AppText>
                </View>
              </View>

              {amended ? (
                <View className="rounded-[12px] bg-tone-info-fill p-3">
                  <AppText align="right" variant="caption" className="text-tone-info-text">
                    بعض الأحداث تعود لنسخة سابقة. استحقاقات النسخة المقبولة الجديدة تنتظر سجلاً
                    مالياً مؤكداً؛ لا تعتبر المبالغ المعروضة طلب دفع جديد.
                  </AppText>
                </View>
              ) : null}

              <View className="gap-2">
                <AppText align="right" variant="heading-4" className="font-ui-bold">
                  حركات وأحداث الدفعات
                </AppText>
                {events.map((event) => {
                  const isConfirmed = event.state === 'confirmed';
                  const isDisputed = event.state === 'disputed';
                  const hasVerification = event.id === 'financial-event-002';
                  const tone = isConfirmed ? 'success' : isDisputed ? 'danger' : 'warning';
                  return (
                    <CareV5Card key={event.id} className="gap-2 rounded-[13px] p-3">
                      <View className="flex-row-reverse items-start justify-between gap-2">
                        <View className="min-w-0 flex-1 items-end gap-1">
                          <AppText align="right" variant="label" className="font-ui-semibold">
                            {event.title}
                          </AppText>
                          <AppText
                            align="right"
                            variant="caption"
                            className="text-content-secondary"
                          >
                            {event.dateLabel}
                          </AppText>
                        </View>
                        <CareV5Badge
                          label={hasVerification ? 'النتيجة غير معروفة' : event.statusLabel}
                          tone={tone}
                        />
                      </View>
                      <View className="flex-row-reverse items-center justify-between gap-2 rounded-[10px] bg-surface-subtle px-3 py-2.5">
                        <AppText direction="ltr" variant="label" className="font-ui-bold">
                          {event.amountLabel}
                        </AppText>
                        <AppText
                          align="right"
                          variant="caption"
                          className="min-w-0 flex-1 text-content-secondary"
                        >
                          {event.detail}
                        </AppText>
                      </View>
                      {hasVerification ? (
                        <View className="gap-2">
                          <Button
                            label="التحقق من العملية نفسها"
                            size="sm"
                            variant="outline"
                            onPress={reviewPayment}
                          />
                        </View>
                      ) : null}
                    </CareV5Card>
                  );
                })}
                {reportedEvents.map((event) => (
                  <CareV5Card key={event.id} className="gap-1.5 rounded-[13px] p-3">
                    <View className="flex-row-reverse items-center justify-between gap-2">
                      <AppText
                        align="right"
                        variant="label"
                        className="min-w-0 flex-1 font-ui-semibold"
                      >
                        {event.title}
                      </AppText>
                      <CareV5Badge label={event.statusLabel} tone="warning" />
                    </View>
                    <AppText align="right" variant="caption" className="text-content-secondary">
                      {event.dateLabel} · {event.detail}
                    </AppText>
                    <AppText align="right" variant="caption" className="text-tone-warning-text">
                      قيد المراجعة، لا يُحسب كدفعة مؤكدة.
                    </AppText>
                  </CareV5Card>
                ))}
              </View>
              {submittedRefund ? (
                <Button
                  size="sm"
                  variant="secondary"
                  label="متابعة طلب الاسترداد"
                  onPress={reviewRefund}
                />
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  label="عرض تفاصيل مسار الاسترداد"
                  onPress={reviewRefund}
                />
              )}
            </View>
          ) : (
            <View className="gap-3">
              <CareV5Card className="gap-2 rounded-[13px] p-3">
                <View className="flex-row-reverse items-center justify-between gap-2">
                  <AppText align="right" variant="label" className="font-ui-bold">
                    مرجع الموافقة
                  </AppText>
                  <CareV5Badge label="نسخة ثابتة" tone="success" />
                </View>
                <CareDetailRow label="نسخة الخطة" value={terms.planVersionLabel} />
                <CareDetailRow label="مرجع الشروط" value={terms.snapshotReference} />
                <CareDetailRow label="تاريخ القبول" value={terms.acceptedAtLabel} />
                <CareDetailRow label="مقدم الخدمة" value={terms.provider} />
                <CareDetailRow label="جهة الدفع" value={terms.paymentModeLabel} />
                <CareDetailRow label="هيكل الاستحقاق" value={terms.dueStructureLabel} />
              </CareV5Card>

              <View className="gap-2">
                <AppText align="right" variant="heading-4" className="font-ui-bold">
                  البنود المتفق عليها
                </AppText>
                {careCase.treatmentPlan.map((item) => (
                  <CareV5Card key={item.id} className="gap-2 rounded-[12px] p-3">
                    <View className="flex-row-reverse items-center justify-between gap-2">
                      <AppText
                        align="right"
                        variant="label"
                        className="min-w-0 flex-1 font-ui-semibold"
                      >
                        {item.title}
                      </AppText>
                      <AppText
                        direction="ltr"
                        variant="label"
                        className="font-ui-bold text-content-link"
                      >
                        {item.priceLabel}
                      </AppText>
                    </View>
                    <AppText align="right" variant="caption" className="text-content-secondary">
                      {item.quantityLabel} · {item.statusLabel}
                    </AppText>
                  </CareV5Card>
                ))}
              </View>

              <CareV5Card className="gap-2 rounded-[13px] p-3">
                <AppText align="right" variant="heading-4" className="font-ui-bold">
                  الإلغاء والاسترداد
                </AppText>
                <AppText align="right" variant="label" className="text-content-secondary">
                  {terms.cancellationTermsLabel}
                </AppText>
                <AppText align="right" variant="label" className="text-content-secondary">
                  {terms.refundTermsLabel}
                </AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">
                  {terms.policyVersionLabel} · {terms.protectionStateLabel}
                </AppText>
              </CareV5Card>
              <View className="rounded-[12px] bg-tone-info-fill p-3">
                <AppText align="right" variant="caption" className="text-tone-info-text">
                  الشروط المقبولة محفوظة كمرجع للنسخة المعتمدة، ولا تتغير بأثر رجعي عند اقتراح نسخة
                  جديدة.
                </AppText>
              </View>
            </View>
          )}
        </ScrollView>
        <CareV5BottomNav active="care" />
      </ReadStateBoundary>
    </Screen>
  );
}
