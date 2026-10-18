import { ActivityIndicator, View } from 'react-native';

import { AppText } from '@/shared/components/ui/app-text';
import { Button } from '@/shared/components/ui/button';

interface StateViewProps {
  title: string;
  description?: string;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export function StateView({
  title,
  description,
  loading = false,
  actionLabel,
  onAction,
}: StateViewProps) {
  return (
    <View className="flex-1 items-stretch justify-center gap-3 px-2">
      {loading ? <ActivityIndicator accessibilityLabel="جاري التحميل" size="large" /> : null}
      <AppText variant="heading-3">{title}</AppText>
      {description ? <AppText className="text-content-secondary">{description}</AppText> : null}
      {actionLabel && onAction ? (
        <Button className="mt-2" label={actionLabel} onPress={onAction} variant="secondary" />
      ) : null}
    </View>
  );
}
