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
      <AppText align="right" variant="heading-4" className="min-w-0 flex-1">
        {title}
      </AppText>
      {action && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={action}
          hitSlop={8}
          className="min-w-[84px] shrink-0 items-center justify-center py-1"
          onPress={onAction}
        >
          <AppText align="center" variant="label" className="w-full text-content-link">
            {action}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
