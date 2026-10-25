import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { useAuthSession } from '@/features/auth/state/auth-session-store';
import { AppIcon, AppText, ConfirmationDialog } from '@/shared/components/ui';
import { ProfileAppearanceSettings } from './profile-appearance-settings';
import { ProfileMenuCard } from './profile-menu-card';

function MenuGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-2.5">
      <AppText align="right" variant="heading-4">
        {title}
      </AppText>
      <View className="overflow-hidden rounded-[15px] border border-border-subtle bg-surface-default">
        {children}
      </View>
    </View>
  );
}

export function ProfileMenuSection() {
  const router = useRouter();
  const { isAuthenticated, signOut } = useAuthSession();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const confirmLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutOpen(false);
    try {
      await signOut();
      router.replace('/(tabs)/home');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <View className="mt-5 gap-5">
      <MenuGroup title="الخصوصية والأمان">
        <ProfileMenuCard
          first
          title="إدارة حسابك"
          description="عرض وتعديل معلومات الملف الشخصي"
          icon={{ ios: 'person.crop.circle', android: 'manage_accounts', web: 'manage_accounts' }}
          onPress={() => router.push('/profile/info')}
        />
        <ProfileMenuCard
          title="الحساب والأمان"
          description="حماية الحساب والجلسات"
          icon={{ ios: 'shield.lefthalf.filled', android: 'security', web: 'security' }}
          onPress={() => router.push('/profile/security')}
        />
        <ProfileMenuCard
          title="الخصوصية والموافقات"
          description="التحكم في مشاركة البيانات"
          icon={{ ios: 'hand.raised.fill', android: 'privacy_tip', web: 'privacy_tip' }}
          onPress={() => router.push('/profile/privacy')}
        />
        <ProfileMenuCard
          title="بياناتي"
          description="الحصول على نسخة من بياناتك"
          icon={{ ios: 'externaldrive', android: 'storage', web: 'storage' }}
          onPress={() => router.push('/profile/data')}
        />
      </MenuGroup>

      <MenuGroup title="إعدادات التطبيق">
        <ProfileMenuCard
          first
          title="التفضيلات والإشعارات"
          description="تذكير المواعيد وتحديثات العلاج"
          icon={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }}
          onPress={() => router.push('/profile/settings')}
        />
        <ProfileAppearanceSettings />
      </MenuGroup>

      <MenuGroup title="المساعدة">
        <ProfileMenuCard
          first
          title="المساعدة والدعم"
          description="الأسئلة والمشكلات وطلبات الدعم"
          icon={{ ios: 'questionmark.circle', android: 'help_outline', web: 'help_outline' }}
          onPress={() => router.push('/support')}
        />
      </MenuGroup>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isAuthenticated ? 'تسجيل الخروج' : 'تسجيل الدخول'}
        className="min-h-[48px] flex-row-reverse items-center justify-center gap-2 rounded-[13px]"
        onPress={() => {
          if (isAuthenticated) setLogoutOpen(true);
          else router.push('/auth/phone');
        }}
      >
        <AppIcon
          name={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
          size={18}
          tone={isAuthenticated ? 'danger' : 'action'}
        />
        <AppText
          variant="label"
          className={
            isAuthenticated
              ? 'font-ui-semibold text-tone-danger-text'
              : 'font-ui-semibold text-content-link'
          }
        >
          {isAuthenticated ? 'تسجيل الخروج' : 'تسجيل الدخول'}
        </AppText>
      </Pressable>
      <ConfirmationDialog
        visible={logoutOpen}
        title="تسجيل الخروج؟"
        description="رح تنتهي جلستك على هالجهاز. بتقدر تسجّل الدخول مرة تانية بأي وقت."
        confirmLabel="تسجيل الخروج"
        cancelLabel="إلغاء"
        destructive
        loading={loggingOut}
        icon={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => void confirmLogout()}
      />
    </View>
  );
}
