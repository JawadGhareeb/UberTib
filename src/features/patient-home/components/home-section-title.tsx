import { Pressable, View } from 'react-native';
import { AppText } from '@/shared/components/ui';

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View className="flex-row-reverse items-center justify-between gap-3">
      <AppText align="right" variant="heading-4">
        {title}
      </AppText>
      {action && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={action}
          hitSlop={8}
          onPress={onAction}
        >
          <AppText variant="label" className="text-content-link">
            {action}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
