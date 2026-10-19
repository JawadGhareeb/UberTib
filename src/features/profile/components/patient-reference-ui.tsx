import type { PropsWithChildren } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppIcon, AppText } from '@/shared/components/ui';
import { AuthBackButton } from '@/shared/components/navigation/auth-back-button';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { cn } from '@/shared/utils/cn';

export function ReferenceHeader({
  title,
  icon,
  onAction,
  actionLabel,
}: {
  title: string;
  icon: AppIconName;
  onAction?: () => void;
  actionLabel?: string;
}) {
  const router = useRouter();
  return (
    <View className="h-[62px] flex-row-reverse items-center justify-between bg-surface-default px-4">
      <AuthBackButton
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/profile'))}
      />
      <AppText
        align="center"
        className="min-w-0 flex-1 px-2 font-ui-bold"
        numberOfLines={1}
        variant="heading-4"
      >
        {title}
      </AppText>
      {onAction ? (
        <Pressable
          accessibilityLabel={actionLabel ?? title}
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-full bg-action-subtle"
          hitSlop={4}
          onPress={onAction}
        >
          <AppIcon name={icon} size={21} tone="action" />
        </Pressable>
      ) : (
        <View className="h-11 w-11 items-center justify-center rounded-full bg-action-subtle">
          <AppIcon name={icon} size={21} tone="action" />
        </View>
      )}
    </View>
  );
}

export function ReferenceCard({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <View
      className={cn('rounded-[14px] border border-border-subtle bg-surface-default p-3', className)}
    >
      {children}
    </View>
  );
}

export function ReferenceIcon({
  icon,
  warm = false,
  info = false,
  size = 36,
  round = false,
  surface = false,
}: {
  icon: AppIconName;
  warm?: boolean;
  info?: boolean;
  size?: number;
  round?: boolean;
  surface?: boolean;
}) {
  return (
    <View
      className={cn(
        'shrink-0 items-center justify-center',
        round ? 'rounded-full' : 'rounded-[11px]',
        warm
          ? 'bg-tone-warning-fill'
          : info
            ? 'bg-tone-info-fill'
            : surface
              ? 'bg-surface-default'
              : 'bg-action-subtle',
      )}
      style={{ height: size, width: size }}
    >
      <AppIcon
        name={icon}
        size={Math.round(size * 0.52)}
        tone={warm ? 'warning' : info ? 'info' : 'action'}
      />
    </View>
  );
}

export function ReferenceActionRow({
  title,
  description,
  icon,
  onPress,
  badge,
  warm,
}: {
  title: string;
  description?: string;
  icon: AppIconName;
  badge?: string;
  onPress: () => void;
  warm?: boolean;
}) {
  return (
    <Pressable accessibilityLabel={title} accessibilityRole="button" onPress={onPress}>
      <ReferenceCard className="min-h-[66px] flex-row-reverse items-center gap-2.5 p-[9px]">
        <ReferenceIcon icon={icon} warm={warm} size={42} />
        <View className="min-w-0 flex-1 items-end gap-0.5">
          <AppText
            align="right"
            className="w-full font-ui-semibold"
            numberOfLines={2}
            style={{ fontSize: 12, lineHeight: 19 }}
            variant="label"
          >
            {title}
          </AppText>
          {description ? (
            <AppText
              align="right"
              className="w-full text-content-secondary"
              numberOfLines={2}
              style={{ fontSize: 10.5, lineHeight: 16 }}
              variant="caption"
            >
              {description}
            </AppText>
          ) : null}
        </View>
        {badge ? (
          <View className="rounded-[8px] bg-action-subtle px-2 py-1">
            <AppText className="text-content-link" variant="caption">
              {badge}
            </AppText>
          </View>
        ) : null}
      </ReferenceCard>
    </Pressable>
  );
}
