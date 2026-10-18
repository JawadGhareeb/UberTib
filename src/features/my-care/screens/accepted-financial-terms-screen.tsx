import { useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { CareDetailRow, CareFinancialCardHeading, CareFinancialPageHeader, FinancialCaseUnavailable } from '@/features/my-care/components/care-financial-ui';
import { getMockCareCaseForScenario } from '@/features/my-care/mocks/care.mock';
import { mockFinancialRecord } from '@/features/my-care/mocks/records.mock';

import {
  CareV5Badge,
  CareV5BottomNav,
  CareV5Card,
} from '@/features/my-care/components/care-v5-ui';
import { AppIcon, AppText, Button, ReadStateBoundary, Screen } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

interface AcceptedFinancialTermsScreenProps {
  caseId: string;
}

export function AcceptedFinancialTermsScreen({ caseId }: AcceptedFinancialTermsScreenProps) {
  const router = useRouter();
  const { claimSubmissions, getSurfaceState, scenario } = useMockScenario();
  const readState = getSurfaceState('finance');
  const careCase = getMockCareCaseForScenario(caseId, scenario);
  const isAmendedPlan = careCase?.planVersionLabel !== 'الخطة 2';
  const submittedRefund = claimSubmissions.find((claim) =>
    claim.caseId === caseId && claim.kind === 'refund',
  );
  const openRefundFollowUp = () => {
    if (submittedRefund) {
      router.push({
        pathname: '/care/[caseId]/claims/[claimId]',
        params: { caseId, claimId: submittedRefund.id },
      });
      return;
    }
    router.push({ pathname: '/care/[caseId]/claims/refund', params: { caseId } });
  };

  if (caseId !== 'case-001' || !careCase) {
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
          contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-[118px] pt-2"
          showsVerticalScrollIndicator={false}
        >
          <View className="rounded-[15px] border border-action-primary/40 bg-action-subtle p-[11px]">
            <CareFinancialCardHeading
              title={`الشروط المالية · ${careCase.planVersionLabel}`}
              status="لقطة ثابتة مقبولة"
              tone="success"
              iconOnWhite
              icon={{ ios: 'building.columns.fill', android: 'account_balance', web: 'account_balance' }}
            />
            <AppText
              align="right"
              className="mt-1 text-content-secondary"
              numberOfLines={2}
              style={{ fontSize: 10, lineHeight: 16 }}
              variant="caption"
            >
              {careCase.planAcceptedAtLabel} · الحالة #2841
            </AppText>
            <View className="mt-[6px] flex-row items-end justify-between gap-2">
              <AppText
                direction="ltr"
                className="font-ui-bold text-content-link"
                style={{ fontSize: 19, lineHeight: 27 }}
              >
                {careCase.acceptedTotalLabel}
              </AppText>
              <AppText align="right" className="text-content-secondary" variant="caption">
                إجمالي الخطة بالليرة السورية
              </AppText>
            </View>
          </View>

          <CareV5Card className="mt-2 rounded-[14px] p-[10px]">
            <CareFinancialCardHeading
              title="بنود الخدمة المقبولة"
              status={careCase.planVersionLabel}
              tone="info"
              icon={{ ios: 'list.bullet.rectangle.fill', android: 'format_list_bulleted', web: 'format_list_bulleted' }}
            />

            {careCase.treatmentPlan.map((item) => (
              <View className="mt-[6px] rounded-[9px] bg-surface-subtle px-[9px] py-[8px]" key={item.id}>
                <View className="flex-row items-center gap-2">
                  <AppText direction="ltr" className="font-ui-bold text-type-label">
                    {item.priceLabel}
                  </AppText>
                  <AppText align="right" className="min-w-0 flex-1 font-ui-semibold" numberOfLines={2} variant="label">{item.title}</AppText>
                </View>
                <AppText
                  align="right"
                  className="mt-0.5 text-content-secondary"
                  numberOfLines={2}
                  style={{ fontSize: 9.5, lineHeight: 15 }}
                  variant="caption"
                >
                  {item.quantityLabel} · {item.statusLabel}
                </AppText>
              </View>
            ))}
          </CareV5Card>

          {isAmendedPlan ? (
            <View className="mt-2 rounded-[12px] bg-tone-info-fill p-3">
              <AppText align="right" className="text-tone-info-text" variant="caption">
                تفاصيل استحقاق النسخة الجديدة بانتظار السجل المالي المؤكد. الأحداث التالية محفوظة من الخطة 2 السابقة، ولا تمثّل استحقاق الخطة الحالية.
              </AppText>
            </View>
          ) : (
          <CareV5Card className="mt-2 gap-[5px] p-[10px]">
            <AppText align="right" className="font-ui-bold" variant="label">هيكل الاستحقاق</AppText>
            <CareDetailRow label="عند بدء المرحلة 1" value={`${mockFinancialRecord.events[0].amountLabel} · مدفوعة`} />
            <CareDetailRow label="قبل بدء المرحلة 2" value={`${mockFinancialRecord.events[1].amountLabel} · مستحقة قبل المرحلة 2`} />
          </CareV5Card>
          )}

          <CareV5Card className="mt-2 gap-[7px] rounded-[14px] p-[10px]">
            <CareFinancialCardHeading
              title={isAmendedPlan ? 'سجل أحداث الخطة 2 السابقة' : 'سجل الأحداث المالية'}
              status="دفع خارجي فقط"
              tone="info"
            />

            <View className="flex-row items-center justify-between gap-[6px]">
              <CareV5Badge label="مؤكدة" tone="success" />
              <View className="min-w-0 flex-1 items-end">
                <AppText className="font-ui-semibold" style={{ fontSize: 11, lineHeight: 17 }} variant="caption">
                  {mockFinancialRecord.events[0].amountLabel} • نقداً في العيادة
                </AppText>
                <AppText className="text-type-caption text-content-placeholder" variant="caption">
                  {mockFinancialRecord.events[0].dateLabel}
                </AppText>
              </View>
              <View className="h-8 w-8 items-center justify-center rounded-[9px] bg-tone-success-fill">
                <AppIcon
                  name={{
                    ios: 'checkmark.circle.fill',
                    android: 'check_circle',
                    web: 'check_circle',
                  }}
                  size={15}
                  tone="success"
                />
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              className="min-h-[44px] flex-row items-center gap-[6px]"
              onPress={() =>
                router.push({
                  pathname: '/care/[caseId]/financial/timeline',
                  params: { caseId },
                })
              }
            >
              <CareV5Badge label="حالة غير معروفة" tone="warning" />
              <View className="min-w-0 flex-1 items-end">
                <AppText className="font-ui-semibold" style={{ fontSize: 11, lineHeight: 17 }} variant="caption">
                  {mockFinancialRecord.events[1].amountLabel} • شام كاش QR
                </AppText>
                <AppText className="text-type-caption text-content-placeholder" variant="caption">
                  28 حزيران
                </AppText>
              </View>
              <View className="h-8 w-8 items-center justify-center rounded-[9px] bg-tone-warning-fill">
                <AppIcon
                  name={{ ios: 'clock.fill', android: 'schedule', web: 'schedule' }}
                  size={15}
                  tone="warning"
                />
              </View>
            </Pressable>
          </CareV5Card>

          <View className="mt-2 rounded-[13px] bg-tone-warning-fill p-3">
            <AppText className="font-ui-bold text-type-label text-tone-warning-text">
              الإلغاء والاسترداد وطرق الدفع
            </AppText>
            <AppText className="mt-1 text-type-caption  text-content-primary" variant="caption">
              الإلغاء قبل 24 ساعة دون بدل خدمة غير منفذة. الاسترداد يخضع للبند المتأثر ونافذته.
              الطرق المفعّلة: نقداً في العيادة أو شام كاش عند إتاحة QR من العيادة.
            </AppText>
            <AppText
              className="mt-1 text-type-caption font-ui-bold  text-tone-danger-text"
              variant="caption"
            >
              لا توجد محفظة أو ضمان أو حساب وسيط أو تمويل استرداد من أوبرطب.
            </AppText>
          </View>

          <View className="mt-3 gap-2">
            <Button
              label="تأكيد الدفعة والتحقق من حالتها"
              onPress={() => router.push({
                pathname: '/care/[caseId]/financial/timeline',
                params: { caseId },
              })}
              size="sm"
              variant="outline"
            />
            <Button
              label="متابعة طلب الاسترداد"
              onPress={openRefundFollowUp}
              size="sm"
              variant="secondary"
            />
          </View>
        </ScrollView>

        <CareV5BottomNav active="care" />
      </ReadStateBoundary>
    </Screen>
  );
}
