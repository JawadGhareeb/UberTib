import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { ReferenceCard, ReferenceHeader, ReferenceIcon } from '@/features/profile/components/patient-reference-ui';
import { getMockNeedsAttentionForScenario, getMockNotificationsForScenario } from '@/features/platform/mocks/platform.mock';
import { AppIcon, AppText, ReadStateBoundary, Screen } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { useMockScenario } from '@/shared/mock';
import { cn } from '@/shared/utils/cn';

const glyphs = {
  calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  plan: { ios: 'checkmark.seal.fill', android: 'fact_check', web: 'fact_check' },
  receipt: { ios: 'doc.text', android: 'receipt_long', web: 'receipt_long' },
  bell: { ios: 'bell.badge.fill', android: 'notifications_active', web: 'notifications_active' },
  image: { ios: 'photo.badge.plus', android: 'add_photo_alternate', web: 'add_photo_alternate' },
} as const satisfies Record<string, AppIconName>;

function notificationIcon(text: string): AppIconName {
  if (text.includes('موعد') || text.includes('حجز')) return glyphs.calendar;
  if (text.includes('دفع') || text.includes('مالي')) return glyphs.receipt;
  if (text.includes('خطة') || text.includes('علاج')) return glyphs.plan;
  if (text.includes('صور') || text.includes('ملف')) return glyphs.image;
  return glyphs.bell;
}

export function NotificationCentreScreen() {
  const router = useRouter();
  const { getSurfaceState, markNotificationRead, readNotificationIds, scenario } = useMockScenario();
  const [tab, setTab] = useState<'attention' | 'history'>('attention');
  const readState = getSurfaceState('notifications');
  const attentionState = getSurfaceState('attention');
  const notifications = getMockNotificationsForScenario(scenario).map((item) => ({
    ...item,
    unread: item.unread && !readNotificationIds.includes(item.id),
  }));
  const actions = getMockNeedsAttentionForScenario(scenario);
  const unreadCount = readState === 'empty-no-data' ? 0 : notifications.filter((x) => x.unread).length;
  const isHistory = tab === 'history';
  const actionRows = actions;
  const historyRows = notifications;

  return (
    <Screen contentClassName="px-0 py-0">
      <ReferenceHeader title="الإشعارات" icon={{ ios: 'checkmark.circle', android: 'done_all', web: 'done_all' }} />
      <ScrollView
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-20 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <View className="h-[43px] flex-row-reverse gap-1 rounded-[12px] bg-surface-subtle p-1">
          {[
            { id: 'attention' as const, label: `${actions.length} · مطلوب الآن` },
            { id: 'history' as const, label: 'سجل الإشعارات' },
          ].map((item) => (
            <Pressable accessibilityRole="tab" accessibilityState={{ selected: tab === item.id }}
              className={cn('min-w-0 flex-1 items-center justify-center rounded-[9px]', tab === item.id && 'bg-surface-default')}
              key={item.id} onPress={() => setTab(item.id)}>
              <AppText align="center" className={cn('font-ui-semibold', tab === item.id ? 'text-content-link' : 'text-content-secondary')} style={{ fontSize: 11, lineHeight: 17 }} variant="caption">{item.label}</AppText>
            </Pressable>
          ))}
        </View>

        {!isHistory ? (
          <ReadStateBoundary state={attentionState} emptyTitle="ما في شي يحتاج إجراء حالياً" emptyDescription="بتظهر هنا المواعيد والمهام اللي بتحتاج انتباهك.">
            <View className="mt-3 flex-row-reverse items-center gap-3 rounded-[15px] bg-action-subtle p-3">
              <ReferenceIcon icon={glyphs.bell} warm size={64} />
              <View className="min-w-0 flex-1 items-end gap-1">
                <AppText align="right" className="font-ui-bold" style={{ fontSize: 15, lineHeight: 22 }} variant="label">لديك إجراءات تحتاج انتباهك</AppText>
                <AppText align="right" className="text-content-secondary" style={{ fontSize: 11, lineHeight: 18 }} variant="caption">تابع المهام الظاهرة قبل انتهاء مهلتها عند وجود موعد محدد.</AppText>
              </View>
            </View>

            <View className="mt-3 flex-row-reverse items-center justify-between">
              <AppText className="font-ui-bold" variant="label">يتطلب إجراء</AppText>
              <AppText className="text-content-secondary" variant="caption">مرتبة حسب أولوية الحالة</AppText>
            </View>
            <View className="mt-2 gap-[7px]">
              {actionRows.map((item, index) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                  key={item.id}
                  onPress={() => router.push(item.href)}
                >
                  <ReferenceCard className="min-h-[74px] flex-row-reverse items-center gap-2.5 px-[10px] py-2">
                    <ReferenceIcon icon={notificationIcon(item.title)} warm={item.tone === 'warning'} size={42} />
                    <View className="min-w-0 flex-1 items-end">
                      <AppText align="right" className="font-ui-semibold" numberOfLines={2} style={{ fontSize: 12, lineHeight: 19 }} variant="label">{item.title}</AppText>
                      <AppText align="right" className="mt-1 text-content-secondary" numberOfLines={2} style={{ fontSize: 10, lineHeight: 17 }} variant="caption">{item.detail}</AppText>
                    </View>
                    <View className={cn('rounded-[8px] px-2 py-1', index === 0 ? 'bg-tone-warning-fill' : 'bg-action-subtle')}>
                      <AppText className={index === 0 ? 'text-tone-warning-text' : 'text-content-link'} style={{ fontSize: 9, lineHeight: 15 }} variant="caption">{item.actionLabel}</AppText>
                    </View>
                  </ReferenceCard>
                </Pressable>
              ))}
            </View>
          </ReadStateBoundary>
        ) : null}

        <ReadStateBoundary state={readState} emptyTitle="ما عندك إشعارات حالياً" emptyDescription="بتظهر هون تحديثات الرعاية والحجوزات عند توفرها.">
          <View className="mt-3 flex-row-reverse items-center justify-between rounded-[11px] bg-surface-subtle px-3 py-2.5">
            <AppText className="font-ui-semibold" variant="caption">آخر الإشعارات</AppText>
            <AppText className="text-content-link" variant="caption">{unreadCount} غير مقروءة</AppText>
          </View>
          <View className="mt-2 gap-1.5">
            {historyRows.map((item) => (
              <Pressable accessibilityLabel={item.title} accessibilityRole="button" key={item.id}
                className="min-h-[65px] flex-row-reverse items-center gap-2 rounded-[11px] bg-surface-subtle px-3 py-2.5"
                onPress={() => { if (item.unread) markNotificationRead(item.id); router.push(item.href); }}>
                <ReferenceIcon icon={notificationIcon(item.title)} size={34} />
                <View className="min-w-0 flex-1 items-end">
                  <AppText align="right" className="font-ui-semibold" style={{ fontSize: 11, lineHeight: 17 }} variant="caption">{item.title}{item.unread ? ' · جديد' : ''}</AppText>
                  <AppText align="right" className="text-content-secondary" style={{ fontSize: 10, lineHeight: 16 }} variant="caption">{item.detail} · {item.timeLabel}</AppText>
                </View>
                <AppIcon name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }} tone="secondary" size={15} />
              </Pressable>
            ))}
          </View>
        </ReadStateBoundary>
      </ScrollView>
    </Screen>
  );
}
