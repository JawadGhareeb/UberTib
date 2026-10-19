import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';

import { useAppDirection } from '@/providers/app-direction-provider';
import { usePreferredLocation } from '@/features/location/state/preferred-location-provider';
import { BrandLogo } from '@/shared/components/brand';
import { AppText, ThemeToggle } from '@/shared/components/ui';
import { CenteredActionIcon } from '@/shared/components/ui/centered-action-icon';
import { useMockScenario } from '@/shared/mock';
import { getMockNotificationsForScenario } from '@/features/platform/mocks/platform.mock';
import { theme } from '@/shared/theme';
import { useAppTheme } from '@/shared/theme/theme-provider';
import { cn } from '@/shared/utils/cn';

import { BackAction } from './back-action';

interface AppHeaderProps {
  title?: string;
  titleDirection?: 'rtl' | 'ltr';
  showBack?: boolean;
  backLabel?: string;
  showTheme?: boolean;
  showNotifications?: boolean;
  startContent?: ReactNode;
  className?: string;
  variant?: 'detail' | 'primary';
}

export function AppHeader({
  title,
  titleDirection = 'rtl',
  showBack = false,
  backLabel = 'رجوع',
  showTheme = false,
  showNotifications,
  startContent,
  className,
  variant = 'detail',
}: AppHeaderProps) {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { colors } = useAppTheme();
  const { location } = usePreferredLocation();
  const { scenario, getSurfaceState, readNotificationIds } = useMockScenario();
  const primary = variant === 'primary';
  const notificationsVisible = showNotifications ?? primary;
  const notificationsState = getSurfaceState('notifications');
  const hasUnreadNotifications =
    notificationsState !== 'empty-no-data' &&
    getMockNotificationsForScenario(scenario).some(
      (notification) => notification.unread && !readNotificationIds.includes(notification.id),
    );

  const notificationButton = notificationsVisible ? (
    <Pressable
      accessibilityLabel="الإشعارات"
      accessibilityRole="button"
      className="rounded-full active:bg-state-selected"
      style={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
      }}
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
  ) : null;

  return (
    <View
      className={cn(
        'w-full',
        primary ? 'bg-surface-default' : 'border-b border-border-subtle bg-surface-default',
        className,
      )}
    >
      <Animated.View
        className={cn(
          rowClassName,
          'w-full items-center justify-between',
          primary ? 'h-16 px-4' : 'h-16 px-5',
        )}
        entering={FadeIn.duration(theme.motion.duration.stateChange).reduceMotion(
          ReduceMotion.System,
        )}
      >
        {primary ? (
          <View className="w-11 shrink-0 items-center justify-center">{notificationButton}</View>
        ) : (
          <View className="w-11 items-center justify-center">
            {showBack ? (
              <BackAction alignToStart={false} label={backLabel} />
            ) : (
              (startContent ?? null)
            )}
          </View>
        )}

        {primary ? (
          <Pressable
            accessibilityLabel="منطقتك، اضغط لتحديد الموقع على الخريطة"
            accessibilityRole="button"
            className="min-h-11 min-w-0 flex-1 items-center justify-center px-1"
            onPress={() => router.push('/location-picker')}
          >
            <AppText className="text-type-caption text-content-secondary" variant="caption">
              منطقتك
            </AppText>
            <View className={cn('mt-0.5 min-w-0 items-center gap-1', rowClassName)}>
              <AppText
                className="min-w-0 flex-shrink text-type-caption"
                numberOfLines={1}
                variant="label"
              >
                {location?.label || 'حدّد منطقتك'}
              </AppText>
              <SymbolView
                name={{
                  ios: 'chevron.down',
                  android: 'keyboard_arrow_down',
                  web: 'keyboard_arrow_down',
                }}
                size={14}
                tintColor={colors.action.primary}
              />
            </View>
          </Pressable>
        ) : (
          <View className="min-w-0 flex-1 items-center px-2">
            {title ? (
              <AppText
                className="w-full"
                direction={titleDirection}
                numberOfLines={1}
                style={{ textAlign: 'center' }}
                variant="body-strong"
              >
                {title}
              </AppText>
            ) : null}
          </View>
        )}

        {primary ? (
          <View className="shrink-0 items-center">
            <BrandLogo size={34} />
          </View>
        ) : (
          <View className="w-11 flex-row items-center justify-center gap-2">
            {showTheme ? <ThemeToggle alignToStart={false} /> : null}
            {notificationButton}
          </View>
        )}
      </Animated.View>
    </View>
  );
}
