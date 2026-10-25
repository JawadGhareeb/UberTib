import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { ProfilePhoneChangeDialogs } from '@/features/profile/components/profile-phone-change-dialogs';
import { useProfilePrivacy } from '@/features/profile/state/profile-privacy-store';
import { useAccountDetails } from '@/features/profile/state/account-details-store';
import { AppIcon, AppText, ConfirmationDialog, ReadStateBoundary } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';

export function AccountSecurityScreen() {
  const router = useRouter();
  const getSurfaceState = useMockScenario((state) => state.getSurfaceState);
  useMockScenario((state) => state.scenarioId);
  const { phone } = useAccountDetails();
  const { securityMethod, sessions, endSession, endOtherSessions } = useProfilePrivacy();
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [pending, setPending] = useState<{ type: 'session'; id: string } | { type: 'all' } | null>(
    null,
  );

  return (
    <ProfileScreenShell
      eyebrow="الحساب والأمان"
      title="الحساب والأمان"
      description="معلومات الحماية والتحكم بالجلسات على أجهزتك."
    >
      <ReadStateBoundary
        state={getSurfaceState('profile')}
        emptyTitle="معلومات الأمان غير متاحة"
        permissionTitle="ما عندك صلاحية لعرض معلومات الأمان"
      >
        <View className="gap-2">
          <AppText variant="heading-4" align="right">
            معلومات الأمان
          </AppText>
          <View className="overflow-hidden rounded-[15px] border border-border-subtle bg-surface-default">
            <View className="min-h-[62px] flex-row-reverse items-center gap-3 px-3 py-3">
              <AppIcon
                name={{ ios: 'phone', android: 'phone', web: 'phone' }}
                size={21}
                tone="action"
              />
              <View className="min-w-0 flex-1 items-end gap-0.5">
                <AppText align="right" variant="label" className="font-ui-semibold">
                  رقم الهاتف الموثّق
                </AppText>
                <AppText
                  align="right"
                  direction="ltr"
                  variant="caption"
                  className="text-content-secondary"
                >
                  {phone}
                </AppText>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="تغيير رقم الهاتف"
                className="min-h-[42px] justify-center rounded-[10px] bg-action-subtle px-3"
                onPress={() => setPhoneDialogOpen(true)}
              >
                <AppText variant="label" className="font-ui-semibold text-content-link">
                  تغيير
                </AppText>
              </Pressable>
            </View>
            <View className="h-px bg-border-subtle" />
            <View className="min-h-[62px] flex-row-reverse items-center gap-3 px-3 py-3">
              <AppIcon
                name={{ ios: 'lock.shield', android: 'verified_user', web: 'verified_user' }}
                size={21}
                tone="action"
              />
              <View className="min-w-0 flex-1 items-end gap-0.5">
                <AppText align="right" variant="label" className="font-ui-semibold">
                  طريقة حماية الحساب
                </AppText>
                <AppText align="right" variant="caption" className="text-content-secondary">
                  {securityMethod}
                </AppText>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-5 gap-2">
          <AppText align="right" variant="heading-4">
            الجلسات والأجهزة
          </AppText>
          <View className="overflow-hidden rounded-[15px] border border-border-subtle bg-surface-default">
            {sessions.map((session, index) => (
              <View
                key={session.id}
                className={
                  'min-h-[64px] flex-row-reverse items-center gap-3 px-3 py-3 ' +
                  (index ? 'border-t border-border-subtle' : '')
                }
              >
                <AppIcon
                  name={{ ios: 'iphone', android: 'smartphone', web: 'smartphone' }}
                  size={22}
                  tone="secondary"
                />
                <View className="min-w-0 flex-1 items-end gap-1">
                  <AppText align="right" variant="label" className="font-ui-semibold">
                    {session.label}
                  </AppText>
                  <AppText
                    align="right"
                    variant="caption"
                    className="text-content-secondary"
                    numberOfLines={2}
                  >
                    {session.activityLabel}
                  </AppText>
                </View>
                {session.current ? (
                  <AppText variant="caption" className="text-content-link">
                    هذا الجهاز
                  </AppText>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={'إنهاء جلسة ' + session.label}
                    onPress={() => setPending({ type: 'session', id: session.id })}
                    className="min-h-[40px] justify-center rounded-[10px] bg-tone-danger-fill px-2"
                  >
                    <AppText variant="caption" className="font-ui-semibold text-tone-danger-text">
                      إنهاء
                    </AppText>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
          {sessions.some((session) => !session.current) ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setPending({ type: 'all' })}
              className="min-h-[44px] self-end justify-center px-2"
            >
              <AppText variant="label" className="text-tone-danger-text">
                إنهاء الجلسات الأخرى
              </AppText>
            </Pressable>
          ) : null}
          <AppText variant="caption" align="right" className="text-content-secondary">
            إجراءات إدارة الأجهزة تحتاج مزامنة مع حسابك حتى تُطبّق على الأجهزة الأخرى.
          </AppText>
        </View>

        <View className="mt-5 gap-2">
          <AppText variant="heading-4" align="right">
            إجراءات الحساب
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="إغلاق الحساب أو طلب الحذف"
            onPress={() => router.push('/profile/account-closure')}
            className="min-h-[58px] flex-row-reverse items-center gap-3 rounded-[14px] border border-border-subtle bg-surface-default px-3"
          >
            <AppIcon
              name={{
                ios: 'person.crop.circle.badge.xmark',
                android: 'person_off',
                web: 'person_off',
              }}
              size={20}
              tone="danger"
            />
            <View className="min-w-0 flex-1 items-end">
              <AppText variant="label" className="font-ui-semibold text-tone-danger-text">
                إغلاق الحساب / طلب الحذف
              </AppText>
            </View>
            <AppIcon
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              size={17}
              tone="secondary"
            />
          </Pressable>
        </View>
      </ReadStateBoundary>
      {phoneDialogOpen ? (
        <ProfilePhoneChangeDialogs visible onClose={() => setPhoneDialogOpen(false)} />
      ) : null}
      <ConfirmationDialog
        visible={pending !== null}
        title="إنهاء الجلسة؟"
        description="سيُحدّث سجل الجلسات في التطبيق. إنهاء الجلسات على الأجهزة الأخرى يتطلب تأكيد الحساب."
        confirmLabel="إنهاء"
        cancelLabel="إلغاء"
        destructive
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending?.type === 'session') endSession(pending.id);
          if (pending?.type === 'all') endOtherSessions();
          setPending(null);
        }}
      />
    </ProfileScreenShell>
  );
}
