import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, View } from 'react-native';

import { ProviderAvatar } from '@/features/discovery/components/provider-avatar';
import { DoctorClassificationDetails } from '@/features/discovery/components/doctor-classification-details';
import { DEMO_CLINIC_PHOTOS } from '@/features/discovery/components/provider-photo-gallery';
import { DiscoveryHeader, ScreenCard } from '@/features/discovery/components/pen-discovery-ui';
import {
  getMockProvider,
  getMockProviderPriceFact,
} from '@/features/discovery/mocks/providers.mock';
import { getProviderServiceLabels } from '@/features/discovery/model/provider-branch-view';
import {
  findPenFamily,
  getPenDoctorsForService,
  penReviews,
} from '@/features/discovery/presentation/pen-discovery-data';
import { AppIcon, AppText, Button, Screen, StateView } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';

function ProfileFact({ icon, label, value }: { icon: AppIconName; label: string; value: string }) {
  return (
    <View className="min-h-[74px] min-w-0 flex-1 items-center justify-center gap-1 rounded-[12px] border border-border-subtle bg-surface-default px-2 py-2.5">
      <AppIcon name={icon} size={19} tone="action" />
      <AppText align="center" variant="caption" className="font-ui-semibold" numberOfLines={2}>
        {value}
      </AppText>
      <AppText
        align="center"
        variant="caption"
        className="text-content-secondary"
        numberOfLines={1}
      >
        {label}
      </AppText>
    </View>
  );
}

function ProfileSectionTitle({
  title,
  linkLabel,
  onPress,
}: {
  title: string;
  linkLabel?: string;
  onPress?: () => void;
}) {
  return (
    <View className="flex-row-reverse items-center justify-between gap-3">
      <AppText align="right" variant="heading-4" className="min-w-0 flex-1 font-ui-bold">
        {title}
      </AppText>
      {linkLabel && onPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={linkLabel}
          className="min-h-[36px] flex-row-reverse items-center gap-1 px-1"
          onPress={onPress}
        >
          <AppText variant="caption" className="font-ui-semibold text-content-link">
            {linkLabel}
          </AppText>
          <AppIcon
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            tone="action"
            size={14}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

export function ProviderDecisionScreen() {
  const router = useRouter();
  const {
    providerId = 'provider-layan',
    serviceCode = 'root-canal',
    patientId,
    origin,
    assessmentDraftId,
  } = useLocalSearchParams<{
    providerId?: string;
    serviceCode?: string;
    patientId?: string;
    origin?: string;
    assessmentDraftId?: string;
  }>();
  const doctor = getPenDoctorsForService(serviceCode).find((item) => item.id === providerId);
  const provider = getMockProvider(providerId);
  const priceFact = provider ? getMockProviderPriceFact(provider, serviceCode) : undefined;
  const service = findPenFamily(serviceCode);
  const relatedReviews = penReviews.filter(
    (review) => review.providerId === providerId && review.serviceCode === serviceCode,
  );
  const services = provider ? getProviderServiceLabels(provider) : [];

  if (!doctor || !provider) {
    return (
      <Screen>
        <StateView
          actionLabel="العودة للأطباء"
          onAction={() =>
            router.replace({ pathname: '/discover/providers/results', params: { serviceCode } })
          }
          title="ملف الطبيب غير موجود"
        />
      </Screen>
    );
  }

  const openReviews = () =>
    router.push({
      pathname: '/discover/provider/[providerId]/reviews',
      params: { providerId: doctor.id, serviceCode },
    });
  const openBranch = () =>
    router.push({
      pathname: '/discover/provider/[providerId]/branch',
      params: {
        providerId: doctor.id,
        serviceCode,
        fromProfile: '1',
        ...(patientId ? { patientId } : {}),
        ...(origin === 'assessment' ? { origin, assessmentDraftId } : {}),
      },
    });
  const book = () =>
    router.push({
      pathname: '/booking/slots',
      params: {
        providerId: doctor.id,
        serviceCode,
        ...(patientId ? { patientId } : {}),
        ...(origin === 'assessment' ? { origin, assessmentDraftId } : {}),
      },
    });

  return (
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader
        title="ملف الطبيب"
        showShareAction
        shareMessage={`ملف الطبيب: ${doctor.name} · ${doctor.specialty} · ${doctor.branch}`}
      />
      <View className="min-h-0 flex-1">
        <ScrollView
          className="min-h-0 flex-1"
          contentContainerClassName="mx-auto w-full max-w-[430px] gap-4 px-4 pb-6 pt-3"
          showsVerticalScrollIndicator={false}
        >
          <ScreenCard className="gap-3 rounded-[17px] p-3.5">
            <View className="flex-row-reverse items-center gap-3">
              <ProviderAvatar providerId={doctor.id} size={80} />
              <View className="min-w-0 flex-1 items-end gap-1">
                <AppText
                  align="right"
                  variant="heading-3"
                  className="w-full font-ui-bold"
                  numberOfLines={2}
                >
                  {doctor.name}
                </AppText>
                <AppText
                  align="right"
                  variant="label"
                  className="w-full text-content-link"
                  numberOfLines={2}
                >
                  {doctor.specialty}
                </AppText>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="قراءة تقييمات الطبيب"
                  onPress={openReviews}
                  className="min-h-[31px] flex-row-reverse items-center gap-1"
                >
                  <AppIcon
                    name={{ ios: 'star.fill', android: 'star', web: 'star' }}
                    size={16}
                    tone="action"
                  />
                  <AppText variant="label" className="font-ui-semibold">
                    {provider.rating.toFixed(1)}
                  </AppText>
                  <AppText variant="caption" className="text-content-secondary">
                    ({provider.reviews} تقييم)
                  </AppText>
                </Pressable>
                <AppText
                  align="right"
                  variant="caption"
                  className="w-full text-content-secondary"
                  numberOfLines={2}
                >
                  {doctor.branch} · {doctor.area}
                </AppText>
              </View>
            </View>
            <View className="flex-row-reverse items-center gap-1.5 rounded-[10px] bg-surface-subtle px-3 py-2">
              <AppIcon
                name={{ ios: 'info.circle', android: 'info', web: 'info' }}
                tone="secondary"
                size={15}
              />
              <AppText
                align="right"
                variant="caption"
                className="min-w-0 flex-1 text-content-secondary"
              >
                راجع معلومات الطبيب والفرع والخدمة قبل اختيار الموعد.
              </AppText>
            </View>
          </ScreenCard>

          <View className="gap-2 rounded-[16px] border border-action-primary/25 bg-action-subtle p-3">
            <View className="flex-row-reverse items-center gap-2">
              <View className="h-10 w-10 items-center justify-center rounded-[10px] bg-surface-default">
                <AppIcon
                  name={{
                    ios: 'cross.case.fill',
                    android: 'medical_services',
                    web: 'medical_services',
                  }}
                  tone="action"
                  size={20}
                />
              </View>
              <View className="min-w-0 flex-1 items-end gap-0.5">
                <AppText align="right" variant="caption" className="text-content-secondary">
                  الخدمة المختارة
                </AppText>
                <AppText align="right" variant="heading-4" className="font-ui-bold">
                  {service?.title ?? 'الخدمة المطلوبة'}
                </AppText>
              </View>
            </View>
            {service?.description ? (
              <AppText align="right" variant="caption" className="text-content-secondary">
                {service.description}
              </AppText>
            ) : null}
            <View className="flex-row-reverse gap-2">
              <View className="min-w-0 flex-1 items-end gap-1 rounded-[11px] bg-surface-default px-3 py-2.5">
                <AppText variant="caption" className="text-content-secondary">
                  سعر الخدمة
                </AppText>
                <AppText variant="label" className="font-ui-bold" numberOfLines={2}>
                  {doctor.price}
                </AppText>
                <AppText variant="caption" className="text-content-secondary">
                  {priceFact?.mode === 'range'
                    ? 'نطاق توضيحي'
                    : priceFact?.mode === 'requires-plan'
                      ? 'بعد الفحص'
                      : 'بحاجة للتحقق'}
                </AppText>
              </View>
              <View className="min-w-0 flex-1 items-end gap-1 rounded-[11px] bg-surface-default px-3 py-2.5">
                <AppText variant="caption" className="text-content-secondary">
                  أقرب موعد
                </AppText>
                <AppText
                  align="right"
                  variant="label"
                  className="font-ui-semibold"
                  numberOfLines={2}
                >
                  {doctor.next}
                </AppText>
                <AppText variant="caption" className="text-content-secondary">
                  بانتظار التأكيد
                </AppText>
              </View>
            </View>
            {priceFact?.includesSummary ? (
              <AppText align="right" variant="caption" className="text-content-secondary">
                {priceFact.includesSummary}
              </AppText>
            ) : null}
          </View>

          <DoctorClassificationDetails provider={provider} serviceCode={serviceCode} />

          <View className="gap-2">
            <ProfileSectionTitle title="عن الطبيب" />
            <View className="flex-row-reverse gap-2">
              <ProfileFact
                icon={{ ios: 'briefcase', android: 'work_outline', web: 'work_outline' }}
                label="الخبرة"
                value={doctor.experience}
              />
              <ProfileFact
                icon={{ ios: 'star', android: 'star_outline', web: 'star_outline' }}
                label="التقييم"
                value={provider.rating.toFixed(1) + ' / 5'}
              />
              <ProfileFact
                icon={{ ios: 'building.2', android: 'apartment', web: 'apartment' }}
                label="الفرع"
                value={doctor.area}
              />
            </View>
            <AppText align="right" variant="label" className="text-content-secondary">
              {doctor.name} · {doctor.specialty}. يقدم خدماته في {doctor.branch} بمنطقة{' '}
              {doctor.area}. التفاصيل الأكاديمية والشهادات لا تظهر قبل توثيقها.
            </AppText>
          </View>

          <View className="gap-2">
            <ProfileSectionTitle
              title="تقييمات المرضى"
              linkLabel="عرض الكل"
              onPress={openReviews}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="قراءة جميع تقييمات الطبيب"
              onPress={openReviews}
              className="gap-2 rounded-[15px] border border-border-subtle bg-surface-default p-3"
            >
              <View className="flex-row-reverse items-center gap-1.5">
                <AppIcon
                  name={{ ios: 'star.fill', android: 'star', web: 'star' }}
                  tone="action"
                  size={20}
                />
                <AppText variant="heading-4" className="font-ui-bold">
                  {provider.rating.toFixed(1)} / 5
                </AppText>
                <AppText variant="caption" className="text-content-secondary">
                  · {provider.reviews} تقييم
                </AppText>
              </View>
              {relatedReviews.length ? (
                <AppText
                  align="right"
                  variant="label"
                  className="text-content-secondary"
                  numberOfLines={3}
                >
                  {relatedReviews[0]!.body}
                </AppText>
              ) : (
                <AppText align="right" variant="caption" className="text-content-secondary">
                  افتح صفحة التقييمات لعرض المراجعات المتاحة لهذا الطبيب.
                </AppText>
              )}
              <AppText align="right" variant="caption" className="text-content-secondary">
                كتابة تقييم جديد متاحة من «علاجي» بعد اكتمال حالة مؤهلة فقط.
              </AppText>
            </Pressable>
          </View>

          <View className="gap-2">
            <ProfileSectionTitle title="الخدمات التي يقدمها" />
            <ScreenCard className="rounded-[15px] px-3 py-1">
              {services.map((label, index) => (
                <View
                  key={label}
                  className={
                    'min-h-[47px] flex-row-reverse items-center gap-2 py-2 ' +
                    (index > 0 ? 'border-t border-border-subtle' : '')
                  }
                >
                  <AppIcon
                    name={{
                      ios: 'checkmark.circle',
                      android: 'check_circle_outline',
                      web: 'check_circle_outline',
                    }}
                    tone="action"
                    size={17}
                  />
                  <AppText align="right" variant="label" className="min-w-0 flex-1">
                    {label}
                  </AppText>
                </View>
              ))}
            </ScreenCard>
          </View>

          <View className="gap-2">
            <ProfileSectionTitle
              title="العيادة التي يعمل فيها"
              linkLabel="تفاصيل الفرع"
              onPress={openBranch}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`فتح ملف ${doctor.branch}`}
              onPress={openBranch}
              className="flex-row-reverse items-center gap-3 rounded-[15px] border border-border-subtle bg-surface-default p-3"
            >
              <Image
                source={{ uri: DEMO_CLINIC_PHOTOS[0] }}
                className="h-[78px] w-[87px] rounded-[11px] bg-surface-subtle"
                resizeMode="cover"
                accessibilityLabel="صورة توضيحية لعيادة، ليست صورة الفرع الفعلية"
              />
              <View className="min-w-0 flex-1 items-end gap-1">
                <AppText
                  align="right"
                  variant="label"
                  className="w-full font-ui-bold"
                  numberOfLines={2}
                >
                  {doctor.branch}
                </AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">
                  {doctor.area} · حلب
                </AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">
                  صور توضيحية · الموقع والخدمات
                </AppText>
              </View>
              <AppIcon
                name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                tone="secondary"
                size={17}
              />
            </Pressable>
          </View>
        </ScrollView>
        <View className="border-t border-border-subtle bg-surface-default px-4 pb-3 pt-3">
          <View className="mx-auto w-full max-w-[398px]">
            <Button
              className="min-h-[50px] rounded-[12px]"
              label="اختر موعداً"
              endIcon={{ ios: 'calendar', android: 'event', web: 'event' }}
              onPress={book}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </Screen>
  );
}
