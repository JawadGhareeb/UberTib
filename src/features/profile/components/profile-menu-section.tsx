import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppText } from '@/shared/components/ui';
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

    </View>
  );
}
