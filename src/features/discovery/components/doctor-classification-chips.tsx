import { Chip } from 'heroui-native';
import { View } from 'react-native';

import { getDoctorClassification } from '@/features/discovery/model/doctor-classification';
import type { MockProvider } from '@/features/discovery/mocks/providers.mock';
import { AppIcon } from '@/shared/components/ui';

export function DoctorClassificationChips({
  provider,
  serviceCode,
}: {
  provider: MockProvider;
  serviceCode: string;
}) {
  const facts = getDoctorClassification(provider, serviceCode);
  return (
    <View className="flex-row-reverse flex-wrap items-center gap-2">
      <Chip
        size="sm"
        variant={
          facts.scientific === 'A'
            ? 'secondary'
            : facts.scientific === 'B'
              ? 'soft'
              : facts.scientific === 'C'
                ? 'secondary'
                : 'soft'
        }
        color={facts.scientific === 'A' || facts.scientific === 'B' ? 'accent' : 'default'}
        className="min-h-[29px] gap-1.5 rounded-full px-2.5"
        accessibilityLabel={`التصنيف العلمي التجريبي: ${facts.scientificLabel}`}
      >
        <AppIcon
          name={{ ios: 'seal', android: 'workspace_premium', web: 'workspace_premium' }}
          size={14}
          tone={facts.scientific === 'pending' ? 'secondary' : 'action'}
        />
        <Chip.Label className="font-ui-semibold text-type-caption text-content-primary">
          {facts.scientificLabel}
        </Chip.Label>
      </Chip>
      <Chip
        size="sm"
        color={facts.protection === 'A' || facts.protection === 'B' ? 'accent' : 'default'}
        variant={facts.protection === 'A' ? 'soft' : 'secondary'}
        className="min-h-[29px] gap-1.5 rounded-full px-2.5"
        accessibilityLabel={`حماية المريض التجريبية: ${facts.protectionLabel}`}
      >
        <AppIcon
          name={{ ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' }}
          size={14}
          tone={facts.protection ? 'action' : 'secondary'}
        />
        <Chip.Label className="font-ui-medium text-type-caption text-content-primary">
          {facts.protectionLabel}
        </Chip.Label>
      </Chip>
    </View>
  );
}
