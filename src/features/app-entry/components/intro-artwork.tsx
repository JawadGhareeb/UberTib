import { View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { theme } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme/use-app-theme';

export function IntroArtwork({ step }: { step: 0 | 1 }) {
  const { colors } = useAppTheme();
  const teal = theme.brand.mark;
  const ink = colors.text.primary;

  return (
    <View
      accessible
      accessibilityLabel={
        step === 0 ? 'رسم توضيحي لسن ورحلة العناية به' : 'رسم توضيحي لطبيب أسنان وموعد حجز مؤكد'
      }
      accessibilityRole="image"
      className="w-full items-center justify-center"
    >
      <Svg width="100%" height={280} viewBox="0 0 320 280" fill="none">
        {step === 0 ? (
          <>
            <Circle cx="160" cy="139" r="116" fill={colors.action.subtle} />
            <Circle
              cx="160"
              cy="139"
              r="100"
              stroke={colors.border.default}
              strokeWidth="1.5"
              strokeDasharray="5 9"
            />
            <Circle
              cx="73"
              cy="66"
              r="24"
              fill={colors.surface.default}
              stroke={colors.border.subtle}
              strokeWidth="2"
            />
            <Path
              d="M65 66l6 6 11-13"
              stroke={teal}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="249"
              cy="207"
              r="24"
              fill={colors.surface.default}
              stroke={colors.border.subtle}
              strokeWidth="2"
            />
            <Path d="M239 207h20M249 197v20" stroke={teal} strokeWidth="3" strokeLinecap="round" />
            <Path
              d="M159 71C138 56 114 61 102 78c-20 28-6 62 5 97l10 31c5 18 16 18 22 1l11-37c4-12 15-12 19 0l11 37c6 17 17 17 22-1l10-31c12-36 25-70 5-97-12-17-36-22-58-7z"
              fill={colors.surface.default}
              stroke={ink}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <Path
              d="M138 99c12 10 31 12 46 0"
              stroke={teal}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <Circle cx="83" cy="205" r="5" fill={teal} />
            <Circle cx="241" cy="88" r="7" fill={ink} />
            <Line
              x1="238"
              y1="90"
              x2="228"
              y2="100"
              stroke={ink}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <Circle cx="160" cy="139" r="116" fill={colors.action.subtle} />
            <Rect
              x="69"
              y="30"
              width="182"
              height="218"
              rx="23"
              fill={colors.surface.default}
              stroke={colors.border.default}
              strokeWidth="2"
            />
            <Rect x="97" y="55" width="126" height="116" rx="19" fill={colors.surface.subtle} />
            <Circle cx="160" cy="94" r="24" fill={teal} />
            <Path d="M117 151c6-28 22-38 43-38s37 10 43 38" fill={ink} />
            <Rect x="100" y="189" width="76" height="9" rx="4.5" fill={colors.border.default} />
            <Rect x="100" y="208" width="117" height="7" rx="3.5" fill={colors.border.subtle} />
            <Circle
              cx="235"
              cy="212"
              r="32"
              fill={teal}
              stroke={colors.surface.default}
              strokeWidth="7"
            />
            <Path
              d="M221 212l10 10 19-21"
              stroke={colors.text.onAction}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="77" cy="65" r="14" fill={ink} />
            <Circle cx="250" cy="66" r="8" fill={teal} />
          </>
        )}
      </Svg>
    </View>
  );
}
