import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { usePreferredLocation } from '@/features/location/state/preferred-location-provider';
import { AppText } from '@/shared/components/ui';
import { ProfileAppearanceSettings } from './profile-appearance-settings';
import { ProfileMenuCard } from './profile-menu-card';

function MenuGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-2.5">
      <AppText align="right" variant="heading-4">
        {title}
      </AppText>
      {children}
    </View>
  );
}

export function ProfileMenuSection() {
  const router = useRouter();
  const { location } = usePreferredLocation();

  return (
    <View className="mt-5 gap-5">
      <MenuGroup title="إعدادات التطبيق">
        <ProfileMenuCard
          title="منطقتي"
          description={location?.label ?? 'حدّد منطقتك على الخريطة'}
          icon={{ ios: 'mappin.and.ellipse', android: 'place', web: 'place' }}
          onPress={() => router.push('/location-picker')}
        />
        <ProfileMenuCard
          title="الإعدادات"
          description="تذكيرات المواعيد وتحديثات التطبيق"
          icon={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }}
          onPress={() => router.push('/profile/settings')}
        />
        <ProfileAppearanceSettings />
      </MenuGroup>

      <MenuGroup title="الخصوصية والأمان">
        <ProfileMenuCard
          title="الحساب والأمان"
          description="الهاتف الموثّق · رمز الدخول · الجلسات"
          icon={{ ios: 'shield.lefthalf.filled', android: 'security', web: 'security' }}
          onPress={() => router.push('/profile/security')}
        />
        <ProfileMenuCard
          title="الخصوصية والموافقات"
          description="التحكم بالموافقات والاطلاع على سجلها"
          icon={{ ios: 'hand.raised.fill', android: 'privacy_tip', web: 'privacy_tip' }}
          onPress={() => router.push('/profile/privacy')}
        />
        <ProfileMenuCard
          title="بياناتي"
          description="طلب نسخة من البيانات ومتابعة تجهيزها"
          icon={{ ios: 'externaldrive', android: 'storage', web: 'storage' }}
          onPress={() => router.push('/profile/data')}
        />
        <AppText align="right" variant="caption" className="text-content-secondary">
          الإجراءات الحساسة تتطلب إعادة التحقق من الهوية.
        </AppText>
      </MenuGroup>

      <MenuGroup title="المساعدة والحساب">
        <ProfileMenuCard
          title="المساعدة والدعم"
          description="تذاكر الدعم والمشكلات والاعتراضات"
          icon={{ ios: 'questionmark.circle', android: 'help_outline', web: 'help_outline' }}
          onPress={() => router.push('/support')}
        />
        <ProfileMenuCard
          title="إغلاق الحساب / طلب الحذف"
          description="طلب محكوم مع توضيح الاحتفاظ قبل التأكيد"
          icon={{
            ios: 'person.crop.circle.badge.xmark',
            android: 'person_off',
            web: 'person_off',
          }}
          danger
          onPress={() => router.push('/profile/account-closure')}
        />
      </MenuGroup>
    </View>
  );
}
