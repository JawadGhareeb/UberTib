import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { topicTitle, useSupportTickets } from '@/features/profile/state/support-tickets-store';
import { AppIcon, AppText, Button } from '@/shared/components/ui';

export function SupportTicketListScreen() {
  const router = useRouter();
  const { tickets } = useSupportTickets();

  return (
    <ProfileScreenShell eyebrow="الدعم" title="طلبات الدعم">
      <View className="gap-3">
        {tickets.length === 0 ? (
          <View className="items-center gap-3 rounded-[16px] border border-border-subtle bg-surface-default px-4 py-8">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-action-subtle">
              <AppIcon
                name={{ ios: 'tray', android: 'inbox', web: 'inbox' }}
                size={27}
                tone="action"
              />
            </View>
            <AppText align="center" variant="heading-4">
              ما في طلبات دعم محفوظة
            </AppText>
            <AppText align="center" variant="label" className="text-content-secondary">
              عند حفظ طلب دعم جديد، رح يظهر هون ضمن طلباتك.
            </AppText>
            <Button label="إنشاء طلب دعم" onPress={() => router.push('/support/new')} />
          </View>
        ) : (
          <>
            <AppText align="right" variant="caption" className="text-content-secondary">
              الطلبات المعروضة محفوظة على الجهاز، وليست تذاكر مؤكدة لدى فريق الدعم.
            </AppText>
            {tickets.map((ticket) => (
              <Pressable
                key={ticket.id}
                accessibilityRole="button"
                accessibilityLabel={'تفاصيل الطلب ' + ticket.subject}
                onPress={() =>
                  router.push({
                    pathname: '/support/tickets/[ticketId]',
                    params: { ticketId: ticket.id },
                  })
                }
                className="min-h-[91px] flex-row-reverse items-center gap-3 rounded-[15px] border border-border-subtle bg-surface-default p-3"
              >
                <View className="h-11 w-11 shrink-0 items-center justify-center rounded-[11px] bg-action-subtle">
                  <AppIcon
                    name={{
                      ios: 'ticket',
                      android: 'confirmation_number',
                      web: 'confirmation_number',
                    }}
                    size={23}
                    tone="action"
                  />
                </View>
                <View className="min-w-0 flex-1 items-end gap-1">
                  <AppText
                    align="right"
                    variant="label"
                    className="font-ui-semibold"
                    numberOfLines={2}
                  >
                    {ticket.subject}
                  </AppText>
                  <AppText align="right" variant="caption" className="text-content-secondary">
                    {topicTitle[ticket.topic]}
                  </AppText>
                  <AppText align="right" variant="caption" className="text-tone-warning-text">
                    محفوظ على الجهاز
                  </AppText>
                </View>
                <AppIcon
                  name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                  size={17}
                  tone="secondary"
                />
              </Pressable>
            ))}
            <Button
              label="إنشاء طلب جديد"
              variant="outline"
              onPress={() => router.push('/support/new')}
            />
          </>
        )}
      </View>
    </ProfileScreenShell>
  );
}
