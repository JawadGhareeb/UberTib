import { useRouter } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { Pressable, View } from 'react-native';

import { AppIcon, AppText } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { cn } from '@/shared/utils/cn';
import { useAppDirection } from '@/providers/app-direction-provider';
import { useAppTheme } from '@/shared/theme/theme-provider';
import { PatientBottomBar } from '@/shared/components/navigation/patient-bottom-bar';
import { AuthBackButton } from '@/shared/components/navigation/auth-back-button';

type Tone = 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'neutral';

const toneClasses: Record<Tone, string> = {
  primary: 'bg-action-subtle',
  success: 'bg-tone-success-fill',
  warning: 'bg-tone-warning-fill',
  info: 'bg-tone-info-fill',
  danger: 'bg-tone-danger-fill',
  neutral: 'bg-surface-subtle',
};

const textToneClasses: Record<Tone, string> = {
  primary: 'text-content-link',
  success: 'text-tone-success-text',
  warning: 'text-tone-warning-text',
  info: 'text-tone-info-text',
  danger: 'text-tone-danger-text',
  neutral: 'text-content-secondary',
};

/**
 * Shared fixed-height patient care app bar.
 * Keep outside ScrollView: the title, back action and contextual icon stay
 * visible while the three financial flows (and the rest of care) scroll.
 */
export function CareV5Header({
  title,
  leftIcon = 'more',
  leftTone = 'primary',
  right = 'back',
  onLeftPress,
}: {
  title: string;
  leftIcon?:
    | 'calendar'
    | 'more'
    | 'history'
    | 'file'
    | 'image'
    | 'star'
    | 'question'
    | 'shield'
    | 'verified';
  leftTone?: Tone;
  right?: 'back' | 'bell' | 'chevron';
  onLeftPress?: () => void;
}) {
  const router = useRouter();
  const { rowReverseClassName } = useAppDirection();
  const { colors } = useAppTheme();

  const contextualIcon: AppIconName = {
    calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
    more: { ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' },
    history: { ios: 'clock.arrow.circlepath', android: 'history', web: 'history' },
    file: { ios: 'doc.text.fill', android: 'receipt_long', web: 'receipt_long' },
    image: { ios: 'photo.fill', android: 'image', web: 'image' },
    star: { ios: 'star', android: 'star_outline', web: 'star_outline' },
    question: { ios: 'questionmark.circle', android: 'help_outline', web: 'help_outline' },
    shield: { ios: 'exclamationmark.shield', android: 'gpp_maybe', web: 'gpp_maybe' },
    verified: { ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' },
  }[leftIcon] as AppIconName;

  const badge = (
    <View
      className={cn('h-10 w-10 items-center justify-center rounded-full', toneClasses[leftTone])}
    >
      <AppIcon
        name={contextualIcon}
        size={20}
        tone={leftTone === 'primary' ? 'action' : leftTone === 'neutral' ? 'secondary' : leftTone}
      />
    </View>
  );

  return (
    <View className="w-full shrink-0 bg-surface-default">
      <View
        className={cn('mx-auto h-16 w-full max-w-[430px] items-center px-4', rowReverseClassName)}
      >
        {onLeftPress ? (
          <Pressable
            accessibilityLabel="إجراء إضافي"
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center"
            onPress={onLeftPress}
          >
            {badge}
          </Pressable>
        ) : (
          <View className="h-11 w-11 items-center justify-center">{badge}</View>
        )}
        <AppText
          align="center"
          className="min-w-0 flex-1 px-2 font-ui-bold"
          numberOfLines={1}
          variant="heading-3"
        >
          {title}
        </AppText>
        {right === 'bell' ? (
          <Pressable
            accessibilityLabel="الإشعارات"
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-full bg-action-subtle"
            onPress={() => router.push('/notifications')}
          >
            <AppIcon
              name={{ ios: 'bell', android: 'notifications', web: 'notifications' }}
              size={21}
              color={colors.action.primary}
            />
          </Pressable>
        ) : (
          <AuthBackButton
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace('/(tabs)/care');
            }}
          />
        )}
      </View>
    </View>
  );
}

export function CareV5BottomNav({ active }: { active: 'bookings' | 'care' }) {
  return <PatientBottomBar active={active === 'care' ? 'care' : 'discover'} />;
}

export function CareV5Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <View
      className={cn('rounded-[14px] border border-border-subtle bg-surface-default', className)}
    >
      {children}
    </View>
  );
}

export function CareV5Badge({ label, tone = 'primary' }: { label: string; tone?: Tone }) {
  return (
    <View className={cn('rounded-[7px] px-1.5 py-0.5', toneClasses[tone])}>
      <AppText
        className={cn('font-ui-medium', textToneClasses[tone])}
        numberOfLines={1}
        variant="badge"
      >
        {label}
      </AppText>
    </View>
  );
}

/** Compact patient action card: title first, smaller supporting copy directly below. */
export function CareV5ActionLink({
  title,
  description,
  icon,
  onPress,
  tone = 'primary',
}: {
  title: string;
  description: string;
  icon: AppIconName;
  onPress: () => void;
  tone?: Tone;
}) {
  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole="button"
      className="min-h-[54px] flex-row items-center gap-2 rounded-[11px] border border-border-subtle bg-surface-default px-[10px] py-[7px]"
      onPress={onPress}
    >
      <View className="min-w-0 flex-1 items-end">
        <AppText
          align="right"
          className="font-ui-semibold"
          numberOfLines={2}
          style={{ fontSize: 12, lineHeight: 19 }}
          variant="label"
        >
          {title}
        </AppText>
        <AppText
          align="right"
          className="mt-0.5 w-full text-content-secondary"
          numberOfLines={2}
          style={{ fontSize: 9.5, lineHeight: 15 }}
          variant="caption"
        >
          {description}
        </AppText>
      </View>
      <View className={cn('h-9 w-9 items-center justify-center rounded-[9px]', toneClasses[tone])}>
        <AppIcon name={icon} size={17} tone={tone === 'primary' ? 'action' : tone} />
      </View>
    </Pressable>
  );
}

/**
 * One patient-facing treatment/booking filter pattern for every list.
 * Icons describe the category, never the index or a generic placeholder.
 */
const defaultCareFilterIcons: Record<string, AppIconName> = {
  الكل: { ios: 'square.grid.2x2', android: 'apps', web: 'apps' },
  'قيد العلاج': { ios: 'heart.text.square', android: 'favorite_border', web: 'favorite_border' },
  علاج: { ios: 'cross.case', android: 'medical_services', web: 'medical_services' },
  قادمة: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  مكتملة: { ios: 'checkmark.circle', android: 'check_circle_outline', web: 'check_circle_outline' },
  ماليات: { ios: 'banknote', android: 'payments', web: 'payments' },
  مشكلات: { ios: 'exclamationmark.triangle', android: 'warning', web: 'warning' },
  ملغاة: { ios: 'xmark.circle', android: 'cancel', web: 'cancel' },
};

export function CareFilterTabs({
  items,
  selected,
  onChange,
  icons,
  iconPlacement = 'inline',
}: {
  items: readonly string[];
  selected: string;
  onChange: (item: string) => void;
  icons?: Record<string, AppIconName>;
  iconPlacement?: 'inline' | 'top';
}) {
  const { rowClassName } = useAppDirection();
  const stacked = iconPlacement === 'top';

  return (
    <View
      accessibilityRole="tablist"
      className={cn(
        'flex-row gap-1 rounded-[11px] bg-surface-subtle p-1',
        stacked ? 'mt-[8px] min-h-[56px]' : 'mt-[10px] min-h-[44px]',
      )}
    >
      {items.map((item) => {
        const active = item === selected;
        const tabIcon = icons?.[item] ?? defaultCareFilterIcons[item];
        return (
          <Pressable
            accessibilityLabel={item}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            className={cn(
              'min-h-[36px] min-w-0 flex-1 items-center justify-center rounded-[8px] px-1',
              active
                ? 'border border-border-subtle bg-surface-default'
                : 'border border-transparent',
            )}
            hitSlop={2}
            key={item}
            onPress={() => onChange(item)}
          >
            <View
              className={cn(
                'items-center justify-center',
                stacked ? 'flex-col gap-0.5' : rowClassName,
                !stacked && 'gap-1',
              )}
            >
              {tabIcon ? (
                <AppIcon
                  name={tabIcon}
                  size={stacked ? 17 : 15}
                  tone={active ? 'action' : 'secondary'}
                />
              ) : null}
              <AppText
                align="center"
                className={active ? 'font-ui-semibold text-content-link' : 'text-content-secondary'}
                numberOfLines={1}
                style={{ fontSize: stacked ? 10 : 10, lineHeight: 16 }}
                variant="caption"
              >
                {item}
              </AppText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export function CareV5TimelineRow({
  date,
  title,
  detail,
  tag,
  tone = 'primary',
  icon,
}: {
  date: string;
  title: string;
  detail: string;
  tag: string;
  tone?: Tone;
  icon?: AppIconName;
}) {
  return (
    <View className="min-h-[54px] flex-row items-center gap-[7px] rounded-[11px] border border-border-subtle bg-surface-default px-[8px] py-[6px]">
      <AppText
        direction="ltr"
        className="w-[52px] text-content-placeholder"
        style={{ fontSize: 9.5, lineHeight: 15 }}
        variant="caption"
      >
        {date}
      </AppText>

      <View className="min-w-0 flex-1 items-end">
        <View className="flex-row items-center justify-end gap-1.5">
          <CareV5Badge label={tag} tone={tone} />
          <AppText
            align="right"
            className="min-w-0 flex-shrink font-ui-bold"
            numberOfLines={2}
            style={{ fontSize: 12, lineHeight: 18 }}
            variant="label"
          >
            {title}
          </AppText>
        </View>
        <AppText
          className="mt-0.5 w-full text-content-secondary"
          numberOfLines={2}
          style={{ fontSize: 9.5, lineHeight: 15 }}
          align="right"
          variant="caption"
        >
          {detail}
        </AppText>
      </View>

      <View
        className={cn(
          'h-[30px] w-[30px] items-center justify-center rounded-[9px]',
          toneClasses[tone],
        )}
      >
        <AppIcon
          name={
            icon ??
            (tone === 'warning'
              ? { ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }
              : tone === 'success'
                ? { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }
                : tone === 'info'
                  ? { ios: 'info.circle.fill', android: 'info', web: 'info' }
                  : {
                      ios: 'circle.fill',
                      android: 'radio_button_checked',
                      web: 'radio_button_checked',
                    })
          }
          size={14}
          tone={
            tone === 'warning'
              ? 'warning'
              : tone === 'success'
                ? 'success'
                : tone === 'info'
                  ? 'info'
                  : 'action'
          }
        />
      </View>
    </View>
  );
}
