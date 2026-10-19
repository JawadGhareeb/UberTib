import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { EditableProfileAvatar } from '@/shared/components/media/editable-profile-avatar';
import { AppIcon, AppText } from '@/shared/components/ui';
import { mockPatientWorld } from '@/shared/mock/patient.mock';
import { useProfilePhoto } from '@/features/profile/state/profile-photo-provider';

export function ProfileAccountSummary() {
  const router = useRouter();
  const { photo, setPhoto } = useProfilePhoto();
  return (
    <>
      <View className="min-h-[72px] flex-row-reverse items-center gap-3 rounded-[12px] bg-action-subtle px-3 py-[9px]">
        <EditableProfileAvatar value={photo} onChange={setPhoto} />
        <View className="min-w-0 flex-1 items-end">
          <AppText align="right" className="font-ui-bold" variant="label">
            {mockPatientWorld.account.name}
          </AppText>
          <AppText
            align="right"
            className="mt-0.5 text-content-secondary"
            style={{ fontSize: 10, lineHeight: 16 }}
            variant="caption"
          >
            {mockPatientWorld.account.phone} · الهاتف موثّق (معاينة)
          </AppText>
        </View>
      </View>

      <View className="mt-[7px] flex-row-reverse gap-[7px]">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="فتح أفراد العائلة"
          className="min-h-[52px] flex-1 flex-row-reverse items-center justify-center gap-2 rounded-[11px] border border-border-subtle bg-surface-default px-2"
          onPress={() => router.push('/profile/family')}
        >
          <AppIcon
            name={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
            size={18}
            tone="action"
          />
          <AppText
            align="center"
            className="font-ui-semibold"
            style={{ fontSize: 11, lineHeight: 18 }}
            variant="caption"
          >
            أفراد العائلة
          </AppText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="فتح معلوماتي الصحية"
          className="min-h-[52px] flex-1 flex-row-reverse items-center justify-center gap-2 rounded-[11px] border border-border-subtle bg-surface-default px-2"
          onPress={() => router.push('/profile/health')}
        >
          <AppIcon
            name={{ ios: 'heart.text.square', android: 'monitor_heart', web: 'monitor_heart' }}
            size={18}
            tone="action"
          />
          <AppText
            align="center"
            className="font-ui-semibold"
            style={{ fontSize: 11, lineHeight: 18 }}
            variant="caption"
          >
            معلوماتي الصحية
          </AppText>
        </Pressable>
      </View>
    </>
  );
}
