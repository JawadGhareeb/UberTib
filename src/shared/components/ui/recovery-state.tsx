import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/app-text';
import { Button } from '@/shared/components/ui/button';

interface RecoveryStateProps {
  title: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
  retrying?: boolean;
}

export function RecoveryState({
  title,
  description,
  retryLabel,
  onRetry,
  retrying = false,
}: RecoveryStateProps) {
  return (
    <View
      accessibilityLiveRegion="polite"
      className="gap-3 rounded-surface border border-tone-danger-border bg-tone-danger-fill p-5"
    >
      <AppText className="text-tone-danger-text" variant="heading-4">
        {title}
      </AppText>
      <AppText className="text-content-secondary">{description}</AppText>
      <Button
        className="mt-1"
        label={retryLabel}
        loading={retrying}
        loadingLabel={retryLabel}
        onPress={onRetry}
        variant="secondary"
      />
    </View>
  );
}
