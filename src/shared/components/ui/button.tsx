import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useAppDirection } from '@/shared/utils/app-direction';
import { AppIcon, type AppIconName } from '@/shared/components/ui/app-icon';
import { AppText } from '@/shared/components/ui/app-text';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { cn } from '@/shared/utils/cn';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'soft' | 'destructive';
export type ButtonSize = 'compact' | 'sm' | 'md';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
  accessibilityLabel?: string;
  endIcon?: AppIconName;
}

const containerClasses: Record<ButtonVariant, string> = {
  primary: 'bg-action-primary active:bg-action-primary-active',
  secondary:
    'border border-action-primary bg-action-secondary-surface active:bg-action-subtle',
  outline: 'border border-action-primary/55 bg-surface-default active:bg-action-subtle',
  soft: 'bg-action-subtle active:bg-state-selected',
  destructive: 'bg-action-destructive active:bg-action-destructive-active',
};

const sizeClasses: Record<ButtonSize, string> = {
  compact: 'min-h-[36px] rounded-[10px] px-3 py-1',
  sm: 'min-h-[44px] rounded-[11px] px-4 py-2',
  md: 'min-h-[52px] rounded-[12px] px-5 py-3',
};

// The default AppText role is dark. All action labels need an explicit
// semantic foreground so filled buttons never inherit black text.
const labelClasses: Record<ButtonVariant, string> = {
  primary: 'text-content-on-action',
  secondary: 'text-content-link',
  outline: 'text-content-link',
  soft: 'text-content-link',
  destructive: 'text-content-on-destructive',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  loadingLabel,
  className,
  accessibilityLabel,
  endIcon,
}: ButtonProps) {
  const { colors } = useAppTheme();
  const { rowClassName } = useAppDirection();
  const isDisabled = disabled || loading;
  const [pressed, setPressed] = useState(false);
  const pressScale = useSharedValue(1);
  useEffect(() => {
    pressScale.value = withTiming(pressed ? 0.985 : 1, {
      duration: pressed ? 120 : 160,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
  }, [pressScale, pressed]);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: pressScale.value }] }));
  const visibleLabel = loading ? (loadingLabel ?? label) : label;
  const labelColor = isDisabled
    ? colors.text.disabled
    : variant === 'primary'
      ? colors.text.onAction
      : variant === 'destructive'
        ? colors.text.onDestructive
        : colors.action.primary;

  return (
    <AnimatedPressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: isDisabled }}
      className={cn(
        rowClassName,
        'items-center justify-center gap-[8px] overflow-hidden',
        sizeClasses[size],
        containerClasses[variant],
        isDisabled && 'border-border-subtle bg-surface-subtle',
        className,
      )}
      disabled={isDisabled}
      hitSlop={size === 'compact' ? 4 : 0}
      style={pressStyle}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
    >
      <View className={cn('items-center gap-[10px]', rowClassName)}>
        {loading ? <ActivityIndicator color={labelColor} size="small" /> : null}
        <AppText
          align="center"
          className={cn('font-ui-bold', isDisabled ? 'text-content-disabled' : labelClasses[variant])}
          style={{
            color: labelColor,
            ...(size === 'compact'
              ? { fontSize: 11, lineHeight: 17 }
              : size === 'sm'
                ? { fontSize: 13, lineHeight: 20 }
                : {}),
          }}
          variant={size === 'md' ? 'body-strong' : 'label'}
        >
          {visibleLabel}
        </AppText>
        {!loading && endIcon ? (
          <AppIcon
            color={labelColor}
            name={endIcon}
            size={size === 'compact' ? 16 : 20}
            tone={isDisabled ? 'secondary' : variant === 'primary' ? 'onAction' : 'action'}
          />
        ) : null}
      </View>
    </AnimatedPressable>
  );
}
