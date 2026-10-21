import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { CareActionFooter } from '@/features/my-care/components/care-financial-ui';
import { getCareStageSummary } from '@/features/my-care/model/care-overview-view';
import {
  CareFilterTabs,
  CareV5Badge,
  CareV5Card,
  CareV5Header,
  CareV5TimelineRow,
} from '@/features/my-care/components/care-v5-ui';
import {
  getMockCareCaseForScenario,
  getMockCareReferenceLabel,
} from '@/features/my-care/mocks/care.mock';
import { getMockClaimsForScenario } from '@/features/my-care/mocks/records.mock';
import {
  AppIcon,
  AppText,
  Button,
  ReadStateBoundary,
  Screen,
  StateView,
} from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { useAppDirection } from '@/providers/app-direction-provider';
import { cn } from '@/shared/utils/cn';
import { useMockScenario } from '@/shared/mock';

interface CaseTimelineScreenProps {
  caseId: string;
}

const filters = ['الكل', 'علاج', 'ماليات', 'مشكلات'] as const;
type Filter = (typeof filters)[number];
type TimelineCategory = Exclude<Filter, 'الكل'>;
type TimelineTone = 'primary' | 'success' | 'warning' | 'info' | 'danger';

interface CaseEvent {
  id: string;
  title: string;
  detail: string;
  date: string;
  tag: string;
  tone: TimelineTone;
  category: TimelineCategory;
  claimId?: string;
  icon: AppIconName;
}

export function CaseTimelineScreen({ caseId }: CaseTimelineScreenProps) {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { getSurfaceState, scenario, claimSubmissions, financialSubmissions, reviewSubmissions } =
    useMockScenario();
  const [filter, setFilter] = useState<Filter>('الكل');
  const readState = getSurfaceState('care');
  const claimsReadState = getSurfaceState('claims');
  const reviewsAvailable = getSurfaceState('reviews') === 'success';
  const careCase = getMockCareCaseForScenario(caseId, scenario);
  const submittedReview = reviewSubmissions.find((review) => review.caseId === caseId);

  if (!careCase) {
    return (
      <Screen contentClassName="px-0 py-0">
        <CareV5Header leftIcon="question" title="الحالة العلاجية" />
        <View className="px-4 pt-5">
          <StateView title="الحالة غير موجودة" />
        </View>
      </Screen>
    );
  }

  // Only the first demo case has a populated finance/refund flow. Other cases
  // must never open its hard-coded financial records under a different case ID.
  const hasDemoFinancialRecord = caseId === 'case-001';
  const submittedRefund = claimSubmissions.find(
    (claim) => claim.caseId === caseId && claim.kind === 'refund',
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

  const events: CaseEvent[] = [
    ...careCase.timeline.map((event): CaseEvent => ({
      id: event.id,
      title: event.title,
      detail: event.detail,
      date: event.dateLabel,
      tag: event.title.includes('دفعة')
        ? 'مالية'
        : event.title.includes('متابعة')
          ? 'متابعة'
          : event.title.includes('الخطة')
            ? 'شروط مقبولة'
            : event.title.includes('المرحلة')
              ? 'دليل ناقص'
              : event.title.includes('تشخيص')
                ? 'سجل طبي'
                : event.title.includes('استجابة')
                  ? 'حجز'
                  : 'تقييم أولي',
      tone:
        event.title.includes('دفعة') || event.title.includes('الخطة')
          ? 'success'
          : event.title.includes('المرحلة') || event.title.includes('متابعة')
            ? 'warning'
            : 'info',
      category: event.title.includes('دفعة') ? 'ماليات' : 'علاج',
      icon: event.title.includes('دفعة')
        ? { ios: 'banknote', android: 'payments', web: 'payments' }
        : event.title.includes('متابعة')
          ? { ios: 'calendar.badge.clock', android: 'event_repeat', web: 'event_repeat' }
          : event.title.includes('المرحلة')
            ? { ios: 'photo.on.rectangle', android: 'image', web: 'image' }
            : event.title.includes('الخطة')
              ? { ios: 'checkmark.rectangle', android: 'fact_check', web: 'fact_check' }
              : event.title.includes('تشخيص')
                ? { ios: 'stethoscope', android: 'medical_services', web: 'medical_services' }
                : event.title.includes('استجابة')
                  ? { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }
                  : { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
    })),
    ...financialSubmissions
      .filter((event) => event.caseId === caseId)
      .map((event): CaseEvent => ({
        id: event.id,
        title: event.title,
        detail: event.detail,
        date: event.dateLabel,
        tag: event.statusLabel,
        tone: 'warning',
        category: 'ماليات',
        icon: { ios: 'banknote', android: 'payments', web: 'payments' },
      })),
    ...[
      ...getMockClaimsForScenario(scenario).filter((claim) => claim.caseId === caseId),
      ...claimSubmissions.filter((claim) => claim.caseId === caseId),
    ].map((claim): CaseEvent => ({
      id: claim.id,
      claimId: claim.id,
      title: claim.title,
      detail: claim.history[0]?.title ?? 'قُدّم الطلب للمراجعة',
      date: claim.history[0]?.dateLabel ?? 'الآن',
      tag: claim.statusLabel,
      tone: 'warning',
      category: 'مشكلات',
      icon: { ios: 'exclamationmark.triangle', android: 'warning', web: 'warning' },
    })),
  ];

  const visibleEvents =
    filter === 'الكل' ? events : events.filter((event) => event.category === filter);

  const openFinance = () =>
    router.push({ pathname: '/care/[caseId]/financial', params: { caseId } });
  return (
    <Screen contentClassName="px-0 py-0">
      <CareV5Header leftIcon="question" title="الحالة العلاجية" />
      <ReadStateBoundary
        emptyDescription="لما يصير تحديث على الحالة رح يظهر ضمن الخط الزمني."
        emptyTitle="ما في أحداث على الحالة بعد"
        permissionDescription="التفويض الحالي ما عاد يسمح بعرض تاريخ هالحالة."
        permissionTitle="ما عاد في صلاحية لعرض الخط الزمني"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <ScrollView
          contentContainerClassName={
            hasDemoFinancialRecord
              ? 'mx-auto w-full max-w-[430px] px-4 pb-[156px] pt-2'
              : 'mx-auto w-full max-w-[430px] px-4 pb-[98px] pt-2'
          }
          showsVerticalScrollIndicator={false}
        >
          <View className="rounded-[15px] border border-action-primary/30 bg-action-subtle p-3">
            <View className={cn('items-center gap-2', rowClassName)}>
              <AppIcon
                name={{ ios: 'folder.badge.plus', android: 'folder_shared', web: 'folder_shared' }}
                size={20}
                tone="action"
              />
              <AppText
                align="right"
                className="min-w-0 flex-1 font-ui-bold text-content-primary"
                numberOfLines={2}
                variant="heading-4"
              >
                {careCase.title}
              </AppText>
              <CareV5Badge
                label={careCase.statusLabel}
                tone={careCase.progress >= 100 ? 'success' : 'primary'}
              />
            </View>
            <AppText
              align="right"
              className="mt-1 text-content-secondary"
              numberOfLines={2}
              variant="caption"
            >
              الحالة #{getMockCareReferenceLabel(caseId)} · {careCase.provider} · {careCase.branch}
            </AppText>
            <View className={cn('mt-2 items-center gap-2', rowClassName)}>
              <CareV5Badge label={careCase.planVersionLabel + ' مقبولة'} tone="success" />
              <AppText className="font-ui-bold text-content-link" variant="caption">
                {careCase.acceptedTotalLabel}
              </AppText>
              <AppText className="min-w-0 flex-1 text-content-secondary" variant="badge">
                {careCase.service}
              </AppText>
            </View>
          </View>

          <View className="mt-3 gap-2 rounded-[14px] border border-border-subtle bg-surface-default p-3">
            <AppText align="right" variant="heading-4" className="font-ui-bold">
              تفاصيل المرحلة الحالية
            </AppText>
            <AppText align="right" variant="label" className="font-ui-semibold">
              {getCareStageSummary(careCase).current?.title ??
                (careCase.progress >= 100 ? 'العلاج مكتمل' : 'تابع تفاصيل العلاج')}
            </AppText>
            {careCase.progress < 100 && careCase.nextAction !== 'لا يوجد إجراء مطلوب' ? (
              <View className="gap-1 border-t border-border-subtle pt-2">
                <AppText align="right" variant="caption" className="text-content-secondary">
                  الإجراء التالي
                </AppText>
                <AppText align="right" variant="label">
                  {careCase.nextAction}
                </AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">
                  {careCase.nextDateLabel}
                </AppText>
              </View>
            ) : null}
          </View>

          {careCase.progress >= 100 && reviewsAvailable ? (
            <View className="mt-2 rounded-[13px] border border-tone-success-border bg-tone-success-fill p-[10px]">
              <View className={cn('items-center gap-2', rowClassName)}>
                <AppIcon
                  name={{ ios: 'star.circle', android: 'star_outline', web: 'star_outline' }}
                  size={22}
                  tone="success"
                />
                <View className="min-w-0 flex-1 items-end">
                  <AppText
                    align="right"
                    className="font-ui-semibold text-content-primary"
                    variant="label"
                  >
                    {submittedReview ? 'تم إرسال تقييمك لهذه الحالة' : 'اكتمل العلاج، قيّم تجربتك'}
                  </AppText>
                  <AppText align="right" className="text-content-secondary" variant="caption">
                    {submittedReview
                      ? 'راجع تقييمك وحالة التحقق من التجربة.'
                      : 'تقييمك مرتبط بهذه الحالة العلاجية المكتملة.'}
                  </AppText>
                </View>
              </View>
              <Button
                className="mt-2 h-[46px] rounded-[11px]"
                endIcon={{ ios: 'star', android: 'star', web: 'star' }}
                label={submittedReview ? 'عرض تقييمي' : 'تقييم الحالة المكتملة'}
                onPress={() =>
                  router.push(
                    submittedReview
                      ? {
                          pathname: '/care/[caseId]/reviews/[reviewId]',
                          params: { caseId, reviewId: submittedReview.id },
                        }
                      : {
                          pathname: '/care/[caseId]/reviews/new',
                          params: { caseId },
                        },
                  )
                }
              />
            </View>
          ) : null}

          <CareFilterTabs
            items={filters}
            selected={filter}
            onChange={(item) => setFilter(item as Filter)}
          />

          {filter === 'ماليات' && hasDemoFinancialRecord ? (
            <View className="mt-2 gap-2">
              <Button
                className="h-[44px] rounded-[12px]"
                label="التحقق من حالة الدفعة"
                onPress={() =>
                  router.push({
                    pathname: '/care/[caseId]/financial/timeline',
                    params: { caseId },
                  })
                }
                size="sm"
                variant="outline"
              />
              <Button
                className="h-[44px] rounded-[12px]"
                label="متابعة طلب الاسترداد"
                onPress={openRefundFollowUp}
                size="sm"
                variant="secondary"
              />
            </View>
          ) : null}

          {filter === 'مشكلات' ? (
            <View className="mt-2 gap-1.5">
              <Button
                className="h-[46px] rounded-[12px]"
                disabled={claimsReadState !== 'success'}
                endIcon={{ ios: 'plus.bubble', android: 'add_comment', web: 'add_comment' }}
                label="إنشاء شكوى"
                onPress={() =>
                  router.push({
                    pathname: '/care/[caseId]/claims',
                    params: { caseId },
                  })
                }
                size="sm"
              />
              {hasDemoFinancialRecord ? (
                <Button
                  className="h-[44px] rounded-[12px]"
                  disabled={claimsReadState !== 'success'}
                  endIcon={{
                    ios: 'exclamationmark.bubble',
                    android: 'report_problem',
                    web: 'report_problem',
                  }}
                  label="فتح نزاع على دفعة"
                  onPress={() =>
                    router.push({
                      pathname: '/care/[caseId]/claims',
                      params: { caseId, issue: 'payment' },
                    })
                  }
                  size="sm"
                  variant="outline"
                />
              ) : null}
              {hasDemoFinancialRecord ? (
                <Button
                  className="h-[44px] rounded-[12px]"
                  disabled={claimsReadState !== 'success'}
                  endIcon={{
                    ios: 'arrow.uturn.backward.circle',
                    android: 'undo',
                    web: 'undo',
                  }}
                  label="طلب استرداد"
                  onPress={() =>
                    router.push({
                      pathname: '/care/[caseId]/claims',
                      params: { caseId, issue: 'refund' },
                    })
                  }
                  size="sm"
                  variant="outline"
                />
              ) : null}
              {hasDemoFinancialRecord ? (
                <Button
                  className="h-[44px] rounded-[12px]"
                  label="متابعة طلب الاسترداد"
                  onPress={openRefundFollowUp}
                  size="sm"
                  variant="secondary"
                />
              ) : null}
              {claimsReadState !== 'success' ? (
                <AppText align="right" className="text-content-secondary" variant="caption">
                  إرسال شكوى أو طلب جديد غير متاح حالياً. الطلبات السابقة بتظل ظاهرة ضمن الحالة.
                </AppText>
              ) : null}
            </View>
          ) : null}

          <View className="mt-2 gap-[6px]">
            {visibleEvents.map((event) => (
              <Pressable
                accessibilityRole={event.claimId ? 'button' : undefined}
                disabled={!event.claimId}
                key={event.id}
                onPress={() => {
                  if (event.claimId) {
                    router.push({
                      pathname: '/care/[caseId]/claims/[claimId]',
                      params: { caseId, claimId: event.claimId },
                    });
                  }
                }}
              >
                <CareV5TimelineRow
                  date={event.date.split(' · ')[0] ?? event.date}
                  title={event.title}
                  detail={event.detail}
                  tag={event.tag}
                  tone={event.tone}
                  icon={event.icon}
                />
              </Pressable>
            ))}
            {visibleEvents.length === 0 ? (
              <CareV5Card className="items-center gap-1 px-4 py-4">
                <AppText align="center" className="font-ui-semibold" variant="label">
                  ما في أحداث ضمن هذا التصنيف
                </AppText>
                <AppText align="center" className="text-content-secondary" variant="caption">
                  أي تحديث جديد رح يظهر هون تلقائياً ضمن الحالة
                </AppText>
              </CareV5Card>
            ) : null}
          </View>

          <View className={cn('mt-2 flex-wrap items-center gap-1.5', rowClassName)}>
            <CareV5Badge label="التحديثات محفوظة" tone="warning" />
            <CareV5Badge label="مراجعة عند الإكمال" tone="info" />
            <CareV5Badge label="الأحداث مرتبطة بالخطة" tone="success" />
          </View>
          <AppText className="mt-1 text-content-secondary" variant="badge">
            يظهر المحتوى من سجلّ الحالة وملفاتها؛ الإجراءات المالية والسريرية تُراجع بحسب الحالة.
          </AppText>
        </ScrollView>

        <CareActionFooter>
          <Button
            className="h-[52px] rounded-[12px]"
            endIcon={{ ios: 'doc.text.fill', android: 'description', web: 'description' }}
            label="خطتي العلاجية"
            onPress={() => router.push({ pathname: '/care/[caseId]/plan', params: { caseId } })}
          />
          {hasDemoFinancialRecord ? (
            <Button
              className="h-11 rounded-[11px]"
              endIcon={{
                ios: 'building.columns.fill',
                android: 'account_balance',
                web: 'account_balance',
              }}
              label="الشروط المالية"
              onPress={openFinance}
              size="sm"
              variant="secondary"
            />
          ) : null}
        </CareActionFooter>
      </ReadStateBoundary>
    </Screen>
  );
}
