import { useEffect } from 'react';
import { Image, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  ReduceMotion,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/shared/components/ui';

export function DiscoverSearchIllustration({ empty = false }: { empty?: boolean }) {
  const { width } = useWindowDimensions();
  const floating = useSharedValue(0);

  useEffect(() => {
    floating.value = withRepeat(
      withTiming(-5, {
        duration: 2300,
        easing: Easing.inOut(Easing.ease),
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      true,
    );
    return () => cancelAnimation(floating);
  }, [floating]);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floating.value }],
  }));
  const imageWidth = Math.min(width - 80, 280);

  return (
    <Animated.View
      entering={FadeInDown.duration(380).reduceMotion(ReduceMotion.System)}
      className="items-center gap-1 pb-5 pt-2"
      accessible
      accessibilityLabel={empty ? 'ما لقينا نتائج' : 'ابدأ البحث عن طبيب أو خدمة'}
    >
      <Animated.View style={floatingStyle}>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={require('../../../shared/assets/ubertip-empty-transparent.png')}
          style={{ width: imageWidth, height: imageWidth * (1155 / 1709) }}
        />
      </Animated.View>
      <AppText align="center" variant="heading-4">
        {empty ? 'ما لقينا نتائج' : 'دور على اللي بناسبك'}
      </AppText>
      <AppText align="center" variant="label" className="text-content-secondary">
        {empty ? 'جرّب كلمة تانية أو غيّر الفلاتر.' : 'ابحث عن طبيب أو خدمة بكل سهولة.'}
      </AppText>
    </Animated.View>
  );
}
