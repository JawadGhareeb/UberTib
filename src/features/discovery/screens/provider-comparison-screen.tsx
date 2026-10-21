import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { getMockProvider } from '@/features/discovery/mocks/providers.mock';

import { ProviderComparisonGrid } from '@/features/discovery/components/provider-comparison-grid';
import { ProviderSelectedServiceSummary } from '@/features/discovery/components/provider-selected-service-summary';
import { DiscoveryHeader } from '@/features/discovery/components/pen-discovery-ui';
import {
  findPenFamily,
  getPenDoctorsForService,
} from '@/features/discovery/presentation/pen-discovery-data';
import { useDiscoverySession } from '@/features/discovery/state/discovery-session-provider';
import { AppIcon, AppText, Button, Screen, StateView } from '@/shared/components/ui';

export function ProviderComparisonScreen() {
  const router = useRouter();
  const {
    providerIds,
    serviceCode: requestedServiceCode,
    patientId,
    fromSearch,
  } = useLocalSearchParams<{
    providerIds?: string;
    serviceCode?: string;
    patientId?: string;
    fromSearch?: 'tab' | 'search';
  }>();
  const serviceCode = requestedServiceCode?.trim() || null;
  const { getServiceState, setComparisonProviders, setCatalogComparison } = useDiscoverySession();
  const routeIds = providerIds?.split(',').filter(Boolean) ?? [];
  const ids = [
    ...new Set(
      routeIds.length ? routeIds : getServiceState(serviceCode ?? undefined).comparisonProviderIds,
    ),
  ].slice(0, 3);
  const doctors = ids.flatMap((id) => {
    const provider = getMockProvider(id);
    const relevantService = serviceCode ?? provider?.serviceCodes[0];
    if (!provider || !relevantService) return [];
    const doctor = getPenDoctorsForService(relevantService).find((item) => item.id === id);
    return doctor ? [doctor] : [];
  });

  const returnToSelection = (selectedIds: string[]) => {
    if (fromSearch === 'tab' || fromSearch === 'search') {
      setCatalogComparison(selectedIds.length ? { serviceCode, providerIds: selectedIds } : null);
      router.replace(fromSearch === 'tab' ? '/(tabs)/discover' : '/discover/search');
      return;
    }
    router.replace({
      pathname: '/discover/providers/results',
      params: { ...(serviceCode ? { serviceCode } : {}), ...(patientId ? { patientId } : {}) },
    });
  };

  const editComparison = () => {
    const selectedIds = doctors.map((doctor) => doctor.id);
    if (serviceCode) setComparisonProviders(serviceCode, selectedIds);
    returnToSelection(selectedIds);
  };
  const removeDoctor = (providerId: string) => {
    const remaining = doctors
      .filter((doctor) => doctor.id !== providerId)
      .map((doctor) => doctor.id);
    if (serviceCode) setComparisonProviders(serviceCode, remaining);
    if (fromSearch) {
      setCatalogComparison(remaining.length ? { serviceCode, providerIds: remaining } : null);
    }
    if (remaining.length < 2) {
      returnToSelection(remaining);
      return;
    }
    router.replace({
      pathname: '/discover/providers/compare',
      params: {
        ...(serviceCode ? { serviceCode } : {}),
        providerIds: remaining.join(','),
        ...(patientId ? { patientId } : {}),
        ...(fromSearch ? { fromSearch } : {}),
      },
    });
  };

  if (doctors.length < 2) {
    return (
      <Screen contentClassName="px-0 py-0">
        <DiscoveryHeader subtitle="مقارنة حقائق" title="مقارنة الأطباء" />
        <View className="mx-auto w-full max-w-[430px] flex-1 px-4 pb-8">
          <StateView
            actionLabel="العودة لاختيار الأطباء"
            description="اختر طبيبين على الأقل من نفس الخدمة قبل فتح المقارنة."
            onAction={() => returnToSelection(doctors.map((doctor) => doctor.id))}
            title="المقارنة تحتاج طبيبين"
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader subtitle={doctors.length + ' أطباء للمقارنة'} title="مقارنة الأطباء" />
      <View className="mx-auto w-full max-w-[430px] min-h-0 flex-1 px-4">
        {serviceCode ? (
          <View className="pb-3 pt-2">
            <ProviderSelectedServiceSummary
              serviceCode={serviceCode}
              title={findPenFamily(serviceCode)?.title ?? 'الخدمة المختارة'}
            />
          </View>
        ) : (
          <View className="pb-3 pt-2">
            <AppText align="right" variant="caption" className="text-content-secondary">
              المقارنة عامة بين الأطباء. لا تظهر أسعار الخدمات قبل اختيار خدمة من الفلاتر.
            </AppText>
          </View>
        )}

        <ProviderComparisonGrid
          doctors={doctors}
          serviceCode={serviceCode}
          onRemove={removeDoctor}
          onViewProfile={(providerId) =>
            router.push({
              pathname: '/discover/provider/[providerId]',
              params: {
                providerId,
                serviceCode:
                  serviceCode ?? getMockProvider(providerId)?.serviceCodes[0] ?? 'dental-checkup',
                ...(patientId ? { patientId } : {}),
              },
            })
          }
          onChoose={(providerId) =>
            router.push({
              pathname: serviceCode ? '/booking/slots' : '/discover/provider/[providerId]',
              params: {
                providerId,
                serviceCode:
                  serviceCode ?? getMockProvider(providerId)?.serviceCodes[0] ?? 'dental-checkup',
                ...(patientId ? { patientId } : {}),
              },
            })
          }
        />

        <View className="gap-2 border-t border-border-subtle bg-surface-canvas pb-3 pt-3">
          <View className="flex-row-reverse items-start gap-2 rounded-[12px] bg-tone-info-fill px-3 py-2.5">
            <AppIcon
              name={{ ios: 'info.circle', android: 'info', web: 'info' }}
              size={18}
              tone="info"
            />
            <AppText align="right" variant="caption" className="min-w-0 flex-1 text-tone-info-text">
              قارن بين الأطباء والمواعيد، والتكلفة النهائية تخضع لتفاصيل الخدمة وتأكيد العيادة.
            </AppText>
          </View>
          <Button
            className="min-h-[48px] rounded-[12px]"
            label={doctors.length < 3 ? 'إضافة طبيب أو تغيير الاختيار' : 'تغيير اختيار الأطباء'}
            onPress={editComparison}
            variant="outline"
            endIcon={{ ios: 'arrow.left.arrow.right', android: 'swap_horiz', web: 'swap_horiz' }}
          />
        </View>
      </View>
    </Screen>
  );
}
