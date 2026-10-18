import Svg, { Path } from 'react-native-svg';

import { useAppTheme } from '@/shared/theme/theme-provider';
import { mirrorToothPath } from '@/shared/utils/mirror-tooth-path';

export type ToothShape = 'incisor' | 'canine' | 'premolar' | 'molar';

/** Exact tooth outline paths from the supplied Pen HTML/SVG export. */
const shapes: Record<ToothShape, string> = {
  incisor: 'M8 1q2-1 4 0l1 10q4 2 4 9l-1 8q-6 3-12 0l-1-8q0-7 4-9z',
  canine: 'M9 0q2 0 3 2l1 11q4 4 1 12l-4 6-4-6q-3-8 1-12z',
  premolar: 'M6 1q2-1 4 4 2-5 4-4l0 11q5 4 3 13-7 5-14 0-2-9 3-13z',
  molar: 'M4 1q2-1 4 5 2-6 4 0 2-6 4-5l-1 12q5 3 3 13-8 5-16 0-2-10 3-13z',
};

// Original primary-dentition (20 teeth) paths from the Pen upper and lower arch exports.
// There are no premolars in primary dentition.
const primaryShapes: Partial<Record<ToothShape, string>> = {
  incisor: 'M4 3c-1 4-1 8 1 12 1 6 2 13 5 15 3-2 4-9 5-15 2-4 2-8 1-12-4 1-8 1-12 0z',
  canine: 'M4 3c-1 4-1 8 2 12l4 5 4-5c3-4 3-8 2-12-4 2-8 2-12 0z',
  molar: 'M3 3c-1 4-1 9 2 13 0 6 2 13 5 15 3-2 5-9 5-15 3-4 3-9 2-13-4 2-10 2-14 0z',
};

// Precompute an exact 180-degree mirror, so lower arches never rely on SVG
// rotation-origin parsing (which clips tooth contours on some renderers).
const lowerShapes: Record<ToothShape, string> = {
  incisor: mirrorToothPath(shapes.incisor),
  canine: mirrorToothPath(shapes.canine),
  premolar: mirrorToothPath(shapes.premolar),
  molar: mirrorToothPath(shapes.molar),
};
const lowerPrimaryShapes: Partial<Record<ToothShape, string>> = {
  incisor: mirrorToothPath(primaryShapes.incisor!),
  canine: mirrorToothPath(primaryShapes.canine!),
  molar: mirrorToothPath(primaryShapes.molar!),
};

interface ToothSvgProps {
  kind: ToothShape;
  selected?: boolean;
  primary?: boolean;
  lower?: boolean;
  transitional?: boolean;
  size?: number;
  width?: number;
  height?: number;
}

/** Vector-only, selectable tooth location marker; not a diagnosis. */
export function ToothSvg({
  kind,
  selected = false,
  primary = false,
  lower = false,
  transitional = false,
  size = 36,
  width,
  height,
}: ToothSvgProps) {
  const { colors } = useAppTheme();
  const stroke = selected
    ? colors.action.primary
    : transitional
      ? colors.tone.warning.border
      : colors.border.strong;
  const fill = selected ? colors.action.subtle : colors.surface.default;
  const toothPath = primary
    ? (lower ? lowerPrimaryShapes[kind] : primaryShapes[kind]) ??
      (lower ? lowerShapes[kind] : shapes[kind])
    : lower
      ? lowerShapes[kind]
      : shapes[kind];

  return (
    <Svg
      accessible={false}
      width={width ?? (size * 20) / 32}
      height={height ?? size}
      viewBox="-1 -1 22 41"
      preserveAspectRatio="xMidYMid meet"
    >
      {transitional ? (
        <Path
          d="M3 2 L17 2 L19 36 L1 36 Z"
          fill="none"
          stroke={colors.action.secondaryBorder}
          strokeDasharray="2 2"
          strokeWidth={1}
        />
      ) : null}
      <Path
        d={toothPath}
        fill={fill}
        stroke={stroke}
        strokeWidth={selected ? 2 : 1}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </Svg>
  );
}
