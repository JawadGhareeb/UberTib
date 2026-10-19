import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { ReferenceIcon } from './patient-reference-ui';
import { ProfileMenuCard } from './profile-menu-card';
import { usePreferredLocation } from '@/features/location/state/preferred-location-provider';
import { AppIcon, AppText } from '@/shared/components/ui';

export function ProfileMenuSection() {
  const router = useRouter();
  const { location } = usePreferredLocation();
  return (
    <>
      <View className="mt-[7px] gap-[7px]">
        <ProfileMenuCard
          title="منطقتي"
          description={location?.label ?? 'حدّد منطقتك على الخريطة'}
          icon={{ ios: 'mappin.and.ellipse', android: 'place', web: 'place' }}
          onPress={() => router.push('/location-picker')}
        />
        <ProfileMenuCard
          title="الإعدادات"
          description="إعدادات التطبيق وتفضيلات الحساب"
          icon={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }}
          onPress={() => router.push('/profile/settings')}
        />
        <ProfileMenuCard
          title="الحساب والأمان"
          description="الهاتف الموثّق · رمز الدخول · جلسات نشطة"
          icon={{ ios: 'shield.lefthalf.filled', android: 'security', web: 'security' }}
          onPress={() => router.push('/profile/security')}
        />
        <ProfileMenuCard
          title="الخصوصية والموافقات"
          description="موافقات منفصلة، عمليات وسجل لا يُستبدل"
          icon={{ ios: 'questionmark.circle', android: 'privacy_tip', web: 'privacy_tip' }}
          onPress={() => router.push('/profile/privacy')}
        />
        <ProfileMenuCard
          title="بياناتي"
          description="اطلب نسخة وتابع حالة تجهيزها"
          icon={{ ios: 'externaldrive', android: 'storage', web: 'storage' }}
          onPress={() => router.push('/profile/data')}
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
      </View>

      <Pressable
        accessibilityLabel="المساعدة والدعم"
        accessibilityRole="button"
        className="mt-[7px] min-h-[58px] flex-row-reverse items-center gap-[9px] rounded-[11px] border border-border-subtle bg-surface-default px-[10px] py-[7px]"
        onPress={() => router.push('/support')}
      >
        <ReferenceIcon
          icon={{ ios: 'questionmark.circle', android: 'help_outline', web: 'help_outline' }}
          size={36}
        />
        <View className="min-w-0 flex-1 items-end">
          <AppText
            align="right"
            className="font-ui-semibold"
            style={{ fontSize: 12, lineHeight: 19 }}
            variant="label"
          >
            المساعدة والدعم
          </AppText>
          <AppText
            align="right"
            className="text-content-secondary"
            style={{ fontSize: 9.5, lineHeight: 15 }}
            variant="caption"
          >
            طلب استرداد، شكوى، أو متابعة تذكرة دعم
          </AppText>
        </View>
        <AppIcon
          name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
          size={16}
          tone="secondary"
        />
      </Pressable>
    </>
  );
}
