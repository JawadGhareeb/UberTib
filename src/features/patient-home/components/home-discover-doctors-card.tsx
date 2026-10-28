import { useRouter } from 'expo-router';
import { Button as HeroButton, Card as HeroCard } from 'heroui-native';
import { View } from 'react-native';

import { AppIcon, AppText } from '@/shared/components/ui';

export function HomeDiscoverDoctorsCard() {
  const router = useRouter();
  return (
    <HeroCard
      variant="default"
      className="gap-3 rounded-[18px] border border-border-subtle bg-surface-default p-4"
    >
      <View className="flex-row-reverse items-center gap-3">
        <View className="h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-action-subtle">
          <AppIcon
            name={{ ios: 'person.2', android: 'group', web: 'group' }}
            size={24}
            tone="action"
          />
        </View>
        <View className="min-w-0 flex-1 items-end gap-1">
          <AppText align="right" variant="heading-4" className="w-full">
            استكشف الأطباء
          </AppText>
          <AppText align="right" variant="caption" numberOfLines={2} className="w-full">
            تصفّح ملفات الأطباء وخدماتهم واختار الطبيب اللي بناسبك.
          </AppText>
        </View>
      </View>
      <HeroButton
        variant="outline"
        className="min-h-[48px] w-full rounded-[12px] border-action-primary"
        onPress={() =>
          router.push({ pathname: '/discover/search', params: { browseDoctors: '1' } })
        }
      >
        <HeroButton.Label
          className="w-full shrink-0 font-ui-semibold text-content-link"
          style={{ textAlign: 'center', writingDirection: 'rtl' }}
        >
          استكشف الأطباء
        </HeroButton.Label>
      </HeroButton>
    </HeroCard>
  );
}
