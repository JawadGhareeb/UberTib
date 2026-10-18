import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { getMockProviders } from '@/features/discovery/mocks/providers.mock';
import { filterMockProviders } from '@/features/discovery/utils/provider-filters';
import { useDiscoverySession } from '@/features/discovery/state/discovery-session-provider';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button, Screen } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

type Doctor = ReturnType<typeof getPenDoctorsForService>[number];

function DoctorCard({
  doctor,
  serviceCode,
  selected,
  disabled,
  onToggle,
}: {
  doctor: Doctor;
  serviceCode: string;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const specialty = serviceCode === 'root-canal' ? 'علاج الجذور' : doctor.specialty;
  const branchLabel = doctor.branch === 'مركز نور الأسنان' ? 'مركز نور' : doctor.branch;

  return (
    <View
      className={cn(
        'gap-[9px] rounded-[13px] bg-surface-default p-[10px]',
        selected ? 'border-2 border-action-primary' : 'border border-border-subtle',
      )}
    >
      {/* Keep the avatar first in the RTL row: it stays at the right edge. */}
      <View className={cn('items-center gap-[10px]', rowClassName)}>
        <View
          accessible
          accessibilityLabel={`صورة رمزية للطبيب ${doctor.name}`}
          className="h-[38px] w-[38px] shrink-0 rounded-full bg-action-subtle"
        />
        <View className="min-w-0 flex-1 items-end">
          <AppText
            align="right"
            className="w-full font-ui-bold text-content-primary"
            numberOfLines={1}
            variant="label"
          >
            {doctor.name}
          </AppText>
          <AppText
            align="right"
            className="mt-0.5 w-full text-content-secondary"
            numberOfLines={1}
            variant="caption"
          >
            {specialty} · {branchLabel}
          </AppText>
        </View>
      </View>

      <View className={cn('gap-2', rowClassName)}>
        {[
          ['التقييم', doctor.rating],
          ['أقرب موعد', doctor.next],
          ['السعر', doctor.priceShort],
        ].map(([label, value]) => (
          <View className="min-w-0 flex-1" key={label}>
            <AppText
              align="center"
              accessibilityLabel={`${label}: ${value}`}
              className="font-ui-semibold text-content-primary"
              numberOfLines={1}
              style={{ fontSize: 11, lineHeight: 17 }}
              variant="label"
            >
              {value}
            </AppText>
          </View>
        ))}
      </View>

      <View className={cn('gap-[6px]', rowClassName)}>
        <Pressable
          accessibilityLabel={
            selected ? `إزالة ${doctor.name} من المقارنة` : `إضافة ${doctor.name} للمقارنة`
          }
          accessibilityRole="checkbox"
          accessibilityState={{ checked: selected, disabled }}
          className={cn(
            'h-[44px] min-w-0 flex-1 items-center justify-center rounded-[9px] border px-2',
            selected
              ? 'border-action-primary bg-action-subtle'
              : disabled
                ? 'border-border-subtle bg-surface-subtle opacity-60'
                : 'border-border-subtle bg-surface-default',
          )}
          disabled={disabled}
          onPress={onToggle}
        >
          <View className={cn('items-center gap-2', rowClassName)}>
            <AppIcon
              name={
                selected
                  ? { ios: 'checkmark.square', android: 'check_box', web: 'check_box' }
                  : {
                      ios: 'square',
                      android: 'check_box_outline_blank',
                      web: 'check_box_outline_blank',
                    }
              }
              size={17}
              tone={disabled ? 'secondary' : 'action'}
            />
            <AppText
              align="center"
              className={cn(
                'font-ui-medium',
                disabled ? 'text-content-disabled' : 'text-content-primary',
              )}
              numberOfLines={1}
              variant="caption"
            >
              {selected ? 'مضاف للمقارنة' : disabled ? 'الحد الأقصى 3' : 'إضافة للمقارنة'}
            </AppText>
          </View>
        </Pressable>

        <Pressable
          accessibilityLabel={`عرض ملف ${doctor.name}`}
          accessibilityRole="button"
          className="h-[44px] w-[104px] items-center justify-center rounded-[9px] bg-surface-subtle"
          onPress={() =>
            router.push({
              pathname: '/discover/provider/[providerId]',
              params: { providerId: doctor.id, serviceCode },
            })
          }
        >
          <AppText
            align="center"
            className="font-ui-semibold text-content-primary"
            variant="caption"
          >
            عرض الطبيب
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

export function ProviderResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { rowClassName } = useAppDirection();
  const { serviceCode: requestedServiceCode, area: routeArea } = useLocalSearchParams<{
    serviceCode?: string;
    area?: string;
  }>();
  const serviceCode = requestedServiceCode?.trim() || 'dental-checkup';
  const { getServiceState, toggleComparisonProvider, resetProviderFilters, setProviderArea } =
    useDiscoverySession();
  const serviceState = getServiceState(serviceCode);
  const area = routeArea ?? serviceState.area;
  const effectiveArea =
    serviceState.filtersApplied && !serviceState.filters.area ? 'كل المناطق' : area;
  const allDoctors = getPenDoctorsForService(
    serviceCode,
    effectiveArea === 'كل المناطق' ? undefined : effectiveArea,
  );
  // Keep service qualification independent of the selected filters and area.
  const serviceDoctors = getPenDoctorsForService(serviceCode);
  const eligibleIds = serviceState.filtersApplied
    ? filterMockProviders(
        getMockProviders(serviceCode),
        serviceCode,
        area,
        serviceState.filters,
      ).map((provider) => provider.id)
    : allDoctors.map((doctor) => doctor.id);
  const doctorById = new Map(allDoctors.map((doctor) => [doctor.id, doctor]));
  const doctors = eligibleIds.flatMap((id) => {
    const doctor = doctorById.get(id);
    return doctor ? [doctor] : [];
  });
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
    // Explicit route areas outrank state; remove the override as well.
    if (routeArea) {
      router.replace({ pathname: '/discover/providers/results', params: { serviceCode } });
    }
  };
  const showDoctorsEverywhere = () => {
    setProviderArea(serviceCode, 'كل المناطق');
    if (routeArea) {
      router.replace({ pathname: '/discover/providers/results', params: { serviceCode } });
    }
  };

  return (
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader
        showFilterAction
        onFilterPress={() =>
          router.push({
            pathname: '/discover/providers',
            params: { serviceCode },
          })
        }
        title="الأطباء المناسبون"
      />
      <ScrollView
        contentContainerClassName={cn(
          'mx-auto w-full max-w-[430px] px-4 pt-2',
          selected.length > 0 ? 'pb-[150px]' : 'pb-[90px]',
        )}
        showsVerticalScrollIndicator={false}
      >
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
            {serviceTitle} · {effectiveArea} {serviceState.filtersApplied ? '· نتائج مفلترة' : ''}
          </AppText>
        </View>

        <View className="mt-[6px] min-h-[33px] justify-center rounded-[9px] bg-tone-info-fill px-3 py-2">
          <AppText className="text-tone-info-text" variant="caption">
            اختر طبيبين أو ثلاثة، الحد الأقصى 3 أطباء.
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
                  : serviceState.filtersApplied
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
              ) : serviceState.filtersApplied ? (
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
            <DoctorCard
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

      <DiscoveryBottomBar activeTab="الرئيسية" />
    </Screen>
  );
}
