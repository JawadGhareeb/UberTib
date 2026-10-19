import { Chip } from 'heroui-native';
import { View } from 'react-native';

import { AppIcon } from '@/shared/components/ui';

export type AppliedFilterItem = {
  key: string;
  label: string;
  onRemove: () => void;
};

/** Shared Discover/My Care selected filters: removable HeroUI chips in one RTL group. */
export function AppliedFilterChips({
  items,
  onClearAll,
}: {
  items: readonly AppliedFilterItem[];
  onClearAll?: () => void;
}) {
  if (!items.length) return null;

  return (
    <View
      className="flex-row-reverse flex-wrap items-center gap-2"
      accessibilityLabel="الفلاتر المختارة"
    >
      {items.map((item) => (
        <Chip
          key={item.key}
          variant="soft"
          color="accent"
          size="md"
          accessibilityRole="button"
          accessibilityLabel={'إزالة فلتر ' + item.label}
          onPress={item.onRemove}
          className="min-h-[34px] flex-row-reverse items-center gap-1.5"
        >
          <Chip.Label>{item.label}</Chip.Label>
          <AppIcon
            name={{ ios: 'xmark', android: 'close', web: 'close' }}
            size={13}
            tone="action"
          />
        </Chip>
      ))}
      {onClearAll ? (
        <Chip
          variant="soft"
          color="default"
          size="md"
          accessibilityRole="button"
          accessibilityLabel="مسح جميع الفلاتر"
          onPress={onClearAll}
          className="min-h-[34px] flex-row-reverse items-center gap-1.5"
        >
          <Chip.Label>مسح الكل</Chip.Label>
          <AppIcon
            name={{ ios: 'xmark', android: 'close', web: 'close' }}
            size={13}
            tone="secondary"
          />
        </Chip>
      ) : null}
    </View>
  );
}
