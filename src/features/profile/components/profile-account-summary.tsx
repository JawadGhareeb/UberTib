import { useRouter } from 'expo-router';
import { Card as HeroCard } from 'heroui-native';
import { Pressable, View } from 'react-native';

import { useProfilePhoto } from '@/features/profile/state/profile-photo-provider';
import { EditableProfileAvatar } from '@/shared/components/media/editable-profile-avatar';
import { AppIcon, AppText } from '@/shared/components/ui';
import { mockPatientWorld } from '@/shared/mock/patient.mock';

export function ProfileAccountSummary() {
  const router = useRouter();
  const { photo, setPhoto } = useProfilePhoto();

  return (
    <View className="gap-3">
      <HeroCard
        variant="default"
        className="min-h-[105px] flex-row-reverse items-center gap-3 rounded-[17px] border border-border-subtle bg-action-subtle p-4"
      >
        <EditableProfileAvatar value={photo} onChange={setPhoto} />
        <View className="min-w-0 flex-1 items-end gap-1.5">
          <AppText align="right" className="font-ui-bold" variant="heading-3" numberOfLines={2}>
            {mockPatientWorld.account.name}
          </AppText>
          <AppText
            align="right"
            className="text-content-secondary"
            variant="label"
            numberOfLines={1}
          >
            {mockPatientWorld.account.phone}
          </AppText>
          <AppText align="right" className="text-content-secondary" variant="caption">
            الهاتف موثّق · بيانات تجريبية
          </AppText>
        </View>
      </HeroCard>

      <View className="flex-row-reverse gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="فتح أفراد العائلة"
          className="min-h-[68px] min-w-0 flex-1 flex-row-reverse items-center justify-center gap-2 rounded-[14px] border border-border-subtle bg-surface-default px-2"
          onPress={() => router.push('/profile/family')}
        >
          <AppIcon
            name={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
            size={21}
            tone="action"
          />
          <AppText align="center" className="font-ui-semibold" variant="label" numberOfLines={2}>
            أفراد العائلة
          </AppText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="فتح معلوماتي الصحية"
          className="min-h-[68px] min-w-0 flex-1 flex-row-reverse items-center justify-center gap-2 rounded-[14px] border border-border-subtle bg-surface-default px-2"
          onPress={() => router.push('/profile/health')}
        >
          <AppIcon
            name={{ ios: 'heart.text.square', android: 'monitor_heart', web: 'monitor_heart' }}
            size={21}
            tone="action"
          />
          <AppText align="center" className="font-ui-semibold" variant="label" numberOfLines={2}>
            معلوماتي الصحية
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}
