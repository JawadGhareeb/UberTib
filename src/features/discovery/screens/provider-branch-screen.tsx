import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, Pressable, ScrollView, View } from 'react-native';
import { useState } from 'react';

import { ProviderPhotoGallery } from '@/features/discovery/components/provider-photo-gallery';
import { DiscoveryHeader, ScreenCard } from '@/features/discovery/components/pen-discovery-ui';
import { findPenFamily, getPenDoctorsForService } from '@/features/discovery/presentation/pen-discovery-data';
import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, AppText, Button, Screen, StateView } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { cn } from '@/shared/utils/cn';

const rootCanalReadiness: {
  title: string;
  body: string;
  status: string;
  icon: AppIconName;
}[] = [
  {
    title: 'تصوير موضعي رقمي',
    body: 'متاح عند الحاجة وقبل الإجراء حسب تقييم الطبيب',
    status: 'متاح',
    icon: { ios: 'photo.on.rectangle', android: 'perm_media', web: 'perm_media' },
  },
  {
    title: 'تجهيزات علاج الجذور',
    body: 'أجهزة قياس القنوات وعزل السن مذكورة في سجل الفرع',
    status: 'جاهز',
    icon: { ios: 'waveform.path', android: 'medical_services', web: 'medical_services' },
  },
  {
    title: 'تعقيم ومتابعة',
    body: 'بروتوكول تعقيم ومواعيد متابعة موثّقة كبيانات',
    status: 'موثّق',
    icon: { ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' },
  },
];

const generalReadiness: typeof rootCanalReadiness = [
  {
    title: 'تجهيزات الفحص',
    body: 'يفحص الطبيب الحالة ويحدّد الأجهزة المطلوبة قبل الإجراء',
    status: 'متاح',
    icon: { ios: 'photo.on.rectangle', android: 'perm_media', web: 'perm_media' },
  },
  {
    title: 'جاهزية الخدمة',
    body: 'يؤكد الفرع التجهيزات اللازمة للخدمة عند اختيار الموعد',
    status: 'يُراجع',
    icon: { ios: 'waveform.path', android: 'medical_services', web: 'medical_services' },
  },
  {
    title: 'تعقيم ومتابعة',
    body: 'يشرح الفرع بروتوكول التعقيم وخطة المتابعة قبل بدء الإجراء',
    status: 'موثّق',
    icon: { ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' },
  },
];

function BranchFact({
  label,
  value,
  icon,
  ltr = false,
}: {
  label: string;
  value: string;
  icon: AppIconName;
  ltr?: boolean;
}) {
  return (
    <View className="min-w-0 flex-1 items-center justify-center rounded-[10px] bg-surface-subtle px-1 py-2">
      <AppIcon name={icon} size={16} tone="action" />
      <AppText
        align="center"
        direction={ltr ? 'ltr' : 'auto'}
        className="mt-1 font-ui-semibold text-content-primary"
        numberOfLines={2}
        variant="caption"
      >
        {value}
      </AppText>
      <AppText align="center" className="text-content-secondary" numberOfLines={1} variant="badge">
        {label}
      </AppText>
    </View>
  );
}

export function ProviderBranchScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const [mapError, setMapError] = useState(false);
  const { providerId = 'provider-layan', serviceCode = 'root-canal' } = useLocalSearchParams<{
    providerId?: string;
    serviceCode?: string;
  }>();
  const doctor = getPenDoctorsForService(serviceCode).find((item) => item.id === providerId);
  const readiness = serviceCode === 'root-canal' ? rootCanalReadiness : generalReadiness;
  const service = findPenFamily(serviceCode);
  const address = providerId === 'provider-layan'
    ? 'شارع سعد الله الجابري · جانب ساحة الجميلية'
    : `المنطقة: ${doctor?.area ?? 'غير متاحة'} · يُراجع العنوان عند الحجز`;
  // Mock branches do not have verified coordinates. Open a named map search,
  // never present an invented location pin or claim the precise address is known.
  const locationQuery = providerId === 'provider-layan'
    ? `${doctor?.branch ?? ''}، شارع سعد الله الجابري، الجميلية، حلب، سوريا`
    : `${doctor?.branch ?? ''}، ${doctor?.area ?? ''}، حلب، سوريا`;
  const openBranchOnMap = async () => {
    setMapError(false);
    try {
      await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`);
    } catch {
      setMapError(true);
    }
  };

  if (!doctor) {
    return (
      <Screen>
        <StateView
          actionLabel="العودة للأطباء"
          onAction={() => router.replace('/discover/providers/results')}
          title="ملف الطبيب غير موجود"
        />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader title="الفرع" />
      <ScrollView contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-9 pt-3" showsVerticalScrollIndicator={false}>
        <ProviderPhotoGallery />

        <ScreenCard className="mt-2 rounded-[14px] p-[10px]">
          <View className={cn('items-center gap-2', rowClassName)}>
            <View className="min-w-0 flex-1">
              <AppText align="right" className="font-ui-bold text-content-primary" numberOfLines={2} variant="label">
                {doctor.branch} · {doctor.area}
              </AppText>
              <AppText align="right" className="mt-1 text-content-secondary" numberOfLines={2} variant="caption">
                {address}
              </AppText>
              <Pressable
                accessibilityLabel={`عرض تفاصيل الخدمة: ${service?.title ?? 'الخدمة'}`}
                accessibilityRole="button"
                className={cn('mt-2 min-h-[35px] items-center gap-1 self-end rounded-[8px] bg-tone-success-fill px-2 py-1', rowClassName)}
                onPress={() => router.push({
                  pathname: '/discover/service/[serviceCode]',
                  params: { serviceCode },
                })}
              >
                <AppText className="font-ui-semibold text-tone-success-text" variant="badge">
                  {service ? `${service.title} · تفاصيل الخدمة` : 'تفاصيل الخدمة'}
                </AppText>
                <AppIcon
                  name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                  size={13}
                  tone="success"
                />
              </Pressable>
            </View>
            <Pressable
              accessibilityLabel={`فتح خريطة فرع ${doctor.branch}`}
              accessibilityRole="button"
              className="h-[74px] w-[74px] items-center justify-center rounded-[12px] bg-action-subtle"
              onPress={() => { void openBranchOnMap(); }}
            >
              <AppIcon name={{ ios: 'map', android: 'map', web: 'map' }} size={25} tone="action" />
              <AppText align="center" className="mt-1 font-ui-semibold text-content-link" variant="badge">
                عرض الخريطة
              </AppText>
            </Pressable>
          </View>
        </ScreenCard>

        <Button
          className="mt-2 rounded-[12px]"
          endIcon={{ ios: 'map', android: 'map', web: 'map' }}
          label="عرض موقع الفرع على الخريطة"
          onPress={() => { void openBranchOnMap(); }}
          size="compact"
          variant="outline"
        />
        <AppText align="right" className="mt-1 text-content-secondary" variant="badge">
          موقع بحث حسب اسم الفرع والعنوان المتاح؛ يرجى تأكيد الموقع الدقيق مع الفرع.
        </AppText>
        {mapError ? (
          <AppText align="right" className="mt-1 text-tone-danger-text" variant="caption">
            تعذّر فتح الخريطة. جرّب مرة ثانية أو تأكد من اتصال الإنترنت.
          </AppText>
        ) : null}

        <View className={cn('mt-3 items-center gap-1', rowClassName)}>
          <AppIcon name={{ ios: 'square.grid.2x2', android: 'dataset', web: 'dataset' }} size={15} tone="action" />
          <AppText className="font-ui-semibold text-content-primary" variant="caption">
            جاهزية مرتبطة بالخدمة · بيانات منظّمة
          </AppText>
        </View>

        <View className="mt-2 gap-[7px]">
          {readiness.map((item) => (
            <ScreenCard className="rounded-[12px] px-3 py-[9px]" key={item.title}>
              <View className={cn('items-center gap-2', rowClassName)}>
                <AppIcon name={item.icon} size={18} tone="action" />
                <View className="min-w-0 flex-1">
                  <AppText align="right" className="font-ui-semibold text-content-primary" variant="label">
                    {item.title}
                  </AppText>
                  <AppText align="right" className="mt-0.5 text-content-secondary" variant="caption">
                    {item.body}
                  </AppText>
                </View>
                <View className="rounded-full bg-tone-success-fill px-2 py-1">
                  <AppText className="text-tone-success-text" variant="badge">
                    {item.status}
                  </AppText>
                </View>
              </View>
            </ScreenCard>
          ))}
        </View>

        <View className={cn('mt-2 items-center gap-2 rounded-[11px] bg-tone-warning-fill px-3 py-2.5', rowClassName)}>
          <AppIcon name={{ ios: 'info.circle', android: 'info_outline', web: 'info_outline' }} size={16} tone="warning" />
          <AppText className="min-w-0 flex-1 text-tone-warning-text" variant="caption">
            الصور للتعريف بالمكان فقط؛ الجاهزية لا تُستنتج منها.
          </AppText>
        </View>

        <View className={cn('mt-2 gap-1.5', rowClassName)}>
          <BranchFact
            icon={{ ios: 'figure.walk', android: 'accessible', web: 'accessible' }}
            label="سهولة الوصول"
            value="مصعد ومدخل"
          />
          <BranchFact
            icon={{ ios: 'phone', android: 'call', web: 'call' }}
            label="اتصال"
            ltr
            value="021-221-4488"
          />
          <BranchFact
            icon={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
            label="ساعات العمل"
            value="8:00–9:00"
          />
        </View>

        <Button
          className="mt-3"
          label="عرض مواعيد هذا الفرع"
          onPress={() => router.push({
            pathname: '/booking/slots',
            params: { providerId: doctor.id, serviceCode },
          })}
          size="sm"
          variant="primary"
        />
      </ScrollView>
    </Screen>
  );
}
