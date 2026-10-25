import { Card as HeroCard } from 'heroui-native';
import { View } from 'react-native';

import { ServiceIcon } from '@/features/discovery/components/service-icon';
import type { ServiceDetailCopy } from '@/features/discovery/presentation/service-detail-copy';
import { useAppDirection } from '@/shared/utils/app-direction';
import { AppIcon, AppText } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { cn } from '@/shared/utils/cn';

function ServiceFactRow({
  icon,
  title,
  description,
}: {
  icon: AppIconName;
  title: string;
  description: string;
}) {
  const { rowClassName } = useAppDirection();

  return (
    <View className={cn('items-start gap-3 py-2', rowClassName)}>
      <View className="h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-action-subtle">
        <AppIcon name={icon} size={20} tone="action" />
      </View>
      <View className="min-w-0 flex-1 items-end gap-1">
        <AppText align="right" variant="label" className="w-full font-ui-semibold">
          {title}
        </AppText>
        <AppText align="right" variant="label" className="w-full text-content-secondary">
          {description}
        </AppText>
      </View>
    </View>
  );
}

/** UI only: the screen owns navigation; the feature's copy module owns text. */
export function ServiceDetailContent({
  serviceId,
  groupTitle,
  copy,
}: {
  serviceId: string;
  groupTitle: string;
  copy: ServiceDetailCopy;
}) {
  const { rowClassName } = useAppDirection();

  return (
    <>
      <HeroCard
        variant="default"
        className="rounded-[16px] border border-border-subtle bg-action-subtle p-3"
      >
        <View className={cn('items-start gap-3', rowClassName)}>
          <View className="h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-surface-default">
            <ServiceIcon serviceId={serviceId} size={40} />
          </View>
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" className="w-full text-content-link" variant="caption">
              {groupTitle}
            </AppText>
            <AppText align="right" className="w-full font-ui-bold" variant="heading-3">
              {copy.title}
            </AppText>
            <AppText align="right" className="w-full text-content-secondary" variant="label">
              {copy.description}
            </AppText>
          </View>
        </View>
      </HeroCard>

      <View className="mt-5 gap-2">
        <AppText align="right" className="font-ui-bold" variant="heading-4">
          ليش ممكن تبحث عنها؟
        </AppText>
        <AppText align="right" className="text-content-secondary" variant="label">
          {copy.whenToConsider}
        </AppText>
      </View>

      <View className="mt-5 gap-2">
        <AppText align="right" className="font-ui-bold" variant="heading-4">
          شو لازم تعرف قبل الموعد؟
        </AppText>
        <View className="gap-1">
          <ServiceFactRow
            icon={{ ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' }}
            title="الفحص والخطة"
            description={copy.planNote}
          />
          <View className="h-px bg-border-subtle" />
          <ServiceFactRow
            icon={{ ios: 'creditcard', android: 'payments', web: 'payments' }}
            title="السعر والتفاصيل"
            description="السعر النهائي والتفاصيل تُراجع مع الطبيب."
          />
          <View className="h-px bg-border-subtle" />
          <ServiceFactRow
            icon={{ ios: 'doc.text', android: 'description', web: 'description' }}
            title="صور أو تقارير سابقة"
            description={copy.preparationNote}
          />
        </View>
      </View>

      <View
        className={cn('mt-4 items-start gap-2 rounded-[12px] bg-tone-info-fill p-3', rowClassName)}
      >
        <AppIcon
          name={{ ios: 'info.circle', android: 'info', web: 'info' }}
          size={19}
          tone="info"
        />
        <AppText align="right" variant="label" className="min-w-0 flex-1 text-tone-info-text">
          المعلومات للتوجيه فقط؛ التشخيص والخطة النهائية مسؤولية الطبيب.
        </AppText>
      </View>
    </>
  );
}
