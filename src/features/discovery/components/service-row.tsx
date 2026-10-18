import { Pressable, View } from 'react-native';

import type { CatalogService } from '@/features/discovery/api/catalog';
import { ServiceIcon } from '@/features/discovery/components/service-icon';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

interface ServiceRowProps {
  service: CatalogService;
  onPress: () => void;
}

export function ServiceRow({ service, onPress }: ServiceRowProps) {
  const { rowClassName } = useAppDirection();

  return (
    <Pressable
      accessibilityHint="يفتح تفاصيل الخدمة"
      accessibilityRole="button"
      className="border-b border-border-subtle bg-surface-default px-3.5 py-3 active:bg-action-subtle"
      onPress={onPress}
    >
      <View className={cn('items-center gap-3', rowClassName)}>
        <View className="h-9 w-9 shrink-0 items-center justify-center rounded-full bg-action-primary">
          <ServiceIcon serviceId={service.code} size={25} color="#FFFFFF" />
        </View>

        <View className="min-w-0 flex-1">
          <View className={cn('items-center justify-between gap-2', rowClassName)}>
            <AppText className="min-w-0 flex-1" numberOfLines={1} variant="body-strong">
              {service.name.ar}
            </AppText>
            <AppText className="text-content-link" numberOfLines={1} variant="label">
              {service.price_label}
            </AppText>
          </View>

          <View className={cn('mt-1 items-center gap-2', rowClassName)}>
            <AppText className="text-content-secondary" variant="caption">
              {service.provider_count} مقدم خدمة
            </AppText>
            <View className="h-1 w-1 rounded-full bg-border-strong" />
            <AppText
              className="min-w-0 flex-1 text-content-secondary"
              numberOfLines={1}
              variant="caption"
            >
              {service.next_available_label}
            </AppText>
          </View>
        </View>

        <AppIcon
          name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
          size={17}
          tone="action"
        />
      </View>
    </Pressable>
  );
}
