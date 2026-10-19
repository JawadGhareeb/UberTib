import { Pressable, View } from 'react-native';
import { AppIcon, AppText } from '@/shared/components/ui';
import { quickTypes } from '../presentation/search-options';

export function DiscoverQuickSearchTypes({
  onSelect,
}: {
  onSelect: (kind: (typeof quickTypes)[number]['kind']) => void;
}) {
  return (
    <View className="mt-3 flex-row-reverse gap-[7px]">
      {quickTypes.map((item) => (
        <Pressable
          accessibilityLabel={item.label}
          accessibilityRole="button"
          className="min-h-[57px] min-w-0 flex-1 items-center justify-center gap-1 rounded-[12px] border border-border-subtle bg-surface-default px-1"
          key={item.kind}
          onPress={() => onSelect(item.kind)}
        >
          <AppIcon name={item.icon} size={18} tone="action" />
          <AppText align="center" className="font-ui-medium" numberOfLines={1} variant="caption">
            {item.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}
