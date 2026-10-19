import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppIcon, AppText, type AppIconName } from '@/shared/components/ui';

function Shortcut({ label, icon, onPress }: { label: string; icon: AppIconName; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label}
      onPress={onPress}
      className="min-h-[75px] min-w-0 flex-1 items-center justify-center gap-2 rounded-[14px] border border-border-subtle bg-surface-default px-2 py-3">
      <AppIcon name={icon} size={22} tone="action" />
      <AppText variant="label" className="font-ui-semibold" numberOfLines={1} align="center">{label}</AppText>
    </Pressable>
  );
}
export function ProfileShortcuts() {
  const router = useRouter();
  return (
    <View className="flex-row-reverse gap-2">
      <Shortcut label="أفراد الأسرة" icon={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
        onPress={() => router.push('/profile/family')} />
      <Shortcut label="معلوماتي الصحية" icon={{ ios: 'heart.text.square', android: 'monitor_heart', web: 'monitor_heart' }}
        onPress={() => router.push('/profile/health')} />
    </View>
  );
}
