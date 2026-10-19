import { useRouter } from 'expo-router';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { ProfileMenuCard } from './profile-menu-card';

export function ProfileAppearanceSettings() {
  const router = useRouter();
  const { scheme } = useAppTheme();
  return (
    <ProfileMenuCard
      title="المظهر"
      description={'المظهر الحالي: ' + (scheme === 'dark' ? 'داكن' : 'فاتح')}
      icon={{ ios: 'paintbrush', android: 'palette', web: 'palette' }}
      onPress={() => router.push('/profile/appearance')}
    />
  );
}
