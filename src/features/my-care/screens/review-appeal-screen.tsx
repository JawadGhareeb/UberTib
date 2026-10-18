import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { CareScreenShell } from '@/features/my-care/components/care-screen-shell';
import { getMockReviewRecordForScenario } from '@/features/my-care/mocks/records.mock';
import {
  AppText,
  Button,
  ReadStateBoundary,
  StateView,
  StatusIndicator,
  TextField,
} from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

interface ReviewAppealScreenProps {
  caseId: string;
  reviewId: string;
}

export function ReviewAppealScreen({ caseId, reviewId }: ReviewAppealScreenProps) {
  const router = useRouter();
  const { getSurfaceState, reviewAppealIds, reviewSubmissions, scenario, submitReviewAppeal } =
    useMockScenario();
  const readState = getSurfaceState('reviews');
  const scenarioReview = getMockReviewRecordForScenario(scenario).existingReview;
  const sessionReview = reviewSubmissions.find((item) => item.id === reviewId && item.caseId === caseId);
  const review = sessionReview ?? (scenarioReview.id === reviewId && scenarioReview.caseId === caseId ? scenarioReview : undefined);
  const [grounds, setGrounds] = useState('');

  if (!review) {
    return (
      <CareScreenShell eyebrow="استئناف التقييم" title="الاستئناف">
        <StateView title="التقييم غير موجود" />
      </CareScreenShell>
    );
  }

  const appealPending = reviewAppealIds.includes(reviewId);

  return (
    <CareScreenShell
      eyebrow="استئناف التقييم"
      title={review.appealEligible || appealPending ? 'استئناف قرار التقييم' : 'الاستئناف غير متاح'}
    >
      <ReadStateBoundary
        emptyTitle="الاستئناف غير متاح"
        permissionDescription="التفويض الحالي ما عاد يسمح بعرض أو إرسال استئناف لهالتقييم."
        permissionTitle="ما عاد في صلاحية للاستئناف"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        {!review.appealEligible && !appealPending ? (
          <View className="mt-5">
            <StatusIndicator label="لا يوجد قرار يحتاج استئنافاً" tone="info" />
            <AppText className="mt-2 text-content-secondary" variant="caption">
              التقييم الحالي ما عنده قرار مؤثر على أهليته أو حالته يحتاج استئناف.
            </AppText>
          </View>
        ) : (
          <>
            <View className="mt-5 rounded-surface border border-border-subtle bg-surface-default p-4">
              <AppText className="text-content-secondary" variant="caption">
                القرار الحالي
              </AppText>
              <AppText className="mt-1" variant="body-strong">
                {review.statusLabel}
              </AppText>
              {'retirementReason' in review ? (
                <AppText className="mt-2 text-content-secondary" variant="caption">
                  {review.retirementReason}
                </AppText>
              ) : null}
              {'appealDeadlineLabel' in review ? (
                <AppText className="mt-2 text-content-secondary" variant="caption">
                  {review.appealDeadlineLabel}
                </AppText>
              ) : null}
            </View>

            <View className="mt-5 rounded-surface border border-tone-info-border bg-tone-info-fill p-4">
              <StatusIndicator label="شو فيك تستأنف؟" tone="info" />
              <AppText className="mt-2 text-content-secondary" variant="caption">
                فيك تعترض على الأهلية أو التحقق أو تطبيق سياسة النشر. التقييم نفسه ونصه مو موضوع
                الاستئناف.
              </AppText>
              <AppText className="mt-2 text-content-secondary" variant="caption">
                الاستئناف بيراجعه شخص مستقل عن القرار الأصلي.
              </AppText>
            </View>

            {appealPending ? (
              <View className="mt-5">
                <StatusIndicator label="تم إرسال الاستئناف · قيد المراجعة" tone="warning" />
                <AppText className="mt-2 text-content-secondary" variant="caption">
                  القرار الأصلي بيضل ظاهر لحد ما يصدر قرار الاستئناف.
                </AppText>
              </View>
            ) : (
              <>
                <View className="mt-5">
                  <TextField
                    label="سبب الاستئناف"
                    multiline
                    numberOfLines={4}
                    onChangeText={setGrounds}
                    placeholder="وضح وين بتعتقد صار خطأ بالأهلية أو التحقق أو تطبيق السياسة"
                    value={grounds}
                  />
                </View>

                {readState === 'success' ? (
                  <Button
                    className="mt-6"
                    disabled={!grounds.trim()}
                    label="إرسال الاستئناف"
                    onPress={() => submitReviewAppeal(reviewId)}
                  />
                ) : (
                  <AppText className="mt-5 text-content-secondary" variant="caption">
                    إرسال الاستئناف متوقف مؤقتاً لحد ما نتحقق من القرار والمهلة.
                  </AppText>
                )}
              </>
            )}

            <Button
              className="mt-4"
              label="العودة لتقييمي"
              onPress={() =>
                router.replace({
                  pathname: '/care/[caseId]/reviews/[reviewId]',
                  params: { caseId, reviewId },
                })
              }
              variant="secondary"
            />
          </>
        )}
      </ReadStateBoundary>
    </CareScreenShell>
  );
}
