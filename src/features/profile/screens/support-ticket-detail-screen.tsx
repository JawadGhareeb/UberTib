import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { topicTitle, useSupportTickets } from '@/features/profile/state/support-tickets-provider';
import { AppIcon, AppText, Button } from '@/shared/components/ui';

export function SupportTicketDetailScreen() {
  const router = useRouter();
  const { ticketId } = useLocalSearchParams<{ ticketId?: string }>();
  const { tickets } = useSupportTickets();
  const ticket = tickets.find((item) => item.id === ticketId);
  return (
    <ProfileScreenShell eyebrow="الدعم" title="تفاصيل طلب الدعم">
      {!ticket ? (
        <View className="mt-5 items-center gap-3 rounded-[16px] bg-surface-subtle p-6">
          <AppText variant="heading-4" align="center">
            الطلب غير موجود
          </AppText>
          <AppText variant="label" align="center" className="text-content-secondary">
            ممكن انتهت الجلسة التجريبية، أو الرابط غير صحيح.
          </AppText>
          <Button
            label="العودة إلى طلبات الدعم"
            onPress={() => router.replace('/support/tickets')}
          />
        </View>
      ) : (
        <View className="mt-3 gap-4">
          <View className="gap-2 rounded-[15px] border border-border-subtle bg-surface-default p-4">
            <AppText align="right" variant="heading-4">
              {ticket.subject}
            </AppText>
            <AppText align="right" variant="label" className="text-content-secondary">
              {topicTitle[ticket.topic]}
            </AppText>
            <View className="self-end rounded-full bg-tone-warning-fill px-3 py-1.5">
              <AppText variant="caption" className="font-ui-semibold text-tone-warning-text">
                مسودة محلية · غير مرسلة
              </AppText>
            </View>
            <View className="h-px bg-border-subtle" />
            <AppText variant="label" align="right">
              {ticket.description}
            </AppText>
          </View>

          {ticket.evidenceNames.length > 0 ? (
            <View className="gap-2 rounded-[14px] border border-border-subtle bg-surface-default p-3">
              <AppText variant="label" align="right" className="font-ui-semibold">
                المرفقات المختارة
              </AppText>
              {ticket.evidenceNames.map((name, index) => (
                <View key={index} className="flex-row-reverse items-center gap-2">
                  <AppIcon
                    name={{ ios: 'photo', android: 'image', web: 'image' }}
                    size={17}
                    tone="secondary"
                  />
                  <AppText variant="caption" align="right" className="text-content-secondary">
                    {name}
                  </AppText>
                </View>
              ))}
              <AppText variant="caption" align="right" className="text-content-secondary">
                ما تم رفع الملفات إلى أي خادم.
              </AppText>
            </View>
          ) : null}

          <View className="gap-2 rounded-[15px] border border-border-subtle bg-surface-default p-4">
            <AppText variant="heading-4" align="right">
              متابعة الطلب
            </AppText>
            <View className="flex-row-reverse items-start gap-3">
              <AppIcon
                name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
                size={21}
                tone="warning"
              />
              <View className="min-w-0 flex-1 items-end gap-1">
                <AppText variant="label" align="right" className="font-ui-semibold">
                  بانتظار ربط نظام الدعم
                </AppText>
                <AppText variant="caption" align="right" className="text-content-secondary">
                  ما في رقم رسمي أو مراجع أو قرار أو رد من فريق الدعم لسه.
                </AppText>
              </View>
            </View>
            <View className="h-px bg-border-subtle" />
            <AppText variant="label" align="right">
              وقت الاستجابة المتوقع (SLA)
            </AppText>
            <AppText variant="caption" align="right" className="text-content-secondary">
              غير محدد. رح يُعرض موعد الرد المعتمد عند استقبال التذكرة من خدمة الدعم، مو مدة
              افتراضية.
            </AppText>
          </View>
          <Button
            label="عرض طلبات الدعم"
            variant="outline"
            onPress={() => router.push('/support/tickets')}
          />
        </View>
      )}
    </ProfileScreenShell>
  );
}
