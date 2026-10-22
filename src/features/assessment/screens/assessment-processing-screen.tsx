import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppIcon, Screen } from '@/shared/components/ui';

const PREPARATION_DURATION_MS = 4000;

const steps = [
  { ios: 'tray.full.fill', android: 'inventory_2', web: 'inventory_2' },
  { ios: 'slider.horizontal.3', android: 'tune', web: 'tune' },
  { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
] as const;

export function AssessmentProcessingScreen() {
  const router = useRouter();
  const { outcome } = useLocalSearchParams<{
    outcome?: 'result' | 'needs-more-info' | 'manual-review';
  }>();
  const pulse = useSharedValue(0.94);
  const progress = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.05, {
        duration: 900,
        easing: Easing.inOut(Easing.quad),
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      true,
    );
    progress.value = 0;
    progress.value = withTiming(100, {
      duration: PREPARATION_DURATION_MS,
      easing: Easing.linear,
      reduceMotion: ReduceMotion.Never,
    });

    const timer = setTimeout(() => {
      if (outcome === 'needs-more-info') {
        router.replace('/assessment/needs-more-info');
      } else if (outcome === 'manual-review') {
        router.replace('/assessment/manual-review');
      } else {
        router.replace('/assessment/result');
      }
    }, PREPARATION_DURATION_MS);

    return () => {
      clearTimeout(timer);
      cancelAnimation(progress);
      cancelAnimation(pulse);
    };
  }, [outcome, progress, pulse, router]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%` as `${number}%`,
  }));

  return (
    <Screen contentClassName="px-0 py-0">
      <View className="flex-1 items-center justify-center bg-surface-canvas px-7">
        <View className="w-full max-w-[320px] items-center gap-7">
          <Animated.View
            className="h-28 w-28 items-center justify-center rounded-full bg-action-subtle"
            style={pulseStyle}
          >
            <View className="h-20 w-20 items-center justify-center rounded-full bg-surface-default">
              <AppIcon
                name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
                size={34}
                tone="action"
              />
            </View>
          </Animated.View>

          <View className="flex-row items-center justify-center gap-3">
            {steps.map((icon, index) => (
              <View
                key={icon.ios}
                className={`h-12 w-12 items-center justify-center rounded-[15px] ${
                  index === 1 ? 'bg-action-primary' : 'bg-surface-default'
                }`}
              >
                <AppIcon name={icon} size={20} tone={index === 1 ? 'onAction' : 'action'} />
              </View>
            ))}
          </View>

          <View
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel="جاري تجهيز التوجيه الأولي"
            accessibilityValue={{ min: 0, max: 100 }}
            className="h-2.5 w-full overflow-hidden rounded-full bg-surface-subtle"
          >
            <Animated.View
              className="h-full rounded-full bg-action-primary"
              style={progressStyle}
            />
          </View>
        </View>
      </View>
    </Screen>
  );
}
