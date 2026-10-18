import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { CareV5Badge, CareV5Card, CareV5Header } from '@/features/my-care/components/care-v5-ui';
import { CareActionFooter } from '@/features/my-care/components/care-financial-ui';
import { getMockCareCaseForScenario, getMockCareReferenceLabel } from '@/features/my-care/mocks/care.mock';
import { AppIcon, AppText, Button, RatingInput, ReadStateBoundary, Screen, StateView } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { useAppTheme } from '@/shared/theme/theme-provider';

interface SubmitReviewScreenProps {
  caseId: string;
}

export function SubmitReviewScreen({ caseId }: SubmitReviewScreenProps) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { getSurfaceState, reviewSubmissions, submitReview, scenario } = useMockScenario();
  const careCase = getMockCareCaseForScenario(caseId, scenario);
  const readState = getSurfaceState('reviews');
  const existing = reviewSubmissions.find((review) => review.caseId === caseId);
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? '');

  // Verified reviews are authoritative; editable draft state applies before submission.
  const displayedRating = existing?.rating ?? rating;
  const displayedComment = existing?.comment ?? comment;

  if (!careCase || careCase.progress < 100) {
    return (
      <Screen contentClassName="px-0 py-0">
        <CareV5Header leftIcon="star" title="تقييم الحالة المكتملة" />
        <View className="px-4 pt-5">
          <StateView
            title={careCase ? 'التقييم متاح بعد اكتمال العلاج' : 'الحالة غير موجودة'}
            description="يمكنك التقييم بعد اكتمال الحالة ووصول الحالة المؤكدة، ولا يظهر التقييم لحالة أخرى."
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <CareV5Header leftIcon="star" title="تقييم الحالة المكتملة" />

      <ReadStateBoundary
        emptyDescription="ما في تجربة مكتملة قابلة للتقييم حالياً."
        emptyTitle="التقييم غير متاح"
        permissionDescription="التفويض الحالي ما عاد يسمح بإرسال تقييم لهالمريض."
        permissionTitle="ما عاد في صلاحية لإرسال التقييم"
        state={readState}
        staleAtLabel="آخر تحديث محفوظ"
      >
        <ScrollView
          contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-[74px] pt-2"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="rounded-[15px] border border-tone-success-border bg-tone-success-fill px-3 py-[11px]">
            <View className="flex-row-reverse items-center gap-2">
              <View className="h-9 w-9 items-center justify-center rounded-[10px] bg-surface-default">
                <AppIcon
                  name={{ ios: 'checkmark.seal', android: 'verified', web: 'verified' }}
                  size={18}
                  tone="success"
                />
              </View>
              <AppText
                align="right"
                className="min-w-0 flex-1 font-ui-bold text-content-primary"
                numberOfLines={2}
                variant="label"
              >
                الحالة #{getMockCareReferenceLabel(caseId)} مكتملة
              </AppText>
              <CareV5Badge
                label={existing ? 'تم إرسال تقييم موثّق' : 'مؤهل لتقييم موثّق'}
                tone="success"
              />
            </View>

            <AppText align="right" className="mt-[6px] text-content-secondary" variant="caption">
              {careCase.title} · {careCase.provider} · {careCase.branch}
            </AppText>

            <View className="mt-[8px] flex-row-reverse flex-wrap gap-[6px]">
              <CareV5Badge label="تقييم نشط واحد كحد أقصى" tone="success" />
              <CareV5Badge label="التقييم مرتبط بالحالة المختارة" tone="info" />
            </View>
          </View>

          <CareV5Card className="mt-2 rounded-[15px] px-3 py-[11px]">
            <AppText align="right" className="font-ui-bold text-content-primary" variant="label">كيف كانت تجربتك الموثّقة؟</AppText>

            <View className="mt-[5px] items-center">
              <RatingInput value={displayedRating} onChange={setRating} disabled={Boolean(existing) || readState !== 'success'} />
            </View>
            <AppText align="center" className="mt-1 text-content-secondary" variant="caption">
              {displayedRating > 0 ? `التقييم المختار: ${displayedRating}/5 — يمكنك تغييره قبل الإرسال` : 'اضغط على النجوم لتقييم تجربتك من 1 إلى 5.'}
            </AppText>
            <View className="mt-2 flex-row-reverse justify-center gap-1.5">
              {[
                { text: 'الوضوح', detail: 'طريقة شرح العلاج' },
                { text: 'الالتزام', detail: 'المواعيد والتنظيم' },
                { text: 'التواصل', detail: 'التعامل والمتابعة' },
              ].map((item) => (
                <View className="min-w-0 flex-1 items-center justify-center rounded-[8px] bg-surface-subtle px-1.5 py-[5px]" key={item.text}>
                  <AppText align="center" className="font-ui-semibold text-content-primary" variant="badge">{item.text}</AppText>
                  <AppText align="center" className="text-content-secondary" variant="badge">{item.detail}</AppText>
                </View>
              ))}
            </View>
          </CareV5Card>

          <View className="mt-2 rounded-[15px] border border-border-subtle bg-surface-default px-3 py-[10px]">
            <AppText align="right" className="font-ui-bold text-type-label">تفاصيل تجربتك</AppText>
            <TextInput
              className="mt-1 min-h-[54px] p-0 font-ui-regular text-sm leading-5 text-content-primary"
              maxLength={500}
              multiline
              onChangeText={setComment}
              placeholder="اكتب تجربتك"
              placeholderTextColor={colors.text.placeholder}
              style={{ textAlign: 'right', textAlignVertical: 'top', writingDirection: 'rtl' }}
              value={displayedComment}
            />
            <AppText
              direction="ltr"
              className="text-type-caption text-content-placeholder"
              variant="caption"
            >
              {displayedComment.length} / 500
            </AppText>
          </View>

          <CareV5Card className="mt-2 rounded-[15px] px-3 py-[10px]">
            <AppText align="right" className="font-ui-bold text-type-label">ما الذي يحدث بعد الإرسال؟</AppText>

            <View className="mt-[7px] flex-row gap-[5px]">
              {([
                { number: 1, label: 'مُرسل', tone: 'primary', icon: { ios: 'paperplane', android: 'send', web: 'send' } },
                { number: 2, label: 'تحقق', tone: 'info', icon: { ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' } },
                { number: 3, label: 'نشر', tone: 'success', icon: { ios: 'eye', android: 'visibility', web: 'visibility' } },
                { number: 4, label: 'اعتدال', tone: 'neutral', icon: { ios: 'shield', android: 'shield', web: 'shield' } },
              ] as const).map((step) => (
                <View
                  className={`min-h-[63px] min-w-0 flex-1 items-center justify-center gap-0.5 rounded-[9px] ${step.tone === 'success' ? 'bg-tone-success-fill' : step.tone === 'info' ? 'bg-tone-info-fill' : step.tone === 'primary' ? 'bg-action-subtle' : 'bg-surface-subtle'}`}
                  key={step.number}
                >
                  <AppText direction="ltr" className="font-ui-semibold text-content-primary" variant="badge">{step.number}</AppText>
                  <AppText className="font-ui-semibold text-content-primary" variant="badge">{step.label}</AppText>
                  <AppIcon name={step.icon} tone={step.tone === 'primary' ? 'action' : step.tone === 'neutral' ? 'secondary' : step.tone} size={13} />
                </View>
              ))}
            </View>

            <AppText
              align="right"
              className="mt-[8px] text-type-caption text-content-secondary"
              variant="caption"
            >
              يخضع النشر للتحقق من اكتمال الحالة. عند الإخفاء أو التقاعد يظهر سبب الاعتدال وتاريخه،
              مع حق الاستئناف ضمن المهلة.
            </AppText>
          </CareV5Card>

          <View className="mt-2 rounded-[13px] bg-tone-info-fill px-3 py-[10px]">
            <View className="gap-[6px]">
              {[
                ['التقييم النشط حالياً', existing ? 'قيد التحقق' : 'لا يوجد'],
                ['أساس التحقق', careCase.title],
                ['الاستئناف', 'يظهر فقط عند قرار اعتدال/تقاعد'],
              ].map(([label, value]) => (
                <View
                  className="min-h-[20px] flex-row-reverse items-start justify-between gap-3"
                  key={label}
                >
                  <AppText
                    align="right"
                    className="min-w-0 flex-1 text-type-caption text-content-secondary"
                    variant="caption"
                  >
                    {label}
                  </AppText>
                  <AppText
                    align="left"
                    className="min-w-0 flex-1 text-type-caption font-ui-semibold text-content-primary"
                    variant="caption"
                  >
                    {value}
                  </AppText>
                </View>
              ))}
            </View>

            <AppText
              align="right"
              className="mt-[8px] text-type-caption font-ui-semibold text-tone-info-text"
              variant="caption"
            >
              لن ننشر بيانات صحية أو تفاصيل علاجية حساسة من دون أن تكتبها صراحة.
            </AppText>
          </View>
        </ScrollView>

        <CareActionFooter>
          <Button
            className="h-[52px] rounded-[12px]"
            disabled={Boolean(existing) || rating < 1 || readState !== 'success'}
            endIcon={{ ios: 'paperplane.fill', android: 'send', web: 'send' }}
            label={existing ? 'تم إرسال التقييم الموثّق' : 'إرسال التقييم الموثّق'}
            onPress={() => {
              submitReview({
                caseId,
                title: careCase.title,
                provider: careCase.provider,
                rating,
                comment: comment.trim(),
              });
              router.push({
                pathname: '/care/[caseId]/reviews/[reviewId]',
                params: { caseId, reviewId: `session-review-${caseId}` },
              });
            }}
          />
        </CareActionFooter>
      </ReadStateBoundary>
    </Screen>
  );
}
