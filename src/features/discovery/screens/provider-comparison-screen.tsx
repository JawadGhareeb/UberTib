import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

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
    serviceCode = 'root-canal',
    patientId,
  } = useLocalSearchParams<{
    providerIds?: string;
    serviceCode?: string;
    patientId?: string;
  }>();
  const { getServiceState, setComparisonProviders } = useDiscoverySession();
  const routeIds = providerIds?.split(',').filter(Boolean) ?? [];
  const ids = [
    ...new Set(routeIds.length ? routeIds : getServiceState(serviceCode).comparisonProviderIds),
  ].slice(0, 3);
  const serviceDoctors = getPenDoctorsForService(serviceCode);
  const doctors = ids
    .map((id) => serviceDoctors.find((doctor) => doctor.id === id))
    .filter((doctor): doctor is (typeof serviceDoctors)[number] => Boolean(doctor));

  const editComparison = () => {
    setComparisonProviders(
      serviceCode,
      doctors.map((doctor) => doctor.id),
    );
    router.replace({
      pathname: '/discover/providers/results',
      params: { serviceCode, ...(patientId ? { patientId } : {}) },
    });
  };
  const removeDoctor = (providerId: string) => {
    const remaining = doctors
      .filter((doctor) => doctor.id !== providerId)
      .map((doctor) => doctor.id);
    setComparisonProviders(serviceCode, remaining);
    if (remaining.length < 2) {
      router.replace({ pathname: '/discover/providers/results', params: { serviceCode } });
      return;
    }
    router.replace({
      pathname: '/discover/providers/compare',
      params: {
        serviceCode,
        providerIds: remaining.join(','),
        ...(patientId ? { patientId } : {}),
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
            onAction={() =>
              router.replace({ pathname: '/discover/providers/results', params: { serviceCode } })
            }
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
        <View className="pb-3 pt-2">
          <ProviderSelectedServiceSummary
            serviceCode={serviceCode}
            title={findPenFamily(serviceCode)?.title ?? 'الخدمة المختارة'}
          />
        </View>

        <ProviderComparisonGrid
          doctors={doctors}
          serviceCode={serviceCode}
          onRemove={removeDoctor}
          onViewProfile={(providerId) =>
            router.push({
              pathname: '/discover/provider/[providerId]',
              params: { providerId, serviceCode, ...(patientId ? { patientId } : {}) },
            })
          }
          onChoose={(providerId) =>
            router.push({
              pathname: '/booking/slots',
              params: { providerId, serviceCode },
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
              الأسعار والمواعيد وبيانات الأطباء تجريبية للمقارنة، وليست حجوزات مؤكدة.
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
