import type { ReactNode } from 'react';
import { View } from 'react-native';

import { useAppDirection } from '@/providers/app-direction-provider';
import { BrandLogo } from '@/shared/components/brand';
import { AppText, ThemeToggle } from '@/shared/components/ui';
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
  /** Alternative left logo/action slot in detail header only. */
  endContent?: ReactNode;
  onBackPress?: () => void;
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
  endContent,
  onBackPress,
  className,
  variant = 'detail',
}: AppHeaderProps) {
  const { rowClassName } = useAppDirection();
  const primary = variant === 'primary';
  const notificationsVisible = showNotifications ?? primary;
  const rightControl = showBack ? (
    <BackAction alignToStart={false} label={backLabel} onPress={onBackPress} />
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
      <View className={cn(rowClassName, 'h-16 w-full items-center px-4')}>
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
          {!primary && endContent ? (
            endContent
          ) : showTheme ? (
            <ThemeToggle alignToStart={false} />
          ) : (
            <BrandLogo size={30} />
          )}
        </View>
      </View>
    </View>
  );
}
