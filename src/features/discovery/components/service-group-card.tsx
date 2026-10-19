import { Pressable, View } from 'react-native';

import type { PenServiceGroup } from '@/features/discovery/presentation/pen-discovery-data';
import { ServiceIcon, type DentalServiceIconId } from '@/features/discovery/components/service-icon';
import { AppText, Button } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/use-app-theme';

const previewFamilies: Record<PenServiceGroup['code'], readonly string[]> = {
  G01: ['extraction', 'periodontics', 'implant'],
  G02: ['crowns', 'bridges', 'veneers'],
  G03: ['root-canal', 'root-complications', 'root-retreatment'],
  G04: ['dental-checkup', 'dental-cleaning', 'dental-filling'],
};

const groupIcons: Record<PenServiceGroup['code'], DentalServiceIconId> = {
  G01: 'implant',
  G02: 'crowns',
  G03: 'root-canal',
  G04: 'dental-checkup',
};

export function ServiceGroupCard({ group, onPress }: { group: PenServiceGroup; onPress: () => void }) {
  const { colors } = useAppTheme();
  const tags = group.families.filter((family) => previewFamilies[group.code].includes(family.id));

  return (
    <View className="overflow-hidden rounded-[16px] border border-border-subtle bg-surface-default px-3 py-3">
      <Pressable
        accessibilityLabel={`${group.title}، عرض الخدمات`}
        accessibilityRole="button"
        onPress={onPress}
      >
      <View className="flex-row-reverse items-center gap-[8px]">
        <View className="h-[49px] w-[49px] shrink-0 items-center justify-center rounded-[12px] bg-action-subtle">
          <ServiceIcon serviceId={groupIcons[group.code]} size={37} />
        </View>

        <View className="min-w-0 flex-1 items-end">
          <AppText
            align="right"
            direction="ltr"
            className="font-ui-bold"
            style={{ color: colors.action.primary, fontSize: 10, lineHeight: 15 }}
            variant="caption"
          >
            {group.code}
          </AppText>
          <AppText
            align="right"
            className="mt-0.5 w-full font-ui-bold"
            numberOfLines={2}
            style={{ fontSize: 16, lineHeight: 23 }}
            variant="label"
          >
            {group.title}
          </AppText>
        </View>

        <View className="shrink-0 rounded-full bg-action-subtle px-2 py-1">
          <AppText
            align="center"
            className="font-ui-medium"
            style={{ color: colors.action.primary, fontSize: 10, lineHeight: 15 }}
            variant="caption"
          >
            {group.families.length} عائلات
          </AppText>
        </View>
      </View>

      <AppText
        align="right"
        className="mt-1.5 w-full text-content-secondary"
        numberOfLines={3}
        style={{ fontSize: 12, lineHeight: 19 }}
        variant="caption"
      >
        {group.description}
      </AppText>

      <View className="mt-1.5 flex-row-reverse flex-wrap gap-1">
        {tags.map((tag) => (
          <View
            className="rounded-full bg-surface-subtle px-2 py-[3px]"
            key={tag.id}
          >
            <AppText
              align="center"
              className="text-content-secondary"
              numberOfLines={1}
              style={{ fontSize: 9, lineHeight: 15 }}
              variant="caption"
            >
              {tag.title}
            </AppText>
          </View>
        ))}
      </View>

      </Pressable>
      <Button
        className="mt-2"
        endIcon={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
        label="عرض الخدمات"
        onPress={onPress}
        size="compact"
        variant="soft"
      />
    </View>
  );
}

