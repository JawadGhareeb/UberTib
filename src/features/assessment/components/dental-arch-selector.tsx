import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import {
  readableToothId,
  type DentitionMode,
} from '@/features/assessment/state/assessment-session-provider';
import {
  dentalArchPoints,
  PERMANENT_LOWER,
  PERMANENT_UPPER,
  PRIMARY_LOWER,
  PRIMARY_UPPER,
  toothShapeForCode,
} from '@/features/assessment/utils/dental-arch-geometry';
import { AppIcon, AppText } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import type { ToothShape } from '@/shared/components/ui/tooth-svg';

interface DentalArchSelectorProps {
  mode: DentitionMode;
  selectedTeeth: string[];
  location: string;
  onToggleTooth: (tooth: string) => void;
  onClear: () => void;
}

/** Occlusal/crown view: rounded incisors, cusped canines and grooved molars.
 * This diagram is illustrative, not a clinical odontogram.
 */
const crownPaths: Record<ToothShape, { outline: string; detail: string }> = {
  incisor: {
    outline: 'M9 6C13 3 27 3 31 7C34 13 32 26 29 31C23 35 16 35 10 31C6 26 6 12 9 6Z',
    detail: 'M12 11C17 9 24 9 28 12M13 29C19 31 24 31 27 28',
  },
  canine: {
    outline: 'M20 3C25 5 31 8 32 15C33 22 27 30 20 35C13 30 7 22 8 15C9 8 15 5 20 3Z',
    detail: 'M14 14Q20 9 26 14M15 21L20 26L25 21',
  },
  premolar: {
    outline: 'M9 5C14 2 26 2 31 6C35 12 34 26 29 32C23 36 16 36 10 32C5 26 5 12 9 5Z',
    detail: 'M13 10Q20 16 27 10M20 13L20 28M12 25Q20 19 28 26',
  },
  molar: {
    outline: 'M9 5C15 2 26 2 32 6C36 12 35 28 30 33C24 36 15 36 9 33C5 29 4 12 9 5Z',
    detail: 'M13 10Q19 17 26 10M12 27Q20 20 28 27M19 13Q23 20 19 28',
  },
};

function DentalCrown({
  kind,
  selected,
  rotate,
  size,
}: {
  kind: ToothShape;
  selected: boolean;
  rotate: number;
  size: number;
}) {
  const { colors } = useAppTheme();
  const paths = crownPaths[kind];
  return (
    <View style={{ transform: [{ rotate: `${rotate}deg` }] }}>
      <Svg width={size} height={size * 1.06} viewBox="0 0 40 40">
        <Path
          d={paths.outline}
          fill={selected ? colors.action.subtle : colors.surface.default}
          stroke={selected ? colors.action.primary : colors.border.strong}
          strokeWidth={selected ? 2.4 : 1.55}
          strokeLinejoin="round"
        />
        <Path
          d={paths.detail}
          stroke={selected ? colors.action.primary : colors.border.default}
          strokeWidth={1.3}
          strokeLinecap="round"
          fill="none"
          opacity={selected ? 0.8 : 0.65}
        />
      </Svg>
    </View>
  );
}

function SelectableTooth({
  code,
  index,
  count,
  crownSize,
  lower,
  mixed,
  selected,
  x,
  y,
  onPress,
}: {
  code: string;
  index: number;
  count: number;
  crownSize: number;
  lower: boolean;
  mixed: boolean;
  selected: boolean;
  x: number;
  y: number;
  onPress: () => void;
}) {
  const kind = mixed
    ? index < 2 || index > count - 3
      ? 'molar'
      : index === 3 || index === count - 4
        ? 'canine'
        : 'incisor'
    : toothShapeForCode(code);
  const size = crownSize * (kind === 'molar' ? 1 : kind === 'incisor' ? 0.88 : 0.94);
  const rotate = (index / (count - 1) - 0.5) * (lower ? -58 : 58);
  return (
    <Pressable
      testID={`tooth-${code}`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={
        mixed ? `موضع ${index + 1} في الفك ${lower ? 'السفلي' : 'العلوي'}` : readableToothId(code)
      }
      accessibilityHint="اضغط للاختيار أو إلغاء الاختيار"
      onPress={onPress}
      className="absolute items-center justify-center"
      style={{
        left: x - (count > 10 ? 14 : 18),
        top: y - (count > 10 ? 20 : 24),
        width: count > 10 ? 28 : 36,
        height: count > 10 ? 40 : 48,
      }}
    >
      <DentalCrown kind={kind} selected={selected} rotate={rotate} size={size} />
      {selected ? (
        <AppText
          align="center"
          direction="ltr"
          variant="caption"
          className="font-ui-bold text-content-link"
          style={{ fontSize: 9, lineHeight: 12 }}
        >
          {mixed ? 'موضع' : ''}
        </AppText>
      ) : null}
    </Pressable>
  );
}

export function DentalArchSelector({
  mode,
  selectedTeeth,
  location,
  onToggleTooth,
  onClear,
}: DentalArchSelectorProps) {
  const { colors } = useAppTheme();
  const [width, setWidth] = useState(300);
  const primary = mode === 'primary';
  const mixed = mode === 'mixed' || mode === 'uncertain';
  const upper = mixed
    ? Array.from({ length: 10 }, (_, i) => `mixed-upper-${i + 1}`)
    : primary
      ? [...PRIMARY_UPPER]
      : [...PERMANENT_UPPER];
  const lower = mixed
    ? Array.from({ length: 10 }, (_, i) => `mixed-lower-${i + 1}`)
    : primary
      ? [...PRIMARY_LOWER]
      : [...PERMANENT_LOWER];
  const upperPoints = dentalArchPoints(upper, width, false);
  const lowerPoints = dentalArchPoints(lower, width, true);
  const crownSizeFor = (points: typeof upperPoints) => {
    const distances = points
      .slice(1)
      .map((point, index) => Math.hypot(point.x - points[index]!.x, point.y - points[index]!.y));
    // Adapt crown size to the narrowest gap, with larger crowns for the 10-tooth primary arches.
    return Math.min(points.length > 10 ? 29 : 35, Math.max(16, Math.min(...distances) * 1.02));
  };
  const upperCrownSize = crownSizeFor(upperPoints);
  const lowerCrownSize = crownSizeFor(lowerPoints);
  const radiusX = Math.max(50, (width - 62) / 2);
  const radiusY = Math.min(88, radiusX * 0.71);
  const curve = (lowerArch: boolean) => {
    const baseline = lowerArch ? 252 : 115;
    const dir = lowerArch ? 1 : -1;
    return `M ${width / 2 - radiusX} ${baseline} C ${width / 2 - radiusX} ${baseline + dir * radiusY * 0.8}, ${width / 2 - radiusX * 0.6} ${baseline + dir * radiusY}, ${width / 2} ${baseline + dir * radiusY} C ${width / 2 + radiusX * 0.6} ${baseline + dir * radiusY}, ${width / 2 + radiusX} ${baseline + dir * radiusY * 0.8}, ${width / 2 + radiusX} ${baseline}`;
  };

  return (
    <View className="gap-3 rounded-[16px] border border-border-subtle bg-surface-default p-3">
      <AppText align="right" variant="caption" className="text-content-secondary">
        اضغط على سن أو أكثر من الرسم، أو اختر المنطقة إذا ما بتعرف السن.
      </AppText>
      <View
        className="w-full overflow-hidden rounded-[18px] bg-surface-subtle"
        style={{ height: 397 }}
        onLayout={(event) => {
          const next = Math.floor(event.nativeEvent.layout.width);
          if (next >= 230 && next !== width) setWidth(next);
        }}
      >
        <Svg
          accessible={false}
          pointerEvents="none"
          width={width}
          height={397}
          className="absolute left-0 top-0"
        >
          <Path
            d={curve(false)}
            fill="none"
            stroke={colors.surface.default}
            strokeWidth={38}
            strokeLinecap="round"
            opacity={0.75}
          />
          <Path
            d={curve(true)}
            fill="none"
            stroke={colors.surface.default}
            strokeWidth={38}
            strokeLinecap="round"
            opacity={0.75}
          />
        </Svg>
        {upperPoints.map((point, index) => (
          <SelectableTooth
            key={point.code}
            code={point.code}
            index={index}
            count={upper.length}
            crownSize={upperCrownSize}
            x={point.x}
            y={point.y}
            mixed={mixed}
            lower={false}
            selected={selectedTeeth.includes(point.code)}
            onPress={() => onToggleTooth(point.code)}
          />
        ))}
        {lowerPoints.map((point, index) => (
          <SelectableTooth
            key={point.code}
            code={point.code}
            index={index}
            count={lower.length}
            crownSize={lowerCrownSize}
            x={point.x}
            y={point.y}
            mixed={mixed}
            lower
            selected={selectedTeeth.includes(point.code)}
            onPress={() => onToggleTooth(point.code)}
          />
        ))}
        <View
          pointerEvents="none"
          className="absolute left-0 right-0 top-[159px] items-center gap-8"
        >
          <AppText variant="caption" className="font-ui-semibold text-content-secondary">
            الفك العلوي
          </AppText>
          <AppText variant="caption" className="font-ui-semibold text-content-secondary">
            الفك السفلي
          </AppText>
        </View>
        <View pointerEvents="none" className="absolute bottom-3 left-3">
          <AppText variant="caption" className="text-content-secondary">
            يسارك
          </AppText>
        </View>
        <View pointerEvents="none" className="absolute bottom-3 right-3">
          <AppText variant="caption" className="text-content-secondary">
            يمينك
          </AppText>
        </View>
      </View>

      {location ? (
        <View className="gap-2 rounded-[11px] bg-action-subtle p-3">
          <View className="flex-row-reverse items-center gap-2">
            <AppIcon
              name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
              size={18}
              tone="action"
            />
            <AppText variant="label" className="min-w-0 flex-1 font-ui-semibold text-content-link">
              {selectedTeeth.length > 1 ? `تم تحديد ${selectedTeeth.length} أسنان` : 'مكان المشكلة'}
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="مسح التحديد"
              onPress={onClear}
              className="min-h-[36px] justify-center px-2"
            >
              <AppText variant="caption" className="font-ui-semibold text-content-link">
                مسح
              </AppText>
            </Pressable>
          </View>
          {selectedTeeth.length > 0 ? (
            selectedTeeth.map((tooth) => (
              <AppText
                key={tooth}
                align="right"
                variant="label"
                className="font-ui-medium text-content-primary"
              >
                {readableToothId(tooth)}
              </AppText>
            ))
          ) : (
            <AppText align="right" variant="label">
              {location}
            </AppText>
          )}
        </View>
      ) : null}
    </View>
  );
}
