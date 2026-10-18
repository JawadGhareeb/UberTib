import { Pressable, View } from 'react-native';

import { useAppDirection } from '@/providers/app-direction-provider';
import { AppIcon, type AppIconName } from '@/shared/components/ui/app-icon';
import { AppText } from '@/shared/components/ui/app-text';
import type { StatusTone } from '@/shared/components/ui/status-indicator';
import { cn } from '@/shared/utils/cn';

interface AttentionItemProps {
  title: string;
  detail: string;
  tone?: StatusTone;
  actionLabel?: string;
  divider?: boolean;
  onPress: () => void;
}

const toneIcons: Record<StatusTone, AppIconName> = {
  neutral: 'circle.fill',
  info: 'info.circle.fill',
  success: 'checkmark.circle.fill',
  warning: 'exclamationmark.triangle.fill',
  danger: 'xmark.octagon.fill',
  restricted: 'lock.fill',
};

export function AttentionItem({
  title,
  detail,
  tone = 'neutral',
  actionLabel,
  divider = false,
  onPress,
}: AttentionItemProps) {
  const { rowClassName } = useAppDirection();

  return (
    <Pressable
      accessibilityLabel={[title, detail, actionLabel].filter(Boolean).join('. ')}
      accessibilityRole="button"
      className={cn(
        'min-h-target-comfortable px-4 py-3.5 active:bg-action-subtle',
        divider && 'border-t border-border-subtle',
      )}
      onPress={onPress}
    >
      <View className={cn('items-start gap-3', rowClassName)}>
        <View className="h-9 w-9 shrink-0 items-center justify-center rounded-full bg-action-primary">
          <AppIcon name={toneIcons[tone]} size={18} tone="onAction" />
        </View>

        <View className="min-w-0 flex-1">
          <AppText variant="body-strong">{title}</AppText>
          <AppText className="mt-0.5 text-content-secondary" variant="caption">
            {detail}
          </AppText>
          {actionLabel ? (
            <AppText className="mt-2 text-content-link" variant="label">
              {actionLabel}
            </AppText>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
