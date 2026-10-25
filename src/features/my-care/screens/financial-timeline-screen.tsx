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

import { CareV5Card } from '@/features/my-care/components/care-v5-ui';
import {
  AppIcon,
  AppText,
  Button,
  ConfirmationDialog,
  ReadStateBoundary,
  Screen,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

interface FinancialTimelineScreenProps {
  caseId: string;
}

export function FinancialTimelineScreen({ caseId }: FinancialTimelineScreenProps) {
  const router = useRouter();
  const [confirmingCheck, setConfirmingCheck] = useState(false);
  const financialEventResponses = useMockScenario((state) => state.financialEventResponses);
  const getSurfaceState = useMockScenario((state) => state.getSurfaceState);
  const submitFinancialEventResponse = useMockScenario(
    (state) => state.submitFinancialEventResponse,
  );
  useMockScenario((state) => state.scenarioId);
  const readState = getSurfaceState('finance');
  const pending = financialEventResponses['financial-event-002'];

  if (caseId !== 'case-001') {
    return <FinancialCaseUnavailable title="تأكيد الدفعة" />;
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <CareFinancialPageHeader page="payment" />

      <ReadStateBoundary
        emptyDescription="ما في محاولة دفع مرتبطة بهذه الحالة."
        emptyTitle="ما في عملية مالية للتحقق"
        permissionDescription="التفويض الحالي ما عاد يسمح بعرض حالة الدفعة."
        permissionTitle="ما عاد في صلاحية لعرض الدفعة"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <ScrollView
          contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-[126px] pt-2"
          showsVerticalScrollIndicator={false}
        >
          <View className="rounded-[15px] border border-tone-warning-border bg-tone-warning-fill p-3">
            <CareFinancialCardHeading
              title="لا تكرر الدفعة الآن"
              status={pending ? 'قيد التحقق' : 'النتيجة غير معروفة'}
              tone="warning"
              iconOnWhite
              icon={{ ios: 'info.circle.fill', android: 'info', web: 'info' }}
            />
            <AppText
              align="right"
              className="mt-[6px] text-content-primary"
              style={{ fontSize: 10.5, lineHeight: 18 }}
              variant="caption"
            >
              {pending
                ? 'طلبنا إعادة التحقق من العملية نفسها. ما رح ننشئ دفعة جديدة أثناء التحقق.'
                : 'انقطع الاتصال بعد إرسال التأكيد. حالة العملية غير معروفة حالياً، وما لازم تعيد الدفع.'}
            </AppText>
          </View>

          {/* These are read-only system states, not controls the patient can select. */}
          <View className="mt-[8px] min-h-[44px] flex-row gap-1 rounded-[11px] bg-surface-subtle p-1">
            {(
              [
                {
                  key: 'sending',
                  label: 'قيد الإرسال',
                  icon: { ios: 'paperplane', android: 'send', web: 'send' },
                  background: 'bg-surface-default',
                  text: 'text-content-secondary',
                },
                {
                  key: 'unknown',
                  label: 'غير معروف',
                  icon: {
                    ios: 'questionmark.circle',
                    android: 'help_outline',
                    web: 'help_outline',
                  },
                  background: 'bg-tone-warning-fill',
                  text: 'text-tone-warning-text',
                },
                {
                  key: 'confirmed',
                  label: 'مؤكد',
                  icon: { ios: 'checkmark.circle', android: 'check_circle', web: 'check_circle' },
                  background: 'bg-tone-success-fill',
                  text: 'text-tone-success-text',
                },
                {
                  key: 'disputed',
                  label: 'متنازع',
                  icon: {
                    ios: 'exclamationmark.triangle',
                    android: 'report_problem',
                    web: 'report_problem',
                  },
                  background: 'bg-tone-danger-fill',
                  text: 'text-tone-danger-text',
                },
              ] as const
            ).map(({ label, key, icon, background, text }) => {
              const selected = pending ? key === 'sending' : key === 'unknown';
              return (
                <View
                  accessible
                  accessibilityLabel={`${label}${selected ? '، الحالة الحالية' : ''}`}
                  className={`min-h-[36px] min-w-0 flex-1 items-center justify-center rounded-[8px] border px-1 ${selected ? 'border-tone-warning-border' : 'border-transparent'} ${background}`}
                  key={key}
                >
                  <View className="flex-row-reverse items-center justify-center gap-1">
                    <AppIcon
                      name={icon}
                      size={13}
                      tone={
                        key === 'unknown'
                          ? 'warning'
                          : key === 'confirmed'
                            ? 'success'
                            : key === 'disputed'
                              ? 'danger'
                              : 'secondary'
                      }
                    />
                    <AppText
                      align="center"
                      className={`font-ui-semibold ${text}`}
                      numberOfLines={1}
                      style={{ fontSize: 9, lineHeight: 15 }}
                      variant="caption"
                    >
                      {label}
                    </AppText>
                  </View>
                </View>
              );
            })}
          </View>

          <CareV5Card className="mt-[8px] gap-[6px] rounded-[14px] p-[11px]">
            <CareFinancialCardHeading
              title="محاولة دفع 1,500 ل.س"
              status="شام كاش QR"
              tone="info"
              icon={{ ios: 'qrcode', android: 'qr_code_2', web: 'qr_code_2' }}
            />
            <CareDetailRow label="الحالة والخطة" value="#2841 • الخطة 2" />
            <CareDetailRow label="وقت المحاولة" value="28 حزيران • 11:42 ص" />
            <CareDetailRow label="مرجع إعادة آمن" value="PAY-2841-02" />
            <CareDetailRow label="آخر تحقق" value="لم يصل تأكيد من العيادة بعد" />
          </CareV5Card>

          <View className="mt-[9px] rounded-[12px] bg-tone-info-fill p-[11px]">
            <CareFinancialCardHeading title="سنستخدم المرجع نفسه" status="إعادة آمنة" tone="info" />
            <AppText className="mt-1 text-type-caption  text-content-primary" variant="caption">
              إعادة التحقق لا تنشئ دفعة جديدة. إذا أكدت العيادة الاستلام يتغير الحدث إلى مؤكد؛ وإن
              أنكرته يمكنك فتح نزاع مرتبط بنفس المرجع.
            </AppText>
          </View>

          <View className="mt-[8px] flex-row gap-[7px]">
            <CareV5Card className="min-h-[60px] flex-1 flex-row items-center gap-[6px] rounded-[12px] p-[9px]">
              <View className="h-9 w-9 items-center justify-center rounded-[9px] bg-action-subtle">
                <AppIcon
                  name={{ ios: 'photo.fill', android: 'image', web: 'image' }}
                  size={16}
                  tone="action"
                />
              </View>
              <View className="min-w-0 flex-1 items-end">
                <AppText className="text-type-caption text-content-placeholder" variant="caption">
                  إثبات خارجي
                </AppText>
                <AppText
                  className="font-ui-semibold"
                  numberOfLines={2}
                  style={{ fontSize: 10, lineHeight: 16 }}
                  variant="caption"
                >
                  صورة إيصال • قيد الفحص
                </AppText>
              </View>
            </CareV5Card>

            <CareV5Card className="min-h-[60px] flex-1 flex-row items-center gap-[6px] rounded-[12px] p-[9px]">
              <View className="h-9 w-9 items-center justify-center rounded-[9px] bg-tone-warning-fill">
                <AppIcon
                  name={{
                    ios: 'exclamationmark.bubble.fill',
                    android: 'report_problem',
                    web: 'report_problem',
                  }}
                  size={16}
                  tone="warning"
                />
              </View>
              <View className="min-w-0 flex-1 items-end">
                <AppText className="text-type-caption text-content-placeholder" variant="caption">
                  عند الخلاف
                </AppText>
                <AppText
                  className="font-ui-semibold"
                  numberOfLines={2}
                  style={{ fontSize: 10, lineHeight: 16 }}
                  variant="caption"
                >
                  نزاع دفعة منفصل
                </AppText>
              </View>
            </CareV5Card>
          </View>

          <View className="mt-[9px] flex-row items-center gap-[7px] rounded-[9px] bg-surface-subtle px-[10px] py-[9px]">
            <AppText
              className="min-w-0 flex-1 text-type-caption font-ui-semibold  text-content-secondary"
              variant="caption"
            >
              التحويل يتم خارج أوبرطب؛ لا محفظة ولا حجز أموال داخل التطبيق.
            </AppText>
            <AppIcon
              name={{ ios: 'shield.fill', android: 'shield', web: 'shield' }}
              size={15}
              tone="secondary"
            />
          </View>
        </ScrollView>

        <CareActionFooter>
          <Button
            className="h-[50px] rounded-[12px]"
            disabled={readState !== 'success' || !!pending}
            endIcon={{ ios: 'arrow.clockwise', android: 'refresh', web: 'refresh' }}
            label={pending ? 'التحقق قيد التنفيذ' : 'التحقق من العملية نفسها'}
            onPress={() => setConfirmingCheck(true)}
          />
          <Button
            className="h-[46px] rounded-[11px]"
            endIcon={{
              ios: 'exclamationmark.bubble.fill',
              android: 'report_problem',
              web: 'report_problem',
            }}
            label="فتح نزاع على الدفعة"
            size="sm"
            onPress={() =>
              router.push({
                pathname: '/care/[caseId]/claims',
                params: { caseId, issue: 'payment' },
              })
            }
            variant="secondary"
          />
        </CareActionFooter>
        <ConfirmationDialog
          visible={confirmingCheck && !pending}
          title="التحقق من الدفعة؟"
          description="سنطلب مراجعة المحاولة نفسها والمرجع الموجود، بدون إنشاء دفعة جديدة. النتيجة تبقى قيد التحقق حتى يردّ الطرف المعتمد."
          confirmLabel="التحقق من العملية"
          onCancel={() => setConfirmingCheck(false)}
          onConfirm={() => {
            if (pending || readState !== 'success') return;
            submitFinancialEventResponse('financial-event-002', 'confirmed', 'إعادة تحقق آمنة');
            setConfirmingCheck(false);
          }}
        />
      </ReadStateBoundary>
    </Screen>
  );
}
