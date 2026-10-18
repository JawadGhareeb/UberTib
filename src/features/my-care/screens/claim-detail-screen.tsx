import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { CareActionFooter, CareDetailRow } from '@/features/my-care/components/care-financial-ui';
import { CareV5Badge, CareV5Card, CareV5Header } from '@/features/my-care/components/care-v5-ui';
import { getMockClaimForScenario } from '@/features/my-care/mocks/records.mock';
import { getMockCareCaseForScenario } from '@/features/my-care/mocks/care.mock';
import { AppIcon, AppText, Button, ConfirmationDialog, ReadStateBoundary, Screen, StateView } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

interface MockClaimDecision {
  reason: string;
  outcomeLabel: string;
  sourceLabel: string;
  decidedAtLabel: string;
  governingPolicyLabel: string;
  effectLabel: string;
  confirmedAmountLabel?: string;
  unverifiedAmountLabel?: string;
  appealDeadlineLabel?: string;
}

interface ClaimDetailScreenProps {
  caseId: string;
  claimId: string;
}

/**
 * The Pen decision screen is a state of one specific dispute, not a generic
 * confirmation page. A new mock complaint stays pending and receives no
 * fabricated human decision until a decision fixture exists for that ID.
 */
export function ClaimDetailScreen({ caseId, claimId }: ClaimDetailScreenProps) {
  const router = useRouter();
  const {
    claimAppealIds, claimExplanationRequestIds, claimSubmissions, getSurfaceState,
    requestClaimExplanation, scenario,
  } = useMockScenario();
  const [confirmingExplanation, setConfirmingExplanation] = useState(false);
  const readState = getSurfaceState('claims');
  const claim =
    claimSubmissions.find((entry) => entry.id === claimId && entry.caseId === caseId) ??
    getMockClaimForScenario(claimId, scenario);
  const matchingClaim = claim?.caseId === caseId ? claim : undefined;
  const careCase = getMockCareCaseForScenario(caseId, scenario);
  const hasDecision = Boolean(matchingClaim && 'decision' in matchingClaim && matchingClaim.decision);
  const appealPending = claimAppealIds.includes(claimId);
  const canAppeal = Boolean(matchingClaim?.appealEligible && hasDecision && !appealPending && readState === 'success');
  const explanationPending = claimExplanationRequestIds.includes(claimId);

  if (!matchingClaim) {
    return (
      <Screen contentClassName="px-0 py-0">
        <CareV5Header leftIcon="question" title="قرار النزاع والاستئناف" />
        <View className="px-4 pt-4">
          <StateView title="الطلب غير موجود ضمن هذه الحالة" />
        </View>
      </Screen>
    );
  }

  const decision = ('decision' in matchingClaim && matchingClaim.decision
    ? matchingClaim.decision
    : undefined) as MockClaimDecision | undefined;

  return (
    <Screen contentClassName="px-0 py-0">
      <CareV5Header leftIcon="question" title="قرار النزاع والاستئناف" />
      <ReadStateBoundary
        emptyTitle="تفاصيل الطلب غير متاحة"
        permissionDescription="ما عاد في صلاحية لعرض هذا الطلب."
        permissionTitle="صلاحية عرض الطلب غير متاحة"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <ScrollView
          contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-[120px] pt-2"
          showsVerticalScrollIndicator={false}
        >
          <View className={`rounded-[14px] border p-[11px] ${hasDecision
            ? 'border-tone-warning-border bg-tone-warning-fill'
            : 'border-tone-info-border bg-tone-info-fill'}`}>
            <View className="flex-row items-center gap-2">
              <View className="h-10 w-10 items-center justify-center rounded-[10px] bg-surface-default">
                <AppIcon
                  name={{ ios: 'scalemass', android: 'balance', web: 'balance' }}
                  size={21}
                  tone={hasDecision ? 'warning' : 'info'}
                />
              </View>
              <AppText align="right" className="min-w-0 flex-1 font-ui-bold text-content-primary" variant="label">
                {matchingClaim.typeLabel}
              </AppText>
              <CareV5Badge label={matchingClaim.statusLabel} tone={hasDecision ? 'warning' : 'info'} />
            </View>
            <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
              {matchingClaim.title} · الحالة {careCase?.title ?? 'العلاجية'}
            </AppText>
            {decision?.confirmedAmountLabel && decision.unverifiedAmountLabel ? (
              <View className="mt-2 flex-row gap-1.5">
                <View className="min-w-0 flex-1 rounded-[9px] bg-tone-success-fill p-2">
                  <AppText align="right" className="text-tone-success-text" variant="badge">مبلغ مؤكد</AppText>
                  <AppText direction="ltr" className="mt-1 font-ui-bold text-tone-success-text" variant="label">
                    {decision.confirmedAmountLabel}
                  </AppText>
                </View>
                <View className="min-w-0 flex-1 rounded-[9px] bg-surface-default p-2">
                  <AppText align="right" className="text-tone-warning-text" variant="badge">غير مثبت</AppText>
                  <AppText direction="ltr" className="mt-1 font-ui-bold text-tone-warning-text" variant="label">
                    {decision.unverifiedAmountLabel}
                  </AppText>
                </View>
              </View>
            ) : matchingClaim.amountLabel !== '—' ? (
              <AppText direction="ltr" className="mt-2 font-ui-bold text-content-primary" variant="body-strong">
                {matchingClaim.amountLabel}
              </AppText>
            ) : null}
          </View>

          {decision ? (
            <CareV5Card className="mt-2 gap-2 rounded-[14px] p-3">
              <View className="flex-row items-center gap-2">
                <AppIcon name={{ ios: 'person.crop.circle.badge.checkmark', android: 'verified_user', web: 'verified_user' }} size={17} tone="info" />
                <AppText align="right" className="min-w-0 flex-1 font-ui-bold text-content-primary" variant="label">
                  سبب القرار
                </AppText>
                <CareV5Badge label="مراجعة بشرية" tone="info" />
              </View>
              <AppText align="right" className="text-content-secondary" variant="caption">
                {decision.reason}
              </AppText>
              <CareDetailRow label="صاحب القرار" value={decision.sourceLabel} />
              <CareDetailRow label="القرار الموثّق" value={decision.decidedAtLabel} />
              <CareDetailRow label="السياسة الحاكمة" value={decision.governingPolicyLabel} />
            </CareV5Card>
          ) : (
            <View className="mt-2 rounded-[12px] bg-tone-info-fill p-3">
              <AppText align="right" className="font-ui-semibold text-tone-info-text" variant="label">
                قيد المراجعة · مثال تجريبي
              </AppText>
              <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
                الطلب محفوظ محلياً فقط؛ لم يصدر قرار بشري أو يُثبت استحقاق مالي.
              </AppText>
            </View>
          )}

          <CareV5Card className="mt-2 gap-2 rounded-[14px] p-3">
            <AppText align="right" className="font-ui-bold text-content-primary" variant="label">
              الأدلة التي تمت مراجعتها
            </AppText>
            {matchingClaim.evidence.map((item) => (
              <View className="flex-row items-center gap-2" key={item.id}>
                <CareV5Badge
                  label={item.status === 'complete' ? 'تمت مراجعته' : 'غير موفّر'}
                  tone={item.status === 'complete' ? 'success' : 'warning'}
                />
                <AppText align="right" className="min-w-0 flex-1 text-content-primary" numberOfLines={2} variant="caption">
                  {item.title}
                </AppText>
                <AppIcon
                  name={item.status === 'complete'
                    ? { ios: 'checkmark.square', android: 'fact_check', web: 'fact_check' }
                    : { ios: 'xmark.square', android: 'disabled_by_default', web: 'disabled_by_default' }}
                  tone={item.status === 'complete' ? 'success' : 'warning'}
                  size={17}
                />
              </View>
            ))}
            <AppText align="right" className="text-content-secondary" variant="caption">
              {matchingClaim.evidenceProgressLabel} · أي دليل إضافي ينتظر المراجعة، ولا يُعتمد تلقائياً.
            </AppText>
          </CareV5Card>

          <View className="mt-2 rounded-[12px] bg-tone-info-fill p-3">
            <View className="flex-row items-center gap-2">
              <AppText align="right" className="min-w-0 flex-1 font-ui-semibold text-tone-info-text" variant="label">
                {canAppeal ? 'مهلة الاستئناف' : 'حالة الاستئناف'}
              </AppText>
              <AppIcon name={{ ios: 'calendar', android: 'event', web: 'event' }} size={17} tone="info" />
            </View>
            <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
              {appealPending
                ? 'الاستئناف قيد المراجعة، والقرار الأصلي ما زال محفوظاً.'
                : canAppeal
                  ? decision?.appealDeadlineLabel ?? matchingClaim.deadlineLabel
                  : 'الاستئناف غير متاح قبل صدور قرار قابل للاستئناف.'}
            </AppText>
            {decision ? (
              <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
                {decision.effectLabel}
              </AppText>
            ) : null}
          </View>
          {decision ? (
            <View className="mt-2 flex-row flex-wrap gap-1.5">
              {matchingClaim.history.map((event) => (
                <CareV5Badge key={event.id} label={event.title} tone="info" />
              ))}
            </View>
          ) : null}
          {explanationPending ? (
            <View className="mt-2 rounded-[10px] bg-tone-info-fill px-3 py-2">
              <AppText align="right" className="text-tone-info-text" variant="caption">
                طلب شرح القرار محفوظ قيد المراجعة؛ ما وصل شرح جديد من جهة القرار بعد.
              </AppText>
            </View>
          ) : null}
        </ScrollView>

        {decision ? (
          <CareActionFooter>
            {canAppeal ? (
              <Button
                className="h-12 rounded-[12px]"
                endIcon={{ ios: 'arrow.clockwise', android: 'refresh', web: 'refresh' }}
                label="تقديم استئناف مع دليل جديد"
                onPress={() => router.push({
                  pathname: '/care/[caseId]/claims/[claimId]/appeal',
                  params: { caseId, claimId },
                })}
              />
            ) : null}
            <Button
              className="h-11 rounded-[11px]"
              disabled={explanationPending || readState !== 'success'}
              endIcon={{ ios: 'bubble.left', android: 'chat_bubble_outline', web: 'chat_bubble_outline' }}
              label={explanationPending ? 'طلب شرح القرار قيد المراجعة' : 'طلب شرح القرار'}
              onPress={() => setConfirmingExplanation(true)}
              variant="outline"
            />
          </CareActionFooter>
        ) : null}
        <ConfirmationDialog
          visible={confirmingExplanation && !explanationPending && Boolean(decision)}
          title="طلب شرح القرار"
          description="رح نحفظ طلب شرح إضافي ضمن التجربة، بدون افتراض أن فريق المراجعة استلمه أو رد عليه."
          confirmLabel="إرسال طلب الشرح"
          onCancel={() => setConfirmingExplanation(false)}
          onConfirm={() => {
            if (readState !== 'success' || !decision || explanationPending) return;
            requestClaimExplanation(claimId);
            setConfirmingExplanation(false);
          }}
        />
      </ReadStateBoundary>
    </Screen>
  );
}
