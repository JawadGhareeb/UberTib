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
import { useAppDirection } from '@/shared/utils/app-direction';
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
  const getSurfaceState = useMockScenario((state) => state.getSurfaceState);
  const scenario = useMockScenario((state) => state.scenario);
  const claimSubmissions = useMockScenario((state) => state.claimSubmissions);
  const financialSubmissions = useMockScenario((state) => state.financialSubmissions);
  const reviewSubmissions = useMockScenario((state) => state.reviewSubmissions);
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
          <View className="mt-2 rounded-[12px] bg-surface-subtle px-3 py-2.5">
            <AppText align="right" variant="caption" className="text-content-secondary">
              {filter === 'الكل'
                ? 'كل تحديثات الحالة العلاجية والمالية والشكاوى محفوظة هون.'
                : filter === 'علاج'
                  ? 'المراحل والجلسات والمتابعات المرتبطة بهذه الخطة.'
                  : filter === 'ماليات'
                    ? 'الأحداث المالية المسجلة، بدون افتراض تأكيد الدفعات الخارجية.'
                    : 'طلباتك المرتبطة بهذه الحالة وحالة مراجعة كل طلب.'}
            </AppText>
          </View>
          {filter === 'الكل' || filter === 'علاج' ? (
            <View className="mt-2 gap-2 rounded-[14px] border border-border-subtle bg-surface-default p-3">
              <View className="flex-row-reverse items-center justify-between gap-2">
                <AppText align="right" variant="label" className="font-ui-bold">
                  المرحلة الحالية
                </AppText>
                <CareV5Badge
                  label={`${getCareStageSummary(careCase).finished} / ${getCareStageSummary(careCase).total}`}
                  tone="info"
                />
              </View>
              <AppText align="right" variant="label" className="mt-2 font-ui-semibold">
                {getCareStageSummary(careCase).current?.title ??
                  (careCase.progress >= 100 ? 'العلاج مكتمل' : 'بانتظار تحديث المرحلة')}
              </AppText>
              {careCase.progress < 100 && careCase.nextAction !== 'لا يوجد إجراء مطلوب' ? (
                <View className="mt-2 gap-1 rounded-[10px] bg-action-subtle p-2.5">
                  <AppText align="right" variant="caption" className="text-content-secondary">
                    الإجراء التالي
                  </AppText>
                  <AppText align="right" variant="label" className="font-ui-semibold">
                    {careCase.nextAction}
                  </AppText>
                  <AppText align="right" variant="caption" className="text-content-secondary">
                    {careCase.nextDateLabel}
                  </AppText>
                </View>
              ) : null}
              {filter === 'علاج' ? (
                <Button
                  className="mt-3"
                  label="عرض المراحل والخطة"
                  size="sm"
                  variant="outline"
                  onPress={() =>
                    router.push({ pathname: '/care/[caseId]/plan', params: { caseId } })
                  }
                />
              ) : null}
            </View>
          ) : null}
          {filter === 'ماليات' ? (
            <View className="mt-2 gap-2 rounded-[14px] border border-border-subtle bg-surface-default p-3">
              <AppText align="right" variant="label" className="font-ui-bold">
                الملخص المالي
              </AppText>
              <View className="flex-row-reverse items-center justify-between gap-2 rounded-[10px] bg-action-subtle px-3 py-2">
                <AppText align="right" variant="caption" className="text-content-secondary">
                  قيمة الخطة المقبولة
                </AppText>
                <AppText direction="ltr" variant="label" className="font-ui-bold text-content-link">
                  {careCase.acceptedTotalLabel}
                </AppText>
              </View>
              <AppText align="right" variant="caption" className="text-content-secondary">
                {hasDemoFinancialRecord
                  ? 'راجع حالة كل دفعة في السجل المالي؛ المبلغ غير المؤكد ليس مبلغاً مدفوعاً.'
                  : 'ما في تفاصيل دفعات إضافية مسجّلة لهذه الحالة.'}
              </AppText>
              {hasDemoFinancialRecord ? (
                <Button
                  label="عرض السجل المالي"
                  size="sm"
                  variant="outline"
                  onPress={openFinance}
                />
              ) : null}
            </View>
          ) : null}
          {filter === 'مشكلات' ? (
            <View className="mt-2 rounded-[14px] border border-border-subtle bg-surface-default p-3">
              <View className="flex-row-reverse items-center justify-between gap-2">
                <AppText align="right" variant="label" className="font-ui-bold">
                  الشكاوى والطلبات
                </AppText>
                <CareV5Badge
                  label={`${events.filter((item) => item.category === 'مشكلات').length} طلب`}
                  tone="info"
                />
              </View>
              <AppText align="right" variant="caption" className="mt-1 text-content-secondary">
                افتح أي طلب من السجل لمعرفة حالته. إرسال شكوى لا يعني صدور قرار أو استحقاق استرداد.
              </AppText>
              <Button
                className="mt-3"
                disabled={claimsReadState !== 'success'}
                label="الإبلاغ عن مشكلة"
                size="sm"
                onPress={() =>
                  router.push({ pathname: '/care/[caseId]/claims', params: { caseId } })
                }
              />
              {submittedRefund ? (
                <Button
                  className="mt-2"
                  label="متابعة طلب الاسترداد"
                  onPress={openRefundFollowUp}
                  size="sm"
                  variant="outline"
                />
              ) : null}
              {hasDemoFinancialRecord ? (
                <AppText align="right" variant="caption" className="mt-2 text-content-secondary">
                  للاعتراض على دفعة أو مراجعة استرداد، افتح السجل المالي واختر العملية المرتبطة.
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
