import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProviderAvatar } from '@/features/discovery/components/provider-avatar';
import { DoctorClassificationChips } from '@/features/discovery/components/doctor-classification-chips';
import {
  DiscoveryBottomBar,
  DiscoveryHeader,
} from '@/features/discovery/components/pen-discovery-ui';
import { ProviderComparisonBar } from '@/features/discovery/components/provider-comparison-bar';
import { getMockProvider } from '@/features/discovery/mocks/providers.mock';
import { findPenFamily } from '@/features/discovery/presentation/pen-discovery-data';
import { useDoctorFavorites } from '@/features/discovery/state/doctor-favorites-provider';
import { AppIcon, AppText, Button, Screen } from '@/shared/components/ui';

export function DoctorFavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const imageWidth = Math.min(width - 80, 280);
  const { favorites, ready, toggleFavorite } = useDoctorFavorites();
  const [chosen, setChosen] = useState<{ serviceCode: string; ids: string[] } | null>(null);

  const rows = favorites.flatMap((item) => {
    const doctor = getMockProvider(item.providerId);
    return doctor ? [{ ...item, doctor }] : [];
  });
  const selectedIds =
    chosen?.ids.filter((id) =>
      rows.some((row) => row.providerId === id && row.serviceCode === chosen.serviceCode),
    ) ?? [];
  const toggleCompare = (id: string, serviceCode: string) => {
    setChosen((current) => {
      if (current?.serviceCode !== serviceCode) return { serviceCode, ids: [id] };
      return {
        serviceCode,
        ids: current.ids.includes(id)
          ? current.ids.filter((item) => item !== id)
          : current.ids.length < 3
            ? [...current.ids, id]
            : current.ids,
      };
    });
  };

  return (
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader title="المفضلة" />
      <ScrollView
        className="min-h-0 flex-1"
        contentContainerClassName="mx-auto w-full max-w-[430px] gap-3 px-4 pb-28 pt-3"
        showsVerticalScrollIndicator={false}
      >
        {!ready ? (
          <AppText align="center" variant="label">
            جاري تحميل المفضلة...
          </AppText>
        ) : !rows.length ? (
          <View className="items-center gap-3 pb-8 pt-6">
            <Image
              accessibilityLabel="المفضلة فارغة"
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={require('../../../shared/assets/ubertip-empty-transparent.png')}
              style={{ width: imageWidth, height: imageWidth * (1155 / 1709) }}
            />
            <AppText align="center" variant="heading-4" className="font-ui-bold">
              لايوجد أطباء بالمفضلة حالياً
            </AppText>
            <AppText align="center" variant="label" className="text-content-secondary">
              تقدر تحفظ الطبيب من بطاقة النتائج أو من ملفه.
            </AppText>
            <Button
              className="mt-2 w-full"
              label="استكشف الأطباء"
              variant="secondary"
              onPress={() =>
                router.push({ pathname: '/discover/search', params: { browseDoctors: '1' } })
              }
            />
          </View>
        ) : (
          rows.map(({ doctor, providerId, serviceCode }, index) => {
            const name = findPenFamily(serviceCode ?? '')?.title;
            const selected = Boolean(
              serviceCode &&
              chosen?.serviceCode === serviceCode &&
              selectedIds.includes(providerId),
            );
            return (
              <View
                key={providerId + ':' + (serviceCode ?? 'general') + ':' + index}
                className="gap-2 rounded-[16px] border border-border-subtle bg-surface-default p-3"
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={'عرض ملف ' + doctor.name}
                  onPress={() =>
                    router.push({
                      pathname: '/discover/provider/[providerId]',
                      params: { providerId, ...(serviceCode ? { serviceCode } : {}) },
                    })
                  }
                  className="min-h-[57px] flex-row-reverse items-center gap-3"
                >
                  <ProviderAvatar providerId={providerId} size={52} />
                  <View className="min-w-0 flex-1 items-end gap-1">
                    <AppText align="right" variant="label" className="font-ui-semibold">
                      {doctor.name}
                    </AppText>
                    <AppText align="right" variant="caption" className="text-content-secondary">
                      {doctor.specialty} · {doctor.branch}
                    </AppText>
                    <AppText align="right" variant="caption" className="text-content-link">
                      {name ? 'الخدمة المحفوظة: ' + name : 'تصفح عام بدون خدمة محددة'}
                    </AppText>
                  </View>
                  <AppIcon
                    name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                    size={17}
                    tone="secondary"
                  />
                </Pressable>
                <DoctorClassificationChips provider={doctor} compact />
                <View className="flex-row-reverse gap-2">
                  <View className="min-w-0 flex-1">
                    {serviceCode ? (
                      <Button
                        label={selected ? 'إزالة من المقارنة' : 'أضف للمقارنة'}
                        variant="outline"
                        size="sm"
                        disabled={
                          !selected &&
                          chosen?.serviceCode === serviceCode &&
                          selectedIds.length >= 3
                        }
                        onPress={() => toggleCompare(providerId, serviceCode)}
                      />
                    ) : (
                      <AppText align="right" variant="caption" className="text-content-secondary">
                        المقارنة حسب الخدمة بعد اختيارها من ملف الطبيب
                      </AppText>
                    )}
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={'إزالة ' + doctor.name + ' من المفضلة'}
                    className="h-10 w-10 items-center justify-center rounded-[11px] bg-action-subtle"
                    onPress={() => toggleFavorite(providerId, serviceCode)}
                  >
                    <AppIcon
                      name={{ ios: 'trash', android: 'delete_outline', web: 'delete_outline' }}
                      size={19}
                      tone="action"
                    />
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
      {chosen && selectedIds.length >= 2 ? (
        <ProviderComparisonBar
          count={selectedIds.length}
          bottom={72 + Math.max(insets.bottom, 8)}
          onCompare={() =>
            router.push({
              pathname: '/discover/providers/compare',
              params: {
                serviceCode: chosen.serviceCode,
                providerIds: selectedIds.join(','),
                fromSearch: 'favorites',
              },
            })
          }
        />
      ) : null}
      <DiscoveryBottomBar activeTab="اكتشف" />
    </Screen>
  );
}
