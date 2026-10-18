import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { ProviderPhotoGallery, ProviderPortrait } from '@/features/discovery/components/provider-photo-gallery';
import { useAppDirection } from '@/providers/app-direction-provider';
import { cn } from '@/shared/utils/cn';

import { DiscoveryHeader, ScreenCard } from '@/features/discovery/components/pen-discovery-ui';
import { getPenDoctorsForService } from '@/features/discovery/presentation/pen-discovery-data';
import { AppIcon, AppText, Button, Screen, StateView } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';


/** Compact, equal-height facts are deliberate: do not reuse full-size summary cards here. */
function CaseFact({ label, value }: { label: string; value: string }) {
  return (
    <View className="min-w-0 flex-1 items-center justify-center rounded-[8px] bg-surface-default px-1 py-[5px]">
      <AppText align="center" className="text-content-primary" numberOfLines={2} style={{ fontSize: 10, lineHeight: 15 }} variant="caption">
        {label} {value}
      </AppText>
    </View>
  );
}

function DoctorStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: AppIconName;
}) {
  return (
    <View className="min-w-0 flex-1 items-center justify-center rounded-[12px] border border-border-subtle bg-surface-default px-1 py-2">
      <AppIcon name={icon} size={15} tone="action" />
      <AppText
        align="center"
        className="mt-0.5 font-ui-semibold text-content-primary"
        numberOfLines={2}
        style={{ fontSize: 11, lineHeight: 17 }}
        variant="caption"
      >
        {value}
      </AppText>
      <AppText align="center" className="text-content-secondary" numberOfLines={1} style={{ fontSize: 9, lineHeight: 14 }} variant="caption">
        {label}
      </AppText>
    </View>
  );
}

export function ProviderDecisionScreen() {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { providerId = 'provider-layan', serviceCode = 'root-canal' } = useLocalSearchParams<{
    providerId?: string;
    serviceCode?: string;
  }>();
  const doctor = getPenDoctorsForService(serviceCode).find((item) => item.id === providerId);

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
      <DiscoveryHeader
        shareMessage={`ملف الطبيب: ${doctor.name} · ${doctor.specialty} · ${doctor.branch}`}
        showShareAction
        title="ملف الطبيب"
      />

      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <ScreenCard className="mt-2 rounded-[14px] p-3">
          <View className={cn('items-center gap-3', rowClassName)}>
            <ProviderPortrait size={72} uri={doctor.imageUrl} />
            <View className="min-w-0 flex-1 items-end">
              <AppText
                align="right"
                className="w-full font-ui-bold text-content-primary"
                numberOfLines={1}
                variant="heading-4"
              >
                {doctor.name}
              </AppText>
              <AppText
                align="right"
                className="mt-0.5 w-full text-content-link"
                numberOfLines={1}
                variant="caption"
              >
                {doctor.specialty}
              </AppText>
              <AppText
                align="right"
                className="mt-0.5 w-full text-content-secondary"
                numberOfLines={2}
                variant="caption"
              >
                {doctor.branch} · {doctor.area}
              </AppText>
            </View>
          </View>
          <View className="mt-1.5 self-start flex-row items-center gap-1 rounded-full bg-tone-success-fill px-2 py-1">
            <AppText className="text-tone-success-text" variant="badge">
              معلومات مهنية موثقة
            </AppText>
            <AppIcon
              name={{ ios: 'checkmark.shield.fill', android: 'verified_user', web: 'verified_user' }}
              size={12}
              tone="success"
            />
          </View>
        </ScreenCard>

        <View className="mt-2 rounded-[14px] border border-action-primary/20 bg-action-subtle p-[10px]">
          <View className={cn('items-center gap-1', rowClassName)}>
            <AppIcon
              name={{ ios: 'cross.case.fill', android: 'dentistry', web: 'dentistry' }}
              size={15}
              tone="action"
            />
            <AppText className="font-ui-semibold text-content-link" variant="label">
              لهذه الحالة
            </AppText>
          </View>
          <AppText className="mt-1 text-content-primary" numberOfLines={2} variant="caption">
            علاج الجذور · فرع يوفّر تصويراً موضعياً وتجهيزات القنوات
          </AppText>
          <View className={cn('mt-2 gap-1.5', rowClassName)}>
            <CaseFact label="الأهلية:" value="مؤهل عملياً" />
            <CaseFact label="السعر:" value={doctor.price} />
            <CaseFact label="موعد:" value={doctor.next} />
          </View>
        </View>

        <ScreenCard className="mt-2 rounded-[14px] p-[10px]">
          <AppText className="mb-2 font-ui-semibold text-content-primary" variant="label">
            جولة سريعة داخل الفرع
          </AppText>
          <ProviderPhotoGallery compact />
        </ScreenCard>

        <View className={cn('mt-2 gap-2', rowClassName)}>
          <DoctorStat
            icon={{ ios: 'character.bubble', android: 'translate', web: 'translate' }}
            label="لغة التواصل"
            value="العربية"
          />
          <DoctorStat
            icon={{ ios: 'checkmark.seal', android: 'workspace_premium', web: 'workspace_premium' }}
            label="خبرة مهنية"
            value={doctor.experience}
          />
          <DoctorStat
            icon={{ ios: 'star', android: 'star_outline', web: 'star_outline' }}
            label="تقييمات موثقة"
            value={doctor.rating}
          />
        </View>

        <ScreenCard className="mt-2 rounded-[13px] p-3">
          <AppText className="font-ui-semibold text-content-primary" variant="label">
            بيانات مهنية وخدمية
          </AppText>
          <AppText className="mt-1 text-content-secondary" variant="caption">
            اختصاص موثّق · علاج جذور للبالغين · يعمل في فرعين · قبول الحالات المحالة
          </AppText>
        </ScreenCard>

        <View className="mt-3 px-1">
          <AppText className="font-ui-semibold text-content-primary" variant="label">
            النبذة المهنية
          </AppText>
          <AppText className="mt-1 text-content-secondary" variant="caption">
            تركّز على شرح الخيارات قبل بدء الإجراء ومتابعة استجابة السن بعد العلاج.
          </AppText>
        </View>

        <View className={cn('mt-3 gap-2', rowClassName)}>
          <Button
            className="min-w-0 flex-1"
            label="الخدمات والأسعار"
            onPress={() =>
              router.push({
                pathname: '/discover/service/[serviceCode]',
                params: { serviceCode },
              })
            }
            size="compact"
            variant="outline"
          />
          <Button
            className="min-w-0 flex-1"
            label={`قراءة ${doctor.reviews} تقييماً`}
            onPress={() =>
              router.push({
                pathname: '/discover/provider/[providerId]/reviews',
                params: { providerId: doctor.id, serviceCode },
              })
            }
            size="compact"
            variant="outline"
          />
        </View>

        <Button
          className="mt-2"
          endIcon={{ ios: 'building.2.fill', android: 'apartment', web: 'apartment' }}
          label="تفاصيل الفرع"
          onPress={() =>
            router.push({
              pathname: '/discover/provider/[providerId]/branch',
              params: { providerId: doctor.id, serviceCode },
            })
          }
          size="compact"
          variant="outline"
        />
        <Button
          className="mt-4"
          label="اختر موعداً"
          onPress={() =>
            router.push({
              pathname: '/booking/slots',
              params: { providerId: doctor.id, serviceCode },
            })
          }
          size="sm"
          variant="primary"
        />
      </ScrollView>
    </Screen>
  );
}
