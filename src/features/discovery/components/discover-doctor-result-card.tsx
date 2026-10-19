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
      <View className="flex-row-reverse items-center gap-3">
        <View className="h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-action-subtle">
          <AppText align="center" className="font-ui-bold text-content-link" variant="label">
            {provider?.initials ?? 'د'}
          </AppText>
        </View>
        <View className="min-w-0 flex-1 items-end gap-1">
          <AppText align="right" variant="body-strong" className="font-ui-bold" numberOfLines={1}>
            {doctor.name}
          </AppText>
          <AppText align="right" variant="caption" numberOfLines={1}>
            {doctor.specialty}
          </AppText>
          <AppText align="right" variant="caption" numberOfLines={1}>
            {doctor.branch} · {doctor.area}
          </AppText>
        </View>
        <View className="flex-row items-center gap-1 rounded-full bg-action-subtle px-2 py-1">
          <AppIcon
            name={{ ios: 'star.fill', android: 'star', web: 'star' }}
            size={15}
            tone="action"
          />
          <AppText variant="caption">{provider?.rating ?? '—'}</AppText>
        </View>
      </View>

      <View className="flex-row-reverse gap-2">
        <View className="min-w-0 flex-1 items-end gap-1 rounded-[11px] bg-surface-subtle px-3 py-2">
          <AppText variant="caption" className="text-content-secondary">
            سعر الخدمة
          </AppText>
          <AppText align="right" variant="label" className="font-ui-semibold" numberOfLines={2}>
            {doctor.price}
          </AppText>
        </View>
        <View className="min-w-0 flex-1 items-end gap-1 rounded-[11px] bg-surface-subtle px-3 py-2">
          <AppText variant="caption" className="text-content-secondary">
            التوافر التجريبي
          </AppText>
          <AppText align="right" variant="caption" numberOfLines={2}>
            {doctor.next}
          </AppText>
        </View>
      </View>

      <View className="flex-row-reverse gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={'عرض ملف ' + doctor.name}
          className="min-h-[46px] min-w-0 flex-1 items-center justify-center rounded-[12px] bg-action-primary"
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
            'min-h-[46px] items-center justify-center rounded-[12px] border px-3 ' +
            (selected
              ? 'border-action-primary bg-action-subtle'
              : 'border-border-subtle bg-surface-default')
          }
          disabled={disabled}
          onPress={onToggle}
        >
          <View className="flex-row-reverse items-center gap-1.5">
            <AppIcon
              name={
                selected
                  ? { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }
                  : { ios: 'square.on.square', android: 'compare_arrows', web: 'compare_arrows' }
              }
              size={18}
              tone="action"
            />
            <AppText variant="caption" className="font-ui-medium">
              {selected ? 'تمت الإضافة' : 'مقارنة'}
            </AppText>
          </View>
        </Pressable>
      </View>
    </HeroCard>
  );
}
