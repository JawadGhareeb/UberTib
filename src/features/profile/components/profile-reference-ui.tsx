import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

import { AppIcon, AppText } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { cn } from '@/shared/utils/cn';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const toneClasses = {
  neutral: 'bg-surface-subtle',
  success: 'bg-tone-success-fill',
  warning: 'bg-tone-warning-fill',
  danger: 'bg-tone-danger-fill',
  info: 'bg-tone-info-fill',
} as const;

const textClasses = {
  neutral: 'text-content-secondary',
  success: 'text-tone-success-text',
  warning: 'text-tone-warning-text',
  danger: 'text-tone-danger-text',
  info: 'text-tone-info-text',
} as const;

export function ProfileReferenceCard({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <View className={cn('rounded-[12px] border border-border-subtle bg-surface-default p-[11px]', className)}>
      {children}
    </View>
  );
}

export function ProfileReferenceBadge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: Tone;
}) {
  return (
    <View className={cn('self-start rounded-[7px] px-[7px] py-[3px]', toneClasses[tone])}>
      <AppText
        className={cn('font-ui-semibold', textClasses[tone])}
        numberOfLines={1}
        style={{ fontSize: 9, lineHeight: 15 }}
        variant="caption"
      >
        {label}
      </AppText>
    </View>
  );
}

export function ProfileReferenceNotice({
  title,
  description,
  tone = 'info',
}: {
  title: string;
  description: string;
  tone?: Tone;
}) {
  return (
    <View className={cn('rounded-[12px] px-3 py-3', toneClasses[tone])}>
      <AppText align="right" className="font-ui-bold" variant="label">
        {title}
      </AppText>
      <AppText
        align="right"
        className="mt-1 text-content-secondary"
        style={{ fontSize: 10.5, lineHeight: 18 }}
        variant="caption"
      >
        {description}
      </AppText>
    </View>
  );
}

export function ProfileReferenceSectionTitle({ children }: PropsWithChildren) {
  return (
    <AppText align="right" className="mt-3 mb-[7px] font-ui-semibold" variant="label">
      {children}
    </AppText>
  );
}

export function ProfileReferenceFact({
  icon,
  label,
  value,
}: {
  icon: AppIconName;
  label: string;
  value: string;
}) {
  return (
    <ProfileReferenceCard className="min-h-[54px] flex-row items-center gap-[9px] px-[10px] py-[8px]">
      <View className="h-8 w-8 items-center justify-center">
        <AppIcon name={icon} size={18} tone="action" />
      </View>
      <View className="min-w-0 flex-1 items-end">
        <AppText align="right" className="text-content-secondary" style={{ fontSize: 10, lineHeight: 16 }} variant="caption">
          {label}
        </AppText>
        <AppText align="right" className="font-ui-semibold" numberOfLines={2} variant="label">
          {value}
        </AppText>
      </View>
    </ProfileReferenceCard>
  );
}
