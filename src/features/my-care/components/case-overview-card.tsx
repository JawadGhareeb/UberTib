import { Card as HeroCard } from 'heroui-native';
import { Pressable, View } from 'react-native';
import type { MockCareCase } from '@/features/my-care/mocks/care.mock';
import { AppText, StatusIndicator } from '@/shared/components/ui';
import { CenteredActionIcon } from '@/shared/components/ui/centered-action-icon';

export function CaseRow({ item, onPress }: { item: MockCareCase; onPress: () => void }) {
  const complete = item.progress >= 100;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'تفاصيل الحالة العلاجية: ' + item.title}
      onPress={onPress}
    >
      <HeroCard
        variant="default"
        className="gap-2 rounded-[14px] border border-border-subtle bg-surface-default p-3"
      >
        <View className="flex-row-reverse items-center gap-2">
          <CenteredActionIcon name="care" frameSize={40} iconSize={20} />
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" variant="caption">
              حالة علاجية
            </AppText>
            <AppText align="right" variant="body-strong" numberOfLines={2}>
              {item.title}
            </AppText>
          </View>
          <StatusIndicator label={item.statusLabel} tone={complete ? 'success' : 'info'} />
        </View>
        <AppText align="right" variant="label">
          {item.provider} · {item.branch}
        </AppText>
        <AppText align="right" variant="caption">
          {item.nextAction}
        </AppText>
        <View
          accessibilityLabel={'تقدم العلاج ' + item.progress + ' بالمئة'}
          accessible
          className="h-[5px] overflow-hidden rounded-full bg-surface-subtle"
        >
          <View
            className="h-full rounded-full bg-action-primary"
            style={{ width: `${Math.min(100, Math.max(0, item.progress))}%` }}
          />
        </View>
        <View className="flex-row-reverse items-center justify-between">
          <AppText variant="caption">{item.progress}% من الخطة</AppText>
          <AppText variant="label" className="text-content-link">
            عرض الحالة
          </AppText>
        </View>
      </HeroCard>
    </Pressable>
  );
}
