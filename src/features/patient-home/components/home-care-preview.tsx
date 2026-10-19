import { Pressable, View } from 'react-native';
import { Card as HeroCard } from 'heroui-native';
import type { MockCareCase } from '@/features/my-care/mocks/care.mock';
import { CenteredActionIcon } from '@/shared/components/ui/centered-action-icon';
import { AppIcon, AppText } from '@/shared/components/ui';

export function CarePreview({ item, onPress }: { item: MockCareCase; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'عرض الحالة ' + item.title}
      onPress={onPress}
    >
      <HeroCard
        variant="default"
        className="rounded-[16px] border border-border-subtle bg-surface-default px-3.5 py-3"
      >
        <View className="flex-row-reverse items-center gap-3">
          <CenteredActionIcon name="care" frameSize={48} iconSize={22} />
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" variant="body-strong" numberOfLines={1}>
              {item.title}
            </AppText>
            <AppText align="right" variant="caption" numberOfLines={2}>
              {item.nextAction}
            </AppText>
          </View>
          <AppIcon
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            size={18}
            tone="secondary"
          />
        </View>
      </HeroCard>
    </Pressable>
  );
}
