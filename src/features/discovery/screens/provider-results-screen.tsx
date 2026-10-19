import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  DiscoveryBottomBar,
  DiscoveryHeader,
} from '@/features/discovery/components/pen-discovery-ui';
import {
  getPenDoctorsForService,
  penServiceGroups,
} from '@/features/discovery/presentation/pen-discovery-data';
import { getMockProvider, getMockProviders } from '@/features/discovery/mocks/providers.mock';
import { DiscoverFilterSheet } from '../components/discover-filter-sheet';
import { DiscoverDoctorResultCard } from '../components/discover-doctor-result-card';
import { filterMockProviders } from '@/features/discovery/utils/provider-filters';
import {
  matchesDiscoveryFilters,
  priceLimitsForService,
  selectedDiscoveryAreas,
  type DiscoveryFilterSelection,
  type PriceRange,
} from '@/features/discovery/model/discover-filters';
import { useDiscoverySession } from '@/features/discovery/state/discovery-session-provider';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button, Screen } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

export function ProviderResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { rowClassName } = useAppDirection();
  const {
    serviceCode: requestedServiceCode,
    area: routeArea,
    areas: routeAreas,
    minPrice,
    maxPrice,
  } = useLocalSearchParams<{
    serviceCode?: string;
    area?: string;
    areas?: string;
    minPrice?: string;
    maxPrice?: string;
  }>();
  const serviceCode = requestedServiceCode?.trim() || 'dental-checkup';
  const { getServiceState, toggleComparisonProvider, resetProviderFilters, setProviderArea } =
    useDiscoverySession();
  const serviceState = getServiceState(serviceCode);
  const initialPriceRange: PriceRange | null =
    minPrice !== undefined &&
    maxPrice !== undefined &&
    Number.isFinite(Number(minPrice)) &&
    Number.isFinite(Number(maxPrice)) &&
    Number(minPrice) >= 0 &&
    Number(maxPrice) >= Number(minPrice)
      ? [Number(minPrice), Number(maxPrice)]
      : null;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [discoveryFilters, setDiscoveryFilters] = useState<DiscoveryFilterSelection>({
    area: routeArea ?? serviceState.area,
    ...(routeAreas !== undefined ? { areas: routeAreas.split('|').filter(Boolean) } : {}),
    priceRange: initialPriceRange,
  });
  const selectedAreas = selectedDiscoveryAreas(discoveryFilters);
  const effectiveArea =
    selectedAreas.length === 1 ? (selectedAreas[0] ?? 'كل المناطق') : 'كل المناطق';
  const allDoctors = getPenDoctorsForService(serviceCode);
  const serviceDoctors = getPenDoctorsForService(serviceCode);
  const eligibleIds = serviceState.filtersApplied
    ? filterMockProviders(
        getMockProviders(serviceCode),
        serviceCode,
        effectiveArea,
        serviceState.filters,
      ).map((provider) => provider.id)
    : allDoctors.map((doctor) => doctor.id);
  const doctorById = new Map(allDoctors.map((doctor) => [doctor.id, doctor]));
  const doctors = eligibleIds.flatMap((id) => {
    const doctor = doctorById.get(id);
    const provider = getMockProvider(id);
    return doctor && provider && matchesDiscoveryFilters(provider, discoveryFilters, serviceCode)
      ? [doctor]
      : [];
  });
  const priceLimits = priceLimitsForService(serviceCode);
  const filtersActive =
    selectedAreas.length > 0 || discoveryFilters.priceRange !== null || serviceState.filtersApplied;
  const selected = serviceState.comparisonProviderIds.filter((id) =>
    doctors.some((doctor) => doctor.id === id),
  );
  const serviceTitle =
    serviceCode === 'root-canal'
      ? 'علاج جذور'
      : (penServiceGroups
          .flatMap((group) => group.families)
          .find((family) => family.id === serviceCode)?.title ?? 'الخدمة المطلوبة');
  const maxReached = selected.length >= 3;
  const noServiceDoctors = serviceDoctors.length === 0;
  const clearProviderFilters = () => {
    resetProviderFilters(serviceCode);
    setDiscoveryFilters({ area: 'كل المناطق', areas: [], priceRange: null });
  };
  const showDoctorsEverywhere = () => {
    setProviderArea(serviceCode, 'كل المناطق');
    setDiscoveryFilters((previous) => ({ ...previous, area: 'كل المناطق', areas: [] }));
  };

  return (
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader title="الأطباء المناسبون" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerClassName={cn(
          'mx-auto w-full max-w-[430px] px-4 pt-2',
          selected.length > 0 ? 'pb-[150px]' : 'pb-[90px]',
        )}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-3 gap-3">
          <View className="items-end gap-1">
            <AppText align="right" variant="heading-3">
              {serviceTitle}
            </AppText>
            <AppText align="right" variant="label" className="text-content-secondary">
              {doctors.length} أطباء مناسبون ضمن المنطقة والفلاتر المختارة
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={'معلومات عن خدمة ' + serviceTitle}
              className="min-h-[38px] justify-center"
              onPress={() =>
                router.push({
                  pathname: '/discover/service/[serviceCode]',
                  params: { serviceCode },
                })
              }
            >
              <AppText variant="caption" className="text-content-link">
                تعرف على الخدمة
              </AppText>
            </Pressable>
          </View>
          <View className="flex-row-reverse items-center gap-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="تصفية النتائج حسب المنطقة والسعر"
              className="min-h-[46px] flex-row-reverse items-center justify-center gap-2 rounded-[13px] border border-border-subtle bg-surface-default px-4"
              onPress={() => setFiltersOpen(true)}
            >
              <AppIcon
                name={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }}
                size={19}
                tone="action"
              />
              <AppText variant="label" className="font-ui-semibold">
                تصفية
              </AppText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="فلاتر الأطباء المتقدمة"
              className="min-h-[46px] min-w-0 flex-1 items-center justify-center rounded-[13px] border border-border-subtle bg-surface-default px-2"
              onPress={() =>
                router.push({ pathname: '/discover/providers', params: { serviceCode } })
              }
            >
              <AppText align="center" variant="label" className="text-content-secondary">
                فلاتر متقدمة
              </AppText>
            </Pressable>
            {filtersActive ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="مسح الفلاتر"
                onPress={clearProviderFilters}
              >
                <AppText variant="caption" className="text-content-link">
                  مسح
                </AppText>
              </Pressable>
            ) : null}
          </View>
        </View>
        <View
          className={cn(
            'min-h-[34px] items-center gap-2 rounded-[9px] bg-action-subtle px-3 py-2',
            rowClassName,
          )}
        >
          <AppIcon
            name={{ ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' }}
            size={16}
            tone="action"
          />
          <AppText
            className="min-w-0 flex-1 font-ui-semibold text-content-primary"
            variant="caption"
          >
            {serviceTitle} ·{' '}
            {selectedAreas.length > 1 ? selectedAreas.length + ' مناطق' : effectiveArea}{' '}
            {filtersActive ? '· نتائج مفلترة' : ''}
          </AppText>
        </View>

        <View className="mt-[7px] gap-[5px]">
          {doctors.length === 0 ? (
            <View className="items-center gap-3 rounded-[13px] border border-border-subtle bg-surface-default p-4">
              <AppText
                align="center"
                className="font-ui-semibold text-content-primary"
                variant="label"
              >
                {noServiceDoctors
                  ? 'ما في أطباء مسجلين لهذه الخدمة ضمن البيانات الحالية'
                  : filtersActive
                    ? 'الفلاتر المختارة أخفت الأطباء المسجلين'
                    : 'ما في أطباء مسجلين بالمنطقة المختارة'}
              </AppText>
              <AppText align="center" className="text-content-secondary" variant="caption">
                {noServiceDoctors
                  ? 'لا يمكن عرض طبيب لهذه الخدمة من دون بيانات تربطه فيها.'
                  : 'جرب عرض كل المناطق أو إلغاء الفلاتر للعودة إلى قائمة الأطباء.'}
              </AppText>
              {noServiceDoctors ? (
                serviceCode !== 'dental-checkup' ? (
                  <Button
                    label="عرض أطباء الفحص العام"
                    onPress={() =>
                      router.push({
                        pathname: '/discover/providers/results',
                        params: { serviceCode: 'dental-checkup' },
                      })
                    }
                    size="sm"
                    variant="outline"
                  />
                ) : (
                  <Button
                    label="العودة للخدمات"
                    onPress={() => router.push('/discover')}
                    size="sm"
                    variant="outline"
                  />
                )
              ) : filtersActive ? (
                <Button
                  label="إلغاء الفلاتر وعرض الأطباء"
                  onPress={clearProviderFilters}
                  size="sm"
                  variant="outline"
                />
              ) : (
                <Button
                  label="عرض كل المناطق"
                  onPress={showDoctorsEverywhere}
                  size="sm"
                  variant="outline"
                />
              )}
            </View>
          ) : null}

          {doctors.map((doctor) => (
            <DiscoverDoctorResultCard
              disabled={maxReached && !selected.includes(doctor.id)}
              doctor={doctor}
              serviceCode={serviceCode}
              key={doctor.id}
              onToggle={() => toggleComparisonProvider(serviceCode, doctor.id)}
              selected={selected.includes(doctor.id)}
            />
          ))}
        </View>
      </ScrollView>

      {selected.length > 0 ? (
        <View
          className="absolute left-0 right-0 px-4"
          style={{ bottom: 68 + Math.max(insets.bottom, 8) }}
        >
          <View
            className={cn(
              'mx-auto min-h-[54px] w-full max-w-[398px] items-center gap-2 rounded-[13px] border border-border-subtle bg-surface-default px-3 py-[6px]',
              rowClassName,
            )}
          >
            <View className="min-w-0 flex-1 items-end">
              <AppText align="right" className="font-ui-bold text-content-primary" variant="label">
                أطباء محددون {selected.length}
              </AppText>
              <AppText
                align="right"
                className="mt-0.5 text-content-secondary"
                numberOfLines={1}
                style={{ fontSize: 10, lineHeight: 15 }}
                variant="caption"
              >
                {maxReached
                  ? 'الحد الأقصى · أزل طبيباً لإضافة آخر'
                  : 'اختر طبيبين على الأقل للمقارنة'}
              </AppText>
            </View>
            <Button
              className="min-h-[40px] w-[112px]"
              disabled={selected.length < 2}
              label="مقارنة"
              onPress={() =>
                router.push({
                  pathname: '/discover/providers/compare',
                  params: { providerIds: selected.join(','), serviceCode },
                })
              }
              size="compact"
            />
          </View>
        </View>
      ) : null}

      <DiscoverFilterSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        selection={discoveryFilters}
        onApply={setDiscoveryFilters}
        limits={priceLimits}
      />
      <DiscoveryBottomBar activeTab="اكتشف" />
    </Screen>
  );
}
