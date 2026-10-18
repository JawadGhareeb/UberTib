import { useEffect, useState, type ReactNode } from 'react';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Pressable, View } from 'react-native';

import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, type AppIconName } from '@/shared/components/ui/app-icon';
import { AppText } from '@/shared/components/ui/app-text';
import { cn } from '@/shared/utils/cn';
import { theme } from '@/shared/theme';

interface FieldSurfaceProps {
  label: string;
  icon?: AppIconName;
  error?: string;
  helperText?: string;
  focused?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  selectionValue?: string;
  accessory?: ReactNode;
  children: ReactNode;
}

/**
 * One field frame for text, phone, date, location and selection controls.
 * A floating Arabic label, feedback and animated accent are semantic and shared.
 */
export function FieldSurface({
  label,
  icon,
  error,
  helperText,
  focused = false,
  disabled = false,
  onPress,
  selectionValue,
  accessory,
  children,
}: FieldSurfaceProps) {
  const { rowClassName } = useAppDirection();
  const invalid = Boolean(error);
  const [pressed, setPressed] = useState(false);
  const focusProgress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    focusProgress.value = withTiming(focused || pressed ? 1 : 0, {
      duration: theme.motion.duration.fieldFocus,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
  }, [focusProgress, focused, pressed]);

  const labelStyle = useAnimatedStyle(() => ({
    opacity: 0.86 + focusProgress.value * 0.14,
    transform: [{ translateY: -focusProgress.value * 2 }],
  }));
  const focusLineStyle = useAnimatedStyle(() => ({
    opacity: focusProgress.value,
    transform: [{ scaleX: focusProgress.value }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.96 + focusProgress.value * 0.04 }],
  }));

  const frame = cn(
    rowClassName,
    'min-h-form-field w-full items-center gap-3 rounded-form-field border px-3',
    'bg-surface-default',
    invalid
      ? 'border-tone-danger-border'
      : focused || pressed
        ? 'border-action-primary bg-state-selected'
        : 'border-action-primary',
    disabled && 'border-state-readonly-border bg-state-readonly',
  );

  const contents = (
    <>
      {icon ? (
        <Animated.View
          style={iconStyle}
          className={cn(
            'h-9 w-9 shrink-0 items-center justify-center rounded-[10px]',
            disabled ? 'bg-surface-subtle' : invalid ? 'bg-tone-danger-fill' : 'bg-action-subtle',
          )}
        >
          <AppIcon
            name={icon}
            size={18}
            tone={disabled ? 'secondary' : invalid ? 'danger' : 'action'}
          />
        </Animated.View>
      ) : null}
      <View className="min-w-0 flex-1 justify-center py-1.5">{children}</View>
      {accessory ? <View className="shrink-0 items-center justify-center">{accessory}</View> : null}
      {!invalid && !disabled ? (
        <Animated.View
          pointerEvents="none"
          className="absolute bottom-0.5 left-5 right-5 h-[2px] rounded-full bg-action-primary"
          style={focusLineStyle}
        />
      ) : null}
    </>
  );

  return (
    <View className="relative w-full gap-1.5 pt-2.5">
      <Animated.View
        pointerEvents="none"
        style={labelStyle}
        className={cn(
          'absolute right-4 top-0 z-10 rounded-[6px] bg-surface-default px-2',
          disabled && 'bg-state-readonly',
        )}
      >
        <AppText
          className={cn(
            'font-ui-medium',
            invalid
              ? 'text-tone-danger-text'
              : focused || pressed
                ? 'text-content-primary'
                : 'text-content-secondary',
          )}
          variant="caption"
        >
          {label}
        </AppText>
      </Animated.View>

      {onPress ? (
        <Pressable
          accessibilityLabel={selectionValue ? `${label}، ${selectionValue}` : label}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          className={frame}
          disabled={disabled}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={onPress}
        >
          {contents}
        </Pressable>
      ) : (
        <View className={frame}>{contents}</View>
      )}

      {error ? (
        <View className={cn(rowClassName, 'items-start gap-1.5 px-0.5')}>
          <View className="mt-0.5">
            <AppIcon
              name={{
                ios: 'exclamationmark.circle',
                android: 'error_outline',
                web: 'error_outline',
              }}
              size={14}
              tone="danger"
            />
          </View>
          <AppText
            accessibilityLiveRegion="polite"
            className="min-w-0 flex-1 text-tone-danger-text"
            variant="caption"
          >
            {error}
          </AppText>
        </View>
      ) : helperText ? (
        <AppText className="px-0.5 text-content-secondary" variant="caption">
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}
