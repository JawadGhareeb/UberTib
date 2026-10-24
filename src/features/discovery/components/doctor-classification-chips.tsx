import { Chip } from 'heroui-native';
import { View } from 'react-native';

import {
  getDoctorCategoryBadges,
  type DoctorBadgeCategory,
} from '@/features/discovery/model/doctor-classification';
import type { MockProvider } from '@/features/discovery/mocks/providers.mock';

const categoryColors: Record<DoctorBadgeCategory, 'accent' | 'default' | 'success'> = {
  scientific: 'accent',
  pricing: 'default',
  protection: 'success',
};

/** Reusable, doctor-scoped HeroUI Chips for search cards and profile. */
export function DoctorClassificationChips({
  provider,
  compact = false,
}: {
  provider: MockProvider;
  compact?: boolean;
}) {
  return (
    <View className="flex-row-reverse flex-wrap items-center gap-1.5">
      {getDoctorCategoryBadges(provider).map((badge) => (
        <Chip
          key={badge.key}
          size="sm"
          variant="soft"
          color={categoryColors[badge.key]}
          className={
            compact ? 'min-h-[25px] rounded-full px-2' : 'min-h-[29px] rounded-full px-2.5'
          }
          accessible
          accessibilityRole="text"
          accessibilityLabel={badge.label}
        >
          <Chip.Label className="font-ui-semibold text-type-caption">{badge.label}</Chip.Label>
        </Chip>
      ))}
    </View>
  );
}
