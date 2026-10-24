import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';

import { ProviderAvatar } from '@/features/discovery/components/provider-avatar';
import {
  ProviderBranchEquipment,
  ProviderBranchServices,
} from '@/features/discovery/components/provider-branch-services';
import { ProviderPhotoGallery } from '@/features/discovery/components/provider-photo-gallery';
import { DiscoveryHeader, ScreenCard } from '@/features/discovery/components/pen-discovery-ui';
import { getBranchView } from '@/features/discovery/model/provider-branch-view';
import { getMockProvider } from '@/features/discovery/mocks/providers.mock';
import { getPenDoctorsForService } from '@/features/discovery/presentation/pen-discovery-data';
import { AppIcon, AppText, Button, Screen, StateView } from '@/shared/components/ui';

export function ProviderBranchScreen() {
  const router = useRouter();
  const [mapError, setMapError] = useState(false);
  const {
    providerId,
    serviceCode: requestedServiceCode,
    patientId,
    origin,
    assessmentDraftId,
  } = useLocalSearchParams<{
    providerId?: string;
    serviceCode?: string;
    fromProfile?: string;
    patientId?: string;
    origin?: string;
    assessmentDraftId?: string;
  }>();

  const branch = getBranchView(providerId ?? '');
  const provider = getMockProvider(providerId);
  const serviceCode =
    requestedServiceCode && provider?.serviceCodes.includes(requestedServiceCode)
      ? requestedServiceCode
      : null;
  const doctor = getPenDoctorsForService(serviceCode ?? provider?.serviceCodes[0] ?? '').find(
    (item) => item.id === providerId,
  );

  // We only know branch names and areas from the fixtures; never invent precise coordinates.
  const openBranchOnMap = async () => {
    if (!branch) return;
    setMapError(false);
    try {
      const query = [branch.name, branch.area, 'حلب', 'سوريا'].join('، ');
      await Linking.openURL(
        'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query),
      );
    } catch {
      setMapError(true);
    }
  };

  if (!branch || !doctor) {
    return (
      <Screen>
        <StateView
          actionLabel="العودة للأطباء"
          onAction={() =>
            serviceCode
              ? router.replace({ pathname: '/discover/providers/results', params: { serviceCode } })
              : router.replace('/discover/search')
          }
          title="الفرع غير موجود"
        />
      </Screen>
    );
  }

  const openDoctor = (id: string, fallbackService: string | null) => {
    router.push({
      pathname: '/discover/provider/[providerId]',
      params: {
        providerId: id,
        ...(fallbackService ? { serviceCode: fallbackService } : {}),
        ...(patientId ? { patientId } : {}),
        ...(origin === 'assessment' ? { origin, assessmentDraftId } : {}),
      },
    });
  };
  const selectedDoctorName = doctor.name;

  return (
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader
        title="ملف الفرع"
        showShareAction
        shareMessage={`ملف الفرع: ${branch.name} · ${branch.area}، حلب`}
      />
      <View className="min-h-0 flex-1">
        <ScrollView
          className="min-h-0 flex-1"
          contentContainerClassName="mx-auto w-full max-w-[430px] gap-4 px-4 pb-6 pt-3"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-2">
            <ProviderPhotoGallery />
            <View className="gap-1">
              <AppText align="right" variant="heading-3" className="font-ui-bold">
                {branch.name}
              </AppText>
              <View className="flex-row-reverse items-center gap-1.5">
                <AppIcon
                  name={{ ios: 'mappin', android: 'place', web: 'place' }}
                  tone="secondary"
                  size={16}
                />
                <AppText variant="label" className="text-content-secondary">
                  {branch.area} · حلب
                </AppText>
              </View>
              <AppText align="right" variant="caption" className="text-content-secondary">
                {branch.singleListedDoctor
                  ? 'طبيب واحد مسجّل بهذا الفرع ضمن البيانات الحالية'
                  : `${branch.doctors.length} أطباء مسجلون في هذا الفرع`}
              </AppText>
            </View>
          </View>

          <View className="flex-row-reverse gap-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`عرض ${branch.name} على الخريطة`}
              className="min-h-[59px] min-w-0 flex-1 items-center justify-center gap-1 rounded-[12px] border border-border-subtle bg-surface-default px-2"
              onPress={() => void openBranchOnMap()}
            >
              <AppIcon name={{ ios: 'map', android: 'map', web: 'map' }} tone="action" size={20} />
              <AppText variant="caption" className="font-ui-semibold">
                الموقع
              </AppText>
            </Pressable>
            <View className="min-h-[59px] min-w-0 flex-1 items-center justify-center gap-1 rounded-[12px] border border-border-subtle bg-surface-default px-2">
              <AppIcon
                name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
                tone="secondary"
                size={20}
              />
              <AppText variant="caption" className="text-content-secondary">
                الدوام غير متاح
              </AppText>
            </View>
            <View className="min-h-[59px] min-w-0 flex-1 items-center justify-center gap-1 rounded-[12px] border border-border-subtle bg-surface-default px-2">
              <AppIcon
                name={{ ios: 'phone', android: 'call', web: 'call' }}
                tone="secondary"
                size={20}
              />
              <AppText variant="caption" className="text-content-secondary">
                الرقم غير متاح
              </AppText>
            </View>
          </View>

          <View className="gap-2">
            <AppText align="right" variant="heading-4" className="font-ui-bold">
              عن الفرع
            </AppText>
            <AppText align="right" variant="label" className="text-content-secondary">
              {branch.name} في منطقة {branch.area}. يمكنك استعراض الخدمات والأطباء المسجلين ضمن
              بيانات النموذج، وتأكيد تفاصيل المكان والتجهيزات عند التواصل مع الفرع.
            </AppText>
          </View>

          <View className="gap-2 rounded-[13px] bg-surface-subtle p-3">
            <View className="flex-row-reverse items-start gap-2">
              <AppIcon
                name={{ ios: 'info.circle', android: 'info_outline', web: 'info_outline' }}
                size={17}
                tone="secondary"
              />
              <View className="min-w-0 flex-1 gap-1">
                <AppText align="right" variant="label" className="font-ui-semibold">
                  حالة بيانات الفرع
                </AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">
                  تاريخ آخر تحقق معتمد: غير متاح. الصور والتجهيزات الظاهرة أمثلة وليست توثيقاً لفرع
                  فعلي.
                </AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">
                  تعليمات الوصول وتجهيزات الإتاحة وساعات الدوام الموثقة بانتظار بيانات العيادة.
                </AppText>
                {serviceCode ? (
                  <AppText align="right" variant="caption" className="text-content-secondary">
                    توفر الخدمة في هذا الفرع معروض للتجربة فقط؛ يُعاد التحقق من أهلية الفرع عند
                    الحجز.
                  </AppText>
                ) : null}
              </View>
            </View>
          </View>

          <ProviderBranchServices branch={branch} />
          {serviceCode ? <ProviderBranchEquipment serviceCode={serviceCode} /> : null}

          <View className="gap-2">
            <AppText align="right" variant="heading-4" className="font-ui-bold">
              {branch.singleListedDoctor ? 'الطبيب في هذا الفرع' : 'الأطباء في هذا الفرع'}
            </AppText>
            {branch.singleListedDoctor ? (
              <ScreenCard className="gap-2 rounded-[15px] p-3">
                <View className="flex-row-reverse items-center gap-3">
                  <ProviderAvatar providerId={branch.doctors[0]!.id} size={56} />
                  <View className="min-w-0 flex-1 items-end gap-1">
                    <AppText align="right" variant="label" className="w-full font-ui-bold">
                      {branch.doctors[0]!.name}
                    </AppText>
                    <AppText
                      align="right"
                      variant="caption"
                      className="w-full text-content-secondary"
                    >
                      {branch.doctors[0]!.specialty}
                    </AppText>
                    <AppText
                      align="right"
                      variant="caption"
                      className="w-full text-content-secondary"
                    >
                      الطبيب المدرج في هذا الفرع
                    </AppText>
                  </View>
                </View>
              </ScreenCard>
            ) : (
              <View className="gap-2">
                {branch.doctors.map((item) => {
                  const itemService =
                    serviceCode && item.serviceCodes.includes(serviceCode) ? serviceCode : null;
                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`عرض ملف ${item.name}`}
                      onPress={() => openDoctor(item.id, itemService)}
                      key={item.id}
                      className="min-h-[83px] flex-row-reverse items-center gap-3 rounded-[14px] border border-border-subtle bg-surface-default p-3"
                    >
                      <ProviderAvatar providerId={item.id} size={55} />
                      <View className="min-w-0 flex-1 items-end gap-1">
                        <AppText align="right" variant="label" className="w-full font-ui-bold">
                          {item.name}
                        </AppText>
                        <AppText
                          align="right"
                          variant="caption"
                          className="w-full text-content-secondary"
                        >
                          {item.specialty}
                        </AppText>
                      </View>
                      <AppIcon
                        name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                        tone="secondary"
                        size={17}
                      />
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          <View className="gap-2">
            <AppText align="right" variant="heading-4" className="font-ui-bold">
              الموقع والعنوان
            </AppText>
            <ScreenCard className="gap-2 rounded-[15px] p-3">
              <View className="flex-row-reverse items-start gap-2">
                <View className="h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-action-subtle">
                  <AppIcon
                    name={{ ios: 'mappin.and.ellipse', android: 'place', web: 'place' }}
                    tone="action"
                    size={21}
                  />
                </View>
                <View className="min-w-0 flex-1 items-end gap-1">
                  <AppText align="right" variant="label" className="font-ui-semibold">
                    {branch.area} · حلب
                  </AppText>
                  <AppText align="right" variant="caption" className="text-content-secondary">
                    العنوان التفصيلي والإحداثيات غير متوفرة حالياً.
                  </AppText>
                </View>
              </View>
              <Button
                label="البحث عن الفرع على الخريطة"
                variant="outline"
                size="compact"
                onPress={() => void openBranchOnMap()}
              />
              <AppText align="right" variant="caption" className="text-content-secondary">
                تُفتح نتائج بحث حسب اسم الفرع والمنطقة، وليس دبوس موقع مؤكد.
              </AppText>
              {mapError ? (
                <AppText align="right" variant="caption" className="text-tone-danger-text">
                  تعذّر فتح الخريطة، تأكد من الاتصال وجرّب مرة ثانية.
                </AppText>
              ) : null}
            </ScreenCard>
          </View>
        </ScrollView>

        <View className="border-t border-border-subtle bg-surface-default px-4 pb-3 pt-3">
          <View className="mx-auto w-full max-w-[398px] gap-1">
            <Button
              label={serviceCode ? `احجز مع ${selectedDoctorName}` : 'اختر خدمة للحجز'}
              endIcon={{ ios: 'calendar', android: 'event', web: 'event' }}
              className="min-h-[50px] rounded-[12px]"
              onPress={() =>
                router.push({
                  pathname: serviceCode ? '/booking/slots' : '/discover/provider/[providerId]',
                  params: {
                    providerId: doctor.id,
                    ...(serviceCode ? { serviceCode } : {}),
                    ...(patientId ? { patientId } : {}),
                    ...(origin === 'assessment' ? { origin, assessmentDraftId } : {}),
                  },
                })
              }
              variant="primary"
            />
            {!branch.singleListedDoctor ? (
              <AppText align="center" variant="caption" className="text-content-secondary">
                الحجز مع الطبيب المختار، وليس مع جميع أطباء الفرع.
              </AppText>
            ) : null}
          </View>
        </View>
      </View>
    </Screen>
  );
}
