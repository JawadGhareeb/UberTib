import { Pressable, View } from 'react-native';

import { AppIcon, AppText } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { cn } from '@/shared/utils/cn';

export function BookingReviewSection({
  title,
  value,
  icon,
  expanded,
  onPress,
}: {
  title:string;
  value:string;
  icon:AppIconName;
  expanded:boolean;
  onPress:()=>void;
}) {
  return (
    <View className={cn('overflow-hidden rounded-[11px] border',expanded?'border-action-primary bg-action-subtle':'border-border-subtle bg-surface-subtle')}>
      <Pressable accessibilityRole="button" accessibilityState={{expanded}}
        className="min-h-[42px] flex-row items-center gap-2 px-3 py-2" onPress={onPress}>
        <AppIcon name={{ios:expanded?'chevron.up':'chevron.down',android:expanded?'expand_less':'expand_more',web:expanded?'expand_less':'expand_more'}} size={16} tone="action" />
        <AppText align="right" className="min-w-0 flex-1 font-ui-medium" variant="label">{title}</AppText>
        <AppIcon name={icon} size={17} tone="action"/>
      </Pressable>
      {expanded ? (
        <View className="border-t border-border-subtle px-3 pb-3 pt-2">
          <AppText align="right" className="font-ui-semibold" variant="caption">{value}</AppText>
        </View>
      ) : null}
    </View>
  );
}
