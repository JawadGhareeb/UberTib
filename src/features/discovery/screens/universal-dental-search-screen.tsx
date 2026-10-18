import { useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { DiscoveryBottomBar, DiscoveryHeader } from '@/features/discovery/components/pen-discovery-ui';
import { useDiscoverySession } from '@/features/discovery/state/discovery-session-provider';
import { AppIcon, AppText, Screen, SearchField } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';

const quickTypes: { label: string; icon: AppIconName; kind: 'pain' | 'service' | 'doctor' | 'area' }[] = [
  { label: 'ألم أو شكوى', icon: { ios: 'bubble.left', android: 'chat_bubble_outline', web: 'chat_bubble_outline' }, kind: 'pain' },
  { label: 'خدمة سنية', icon: { ios: 'stethoscope', android: 'medical_services', web: 'medical_services' }, kind: 'service' },
  { label: 'اسم طبيب', icon: { ios: 'person', android: 'person_outline', web: 'person_outline' }, kind: 'doctor' },
  { label: 'منطقة', icon: { ios: 'mappin', android: 'place', web: 'place' }, kind: 'area' },
];

const recent = ['علاج جذور في الجميلية', 'د. ليان يوسف', 'تنظيف أسنان بسعر ثابت'] as const;

export function UniversalDentalSearchScreen() {
  const router = useRouter();
  const { catalogQuery, setCatalogQuery } = useDiscoverySession();

  const submitSearch = (kind: 'all' | 'service' | 'doctor' | 'area' = 'all', query = catalogQuery) => {
    router.push({
      pathname: '/discover/search/results',
      params: { q: query.trim(), kind },
    });
  };

  const openQuickType = (kind: (typeof quickTypes)[number]['kind']) => {
    if (kind === 'pain') {
      router.push('/assessment/start');
    } else if (kind === 'area') {
      router.push({ pathname: '/discover/providers', params: { serviceCode: 'root-canal', openArea: '1' } });
    } else {
      submitSearch(kind);
    }
  };

  const openRecent = (term: string) => {
    setCatalogQuery(term);
    if (term === 'علاج جذور في الجميلية') {
      router.push({
        pathname: '/discover/providers/results',
        params: { serviceCode: 'root-canal', area: 'الجميلية' },
      });
    } else if (term === 'د. ليان يوسف') {
      submitSearch('doctor', term);
    } else {
      submitSearch('service', 'تنظيف');
    }
  };

  return (
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader
        showFilterAction
        onFilterPress={() => router.push({ pathname: '/discover/providers', params: { serviceCode: 'root-canal' } })}
        title="البحث"
      />

      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-[98px] pt-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppText align="right" className="font-ui-bold" variant="heading-3">
          ابحث بالطريقة التي تعرفها
        </AppText>

        <SearchField
          containerClassName="mt-3"
          onChangeText={setCatalogQuery}
          onSubmitEditing={() => submitSearch()}
          placeholder="ألم، خدمة، طبيب، أو منطقة في حلب"
          value={catalogQuery}
        />

        <Pressable
          accessibilityLabel="عرض أطباء علاج الجذور من التقييم الأولي"
          accessibilityRole="button"
          className="mt-3 min-h-[101px] items-end justify-center rounded-[15px] border border-action-primary/30 bg-action-subtle px-3 py-3"
          onPress={() => router.push({ pathname: '/discover/providers', params: { serviceCode: 'root-canal' } })}
        >
          <AppText align="right" className="text-content-link" variant="caption">من التقييم الأولي</AppText>
          <AppText align="right" className="mt-2 font-ui-bold" variant="label">
            ألم في ضرس خلفي • علاج الجذور
          </AppText>
          <AppText align="right" className="mt-1 text-content-secondary" variant="caption">
            الخدمة محددة مسبقاً ويمكنك تعديل التقييم
          </AppText>
        </Pressable>

        <View className="mt-3 flex-row-reverse gap-[7px]">
          {quickTypes.map((item) => (
            <Pressable
              accessibilityLabel={item.label}
              accessibilityRole="button"
              className="min-h-[57px] min-w-0 flex-1 items-center justify-center gap-1 rounded-[12px] border border-border-subtle bg-surface-default px-1"
              key={item.kind}
              onPress={() => openQuickType(item.kind)}
            >
              <AppIcon name={item.icon} size={18} tone="action" />
              <AppText align="center" className="font-ui-medium" numberOfLines={1} variant="caption">
                {item.label}
              </AppText>
            </Pressable>
          ))}
        </View>

        <AppText align="right" className="mt-4 font-ui-bold" variant="label">
          عمليات بحث حديثة
        </AppText>
        <View className="mt-2 gap-[7px]">
          {recent.map((item) => (
            <Pressable
              accessibilityLabel={`إعادة البحث عن ${item}`}
              accessibilityRole="button"
              className="min-h-[43px] flex-row-reverse items-center gap-3 rounded-[11px] border border-border-subtle bg-surface-default px-3"
              key={item}
              onPress={() => openRecent(item)}
            >
              <AppText align="right" className="min-w-0 flex-1" variant="label">
                {item}
              </AppText>
              <AppIcon
                name={{ ios: 'clock.arrow.circlepath', android: 'history', web: 'history' }}
                size={17}
                tone="secondary"
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <DiscoveryBottomBar activeTab="الرئيسية" />
    </Screen>
  );
}
