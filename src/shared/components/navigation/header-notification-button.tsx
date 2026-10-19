import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { getMockNotificationsForScenario } from '@/features/platform/mocks/platform.mock';
import { CenteredActionIcon } from '@/shared/components/ui/centered-action-icon';
import { useMockScenario } from '@/shared/mock';
import { useAppTheme } from '@/shared/theme/theme-provider';

export function HeaderNotificationButton() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { scenario, getSurfaceState, readNotificationIds } = useMockScenario();
  const hasUnreadNotifications =
    getSurfaceState('notifications') !== 'empty-no-data' &&
    getMockNotificationsForScenario(scenario).some(
      (notification) => notification.unread && !readNotificationIds.includes(notification.id),
    );

  return (
    <Pressable
      accessibilityLabel="الإشعارات"
      accessibilityRole="button"
      className="rounded-full active:bg-state-selected"
      style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
      hitSlop={4}
      onPress={() => router.push('/notifications')}
    >
      <CenteredActionIcon name="bell" frameSize={44} iconSize={22} color={colors.text.primary} />
      {hasUnreadNotifications ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 7,
            right: 7,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.tone.danger.text,
          }}
        />
      ) : null}
    </Pressable>
  );
}
