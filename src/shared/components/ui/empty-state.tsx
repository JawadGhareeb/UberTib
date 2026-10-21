import { View } from 'react-native';

import { AppIcon } from '@/shared/components/ui/app-icon';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { AppText } from '@/shared/components/ui/app-text';
import { Button } from '@/shared/components/ui/button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: AppIconName;
}

const defaultEmptyIcon: AppIconName = {
  ios: 'tray',
  android: 'inbox',
  web: 'inbox',
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = defaultEmptyIcon,
}: EmptyStateProps) {
  return (
    <View className="items-center gap-3 py-10">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-action-subtle">
        <AppIcon name={icon} size={28} tone="action" />
      </View>

      <AppText className="text-center" variant="heading-3">
        {title}
      </AppText>

      {description ? (
        <AppText className="max-w-[360px] text-center text-content-secondary">
          {description}
        </AppText>
      ) : null}

      {actionLabel && onAction ? (
        <Button
          className="mt-2 w-full"
          label={actionLabel}
          onPress={onAction}
          variant="secondary"
        />
      ) : null}
    </View>
  );
}
