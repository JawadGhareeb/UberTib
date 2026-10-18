import { useEffect, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { theme } from '@/shared/theme';
import { cn } from '@/shared/utils/cn';

interface AnimatedProgressBarProps {
  value: number;
  className?: string;
  fillClassName?: string;
  duration?: number;
}

export function AnimatedProgressBar({
  value,
  className,
  fillClassName,
  duration = theme.motion.duration.overlay,
}: AnimatedProgressBarProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = useSharedValue(0);
  const clampedValue = Math.max(0, Math.min(100, value));

  useEffect(() => {
    if (trackWidth === 0) {
      return;
    }

    progress.value = withTiming(clampedValue / 100, {
      duration,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
  }, [clampedValue, duration, progress, trackWidth]);

  const fillStyle = useAnimatedStyle(() => ({
    width: trackWidth * progress.value,
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      accessibilityLabel={`نسبة التقدم ${clampedValue}%`}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clampedValue }}
      className={cn('h-1.5 overflow-hidden rounded-full bg-surface-subtle', className)}
      onLayout={handleLayout}
    >
      <Animated.View
        className={cn('h-full self-end rounded-full bg-action-primary', fillClassName)}
        style={fillStyle}
      />
    </View>
  );
}
