import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  FadeInDown,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/shared/components/brand/brand-mark';
import { theme } from '@/shared/theme';

const PRIMARY = theme.brand.mark;
const SPLASH_BACKGROUND = theme.color.surface.canvas;
const LOGO_TILE = theme.brand.ink;

/**
 * Branded in-app loading state matching the app's default Light appearance.
 * Existing in-app Dark preference is honored once the main app has hydrated.
 * The loading bar is indeterminate: it never claims a real boot percentage.
 */
export function SplashScreen() {
  const progress = useSharedValue(0.4);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(0.88, {
        duration: 1250,
        easing: Easing.inOut(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      true,
    );

    return () => cancelAnimation(progress);
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.value }],
  }));

  return (
    <View className="flex-1" style={{ backgroundColor: SPLASH_BACKGROUND }}>
      <StatusBar backgroundColor={SPLASH_BACKGROUND} style="dark" />

      {/* A quiet teal tint appears toward the bottom of the light startup surface. */}
      <Svg
        height="100%"
        pointerEvents="none"
        style={StyleSheet.absoluteFillObject}
        width="100%"
      >
        <Defs>
          <LinearGradient id="splash-background" x1="0%" x2="0%" y1="0%" y2="100%">
            <Stop offset="0%" stopColor={PRIMARY} stopOpacity={0} />
            <Stop offset="38%" stopColor={PRIMARY} stopOpacity={0.035} />
            <Stop offset="100%" stopColor={PRIMARY} stopOpacity={0.13} />
          </LinearGradient>
        </Defs>
        <Rect fill="url(#splash-background)" height="100%" width="100%" />
      </Svg>

      <SafeAreaView className="flex-1 px-6 pb-5" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center pb-8">
          <Animated.View
            className="items-center"
            entering={FadeInDown.duration(480).reduceMotion(ReduceMotion.System)}
          >
            <View className="h-[112px] w-[120px] items-center justify-center">
              <Svg
                accessible={false}
                height={112}
                pointerEvents="none"
                style={{ position: 'absolute', top: 0, left: 4 }}
                viewBox="0 0 112 112"
                width={112}
              >
                <Defs>
                  <RadialGradient cx="50%" cy="50%" id="splash-halo" r="50%">
                    <Stop offset="0%" stopColor={PRIMARY} stopOpacity={0.23} />
                    <Stop offset="55%" stopColor={PRIMARY} stopOpacity={0.09} />
                    <Stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Circle cx={56} cy={56} fill="url(#splash-halo)" r={56} />
              </Svg>

              {/* Use the actual bundled logo asset; the old vector U was a placeholder. */}
              <View
                className="h-[98px] w-[98px] items-center justify-center rounded-[22px]"
                style={{
                  backgroundColor: LOGO_TILE,
                  elevation: 7,
                  shadowColor: PRIMARY,
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.2,
                  shadowRadius: 18,
                }}
              >
                <BrandMark size={88} />
              </View>
            </View>

            <Text
              allowFontScaling
              style={{
                color: theme.brand.ink,
                fontFamily: Platform.select({ android: 'sans-serif-medium', ios: 'System' }),
                fontSize: 23,
                fontWeight: '800',
                includeFontPadding: false,
                letterSpacing: -0.7,
                lineHeight: 29,
                marginTop: 3,
                textAlign: 'center',
                writingDirection: 'ltr',
              }}
            >
              UberTib
            </Text>

            <Text
              allowFontScaling
              style={{
                color: PRIMARY,
                fontFamily: theme.font.regular,
                fontSize: 11,
                lineHeight: 20,
                marginTop: 1,
                textAlign: 'center',
                writingDirection: 'rtl',
              }}
            >
              منصة رعاية أسنان موثوقة
            </Text>
          </Animated.View>
        </View>

        <View
          accessible
          accessibilityLabel="جارٍ التحقق من الجلسة"
          className="items-center gap-[7px] pb-1"
        >
          <Text
            style={{
              color: 'rgba(17,17,17,0.55)',
              fontFamily: theme.font.regular,
              fontSize: 10,
              lineHeight: 16,
              textAlign: 'center',
              writingDirection: 'rtl',
            }}
          >
            جارٍ التحقق من الجلسة...
          </Text>
          <View className="h-[3px] w-[112px] overflow-hidden rounded-full bg-black/10">
            <Animated.View
              className="h-full w-full origin-left rounded-full"
              style={[{ backgroundColor: PRIMARY }, progressStyle]}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
