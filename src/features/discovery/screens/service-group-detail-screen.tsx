import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { DiscoveryHeader, FamilyCard } from '@/features/discovery/components/pen-discovery-ui';
import { findPenGroup } from '@/features/discovery/presentation/pen-discovery-data';
import { AssessmentEntryCard } from '@/shared/components/assessment/assessment-entry-card';
import { AppText, Screen } from '@/shared/components/ui';

export function ServiceGroupDetailScreen() {
  const router = useRouter();
  const { groupCode } = useLocalSearchParams<{ groupCode?: string }>();
  const group = findPenGroup(groupCode);

  if (!group) {
    return (
      <Screen>
        <AppText variant="heading-3">المجموعة غير موجودة</AppText>
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader subtitle="عائلات الخدمة" title={group.title} />

      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-24 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <AppText align="right" className="text-content-secondary" variant="label">
          {group.description}
        </AppText>

        <View className="mt-4">
          <AssessmentEntryCard />
        </View>

        <View className="mt-5 gap-3">
          <View className="flex-row-reverse items-center justify-between gap-2">
            <AppText align="right" className="min-w-0 flex-1 font-ui-bold" variant="heading-4">
              استكشف عائلات الخدمات
            </AppText>
            <AppText align="left" className="text-content-secondary" variant="caption">
              {group.families.length} عائلات
            </AppText>
          </View>

          <View className="flex-row-reverse flex-wrap justify-between gap-y-3">
            {group.families.map((family) => (
              <FamilyCard
                family={family}
                key={family.id}
                layout="grid"
                onPress={() =>
                  router.push({
                    pathname: '/discover/service/[serviceCode]',
                    params: { serviceCode: family.id },
                  })
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
