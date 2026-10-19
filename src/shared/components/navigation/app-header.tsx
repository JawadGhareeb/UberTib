import type { ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';

import { useAppDirection } from '@/providers/app-direction-provider';
import { BrandLogo } from '@/shared/components/brand';
import { AppText, ThemeToggle } from '@/shared/components/ui';
import { theme } from '@/shared/theme';
import { cn } from '@/shared/utils/cn';

import { BackAction } from './back-action';
import { HeaderNotificationButton } from './header-notification-button';

interface AppHeaderProps {
  title?: string;
  titleDirection?: 'rtl' | 'ltr';
  showBack?: boolean;
  backLabel?: string;
  showTheme?: boolean;
  showNotifications?: boolean;
  /** Contextual action for detail headers only; main-tab positions are fixed. */
  startContent?: ReactNode;
  className?: string;
  variant?: 'detail' | 'primary';
}

/**
 * Fixed three-column header: bell/back on the physical right, title centered,
 * and the UberTib logo on the physical left. Equal side columns keep the title
 * centered independently of the width of the logo or notification button.
 *
 * Main tabs use variant="primary". Detail screens keep their back action.
 * Region selection lives in Profile rather than in the shared app header.
 */
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
  const { rowClassName } = useAppDirection();
  const primary = variant === 'primary';
  const notificationsVisible = showNotifications ?? primary;
  const rightControl = showBack ? (
    <BackAction alignToStart={false} label={backLabel} />
  ) : notificationsVisible ? (
    <HeaderNotificationButton />
  ) : (
    (startContent ?? null)
  );

  return (
    <View
      className={cn(
        'w-full bg-surface-default',
        !primary && 'border-b border-border-subtle',
        className,
      )}
    >
      <Animated.View
        className={cn(rowClassName, 'h-16 w-full items-center px-4')}
        entering={FadeIn.duration(theme.motion.duration.stateChange).reduceMotion(
          ReduceMotion.System,
        )}
      >
        <View className="h-16 items-end justify-center" style={{ width: 112 }}>
          {rightControl}
        </View>

        <View className="min-w-0 flex-1 items-center justify-center px-1">
          <AppText
            align="center"
            className="w-full"
            direction={titleDirection}
            numberOfLines={primary ? 1 : 2}
            style={{ textAlign: 'center' }}
            variant="body-strong"
          >
            {title ?? (primary ? 'الرئيسية' : '')}
          </AppText>
        </View>

        <View className="h-16 items-start justify-center" style={{ width: 112 }}>
          {showTheme ? <ThemeToggle alignToStart={false} /> : <BrandLogo size={30} />}
        </View>
      </Animated.View>
    </View>
  );
}
