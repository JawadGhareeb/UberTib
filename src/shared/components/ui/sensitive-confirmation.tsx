import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/app-text';
import { StatusIndicator, type StatusTone } from '@/shared/components/ui/status-indicator';

interface SensitiveConfirmationProps {
  title: string;
  description: string;
  tone?: Extract<StatusTone, 'warning' | 'danger'>;
}

export function SensitiveConfirmation({
  title,
  description,
  tone = 'warning',
}: SensitiveConfirmationProps) {
  return (
    <View
      accessibilityRole="summary"
      className={
        tone === 'danger'
          ? 'rounded-surface border border-tone-danger-border bg-tone-danger-fill p-4'
          : 'rounded-surface border border-tone-warning-border bg-tone-warning-fill p-4'
      }
    >
      <StatusIndicator label={title} tone={tone} />
      <AppText className="mt-3 text-content-secondary">{description}</AppText>
    </View>
  );
}
