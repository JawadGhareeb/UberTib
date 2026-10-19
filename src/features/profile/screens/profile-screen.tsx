import { ScrollView } from 'react-native';
import { ReadStateBoundary, Screen } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { ProfileAccountHeader } from '../components/profile-account-header';
import { ProfileAccountSummary } from '../components/profile-account-summary';
import { ProfileAppearanceSettings } from '../components/profile-appearance-settings';
import { ProfileMenuSection } from '../components/profile-menu-section';

export function ProfileScreen() {
  const { getSurfaceState } = useMockScenario();
  return (
    <Screen contentClassName="px-0 py-0" header={<ProfileAccountHeader />}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-28 pt-[7px]"
        showsVerticalScrollIndicator={false}
      >
        <ReadStateBoundary
          state={getSurfaceState('profile')}
          emptyTitle="بيانات الحساب غير متاحة"
          permissionTitle="بيانات الحساب غير متاحة"
        >
          <ProfileAccountSummary />
          <ProfileMenuSection />
          <ProfileAppearanceSettings />
        </ReadStateBoundary>
      </ScrollView>
    </Screen>
  );
}
