import { View } from 'react-native';

import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, type AppIconName, type AppIconTone } from '@/shared/components/ui/app-icon';
import { AppText } from '@/shared/components/ui/app-text';
import { cn } from '@/shared/utils/cn';

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'restricted';
export type StatusEmphasis = 'subtle' | 'default' | 'strong';

interface StatusIndicatorProps {
  label: string;
  tone?: StatusTone;
  emphasis?: StatusEmphasis;
  className?: string;
}

const toneClasses: Record<StatusTone, { container: string; text: string }> = {
  neutral: {
    container: 'bg-tone-neutral-fill border-tone-neutral-border',
    text: 'text-tone-neutral-text',
  },
  info: {
    container: 'bg-tone-info-fill border-tone-info-border',
    text: 'text-tone-info-text',
  },
  success: {
    container: 'bg-tone-success-fill border-tone-success-border',
    text: 'text-tone-success-text',
  },
  warning: {
    container: 'bg-tone-warning-fill border-tone-warning-border',
    text: 'text-tone-warning-text',
  },
  danger: {
    container: 'bg-tone-danger-fill border-tone-danger-border',
    text: 'text-tone-danger-text',
  },
  restricted: {
    container: 'bg-tone-restricted-fill border-tone-restricted-border',
    text: 'text-tone-restricted-text',
  },
};

const toneIcons: Record<StatusTone, { name: AppIconName; tone: AppIconTone }> = {
  neutral: { name: 'circle.fill', tone: 'neutral' },
  info: { name: 'info.circle.fill', tone: 'info' },
  success: { name: 'checkmark.circle.fill', tone: 'success' },
  warning: { name: 'exclamationmark.triangle.fill', tone: 'warning' },
  danger: { name: 'xmark.octagon.fill', tone: 'danger' },
  restricted: { name: 'lock.fill', tone: 'restricted' },
};

const emphasisClasses: Record<StatusEmphasis, string> = {
  subtle: 'border-0',
  default: 'border',
  strong: 'border-2',
};

export function StatusIndicator({
  label,
  tone = 'neutral',
  emphasis = 'default',
  className,
}: StatusIndicatorProps) {
  const { rowClassName } = useAppDirection();
  const classes = toneClasses[tone];
  const icon = toneIcons[tone];

  return (
    <View
      accessibilityLabel={label}
      accessible
      className={cn(
        rowClassName,
        'self-start items-center gap-1 rounded-full px-2 py-0.5',
        classes.container,
        emphasisClasses[emphasis],
        className,
      )}
    >
      <AppIcon name={icon.name} size={11} tone={icon.tone} />
      <AppText className={classes.text} numberOfLines={1} variant="badge">
        {label}
      </AppText>
    </View>
  );
}
