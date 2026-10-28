import { useRouter } from 'expo-router';
import { Button as HeroButton, Card as HeroCard } from 'heroui-native';
import { Pressable, View } from 'react-native';
import { ServiceIcon } from '@/features/discovery/components/service-icon';
import { penServiceGroups } from '@/features/discovery/presentation/pen-discovery-data';
import { AppText } from '@/shared/components/ui';
import { SectionTitle } from './home-section-title';

const groupIcons = {
  G01: 'implant',
  G02: 'crowns',
  G03: 'root-canal',
  G04: 'dental-checkup',
} as const;

export function HomeServicesSection() {
  const router = useRouter();
  return (
    <View className="gap-3">
      <SectionTitle
        title="استكشف خدمات الأسنان"
        action="عرض الكل"
        onAction={() => router.push('/(tabs)/discover')}
      />
      <View className="flex-row-reverse flex-wrap justify-between gap-y-2.5">
        {penServiceGroups.map((group) => (
          <Pressable
            key={group.code}
            accessibilityRole="button"
            accessibilityLabel={'استكشف ' + group.title}
            className="w-[49%]"
            onPress={() =>
              router.push({
                pathname: '/discover/group/[groupCode]',
                params: { groupCode: group.code },
              })
            }
          >
            <HeroCard
              variant="default"
              className="min-h-[110px] items-center justify-center gap-2 rounded-[16px] border border-border-subtle bg-surface-default px-3 py-3"
            >
              <ServiceIcon serviceId={groupIcons[group.code]} size={34} />
              <AppText
                align="center"
                numberOfLines={2}
                variant="label"
                className="font-ui-semibold"
              >
                {group.title}
              </AppText>
            </HeroCard>
          </Pressable>
        ))}
      </View>
      <HeroButton
        variant="outline"
        className="min-h-[48px] w-full rounded-[12px] border-action-primary"
        onPress={() => router.push('/(tabs)/discover')}
      >
        <HeroButton.Label className="shrink-0 text-center font-ui-semibold text-content-link">
          استكشف جميع الخدمات
        </HeroButton.Label>
      </HeroButton>
    </View>
  );
}
