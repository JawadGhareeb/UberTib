import { useRouter } from 'expo-router';
import { Button as HeroButton, Card as HeroCard } from 'heroui-native';
import { View } from 'react-native';

import { CenteredActionIcon } from '@/shared/components/ui/centered-action-icon';
import { AppText } from '@/shared/components/ui';
import type { MockCareCase } from '../mocks/care.mock';
import type { LocalCareDraft } from '@/features/my-care/state/care-draft-provider';
import { getDraftCaseDisplay } from '../model/care-draft-display';
import { getCareStageSummary } from '../model/care-overview-view';
import { CareCaseStatusBadge } from './care-case-status-badge';
import { CareRecordTitle } from './care-record-title';

function CareProgressTrack({ progress }: { progress: number }) {
  // Explicit native heights: relying on arbitrary class h-[6px] let this view
  // grow to a screen-sized pill on iOS when its child used percentage width.
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={'تقدم العلاج ' + progress + ' بالمئة'}
      accessibilityValue={{ min: 0, max: 100, now: progress }}
      className="bg-surface-subtle"
      style={{
        width: '100%',
        height: 6,
        borderRadius: 99,
        overflow: 'hidden',
        flexShrink: 0,
        alignItems: 'flex-end',
      }}
    >
      <View
        className="bg-action-primary"
        style={{ width: `${progress}%`, height: 6, borderRadius: 99 }}
      />
    </View>
  );
}

/** One HeroUI case card for actual treatment and not-yet-submitted drafts. */
export function CaseRow({
  item,
  onContinueDraft,
  onRemoveDraft,
}: {
  item: MockCareCase | LocalCareDraft;
  onContinueDraft?: (draft: LocalCareDraft) => void;
  onRemoveDraft?: (draft: LocalCareDraft) => void;
}) {
  const router = useRouter();
  const careCase = 'progress' in item ? item : null;
  const draft = careCase ? null : (item as LocalCareDraft);
  const summary = careCase ? getCareStageSummary(careCase) : null;
  const progress = careCase ? Math.min(100, Math.max(0, careCase.progress)) : 0;
  const display = draft
    ? getDraftCaseDisplay(draft)
    : {
        title: careCase!.title,
        provider: careCase!.provider,
        branch: careCase!.branch,
        detail: '',
      };

  const openDetails = () => {
    if (draft) onContinueDraft?.(draft);
    else if (careCase)
      router.push({ pathname: '/care/[caseId]/timeline', params: { caseId: careCase.id } });
  };
  const openPlanOrDelete = () => {
    if (draft) onRemoveDraft?.(draft);
    else if (careCase)
      router.push({ pathname: '/care/[caseId]/plan', params: { caseId: careCase.id } });
  };

  return (
    <HeroCard
      variant="default"
      className="gap-3 rounded-[16px] border border-border-subtle bg-surface-default p-3.5"
    >
      <View className="flex-row-reverse items-center gap-3">
        <CenteredActionIcon name="care" frameSize={44} iconSize={20} />
        <View className="min-w-0 flex-1 items-end gap-1">
          <View className="w-full flex-row-reverse items-center justify-between gap-2">
            <View className="min-w-0 flex-1">
              <CareRecordTitle title={display.title} provider={display.provider} />
            </View>
            <CareCaseStatusBadge careCase={careCase ?? undefined} draft={!!draft} />
          </View>
          <AppText
            align="right"
            variant="caption"
            className="text-content-secondary"
            numberOfLines={1}
          >
            {display.branch}
          </AppText>
        </View>
      </View>

      {draft ? (
        <View className="gap-1 rounded-[11px] bg-surface-subtle px-3 py-2.5">
          <AppText align="right" variant="caption" className="text-content-secondary">
            آخر خطوة محفوظة
          </AppText>
          <AppText align="right" variant="label" className="font-ui-medium text-content-primary">
            {display.detail}
          </AppText>
        </View>
      ) : summary && summary.total > 0 ? (
        <View className="gap-2" style={{ flexShrink: 0 }}>
          <View className="flex-row-reverse items-center justify-between gap-2">
            <AppText align="right" variant="caption" className="text-content-secondary">
              {summary.finished} من {summary.total} مراحل مكتملة
            </AppText>
            <AppText
              direction="ltr"
              align="center"
              variant="caption"
              className="shrink-0 font-ui-medium text-content-link"
              numberOfLines={1}
              style={{ minWidth: 48 }}
            >
              {progress}%
            </AppText>
          </View>
          <CareProgressTrack progress={progress} />
        </View>
      ) : null}

      <View className="flex-row-reverse gap-2">
        <HeroButton
          variant="primary"
          className="min-h-[46px] min-w-0 flex-1 rounded-[12px] bg-action-primary"
          onPress={openDetails}
        >
          <HeroButton.Label
            className="w-full font-ui-semibold text-content-on-action"
            style={{ textAlign: 'center', writingDirection: 'rtl', fontSize: 12, flexShrink: 1 }}
          >
            {draft ? 'متابعة المسودة' : 'تفاصيل الحالة'}
          </HeroButton.Label>
        </HeroButton>
        <HeroButton
          variant="outline"
          className="min-h-[46px] min-w-0 flex-1 rounded-[12px] border-action-primary"
          onPress={openPlanOrDelete}
        >
          <HeroButton.Label
            className="w-full font-ui-semibold text-content-link"
            style={{ textAlign: 'center', writingDirection: 'rtl', fontSize: 12, flexShrink: 1 }}
          >
            {draft ? 'حذف المسودة' : 'خطة العلاج'}
          </HeroButton.Label>
        </HeroButton>
      </View>
    </HeroCard>
  );
}
