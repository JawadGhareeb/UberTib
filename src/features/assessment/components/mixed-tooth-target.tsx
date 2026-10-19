import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppIcon } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { mirrorToothPath } from '@/shared/utils/mirror-tooth-path';

/**
 * Pen mixed arches contain ten selectable positions per row.
 * Locations 2, 3, 8 and 9 layer a primary tooth in front of a permanent tooth.
 * Lower and upper teeth share matching outlines, rotated for lower orientation.
 */
const TRANSITIONAL_POSITIONS = new Set([1, 2, 7, 8]);

type MixedShape = 'molar' | 'canine' | 'incisor';

const mixedPaths: Record<MixedShape, string> = {
  molar: 'M3 3c-1 4-1 9 2 13 0 6 2 13 5 15 3-2 5-9 5-15 3-4 3-9 2-13-4 2-10 2-14 0z',
  canine: 'M4 3c-1 4-1 8 2 12l4 5 4-5c3-4 3-8 2-12-4 2-8 2-12 0z',
  incisor: 'M4 3c-1 4-1 8 1 12 1 6 2 13 5 15 3-2 4-9 5-15 2-4 2-8 1-12-4 1-8 1-12 0z',
};

const mixedLowerPaths: Record<MixedShape, string> = {
  molar: mirrorToothPath(mixedPaths.molar),
  canine: mirrorToothPath(mixedPaths.canine),
  incisor: mirrorToothPath(mixedPaths.incisor),
};

interface MixedSilhouetteProps {
  shape: MixedShape;
  lower: boolean;
  width: number;
  height: number;
  stroke: string;
  fill: string;
  strokeWidth?: number;
  offsetX: number;
  top: number;
}

function MixedSilhouette({
  shape,
  lower,
  width,
  height,
  stroke,
  fill,
  strokeWidth = 1,
  offsetX,
  top,
}: MixedSilhouetteProps) {
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', left: '50%', marginLeft: -width / 2 + offsetX, top, width, height }}
    >
      <Svg
        accessible={false}
        height={height}
        preserveAspectRatio="xMidYMid meet"
        viewBox="-1 -1 22 41"
        width={width}
      >
        <Path
          d={lower ? mixedLowerPaths[shape] : mixedPaths[shape]}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      </Svg>
    </View>
  );
}

interface MixedToothTargetProps {
  index: number;
  lower: boolean;
  selected: boolean;
  onPress: () => void;
}

export function MixedToothTarget({ index, lower, selected, onPress }: MixedToothTargetProps) {
  const { colors } = useAppTheme();
  const transitional = TRANSITIONAL_POSITIONS.has(index);
  const code = `mixed-${lower ? 'lower' : 'upper'}-${index + 1}`;
  const outline = selected || transitional ? colors.text.link : colors.action.secondaryBorder;
  const kind: MixedShape =
    index === 0 || index === 9 ? 'molar' : index === 3 || index === 6 ? 'canine' : 'incisor';

  return (
    <Pressable
      accessibilityLabel={`الموضع ${index + 1} ${lower ? 'السفلي' : 'العلوي'}`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      className="h-full min-w-0 flex-1 items-center rounded-[9px]"
      hitSlop={{ left: 5, right: 5, top: 3, bottom: 3 }}
      onPress={onPress}
      style={{
        overflow: 'visible',
        backgroundColor: selected ? colors.action.subtle : 'transparent',
      }}
      testID={code}
    >
      <MixedSilhouette
        fill={colors.surface.default}
        height={28}
        offsetX={transitional ? 2 : 0}
        lower={lower}
        shape={transitional ? 'molar' : kind}
        stroke={outline}
        strokeWidth={selected ? 2 : 1}
        top={transitional ? (lower ? 20 : 2) : lower ? 14 : 8}
        width={kind === 'molar' || transitional ? 17 : 14}
      />
      {transitional ? (
        <MixedSilhouette
          fill={colors.tone.warning.fill}
          height={22}
          offsetX={-4}
          lower={lower}
          shape="molar"
          stroke={colors.tone.warning.border}
          top={11}
          width={14}
        />
      ) : null}
      {selected ? (
        <View pointerEvents="none" className="absolute right-0 top-0">
          <AppIcon
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            size={10}
            tone="action"
          />
        </View>
      ) : null}
    </Pressable>
  );
}
