import { useRouter } from 'expo-router';
import { Button as HeroButton, Card as HeroCard } from 'heroui-native';
import { ProviderAvatar } from '@/features/discovery/components/provider-avatar';
import { DoctorClassificationChips } from '@/features/discovery/components/doctor-classification-chips';
import { useDoctorFavorites } from '@/features/discovery/state/doctor-favorites-provider';
import { Pressable, View } from 'react-native';

import {
  getMockProvider,
  getMockProviderDistanceKm,
} from '@/features/discovery/mocks/providers.mock';
import { getPenDoctorsForService } from '@/features/discovery/presentation/pen-discovery-data';
import { AppIcon, AppText } from '@/shared/components/ui';

type Doctor = ReturnType<typeof getPenDoctorsForService>[number];

export function DiscoverDoctorResultCard({
  doctor,
  serviceCode,
  patientId,
  origin,
  assessmentDraftId,
  selected,
  disabled,
  disabledReason,
  showServicePrice = true,
  showComparison = true,
  onToggle,
}: {
  doctor: Doctor;
  serviceCode: string | null;
  patientId?: string;
  origin?: string;
  assessmentDraftId?: string;
  selected: boolean;
  disabled: boolean;
  disabledReason?: string;
  showServicePrice?: boolean;
  showComparison?: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();
  const provider = getMockProvider(doctor.id);
  const { ready, isFavorite, toggleFavorite } = useDoctorFavorites();
  const favorite = isFavorite(doctor.id, serviceCode);

  return (
    <HeroCard
      variant="default"
      className="gap-3 rounded-[16px] border border-border-subtle bg-surface-default p-3.5"
    >
      <View className="flex-row-reverse items-start gap-3">
        <ProviderAvatar providerId={doctor.id} size={52} />
        <View className="min-w-0 flex-1 items-end gap-1">
          <View className="w-full flex-row-reverse flex-wrap items-center gap-x-2 gap-y-1">
            <AppText align="right" variant="body-strong" className="font-ui-bold" numberOfLines={2}>
              {doctor.name}
            </AppText>
            <AppText
              align="right"
              variant="caption"
              className="text-content-secondary"
              numberOfLines={2}
            >
              {doctor.specialty}
            </AppText>
            {provider && provider.reviews > 0 ? (
              <View className="flex-row-reverse items-center gap-1 rounded-full bg-action-subtle px-2 py-0.5">
                <AppIcon
                  name={{ ios: 'star.fill', android: 'star', web: 'star' }}
                  size={14}
                  tone="action"
                />
                <AppText variant="caption" className="font-ui-semibold">
                  {provider.rating.toFixed(1)}
                </AppText>
                <AppText variant="caption" className="text-content-secondary">
                  ({provider.reviews})
                </AppText>
              </View>
            ) : null}
          </View>

          <View className="flex-row-reverse items-center gap-1 self-stretch">
            <AppIcon
              name={{ ios: 'mappin', android: 'place', web: 'place' }}
              size={14}
              tone="secondary"
            />
            <AppText
              align="right"
              variant="caption"
              className="min-w-0 flex-1 text-content-secondary"
              numberOfLines={1}
            >
              {doctor.branch} · {doctor.area}
              {provider ? ' · ' + getMockProviderDistanceKm(provider).toFixed(1) + ' كم' : ''}
            </AppText>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={favorite ? 'إزالة الطبيب من المفضلة' : 'إضافة الطبيب للمفضلة'}
          accessibilityState={{ selected: favorite, disabled: !ready }}
          disabled={!ready}
          className={
            'h-10 w-10 items-center justify-center rounded-full ' +
            (favorite ? 'bg-action-primary' : 'bg-action-subtle')
          }
          onPress={() => toggleFavorite(doctor.id, serviceCode)}
        >
          <AppIcon
            name={
              favorite
                ? { ios: 'heart.fill', android: 'favorite', web: 'favorite' }
                : { ios: 'heart', android: 'favorite_border', web: 'favorite_border' }
            }
            size={20}
            tone={favorite ? 'onAction' : 'action'}
          />
        </Pressable>
      </View>

      {provider ? <DoctorClassificationChips provider={provider} compact /> : null}

      <View className="flex-row-reverse gap-2">
        <View className="min-w-0 flex-1 items-end gap-1 rounded-[12px] bg-surface-subtle px-3 py-2.5">
          <AppText variant="caption" className="text-content-secondary">
            {serviceCode ? 'سعر الخدمة' : 'الخدمات المتاحة'}
          </AppText>
          <AppText
            align="right"
            variant="label"
            className="w-full font-ui-semibold"
            numberOfLines={2}
          >
            {serviceCode
              ? showServicePrice
                ? doctor.price
                : 'السعر حسب الخدمة'
              : provider
                ? provider.serviceCodes.length + ' خدمات'
                : '—'}
          </AppText>
        </View>
        <View className="min-w-0 flex-1 items-end gap-1 rounded-[12px] bg-surface-subtle px-3 py-2.5">
          <AppText variant="caption" className="text-content-secondary">
            {serviceCode ? 'أقرب موعد' : 'المواعيد'}
          </AppText>
          <AppText
            align="right"
            variant="label"
            className="w-full font-ui-medium"
            numberOfLines={2}
          >
            {serviceCode ? doctor.next : 'حسب الخدمة المختارة'}
          </AppText>
        </View>
      </View>

      <View className="flex-row-reverse gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={'عرض ملف ' + doctor.name}
          className="min-h-[46px] min-w-0 flex-1 items-center justify-center rounded-[12px] bg-action-primary px-3"
          onPress={() =>
            router.push({
              pathname: '/discover/provider/[providerId]',
              params: {
                providerId: doctor.id,
                ...(serviceCode ? { serviceCode } : {}),
                ...(patientId ? { patientId } : {}),
                ...(origin === 'assessment' ? { origin, assessmentDraftId } : {}),
              },
            })
          }
        >
          <AppText
            align="center"
            variant="label"
            className="font-ui-semibold text-content-on-action"
          >
            عرض الطبيب
          </AppText>
        </Pressable>
        {showComparison ? (
          <HeroButton
            variant="outline"
            size="md"
            isDisabled={disabled}
            accessibilityLabel={
              selected
                ? 'إزالة ' + doctor.name + ' من المقارنة'
                : 'اختيار ' + doctor.name + ' للمقارنة'
            }
            accessibilityHint={
              selected ? 'اضغط لإلغاء اختيار الطبيب' : 'اضغط لإضافة الطبيب إلى قائمة المقارنة'
            }
            accessibilityState={{ selected }}
            onPress={onToggle}
            className={
              'min-h-[46px] min-w-0 flex-1 flex-row-reverse items-center justify-center gap-1.5 rounded-[12px] border px-2 ' +
              (selected
                ? 'border-state-selected-border bg-action-subtle'
                : 'border-border-subtle bg-surface-default')
            }
          >
            <AppIcon
              name={
                selected
                  ? { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }
                  : { ios: 'plus.circle', android: 'add_circle_outline', web: 'add_circle_outline' }
              }
              size={18}
              tone={selected ? 'action' : 'secondary'}
            />
            <HeroButton.Label
              className={
                selected
                  ? 'font-ui-semibold text-content-link'
                  : 'font-ui-medium text-content-primary'
              }
              numberOfLines={1}
            >
              {selected
                ? 'تم الاختيار'
                : disabled
                  ? (disabledReason ?? 'اكتمل العدد')
                  : 'أضف للمقارنة'}
            </HeroButton.Label>
          </HeroButton>
        ) : null}
      </View>
    </HeroCard>
  );
}
