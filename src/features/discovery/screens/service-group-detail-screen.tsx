import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { DiscoveryHeader, FamilyCard } from '@/features/discovery/components/pen-discovery-ui';
import { findPenGroup } from '@/features/discovery/presentation/pen-discovery-data';
import { AppText, Button, Screen } from '@/shared/components/ui';

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
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1">
          <AppText direction="ltr" className="text-type-label text-content-link" variant="caption">
            {group.code} · {group.countLabel}
          </AppText>
          <AppText className="font-ui-bold text-type-heading-2 ">{group.title}</AppText>
          <AppText className="text-type-label  text-content-secondary" variant="caption">
            {group.description}
          </AppText>
        </View>

        <View className="mt-3 gap-2">
          {group.families.map((family) => (
            <FamilyCard
              family={family}
              key={family.id}
              onPress={() =>
                router.push({
                  pathname: '/discover/service/[serviceCode]',
                  params: { serviceCode: family.id },
                })
              }
            />
          ))}
        </View>


        <Button
          className="mt-3"
          endIcon={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
          label="مو متأكد؟ خلينا نحدد حالتك"
          onPress={() => router.push('/assessment/start')}
          size="sm"
          variant="outline"
        />
      </ScrollView>
    </Screen>
  );
}
