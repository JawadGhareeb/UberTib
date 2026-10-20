import { Accordion, Chip } from 'heroui-native';
import { View } from 'react-native';

import type { getBranchView } from '@/features/discovery/model/provider-branch-view';
import { ServiceIcon } from '@/features/discovery/components/service-icon';
import { AppIcon, AppText } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';

type Branch = NonNullable<ReturnType<typeof getBranchView>>;

const rootCanalEquipment: { label: string; icon: AppIconName }[] = [
  { label: 'تصوير موضعي', icon: { ios: 'photo', android: 'image', web: 'image' } },
  {
    label: 'تجهيزات علاج الجذور',
    icon: { ios: 'cross.case', android: 'medical_services', web: 'medical_services' },
  },
  {
    label: 'التعقيم والمتابعة',
    icon: { ios: 'shield', android: 'verified_user', web: 'verified_user' },
  },
];
const generalEquipment: typeof rootCanalEquipment = [
  {
    label: 'تجهيزات الفحص',
    icon: { ios: 'cross.case', android: 'medical_services', web: 'medical_services' },
  },
  {
    label: 'تجهيزات الخدمة',
    icon: { ios: 'wrench.and.screwdriver', android: 'build', web: 'build' },
  },
  {
    label: 'التعقيم والمتابعة',
    icon: { ios: 'shield', android: 'verified_user', web: 'verified_user' },
  },
];

/** Branch service descriptions are sourced from catalog data, never custom fabricated prices. */
export function ProviderBranchServices({ branch }: { branch: Branch }) {
  return (
    <View className="gap-2">
      <View className="flex-row-reverse items-center justify-between">
        <AppText align="right" variant="heading-4" className="font-ui-bold">
          الخدمات المتوفرة بالفرع
        </AppText>
        <AppText variant="caption" className="text-content-secondary">
          {branch.services.length} خدمات
        </AppText>
      </View>
      {branch.services.length ? (
        <Accordion
          selectionMode="single"
          isCollapsible
          variant="default"
          className="overflow-hidden rounded-[16px] border border-border-subtle bg-surface-default"
        >
          {branch.services.map(({ code, family }) => (
            <Accordion.Item key={code} value={code}>
              <Accordion.Trigger className="min-h-[65px] flex-row-reverse items-center gap-2.5 px-3 py-2.5">
                <View className="h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-action-subtle">
                  <ServiceIcon serviceId={code} size={29} />
                </View>
                <AppText
                  align="right"
                  variant="label"
                  className="min-w-0 flex-1 font-ui-semibold"
                  numberOfLines={2}
                >
                  {family.title}
                </AppText>
                <Accordion.Indicator />
              </Accordion.Trigger>
              <Accordion.Content className="px-4 pb-4">
                <AppText align="right" variant="label" className="text-content-secondary">
                  {family.description}
                </AppText>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <AppText align="right" variant="caption" className="text-content-secondary">
          تفاصيل الخدمات غير متاحة حالياً.
        </AppText>
      )}
    </View>
  );
}

/** Display-only HeroUI chips. These are illustrative fixture descriptions, NOT verified inventory. */
export function ProviderBranchEquipment({ serviceCode }: { serviceCode: string }) {
  const examples = serviceCode === 'root-canal' ? rootCanalEquipment : generalEquipment;

  return (
    <View className="gap-2">
      <AppText align="right" variant="heading-4" className="font-ui-bold">
        تجهيزات الفرع
      </AppText>
      <View className="flex-row-reverse flex-wrap gap-2">
        {examples.map((item) => (
          <Chip
            key={item.label}
            variant="soft"
            color="default"
            size="md"
            className="min-h-[35px] flex-row-reverse items-center gap-1.5"
          >
            <AppIcon name={item.icon} tone="secondary" size={15} />
            <Chip.Label>{item.label}</Chip.Label>
          </Chip>
        ))}
      </View>
      <AppText align="right" variant="caption" className="text-content-secondary">
        التجهيزات المذكورة أمثلة ضمن النموذج، يرجى تأكيد المتوفر منها مع الفرع قبل الحجز.
      </AppText>
    </View>
  );
}
