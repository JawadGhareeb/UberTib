import { Card as HeroCard } from 'heroui-native';
import { Pressable, View } from 'react-native';

import { ServiceIcon } from '@/features/discovery/components/service-icon';
import type { PenServiceFamily } from '@/features/discovery/presentation/pen-discovery-data';
import { AppIcon, AppText } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/use-app-theme';

interface FamilyCardProps {
  family: PenServiceFamily;
  onPress: () => void;
  layout?: 'row' | 'grid';
}

/** Tile within a service group, descriptive row in search results. */
export function FamilyCard({ family, onPress, layout = 'row' }: FamilyCardProps) {
  const { colors } = useAppTheme();

  if (layout === 'grid') {
    return (
      <Pressable
        accessibilityLabel={'عرض تفاصيل ' + family.title}
        accessibilityHint="يفتح تفاصيل الخدمة"
        accessibilityRole="button"
        className="w-[48.5%] active:opacity-90"
        onPress={onPress}
      >
        <HeroCard
          variant="default"
          className="min-h-[128px] items-center justify-center gap-2 rounded-[16px] border border-border-subtle bg-surface-default px-3 py-3"
        >
          <ServiceIcon serviceId={family.id} size={36} />
          <AppText
            align="center"
            className="w-full font-ui-semibold"
            numberOfLines={2}
            variant="label"
          >
            {family.title}
          </AppText>
        </HeroCard>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityHint="يفتح تفاصيل عائلة الخدمة"
      accessibilityRole="button"
      className="min-h-[102px] flex-row items-center gap-3 rounded-[16px] border border-border-subtle bg-surface-default p-3 active:bg-action-subtle"
      onPress={onPress}
    >
      <AppIcon
        name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
        size={19}
        tone="secondary"
      />
      <View className="min-w-0 flex-1 items-end">
        <AppText
          align="right"
          className="font-ui-medium"
          style={{ color: colors.action.primary, fontSize: 10, lineHeight: 16 }}
          variant="caption"
        >
          عائلة خدمة · {family.groupCode}
        </AppText>
        <AppText
          align="right"
          className="mt-1 w-full font-ui-bold"
          numberOfLines={1}
          variant="label"
        >
          {family.title}
        </AppText>
        <AppText
          align="right"
          className="mt-1 w-full text-content-secondary"
          numberOfLines={2}
          variant="caption"
        >
          {family.description}
        </AppText>
      </View>

      <View className="h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[15px] bg-action-subtle">
        <ServiceIcon serviceId={family.id} size={30} />
      </View>
    </Pressable>
  );
}
