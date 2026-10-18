import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import type { MockCareStage } from '@/features/my-care/mocks/care.mock';
import { AppText } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/theme-provider';

const SIZE = 62;
const STROKE_WIDTH = 7;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** The current stage counts toward the reached stage, matching "2/4" in the care design.
 * Upcoming stages are not counted, and the indicator is derived from the actual stage list.
 */
export function getTreatmentStageProgress(stages: readonly MockCareStage[]) {
  const total = stages.length;
  const reached = stages.filter(
    (stage) => stage.status === 'completed' || stage.status === 'current',
  ).length;
  return { reached, total, fraction: total > 0 ? reached / total : 0 };
}

export function TreatmentStageProgress({ stages }: { stages: readonly MockCareStage[] }) {
  const { colors } = useAppTheme();
  const { reached, total, fraction } = getTreatmentStageProgress(stages);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`المرحلة ${reached} من ${total}`}
      accessibilityValue={{ min: 0, max: Math.max(total, 1), now: reached }}
      className="h-[62px] w-[62px] shrink-0 items-center justify-center"
    >
      <Svg height={SIZE} width={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={colors.action.subtle}
          strokeWidth={STROKE_WIDTH}
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={colors.action.primary}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
          strokeLinecap="butt"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>
      <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
        <AppText
          direction="ltr"
          className="font-ui-bold text-content-link"
          style={{ fontSize: 15, lineHeight: 22 }}
          variant="label"
        >
          {reached}/{total}
        </AppText>
      </View>
    </View>
  );
}
