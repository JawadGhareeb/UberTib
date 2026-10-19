import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { useAppTheme } from '@/shared/theme/use-app-theme';

export type CenteredActionIconName = 'bell' | 'calendar' | 'care' | 'clock';

/**
 * Exact-square SVG frame avoids Android font-baseline offsets from expo-symbols.
 * Both the tile and the vector glyph use fixed width/height + flex centering,
 * never positional offsets or padding.
 */
export function CenteredActionIcon({
  name,
  frameSize = 48,
  iconSize = 22,
  color,
  warning = false,
}: {
  name: CenteredActionIconName;
  frameSize?: number;
  iconSize?: number;
  color?: string;
  warning?: boolean;
}) {
  const { colors } = useAppTheme();

  return (
    <View
      pointerEvents="none"
      style={{
        width: frameSize,
        height: frameSize,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Math.round(frameSize * 0.29),
        backgroundColor: warning ? colors.tone.warning.fill : colors.action.subtle,
      }}
    >
      <Svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color ?? (warning ? colors.tone.warning.text : colors.action.primary)}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {name === 'bell' ? (
          <>
            <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <Path d="M10 21h4" />
          </>
        ) : name === 'calendar' ? (
          <>
            <Rect x="3" y="5" width="18" height="16" rx="2" />
            <Path d="M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
          </>
        ) : name === 'care' ? (
          <>
            <Rect x="3" y="7" width="18" height="14" rx="2" />
            <Path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M12 11v6M9 14h6" />
          </>
        ) : (
          <>
            <Circle cx="12" cy="12" r="9" />
            <Path d="M12 7v5l3 2" />
          </>
        )}
      </Svg>
    </View>
  );
}
