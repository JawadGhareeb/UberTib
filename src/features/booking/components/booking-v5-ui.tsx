import { useRouter } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { Image, View } from 'react-native';
import {
  DEMO_CLINIC_PHOTOS,
  ProviderPortrait,
} from '@/features/discovery/components/provider-photo-gallery';

import { useAppDirection } from '@/shared/utils/app-direction';
import { AppIcon, AppText } from '@/shared/components/ui';
import { AppHeader } from '@/shared/components/navigation/app-header';
import { cn } from '@/shared/utils/cn';

/** Delegates to the same edge-to-edge header used everywhere in the patient app. */
export function BookingHeader({
  title,
  subtitle,
  showBack = true,
  onBackPress,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  leadingIcon?: 'review' | 'pending' | 'confirmed' | 'reason' | 'patient' | 'calendar';
  leadingTone?: 'action' | 'warning' | 'success';
}) {
  const router = useRouter();
  const goBack = () => {
    if (onBackPress) return onBackPress();
    if (router.canGoBack()) router.back();
    else router.replace({ pathname: '/(tabs)/care', params: { tab: 'bookings' } });
  };
  return (
    <View className="w-full">
      <AppHeader title={title} showBack={showBack} onBackPress={goBack} />
      {subtitle ? (
        <View className="w-full bg-surface-default px-4 pb-2">
          <AppText align="center" variant="caption" className="text-content-secondary">
            {subtitle}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

export function BookingStepPill({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) {
  return (
    <View className="flex-row items-center justify-between rounded-[11px] bg-surface-subtle px-3 py-2">
      <AppText
        direction="ltr"
        className="text-type-caption text-content-secondary"
        variant="caption"
      >
        {current}/{total}
      </AppText>
      <AppText className="text-type-caption text-content-link" variant="label">
        {label}
      </AppText>
    </View>
  );
}

export function BookingCard({ children, className }: PropsWithChildren<{ className?: string }>) {
  const hasRadius = className?.split(/\s+/).some((item) => /^rounded-(?!t-|r-|b-|l-)/.test(item));
  return (
    <View
      className={cn(
        !hasRadius && 'rounded-[14px]',
        'border border-border-subtle bg-surface-default',
        className,
      )}
    >
      {children}
    </View>
  );
}

/** Shared doctor and clinic media in booking; pictures are illustrative, not verified branch imagery. */
export function BookingProviderMiniCard({
  providerName,
  serviceName,
  branch,
  portraitUri,
}: {
  providerName: string;
  serviceName: string;
  branch: string;
  portraitUri?: string;
}) {
  const { rowClassName } = useAppDirection();
  return (
    <BookingCard className="p-2.5">
      <View className={cn('items-center gap-2', rowClassName)}>
        <Image
          accessibilityLabel="صورة توضيحية للعيادة"
          className="h-[46px] w-[52px] rounded-[9px] bg-action-subtle"
          source={{ uri: DEMO_CLINIC_PHOTOS[2] }}
        />
        <ProviderPortrait size={42} uri={portraitUri} />
        <View className="min-w-0 flex-1 items-end">
          <AppText
            align="right"
            className="font-ui-semibold text-content-primary"
            numberOfLines={1}
            variant="label"
          >
            {providerName} · {serviceName}
          </AppText>
          <AppText
            align="right"
            className="mt-0.5 text-content-secondary"
            numberOfLines={2}
            variant="caption"
          >
            {branch} · صور توضيحية
          </AppText>
        </View>
      </View>
    </BookingCard>
  );
}

export function BookingFact({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View className="min-w-0 flex-1 items-end">
      <AppText className="text-type-caption text-content-secondary" variant="caption">
        {label}
      </AppText>
      <AppText
        className={cn(
          'mt-0.5 text-type-label',
          highlight ? 'font-ui-bold text-content-link' : 'text-content-primary',
        )}
        variant="label"
      >
        {value}
      </AppText>
    </View>
  );
}

export function BookingStatusBanner({
  title,
  body,
  tone = 'info',
}: {
  title: string;
  body: string;
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
}) {
  const classes = {
    info: 'bg-tone-info-fill',
    success: 'bg-tone-success-fill',
    warning: 'bg-tone-warning-fill',
    danger: 'bg-tone-danger-fill',
    neutral: 'bg-surface-subtle',
  }[tone];

  const iconTone =
    tone === 'success'
      ? 'success'
      : tone === 'warning'
        ? 'warning'
        : tone === 'danger'
          ? 'danger'
          : 'info';

  return (
    <View className={cn('flex-row items-start gap-2 rounded-[13px] p-3', classes)}>
      <View className="min-w-0 flex-1 items-end">
        <AppText className="font-ui-bold text-type-label" variant="label">
          {title}
        </AppText>
        <AppText className="mt-1 text-type-caption  text-content-secondary" variant="caption">
          {body}
        </AppText>
      </View>
      <AppIcon
        name={{
          ios:
            tone === 'success'
              ? 'checkmark.circle.fill'
              : tone === 'danger'
                ? 'exclamationmark.triangle.fill'
                : tone === 'warning'
                  ? 'clock.fill'
                  : 'info.circle.fill',
          android:
            tone === 'success'
              ? 'check_circle'
              : tone === 'danger'
                ? 'warning'
                : tone === 'warning'
                  ? 'schedule'
                  : 'info',
          web:
            tone === 'success'
              ? 'check_circle'
              : tone === 'danger'
                ? 'warning'
                : tone === 'warning'
                  ? 'schedule'
                  : 'info',
        }}
        size={17}
        tone={iconTone}
      />
    </View>
  );
}
