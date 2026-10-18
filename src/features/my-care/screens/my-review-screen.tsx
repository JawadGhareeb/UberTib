import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { CareScreenShell } from '@/features/my-care/components/care-screen-shell';
import { getMockReviewRecordForScenario } from '@/features/my-care/mocks/records.mock';
import {
  AppText,
  Button,
  RatingStars,
  ReadStateBoundary,
  StateView,
  StatusIndicator,
  StatusTag,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

interface MyReviewScreenProps {
  caseId: string;
  reviewId: string;
}

export function MyReviewScreen({ caseId, reviewId }: MyReviewScreenProps) {
  const router = useRouter();
  const { getSurfaceState, reviewAppealIds, reviewSubmissions, scenario } = useMockScenario();
  const readState = getSurfaceState('reviews');
  const scenarioReview = getMockReviewRecordForScenario(scenario).existingReview;
  const sessionReview = reviewSubmissions.find((item) => item.id === reviewId && item.caseId === caseId);
  const review = sessionReview ?? (scenarioReview.id === reviewId && scenarioReview.caseId === caseId ? scenarioReview : undefined);

  if (!review) {
    return (
      <CareScreenShell eyebrow="تقييمي" title="التقييم">
        <StateView title="التقييم غير موجود" />
      </CareScreenShell>
    );
  }

  const appealPending = reviewAppealIds.includes(reviewId);
  const verificationPending =
    review.statusLabel.includes('التحقق') || review.statusLabel.includes('قيد المعالجة');
  const statusTone =
    appealPending ||
    verificationPending ||
    review.statusLabel.includes('بانتظار') ||
    review.appealEligible
      ? 'warning'
      : 'success';

  return (
    <CareScreenShell eyebrow="تقييمي" title={review.title}>
      <ReadStateBoundary
        emptyTitle="التقييم غير متاح"
        permissionDescription="التفويض الحالي ما عاد يسمح بعرض هالتقييم."
        permissionTitle="ما عاد في صلاحية لعرض التقييم"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <View className="mt-5 rounded-surface border border-border-subtle bg-surface-default p-4">
          <RatingStars rating={review.rating} size={20} />
          {review.comment ? <AppText className="mt-3">{review.comment}</AppText> : null}
          <AppText className="mt-3 text-content-secondary" variant="caption">
            {review.provider} · {review.submittedAtLabel}
          </AppText>
          <View className="mt-2 self-start">
            <StatusTag label={review.statusLabel} tone={statusTone} />
          </View>
        </View>

        {'verificationDetail' in review ? (
          <View className="mt-5 rounded-surface border border-tone-warning-border bg-tone-warning-fill p-4">
            <StatusIndicator label="التحقق من التجربة قيد المعالجة" tone="warning" />
            <AppText className="mt-2 text-content-secondary" variant="caption">
              {review.verificationDetail}
            </AppText>
          </View>
        ) : null}

        {'retirementReason' in review ? (
          <View className="mt-5 rounded-surface border border-tone-warning-border bg-tone-warning-fill p-4">
            <AppText className="text-tone-warning-text" variant="body-strong">
              سبب القرار
            </AppText>
            <AppText className="mt-2 text-content-secondary" variant="caption">
              {review.retirementReason}
            </AppText>
            <AppText className="mt-2 text-content-secondary" variant="caption">
              {review.appealDeadlineLabel}
            </AppText>
          </View>
        ) : null}

        {appealPending ? (
          <View className="mt-5">
            <StatusIndicator label="الاستئناف قيد المراجعة" tone="warning" />
            <AppText className="mt-2 text-content-secondary" variant="caption">
              القرار الأصلي بيضل ظاهر لحد ما يصدر قرار الاستئناف.
            </AppText>
          </View>
        ) : null}

        {review.appealEligible && !appealPending && readState === 'success' ? (
          <Button
            className="mt-5"
            label="استئناف القرار"
            onPress={() =>
              router.push({
                pathname: '/care/[caseId]/reviews/[reviewId]/appeal',
                params: { caseId, reviewId },
              })
            }
            variant="secondary"
          />
        ) : null}
      </ReadStateBoundary>
    </CareScreenShell>
  );
}
