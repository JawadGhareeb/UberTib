import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/app-text';

interface SnackbarProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function Snackbar({ message, actionLabel, onAction }: SnackbarProps) {
  return (
    <View
      className="min-h-target-comfortable flex-row items-center gap-3 rounded-control bg-surface-inverse px-4 py-3"
      accessibilityRole="alert"
    >
      <AppText variant="body" className="flex-1 text-content-on-inverse">
        {message}
      </AppText>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          className="min-h-target-comfortable justify-center px-2"
          onPress={onAction}
        >
          <AppText variant="body-strong" className="text-content-on-inverse">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
