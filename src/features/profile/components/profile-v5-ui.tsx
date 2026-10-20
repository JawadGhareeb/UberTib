import { Radio } from 'heroui-native';
import type { PropsWithChildren } from 'react';
import { Pressable, View } from 'react-native';

import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, type AppIconName, AppText } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

interface ProfileSectionProps extends PropsWithChildren {
  title: string;
  description?: string;
  className?: string;
}

export function ProfileSection({ title, description, className, children }: ProfileSectionProps) {
  return (
    <View className={cn('mt-4', className)}>
      <AppText variant="heading-4">{title}</AppText>
      {description ? (
        <AppText className="mt-1 text-content-secondary" variant="caption">
          {description}
        </AppText>
      ) : null}
      <View className="mt-2">{children}</View>
    </View>
  );
}

interface ProfileNavRowProps {
  title: string;
  description: string;
  icon: AppIconName;
  onPress: () => void;
  meta?: string;
  first?: boolean;
}

export function ProfileNavRow({
  title,
  description,
  icon,
  onPress,
  meta,
  first = false,
}: ProfileNavRowProps) {
  const { rowClassName } = useAppDirection();

  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        'min-h-[68px] px-[10px] py-[10px] active:bg-action-subtle',
        !first && 'border-t border-border-subtle',
      )}
      onPress={onPress}
    >
      <View className={cn('items-center gap-3', rowClassName)}>
        <View className="h-9 w-9 shrink-0 items-center justify-center rounded-full bg-action-subtle">
          <AppIcon name={icon} size={20} tone="action" />
        </View>

        <View className="min-w-0 flex-1">
          <View className={cn('items-center gap-2', rowClassName)}>
            <AppText className="min-w-0 flex-1" variant="body-strong">
              {title}
            </AppText>
            {meta ? (
              <AppText className="text-content-link" variant="caption">
                {meta}
              </AppText>
            ) : null}
          </View>
          <AppText className="mt-0.5 text-content-secondary" variant="caption">
            {description}
          </AppText>
        </View>

        <View className="h-6 w-6 items-center justify-center">
          <AppIcon
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            size={16}
            tone="action"
          />
        </View>
      </View>
    </Pressable>
  );
}

interface ProfileFactProps {
  label: string;
  value: string;
  icon: AppIconName;
  valueDirection?: 'rtl' | 'ltr';
}

export function ProfileFact({ label, value, icon, valueDirection = 'rtl' }: ProfileFactProps) {
  const { rowClassName } = useAppDirection();

  return (
    <View className={cn('min-h-[68px] items-center gap-3 px-4 py-3', rowClassName)}>
      <View className="h-10 w-10 shrink-0 items-center justify-center rounded-control bg-surface-subtle">
        <AppIcon name={icon} size={18} tone="secondary" />
      </View>
      <View className="min-w-0 flex-1">
        <AppText className="text-content-secondary" variant="caption">
          {label}
        </AppText>
        <AppText className="mt-0.5" direction={valueDirection} variant="label">
          {value}
        </AppText>
      </View>
    </View>
  );
}

interface ProfileSelectionCardProps {
  title: string;
  description: string;
  initials: string;
  selected: boolean;
  onPress: () => void;
  status?: string;
}

export function ProfileSelectionCard({
  title,
  description,
  initials,
  selected,
  onPress,
  status,
}: ProfileSelectionCardProps) {
  const { rowClassName } = useAppDirection();

  return (
    <Radio
      isSelected={selected}
      onSelectedChange={onPress}
      className={cn(
        'min-h-[76px] rounded-surface border p-4',
        selected
          ? 'border-state-selected-border bg-state-selected'
          : 'border-border-subtle bg-surface-default active:bg-action-subtle',
      )}
    >
      <View className={cn('items-center gap-3', rowClassName)}>
        <Radio.Indicator />
        <View
          className={cn(
            'h-12 w-12 shrink-0 items-center justify-center rounded-surface',
            selected ? 'bg-action-primary' : 'bg-surface-subtle',
          )}
        >
          <AppText className={selected ? 'text-content-on-action' : undefined} variant="label">
            {initials}
          </AppText>
        </View>
        <View className="min-w-0 flex-1">
          <View className={cn('items-center gap-2', rowClassName)}>
            <AppText className="min-w-0 flex-1" variant="body-strong">
              {title}
            </AppText>
            {status ? (
              <AppText
                className={selected ? 'text-content-link' : 'text-content-secondary'}
                variant="caption"
              >
                {status}
              </AppText>
            ) : null}
          </View>
          <AppText className="mt-0.5 text-content-secondary" variant="caption">
            {description}
          </AppText>
        </View>
        <AppIcon
          name={
            selected
              ? { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }
              : { ios: 'circle', android: 'radio_button_unchecked', web: 'radio_button_unchecked' }
          }
          size={22}
          tone={selected ? 'success' : 'secondary'}
        />
      </View>
    </Radio>
  );
}
