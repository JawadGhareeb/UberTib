import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ProfileNavRow, ProfileSection } from '@/features/profile/components/profile-v5-ui';
import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { SettingsToggleRow } from '@/features/profile/components/settings-toggle-row';
import { useProfilePrivacy } from '@/features/profile/state/profile-privacy-provider';
import { useAppDirection } from '@/providers/app-direction-provider';
import { useAuthSession } from '@/providers/auth-session-provider';
import { AppIcon, AppText, Button, ConfirmationDialog, StatusIndicator } from '@/shared/components/ui';
import { mockPatientWorld } from '@/shared/mock/patient.mock';
import { useAppTheme } from '@/shared/theme/theme-provider';
import { cn } from '@/shared/utils/cn';

export function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuthSession();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const { rowClassName } = useAppDirection();
  const { scheme, setScheme } = useAppTheme();
  const { sessions } = useProfilePrivacy();
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [careUpdates, setCareUpdates] = useState(true);
  const [accountUpdates, setAccountUpdates] = useState(false);

  return (
    <ProfileScreenShell
      description="إدارة الأمان والموافقات وحقوق البيانات من مكان واحد."
      eyebrow="الحساب والإعدادات"
      title={mockPatientWorld.account.name}
    >
      <View className="mt-4 rounded-[16px] border border-border-subtle bg-surface-default p-4">
        <View className={cn('items-center gap-3', rowClassName)}>
          <View className="h-12 w-12 items-center justify-center rounded-[14px] bg-action-subtle">
            <AppIcon
              name={{ ios: 'person.fill', android: 'person', web: 'person' }}
              size={22}
              tone="action"
            />
          </View>
          <View className="min-w-0 flex-1 items-end">
            <AppText className="font-ui-bold" variant="body-strong">
              الحساب والخصوصية والأمان
            </AppText>
            <AppText direction="ltr" className="mt-0.5 text-content-secondary" variant="caption">
              {mockPatientWorld.account.phone} · الهاتف موثّق
            </AppText>
          </View>
          <StatusIndicator label="موثّق" tone="success" />
        </View>
      </View>

      <ProfileSection title="الخصوصية والأمان">
        <View className="overflow-hidden rounded-surface border border-border-default bg-surface-default">
          <ProfileNavRow
            description={`الهاتف الموثّق · رمز الدخول · ${sessions.length} جلسات نشطة`}
            first
            icon={{ ios: 'lock.shield.fill', android: 'security', web: 'security' }}
            onPress={() => router.push('/profile/security')}
            title="الحساب والأمان"
          />
          <ProfileNavRow
            description="موافقات منفصلة وسجل إصدارات لا يُستبدل"
            icon={{ ios: 'hand.raised.fill', android: 'privacy_tip', web: 'privacy_tip' }}
            onPress={() => router.push('/profile/privacy')}
            title="الخصوصية والموافقات"
          />
          <ProfileNavRow
            description="اطلب نسخة وتابع حالة تجهيزها"
            icon={{ ios: 'arrow.down.doc.fill', android: 'download', web: 'download' }}
            onPress={() => router.push('/profile/data')}
            title="بياناتي"
          />
          <ProfileNavRow
            description="طلب محكوم مع توضيح الاحتفاظ قبل التأكيد"
            icon={{
              ios: 'person.crop.circle.badge.xmark',
              android: 'person_off',
              web: 'person_off',
            }}
            onPress={() => router.push('/profile/account-closure')}
            title="إغلاق الحساب / طلب الحذف"
          />
        </View>
        <AppText className="mt-2 text-content-secondary" variant="caption">
          الإجراءات الحساسة تتطلب إعادة التحقق من الهوية.
        </AppText>
      </ProfileSection>

      <ProfileSection title="المظهر">
        <Pressable
          accessibilityLabel={`تغيير المظهر، الحالي ${scheme === 'light' ? 'فاتح' : 'داكن'}`}
          accessibilityRole="button"
          className={cn(
            'min-h-12 items-center justify-between rounded-[10px] border border-border-subtle bg-surface-default px-[10px]',
            rowClassName,
          )}
          onPress={() => setScheme(scheme === 'light' ? 'dark' : 'light')}
        >
          <AppIcon
            name={
              scheme === 'light'
                ? { ios: 'sun.max.fill', android: 'light_mode', web: 'light_mode' }
                : { ios: 'moon.fill', android: 'dark_mode', web: 'dark_mode' }
            }
            size={18}
            tone="action"
          />
          <AppText className="font-ui-medium" variant="label">
            المظهر · {scheme === 'light' ? 'فاتح' : 'داكن'}
          </AppText>
        </Pressable>
      </ProfileSection>

      <ProfileSection title="الإشعارات">
        <View className="overflow-hidden rounded-surface border border-border-default bg-surface-default">
          <SettingsToggleRow
            description="تنبيه قبل المواعيد القادمة"
            onValueChange={setAppointmentReminders}
            title="تذكير المواعيد"
            value={appointmentReminders}
          />
          <View className="h-px bg-border-subtle" />
          <SettingsToggleRow
            description="تحديثات الخطة والمتابعة والحالة العلاجية"
            onValueChange={setCareUpdates}
            title="تحديثات الرعاية"
            value={careUpdates}
          />
          <View className="h-px bg-border-subtle" />
          <SettingsToggleRow
            description="التنبيهات المتعلقة بالحساب والتمثيل"
            onValueChange={setAccountUpdates}
            title="تحديثات الحساب"
            value={accountUpdates}
          />
        </View>
      </ProfileSection>

      <ProfileSection title="روابط سريعة">
        <View className="overflow-hidden rounded-surface border border-border-default bg-surface-default">
          <ProfileNavRow
            description="عرض آخر التحديثات والتنبيهات"
            first
            icon={{ ios: 'bell', android: 'notifications_none', web: 'notifications_none' }}
            onPress={() => router.push('/notifications')}
            title="الإشعارات"
          />
          <ProfileNavRow
            description="القادمة والسابقة"
            icon={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
            onPress={() => router.push('/booking')}
            title="مواعيدي"
          />
          <ProfileNavRow
            description="التابعون والتفويضات وسياق المريض"
            icon={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
            onPress={() => router.push('/profile/family')}
            title="العائلة والتمثيل"
          />
          <ProfileNavRow
            description="الحساسيات وعلاج الأسنان والسجلات الطبية"
            icon={{ ios: 'heart.text.square', android: 'monitor_heart', web: 'monitor_heart' }}
            onPress={() => router.push('/profile/health')}
            title="معلوماتي الصحية"
          />
          <ProfileNavRow
            description="التذاكر والمشكلات والاعتراضات"
            icon={{ ios: 'questionmark.circle', android: 'help_outline', web: 'help_outline' }}
            onPress={() => router.push('/support')}
            title="المساعدة والدعم"
          />
        </View>
      </ProfileSection>

      <Button
        className="mt-5"
        label="تسجيل الخروج"
        onPress={() => setLogoutDialogVisible(true)}
        variant="outline"
      />
      <ConfirmationDialog
        confirmLabel="تسجيل الخروج"
        description="سيتم إنهاء جلستك على هذا الجهاز. يمكنك تسجيل الدخول من جديد."
        destructive
        icon={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
        onCancel={() => setLogoutDialogVisible(false)}
        onConfirm={() => {
          setLogoutDialogVisible(false);
          signOut();
          router.replace('/');
        }}
        title="تأكيد تسجيل الخروج"
        visible={logoutDialogVisible}
      />
    </ProfileScreenShell>
  );
}
