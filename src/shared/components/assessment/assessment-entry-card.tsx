import { Button as HeroButton, Card as HeroCard } from 'heroui-native';
import { View } from 'react-native';

import { AppIcon, AppText } from '@/shared/components/ui';
import { useAssessmentEntry } from '@/features/assessment/hooks/use-assessment-entry';

/** Identical assessment entry in Home and Discover; no duplicate visual/behavioral copies. */
export function AssessmentEntryCard() {
  const startAssessment = useAssessmentEntry();

  return (
    <HeroCard
      variant="default"
      className="gap-3 rounded-[18px] border border-border-subtle bg-action-subtle p-4"
    >
      <View className="flex-row-reverse items-center gap-3">
        <View className="h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-surface-default">
          <AppIcon
            name={{
              ios: 'stethoscope',
              android: 'medical_information',
              web: 'medical_information',
            }}
            size={24}
            tone="action"
          />
        </View>
        <View className="min-w-0 flex-1 items-end gap-1">
          <AppText align="right" variant="heading-4">
            مو متأكد من حالتك؟
          </AppText>
          <AppText align="right" variant="caption" numberOfLines={2}>
            جاوب على أسئلة بسيطة لنساعدك تختار الخطوة المناسبة.
          </AppText>
        </View>
      </View>
      <HeroButton
        variant="primary"
        className="min-h-[48px] w-full rounded-[12px] bg-action-primary"
        onPress={startAssessment}
      >
        <HeroButton.Label className="shrink-0 text-center font-ui-semibold text-content-on-action">
          ساعدني أحدد حالتي
        </HeroButton.Label>
      </HeroButton>
    </HeroCard>
  );
}
