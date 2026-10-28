import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button as HeroButton } from 'heroui-native';
import { ScrollView, View } from 'react-native';

import { ServiceDetailContent } from '@/features/discovery/components/service-detail-content';
import { DiscoveryHeader } from '@/features/discovery/components/pen-discovery-ui';
import { findPenFamily, findPenGroup } from '@/features/discovery/presentation/pen-discovery-data';
import { getServiceDetailCopy } from '@/features/discovery/presentation/service-detail-copy';
import { AssessmentEntryCard } from '@/shared/components/assessment/assessment-entry-card';
import { Screen, StateView } from '@/shared/components/ui';

/** One service detail journey for every dental service family, including root canal. */
export function ServiceDetailScreen() {
  const router = useRouter();
  const { serviceCode = 'root-canal' } = useLocalSearchParams<{ serviceCode?: string }>();
  const family = findPenFamily(serviceCode);
  const group = family ? findPenGroup(family.groupCode) : undefined;

  if (!family) {
    return (
      <Screen>
        <StateView
          title="الخدمة غير موجودة"
          actionLabel="العودة للخدمات"
          onAction={() => router.replace('/discover')}
        />
      </Screen>
    );
  }

  const copy = getServiceDetailCopy(family);

  return (
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader title="تفاصيل الخدمة" />
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-24 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <ServiceDetailContent
          serviceId={family.id}
          groupTitle={group?.title ?? 'الخدمات'}
          copy={copy}
        />
        <View className="mt-6 gap-3">
          <HeroButton
            variant="primary"
            className="min-h-[50px] w-full rounded-[12px] bg-action-primary"
            onPress={() =>
              router.push({
                pathname: '/discover/providers/results',
                params: { serviceCode: family.id },
              })
            }
          >
            <HeroButton.Label
              className="w-full font-ui-semibold text-content-on-action"
              style={{ textAlign: 'center', writingDirection: 'rtl' }}
            >
              ابحث عن طبيب مؤهّل
            </HeroButton.Label>
          </HeroButton>
          <AssessmentEntryCard />
        </View>
      </ScrollView>
    </Screen>
  );
}
