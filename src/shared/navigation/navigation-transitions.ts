import { Easing, Platform } from 'react-native';

/**
 * Direction-neutral page transitions work in the Arabic UI on both iOS and Android,
 * without contradicting the device's physical (LTR) native navigation direction.
 * Keep transitions here so root, booking and assessment stacks feel consistent.
 */
export const PAGE_TRANSITION_DURATION_MS = 200;
export const TAB_TRANSITION_DURATION_MS = 140;

export function pageTransitionOptions(reduceMotion: boolean) {
  return {
    animation: reduceMotion
      ? ('none' as const)
      : Platform.OS === 'android'
        ? ('fade' as const)
        : ('fade_from_bottom' as const),
    animationDuration: reduceMotion ? 0 : PAGE_TRANSITION_DURATION_MS,
    animationTypeForReplace: 'push' as const,
  };
}

export function tabTransitionOptions(reduceMotion: boolean) {
  return {
    animation: reduceMotion ? ('none' as const) : ('fade' as const),
    transitionSpec: {
      animation: 'timing' as const,
      config: {
        duration: reduceMotion ? 0 : TAB_TRANSITION_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      },
    },
  };
}
