import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppHeader } from '@/shared/components/navigation';
import { SectionTabs } from '@/shared/components/ui/section-tabs';
import {
  getMockNeedsAttentionForScenario,
  getMockNotificationsForScenario,
} from '@/features/platform/mocks/platform.mock';
import { AppIcon, AppText, ReadStateBoundary, Screen } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { useMockScenario } from '@/shared/mock';

const icons = {
  calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  care: { ios: 'heart.text.square', android: 'monitor_heart', web: 'monitor_heart' },
  finance: { ios: 'doc.text', android: 'receipt_long', web: 'receipt_long' },
  bell: { ios: 'bell', android: 'notifications', web: 'notifications' },
} as const satisfies Record<string, AppIconName>;

function iconFor(title: string): AppIconName {
  if (/موعد|حجز/.test(title)) return icons.calendar;
  if (/مالي|دفع|استرداد/.test(title)) return icons.finance;
  if (/علاج|خطة|متابعة/.test(title)) return icons.care;
  return icons.bell;
}
type NotificationTab = 'attention' | 'history';

export function NotificationCentreScreen() {
  const router = useRouter();
  const { getSurfaceState, markNotificationRead, readNotificationIds, scenario } =
    useMockScenario();
  const [tab, setTab] = useState<NotificationTab>('attention');
  const actions = getMockNeedsAttentionForScenario(scenario);
  const notifications = getMockNotificationsForScenario(scenario).map((item) => ({
    ...item,
    unread: item.unread && !readNotificationIds.includes(item.id),
  }));
  const unread = notifications.filter((item) => item.unread).length;

  return (
    <Screen
      contentClassName="px-0 py-0"
      header={<AppHeader title="الإشعارات" variant="detail" showBack />}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerClassName="mx-auto w-full max-w-[430px] gap-4 px-4 pb-20 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <SectionTabs
          value={tab}
          onValueChange={setTab}
          items={[
            { value: 'attention', label: 'مطلوب منك', count: actions.length },
            { value: 'history', label: 'كل الإشعارات', count: unread },
          ]}
        />
        {tab === 'attention' ? (
          <ReadStateBoundary
            state={getSurfaceState('attention')}
            emptyTitle="ما في شي يحتاج إجراء حالياً"
            emptyDescription="أي مهام أو مواعيد بحاجة لقرار منك رح تظهر هون."
          >
            <View className="gap-2">
              <AppText variant="heading-4" align="right">
                إجراءات تحتاج انتباهك
              </AppText>
              {actions.map((item) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                  className="min-h-[90px] flex-row-reverse items-center gap-3 rounded-[15px] border border-border-subtle bg-surface-default p-3"
                  onPress={() => router.push(item.href)}
                >
                  <View
                    className={
                      'h-11 w-11 shrink-0 items-center justify-center rounded-[12px] ' +
                      (item.tone === 'warning' ? 'bg-tone-warning-fill' : 'bg-action-subtle')
                    }
                  >
                    <AppIcon
                      name={iconFor(item.title)}
                      size={22}
                      tone={item.tone === 'warning' ? 'warning' : 'action'}
                    />
                  </View>
                  <View className="min-w-0 flex-1 items-end gap-1">
                    <AppText
                      align="right"
                      variant="label"
                      className="font-ui-semibold"
                      numberOfLines={2}
                    >
                      {item.title}
                    </AppText>
                    <AppText
                      align="right"
                      variant="caption"
                      className="text-content-secondary"
                      numberOfLines={2}
                    >
                      {item.detail}
                    </AppText>
                    <AppText
                      align="right"
                      variant="caption"
                      className="font-ui-semibold text-content-link"
                    >
                      {item.actionLabel}
                    </AppText>
                  </View>
                  <AppIcon
                    name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                    size={16}
                    tone="secondary"
                  />
                </Pressable>
              ))}
            </View>
          </ReadStateBoundary>
        ) : (
          <ReadStateBoundary
            state={getSurfaceState('notifications')}
            emptyTitle="ما عندك إشعارات حالياً"
            emptyDescription="بتظهر هون تحديثات الرعاية والحجوزات عند توفرها."
          >
            <View className="gap-2">
              <View className="flex-row-reverse items-center justify-between">
                <AppText align="right" variant="heading-4">
                  سجل الإشعارات
                </AppText>
                {unread > 0 ? (
                  <AppText variant="caption" className="text-content-link">
                    {unread} غير مقروءة
                  </AppText>
                ) : null}
              </View>
              {notifications.map((item) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                  onPress={() => {
                    if (item.unread) markNotificationRead(item.id);
                    router.push(item.href);
                  }}
                  className={
                    'min-h-[82px] flex-row-reverse items-center gap-3 rounded-[15px] border border-border-subtle p-3 ' +
                    (item.unread ? 'bg-action-subtle' : 'bg-surface-default')
                  }
                >
                  <View className="h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-surface-default">
                    <AppIcon name={iconFor(item.title)} size={20} tone="action" />
                  </View>
                  <View className="min-w-0 flex-1 items-end gap-1">
                    <View className="flex-row-reverse items-center gap-2">
                      <AppText
                        align="right"
                        variant="label"
                        className="min-w-0 flex-1 font-ui-semibold"
                        numberOfLines={2}
                      >
                        {item.title}
                      </AppText>
                      {item.unread ? (
                        <View className="h-[7px] w-[7px] rounded-full bg-action-primary" />
                      ) : null}
                    </View>
                    <AppText
                      align="right"
                      variant="caption"
                      className="text-content-secondary"
                      numberOfLines={2}
                    >
                      {item.detail}
                    </AppText>
                    <AppText variant="caption" className="text-content-secondary">
                      {item.timeLabel}
                    </AppText>
                  </View>
                  <AppIcon
                    name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                    size={16}
                    tone="secondary"
                  />
                </Pressable>
              ))}
            </View>
          </ReadStateBoundary>
        )}
      </ScrollView>
    </Screen>
  );
}
