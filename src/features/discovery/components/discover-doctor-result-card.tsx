import { useRouter } from 'expo-router';
import { Card as HeroCard } from 'heroui-native';
import { Pressable, View } from 'react-native';

import { getMockProvider } from '@/features/discovery/mocks/providers.mock';
import { getPenDoctorsForService } from '@/features/discovery/presentation/pen-discovery-data';
import { AppIcon, AppText } from '@/shared/components/ui';

type Doctor = ReturnType<typeof getPenDoctorsForService>[number];

export function DiscoverDoctorResultCard({
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
  const provider = getMockProvider(doctor.id);

  return (
    <HeroCard
      variant="default"
      className="gap-3 rounded-[16px] border border-border-subtle bg-surface-default p-3.5"
    >
      <View className="flex-row-reverse items-start gap-3">
        <View className="h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-action-subtle">
          <AppText align="center" variant="body-strong" className="font-ui-bold text-content-link">
            {provider?.initials ?? 'د'}
          </AppText>
        </View>
        <View className="min-w-0 flex-1 items-end gap-1">
          <AppText
            align="right"
            variant="body-strong"
            className="w-full font-ui-bold"
            numberOfLines={2}
          >
            {doctor.name}
          </AppText>
          <AppText
            align="right"
            variant="label"
            className="w-full text-content-secondary"
            numberOfLines={2}
          >
            {doctor.specialty}
          </AppText>
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
            </AppText>
          </View>
        </View>
      </View>

      {provider && provider.reviews > 0 ? (
        <View className="flex-row-reverse items-center gap-1.5">
          <AppIcon
            name={{ ios: 'star.fill', android: 'star', web: 'star' }}
            size={16}
            tone="action"
          />
          <AppText align="right" variant="label" className="font-ui-semibold">
            {provider.rating.toFixed(1)}
          </AppText>
          <AppText align="right" variant="caption" className="text-content-secondary">
            ({provider.reviews} تقييم)
          </AppText>
        </View>
      ) : null}

      <View className="flex-row-reverse gap-2">
        <View className="min-w-0 flex-1 items-end gap-1 rounded-[12px] bg-surface-subtle px-3 py-2.5">
          <AppText variant="caption" className="text-content-secondary">
            سعر الخدمة
          </AppText>
          <AppText
            align="right"
            variant="label"
            className="w-full font-ui-semibold"
            numberOfLines={2}
          >
            {doctor.price}
          </AppText>
        </View>
        <View className="min-w-0 flex-1 items-end gap-1 rounded-[12px] bg-surface-subtle px-3 py-2.5">
          <AppText variant="caption" className="text-content-secondary">
            موعد تجريبي · غير مؤكّد
          </AppText>
          <AppText
            align="right"
            variant="label"
            className="w-full font-ui-medium"
            numberOfLines={2}
          >
            {doctor.next}
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
              params: { providerId: doctor.id, serviceCode },
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
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel={selected ? 'إزالة من المقارنة' : 'إضافة للمقارنة'}
          accessibilityState={{ checked: selected, disabled }}
          className={
            'min-h-[46px] flex-row-reverse items-center justify-center gap-2 rounded-[12px] border px-3 ' +
            (selected
              ? 'border-action-primary bg-action-subtle'
              : 'border-border-subtle bg-surface-default')
          }
          disabled={disabled}
          onPress={onToggle}
        >
          <AppIcon
            name={
              selected
                ? { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }
                : { ios: 'square.on.square', android: 'compare_arrows', web: 'compare_arrows' }
            }
            size={18}
            tone="action"
          />
          <AppText variant="label" className="font-ui-medium">
            {selected ? 'تمت الإضافة' : 'مقارنة'}
          </AppText>
        </Pressable>
      </View>
    </HeroCard>
  );
}
