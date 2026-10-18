import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { DiscoveryHeader } from '@/features/discovery/components/pen-discovery-ui';
import { getPenDoctorsForService } from '@/features/discovery/presentation/pen-discovery-data';
import { useDiscoverySession } from '@/features/discovery/state/discovery-session-provider';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button, Screen, StateView } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

const attributes = [
  { key: 'next', label: 'الموعد' },
  { key: 'priceLong', label: 'السعر' },
  { key: 'priceMeaning', label: 'ما يمثله السعر' },
  { key: 'rating', label: 'تقييم المرضى', suffix: ' تجربة' },
  { key: 'availability', label: 'توفر الخدمة' },
  { key: 'accessibility', label: 'الوصول والموقع' },
  { key: 'terms', label: 'الشروط' },
] as const;

export function ProviderComparisonScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { providerIds, serviceCode = 'root-canal' } = useLocalSearchParams<{
    providerIds?: string;
    serviceCode?: string;
  }>();
  const { getServiceState, setComparisonProviders } = useDiscoverySession();
  const idsFromRoute = providerIds?.split(',').filter(Boolean) ?? [];
  const ids = idsFromRoute.length
    ? idsFromRoute.slice(0, 3)
    : getServiceState(serviceCode).comparisonProviderIds.slice(0, 3);
  const serviceDoctors = getPenDoctorsForService(serviceCode);
  const doctors = ids
    .map((id) => serviceDoctors.find((doctor) => doctor.id === id))
    .filter((doctor): doctor is (typeof serviceDoctors)[number] => Boolean(doctor));

  if (doctors.length < 2) {
    return (
      <Screen contentClassName="px-0 py-0">
        <DiscoveryHeader subtitle="مقارنة حقائق" title="مقارنة الأطباء" />
        <View className="mx-auto flex-1 w-full max-w-[430px] px-4 pb-8">
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
      <DiscoveryHeader subtitle="مقارنة حقائق" title="مقارنة حتى 3 أطباء" />

      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className={cn('mt-1 items-start gap-2', rowClassName)}>
          <View className="w-[72px] shrink-0">
            <View className="min-h-[190px] items-center justify-center rounded-[12px] bg-surface-subtle px-2">
              <AppIcon
                name={{ ios: 'person.2.fill', android: 'compare', web: 'compare' }}
                size={22}
                tone="action"
              />
              <AppText
                align="center"
                className="mt-2 text-type-caption font-ui-bold"
                variant="label"
              >
                الطبيب والفرع
              </AppText>
            </View>
            {attributes.map((attribute) => (
              <View
                className="mt-1 min-h-[66px] items-center justify-center rounded-[10px] bg-surface-subtle px-1"
                key={attribute.key}
              >
                <AppText align="center" className="text-type-caption font-ui-bold" variant="label">
                  {attribute.label}
                </AppText>
              </View>
            ))}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
            <View className="flex-row gap-2 pr-1">
              {doctors.map((doctor) => (
                <View className="w-[128px]" key={doctor.id}>
                  <View className="min-h-[190px] items-center justify-center rounded-[12px] border border-border-subtle bg-surface-default p-2">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-action-subtle">
                      <AppIcon
                        name={{ ios: 'person.fill', android: 'person', web: 'person' }}
                        size={20}
                        tone="action"
                      />
                    </View>
                    <AppText align="center" className="mt-1 font-ui-bold text-type-label">
                      {doctor.name}
                    </AppText>
                    <AppText
                      align="center"
                      className="text-type-caption text-content-secondary"
                      variant="caption"
                    >
                      {doctor.branch} · {doctor.area}
                    </AppText>
                    <View className="mt-1 w-full gap-1">
                      <Button
                        label="اختر الطبيب"
                        onPress={() =>
                          router.push({
                            pathname: '/booking/slots',
                            params: { providerId: doctor.id, serviceCode },
                          })
                        }
                        size="compact"
                      />
                      <Button
                        label="عرض الطبيب"
                        onPress={() =>
                          router.push({
                            pathname: '/discover/provider/[providerId]',
                            params: { providerId: doctor.id, serviceCode },
                          })
                        }
                        size="compact"
                        variant="soft"
                      />
                    </View>
                  </View>

                  {attributes.map((attribute) => {
                    const baseValue = String(doctor[attribute.key]);
                    const value =
                      attribute.key === 'rating'
                        ? `${baseValue}${attribute.suffix}`
                        : attribute.key === 'accessibility'
                          ? `${doctor.distance} · ${baseValue}`
                          : baseValue;

                    return (
                      <View
                        className="mt-1 min-h-[66px] items-center justify-center rounded-[10px] border border-border-subtle bg-surface-default px-2"
                        key={attribute.key}
                      >
                        <AppText
                          align="center"
                          className="text-type-caption  text-content-secondary"
                          variant="caption"
                        >
                          {value}
                        </AppText>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {doctors.length === 3 ? (
          <View className={cn('mt-2 items-center justify-center gap-1', rowClassName)}>
            <AppIcon
              name={{ ios: 'arrow.left.and.right', android: 'swipe', web: 'swipe' }}
              size={14}
              tone="secondary"
            />
            <AppText className="text-type-caption text-content-secondary" variant="caption">
              اسحب أفقياً لرؤية الطبيب الثالث
            </AppText>
          </View>
        ) : null}

        <Button
          className="mt-3"
          label="تغيير الاختيار"
          onPress={() => {
            setComparisonProviders(
              serviceCode,
              doctors.map((doctor) => doctor.id),
            );
            router.replace({ pathname: '/discover/providers/results', params: { serviceCode } });
          }}
          variant="secondary"
        />
      </ScrollView>
    </Screen>
  );
}
