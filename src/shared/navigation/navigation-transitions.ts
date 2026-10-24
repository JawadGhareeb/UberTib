import { Animated, Easing } from 'react-native';

/**
 * The Expo Router JS Stack allows explicit slide duration on Android and iOS.
 * Both tabs and stacks animate native-driver supported transform properties.
 * Arabic reading direction stays separate from physical route navigation.
 */
export const PAGE_PUSH_DURATION_MS = 220;
export const PAGE_POP_DURATION_MS = 200;
export const TAB_TRANSITION_DURATION_MS = 190;

const slideEasing = Easing.out(Easing.cubic);

export function pageTransitionOptions(reduceMotion: boolean) {
  return {
    animation: reduceMotion ? ('none' as const) : ('slide_from_right' as const),
    animationTypeForReplace: 'push' as const,
    gestureDirection: 'horizontal' as const,
    cardOverlayEnabled: false,
    cardShadowEnabled: false,
    transitionSpec: {
      open: {
        animation: 'timing' as const,
        config: { duration: reduceMotion ? 0 : PAGE_PUSH_DURATION_MS, easing: slideEasing },
      },
      close: {
        animation: 'timing' as const,
        config: { duration: reduceMotion ? 0 : PAGE_POP_DURATION_MS, easing: slideEasing },
      },
    },
  };
}

export function tabTransitionOptions(reduceMotion: boolean, screenWidth: number) {
  return {
    animation: reduceMotion ? ('none' as const) : ('shift' as const),
    ...(reduceMotion
      ? {}
      : {
          // Full-width native-driver translation (no per-frame React re-render).
          sceneStyleInterpolator: ({ current }: { current: { progress: Animated.Value } }) => ({
            sceneStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [-screenWidth, 0, screenWidth],
                    extrapolate: 'clamp' as const,
                  }),
                },
              ],
            },
          }),
        }),
    transitionSpec: {
      animation: 'timing' as const,
      config: { duration: reduceMotion ? 0 : TAB_TRANSITION_DURATION_MS, easing: slideEasing },
    },
  };
}
