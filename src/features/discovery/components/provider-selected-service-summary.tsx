import { View } from 'react-native';

import { ServiceIcon } from '@/features/discovery/components/service-icon';
import { AppText } from '@/shared/components/ui';

/** Informational only: the chosen service is context, not an extra navigation step. */
export function ProviderSelectedServiceSummary({
  serviceCode,
  title,
}: {
  serviceCode: string;
  title: string;
}) {
  return (
    <View
      className="flex-row-reverse items-center gap-3 rounded-[16px] border border-border-subtle bg-surface-subtle px-3 py-3"
      accessible
      accessibilityLabel={'الخدمة المختارة: ' + title}
    >
      <View className="h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-action-subtle">
        <ServiceIcon serviceId={serviceCode} size={34} />
      </View>
      <View className="min-w-0 flex-1 items-end gap-1">
        <AppText align="right" variant="caption" className="w-full text-content-secondary">
          عم تبحث عن أطباء لخدمة
        </AppText>
        <AppText
          align="right"
          variant="heading-4"
          className="w-full font-ui-bold"
          numberOfLines={2}
        >
          {title}
        </AppText>
      </View>
    </View>
  );
}
