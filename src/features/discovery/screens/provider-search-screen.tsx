import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { DiscoveryBottomBar } from '@/features/discovery/components/pen-discovery-ui';
import { mockAreas } from '@/features/discovery/mocks/providers.mock';
import { useDiscoverySession } from '@/features/discovery/state/discovery-session-provider';
import type { ProviderFilterKey } from '@/features/discovery/utils/provider-filters';
import { AppIcon, AppText, Button, Screen } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';

const filterRows: {
  key: ProviderFilterKey;
  title: string;
  summary: string;
  icon: AppIconName;
}[] = [
  {
    key: 'area',
    title: 'المنطقة والمسافة',
    summary: 'المنطقة المختارة، دون تقدير مسافة وهمي',
    icon: { ios: 'mappin', android: 'place', web: 'place' },
  },
  {
    key: 'soonest',
    title: 'أقرب موعد',
    summary: 'مواعيد ضمن الأيام السبعة القادمة',
    icon: { ios: 'calendar.badge.clock', android: 'event_available', web: 'event_available' },
  },
  {
    key: 'price',
    title: 'السعر وطريقة عرضه',
    summary: 'السعر ظاهر قبل طلب الحجز',
    icon: { ios: 'dollarsign.circle', android: 'payments', web: 'payments' },
  },
  {
    key: 'rating',
    title: 'التقييم الموثّق',
    summary: '4.5 فأعلى مع وجود تقييمات',
    icon: { ios: 'star', android: 'star_border', web: 'star_border' },
  },
  {
    key: 'branch',
    title: 'جاهزية الفرع للخدمة',
    summary: 'حسب بيانات العرض التجريبية',
    icon: { ios: 'building.2', android: 'business', web: 'business' },
  },
  {
    key: 'payment',
    title: 'الدفع',
    summary: 'Sham Cash حسب بيانات العرض التجريبية',
    icon: { ios: 'receipt', android: 'receipt_long', web: 'receipt_long' },
  },
];

export function ProviderSearchScreen() {
  const router = useRouter();
  const { serviceCode: requestedServiceCode, openArea } = useLocalSearchParams<{
    serviceCode?: string;
    openArea?: string;
  }>();
  const serviceCode = requestedServiceCode?.trim() || 'dental-checkup';
  const {
    getServiceState,
    setProviderArea,
    setProviderFilter,
    resetProviderFilters,
    applyProviderFilters,
  } = useDiscoverySession();
  const { area, filters } = getServiceState(serviceCode);
  const [areaOpen, setAreaOpen] = useState(openArea === '1');

  return (
    <Screen contentClassName="px-0 py-0">
      <View className="mx-auto h-[64px] w-full max-w-[430px] flex-row-reverse items-center justify-between bg-surface-default px-3">
        <Pressable
          accessibilityLabel="العودة إلى البحث"
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/discover/search'))}
        >
          <AppIcon
            name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
            size={21}
            tone="primary"
          />
        </Pressable>
        <AppText align="center" className="min-w-0 flex-1 font-ui-bold" variant="heading-3">
          تصفية النتائج
        </AppText>
        <Pressable
          accessibilityLabel="إعادة ضبط الفلاتر"
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-full bg-action-subtle"
          onPress={() => resetProviderFilters(serviceCode)}
        >
          <AppIcon
            name={{ ios: 'arrow.counterclockwise', android: 'restart_alt', web: 'restart_alt' }}
            size={19}
            tone="action"
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-3 pb-[102px] pt-1"
        showsVerticalScrollIndicator={false}
      >
        <AppText align="right" className="mb-[9px] font-ui-bold" variant="heading-4">
          صفِ النتائج بما يفيد قرارك
        </AppText>
        <View className="gap-[8px]">
          {filterRows.map((item) => (
            <View
              className="min-h-[62px] flex-row-reverse items-center gap-3 rounded-[12px] border border-border-subtle bg-surface-default px-[11px] py-2"
              key={item.key}
            >
              <AppIcon name={item.icon} size={18} tone="action" />
              <View className="min-w-0 flex-1 items-end">
                <AppText align="right" className="font-ui-semibold" variant="label">
                  {item.title}
                </AppText>
                {item.key === 'area' ? (
                  <Pressable
                    accessibilityLabel="تغيير المنطقة المختارة"
                    accessibilityRole="button"
                    className="min-h-[26px] justify-center"
                    onPress={() => setAreaOpen(true)}
                  >
                    <AppText align="right" className="text-content-link" variant="caption">
                      {area} · تغيير المنطقة
                    </AppText>
                  </Pressable>
                ) : (
                  <AppText align="right" className="text-content-secondary" variant="caption">
                    {item.summary}
                  </AppText>
                )}
              </View>
              <Pressable
                accessibilityLabel={item.title}
                accessibilityRole="switch"
                accessibilityState={{ checked: filters[item.key] }}
                className="h-[44px] w-[48px] items-center justify-center"
                onPress={() => setProviderFilter(serviceCode, item.key, !filters[item.key])}
              >
                <View
                  className={`h-[24px] w-[38px] justify-center rounded-full px-[3px] ${filters[item.key] ? 'bg-action-primary' : 'bg-border-default'}`}
                >
                  <View
                    className={`h-[18px] w-[18px] rounded-full bg-surface-default ${filters[item.key] ? 'self-end' : 'self-start'}`}
                  />
                </View>
              </Pressable>
            </View>
          ))}
        </View>

        <Button
          className="mt-[10px] h-[49px]"
          label="عرض النتائج المناسبة"
          onPress={() => {
            applyProviderFilters(serviceCode);
            router.push({
              pathname: '/discover/providers/results',
              params: { serviceCode },
            });
          }}
          size="sm"
          variant="primary"
        />
        <AppText align="right" className="mt-2 text-content-secondary" variant="caption">
          التوفر وجاهزية الفرع وطرق الدفع هنا بيانات توضيحية، وتحتاج تأكيداً قبل الحجز.
        </AppText>
      </ScrollView>

      <DiscoveryBottomBar activeTab="اكتشف" />

      <Modal
        animationType="fade"
        onRequestClose={() => setAreaOpen(false)}
        transparent
        visible={areaOpen}
      >
        <View className="flex-1 justify-end">
          <Pressable
            accessibilityLabel="إغلاق اختيار المنطقة"
            accessibilityRole="button"
            className="absolute inset-0 bg-black/50"
            onPress={() => setAreaOpen(false)}
          />
          <View className="rounded-t-[20px] bg-surface-default px-4 pb-6 pt-4">
            <View className="mx-auto w-full max-w-[430px] gap-2">
              <AppText align="right" className="font-ui-bold" variant="heading-4">
                اختر المنطقة
              </AppText>
              {mockAreas.map((option) => (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: area === option }}
                  className="min-h-[46px] flex-row-reverse items-center gap-2 rounded-[10px] border border-border-subtle px-3"
                  key={option}
                  onPress={() => {
                    setProviderArea(serviceCode, option);
                    setAreaOpen(false);
                  }}
                >
                  <AppText align="right" className="min-w-0 flex-1 font-ui-medium" variant="label">
                    {option}
                  </AppText>
                  {area === option ? (
                    <AppIcon
                      name={{
                        ios: 'checkmark.circle.fill',
                        android: 'check_circle',
                        web: 'check_circle',
                      }}
                      size={20}
                      tone="action"
                    />
                  ) : null}
                </Pressable>
              ))}
              <Button label="إلغاء" onPress={() => setAreaOpen(false)} variant="outline" />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
