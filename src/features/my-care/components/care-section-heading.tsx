import { View } from 'react-native';
import { AppText } from '@/shared/components/ui';

export function CareSectionHeading({
  title,
  subtitle,
  count,
}: {
  title: string;
  subtitle: string;
  count: number;
}) {
  return (
    <View className="flex-row-reverse items-center justify-between gap-3">
      <View className="min-w-0 flex-1 items-end gap-0.5">
        <AppText variant="heading-4" align="right">{title}</AppText>
        <AppText variant="caption" align="right" className="text-content-secondary">{subtitle}</AppText>
      </View>
      <View className="min-h-8 min-w-8 items-center justify-center rounded-full bg-action-subtle px-2">
        <AppText variant="caption" className="font-ui-semibold text-content-link">{count}</AppText>
      </View>
    </View>
  );
}
