import type { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView as NativeKeyboardAvoidingView, Platform, View } from 'react-native';
import { KeyboardAvoidingView as ControlledKeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResolveClassNames } from 'uniwind';

import { cn } from '@/shared/utils/cn';

interface ScreenProps extends PropsWithChildren {
  header?: ReactNode;
  context?: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Disable when a child already manages keyboard avoidance. */
  keyboardAvoiding?: boolean;
}

export function Screen({
  children,
  header,
  context,
  className,
  contentClassName,
  keyboardAvoiding = true,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const KeyboardContainer =
    Platform.OS === 'android' ? ControlledKeyboardAvoidingView : NativeKeyboardAvoidingView;
  // SafeAreaView is from a third-party library: resolve the semantic Tailwind
  // background into a native style as well, so it updates reliably in Dark.
  const canvasStyle = useResolveClassNames('bg-surface-canvas');
  const resolvedContentClassName = contentClassName
    ? cn('flex-1', contentClassName)
    : 'flex-1 px-4 pb-4';

  return (
    <SafeAreaView
      className={cn('flex-1 bg-surface-canvas', className)}
      style={[{ flex: 1 }, canvasStyle]}
      edges={header ? ['left', 'right', 'bottom'] : undefined}
    >
      {header ? (
        <View className="bg-surface-default" style={{ paddingTop: insets.top }}>
          {header}
        </View>
      ) : null}
      <KeyboardContainer
        style={{ flex: 1 }}
        behavior="padding"
        enabled={keyboardAvoiding && Platform.OS === 'ios'}
      >
        <View className={resolvedContentClassName} style={{ flex: 1 }}>
          {context ? (
            <View className="mb-4 mt-3">{context}</View>
          ) : !contentClassName ? (
            <View className="h-3" />
          ) : null}
          {children}
        </View>
      </KeyboardContainer>
    </SafeAreaView>
  );
}
