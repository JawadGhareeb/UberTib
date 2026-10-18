import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/app-text';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

export type FeedbackStateTone =
  'offline' | 'error' | 'empty' | 'requiresAction' | 'rejected' | 'pending' | 'success';

interface FeedbackStateProps {
  title: string;
  description?: string;
  tone?: FeedbackStateTone;
  actionLabel?: string;
  onAction?: () => void;
}

const toneClasses: Record<FeedbackStateTone, string> = {
  offline: 'border-tone-neutral-border bg-tone-neutral-fill',
  error: 'border-tone-danger-border bg-tone-danger-fill',
  empty: 'border-border-subtle bg-surface-default',
  requiresAction: 'border-tone-warning-border bg-tone-warning-fill',
  rejected: 'border-tone-danger-border bg-tone-danger-fill',
  pending: 'border-tone-info-border bg-tone-info-fill',
  success: 'border-tone-success-border bg-tone-success-fill',
};

export function FeedbackState({
  title,
  description,
  tone = 'empty',
  actionLabel,
  onAction,
}: FeedbackStateProps) {
  return (
    <Card className={toneClasses[tone]}>
      <View className="gap-2">
        <AppText variant="heading-4">{title}</AppText>
        {description ? (
          <AppText variant="body" className="text-content-secondary">
            {description}
          </AppText>
        ) : null}
      </View>

      {actionLabel && onAction ? (
        <View className="mt-4">
          <Button label={actionLabel} variant="secondary" onPress={onAction} />
        </View>
      ) : null}
    </Card>
  );
}
