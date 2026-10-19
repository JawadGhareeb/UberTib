import { useState } from 'react';
import { useAppTheme } from '@/shared/theme/theme-provider';
import { ProfileAppearanceModal } from './profile-appearance-modal';
import { ProfileMenuCard } from './profile-menu-card';

export function ProfileAppearanceSettings() {
  const { scheme } = useAppTheme();
  const [appearanceOpen, setAppearanceOpen] = useState(false);

  return (
    <>
      <ProfileMenuCard
        title="المظهر"
        description={'المظهر الحالي: ' + (scheme === 'dark' ? 'داكن' : 'فاتح')}
        icon={{ ios: 'paintbrush', android: 'palette', web: 'palette' }}
        onPress={() => setAppearanceOpen(true)}
      />
      <ProfileAppearanceModal visible={appearanceOpen} onClose={() => setAppearanceOpen(false)} />
    </>
  );
}
