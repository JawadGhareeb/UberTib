import { Pressable, View } from 'react-native';
import { AppIcon, AppText } from '@/shared/components/ui';
import { recentSearches } from '../presentation/search-options';

export function DiscoverRecentSearches({ onSelect }: { onSelect: (term: string) => void }) {
  return (
    <>
      <AppText align="right" className="mt-4 font-ui-bold" variant="label">
        عمليات بحث حديثة
      </AppText>
      <View className="mt-2 gap-[7px]">
        {recentSearches.map((item) => (
          <Pressable
            accessibilityLabel={`إعادة البحث عن ${item}`}
            accessibilityRole="button"
            className="min-h-[43px] flex-row-reverse items-center gap-3 rounded-[11px] border border-border-subtle bg-surface-default px-3"
            key={item}
            onPress={() => onSelect(item)}
          >
            <AppText align="right" className="min-w-0 flex-1" variant="label">
              {item}
            </AppText>
            <AppIcon
              name={{ ios: 'clock.arrow.circlepath', android: 'history', web: 'history' }}
              size={17}
              tone="secondary"
            />
          </Pressable>
        ))}
      </View>
    </>
  );
}
