import { View } from 'react-native';

import { AppIcon, AppText } from '@/shared/components/ui';

import type { ProfileLocationMapProps } from './profile-location-map.types';

interface ProfileLocationMapFallbackProps extends ProfileLocationMapProps {
  description: string;
}

export function ProfileLocationMapFallback({
  description,
}: ProfileLocationMapFallbackProps) {
  return (
    <View className="flex-1 items-center justify-center bg-surface-subtle p-6">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-action-subtle">
        <AppIcon
          name={{ ios: 'mappin', android: 'location_on', web: 'location_on' }}
          size={28}
          tone="action"
        />
      </View>
      <AppText className="mt-3" variant="body-strong">
        معاينة الموقع
      </AppText>
      <AppText align="center" className="mt-1 text-content-secondary" variant="caption">
        {description}
      </AppText>
    </View>
  );
}
