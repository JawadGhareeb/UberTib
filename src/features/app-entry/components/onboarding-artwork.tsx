import { Image, type ImageSourcePropType, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { useAppTheme } from '@/shared/theme/use-app-theme';
import { theme } from '@/shared/theme';

export type OnboardingStep = 0 | 1 | 2 | 3;

const illustrations: Record<1 | 2 | 3, ImageSourcePropType> = {
  1: require('../../../shared/assets/doctor.png'),
  2: require('../../../shared/assets/time.png'),
  3: require('../../../shared/assets/welcome.png'),
};

const labels = [
  'رسم سن يوضح بداية رحلة العناية بالأسنان',
  'رسم طبيب أسنان يستمع إلى مريضة',
  'رسم توضيحي للمواعيد ومتابعة مراحل العلاج',
  'رسم ترحيبي ببداية تجربة UberTib',
] as const;

/**
 * The first illustration reuses the original tooth path and orbit composition
 * from feat/heroui-native-foundation's intro-artwork.tsx.
 * Remaining illustrations are the user-supplied transparent PNG assets.
 */
function ToothIllustration({ height }: { height: number }) {
  const { colors } = useAppTheme();
  const teal = theme.brand.mark;

  return (
    <Svg width="100%" height={height} viewBox="0 0 320 280" fill="none" accessible={false}>
      <Circle cx="160" cy="139" r="116" fill={colors.action.subtle} />
      <Circle
        cx="160"
        cy="139"
        r="99"
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
        stroke={colors.text.primary}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <Path d="M138 99c12 10 31 12 46 0" stroke={teal} strokeWidth="5" strokeLinecap="round" />
      <Circle cx="83" cy="205" r="5" fill={teal} />
      <Circle cx="241" cy="88" r="7" fill={colors.text.primary} />
      <Line
        x1="238"
        y1="90"
        x2="228"
        y2="100"
        stroke={colors.text.primary}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function OnboardingArtwork({ step, height }: { step: OnboardingStep; height: number }) {
  const { colors } = useAppTheme();

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={labels[step]}
      style={{
        height,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {step === 0 ? (
        <ToothIllustration height={height} />
      ) : (
        <>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              width: height * 0.89,
              height: height * 0.89,
              borderRadius: height,
              backgroundColor: colors.action.subtle,
              opacity: 0.78,
            }}
          />
          <Image
            source={illustrations[step]}
            accessible={false}
            resizeMode="contain"
            style={{
              width: '100%',
              height: height * 0.94,
            }}
          />
        </>
      )}
    </View>
  );
}
