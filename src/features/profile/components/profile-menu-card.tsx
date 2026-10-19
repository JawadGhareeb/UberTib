import { Pressable, View } from 'react-native';
import { ReferenceCard, ReferenceIcon } from './patient-reference-ui';
import { AppIcon, AppText } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { cn } from '@/shared/utils/cn';

export function ProfileMenuCard({
  title,
  description,
  icon,
  onPress,
  danger = false,
}: {
  title: string;
  description: string;
  icon: AppIconName;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <ReferenceCard
        className={cn(
          'min-h-[66px] flex-row-reverse items-center gap-[9px] px-[10px] py-[9px]',
          danger && 'border-tone-danger-border bg-tone-danger-fill/70',
        )}
      >
        <ReferenceIcon icon={icon} size={37} warm={danger} />
        <View className="min-w-0 flex-1 items-end">
          <AppText
            align="right"
            className={cn('font-ui-semibold', danger && 'text-tone-danger-text')}
            numberOfLines={2}
            style={{ fontSize: 12, lineHeight: 19 }}
            variant="label"
          >
            {title}
          </AppText>
          <AppText
            align="right"
            className="mt-0.5 text-content-secondary"
            numberOfLines={2}
            style={{ fontSize: 9.5, lineHeight: 15 }}
            variant="caption"
          >
            {description}
          </AppText>
        </View>
        <AppIcon
          name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
          size={16}
          tone={danger ? 'danger' : 'secondary'}
        />
      </ReferenceCard>
    </Pressable>
  );
}
