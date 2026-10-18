import type { PropsWithChildren, ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/shared/theme';
import { cn } from '@/shared/utils/cn';

interface ScreenProps extends PropsWithChildren {
  header?: ReactNode;
  context?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function Screen({ children, header, context, className, contentClassName }: ScreenProps) {
  const resolvedContentClassName = contentClassName
    ? cn('flex-1', contentClassName)
    : 'flex-1 px-4 pb-4';

  return (
    <SafeAreaView className={cn('flex-1 bg-surface-canvas', className)}>
      {header ?? null}
      <Animated.View
        className={resolvedContentClassName}
        entering={FadeIn.duration(theme.motion.duration.stateChange).reduceMotion(
          ReduceMotion.System,
        )}
      >
        {context ? (
          <View className="mb-4 mt-3">{context}</View>
        ) : !contentClassName ? (
          <View className="h-3" />
        ) : null}
        {children}
      </Animated.View>
    </SafeAreaView>
  );
}
