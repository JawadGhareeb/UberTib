import { ScrollView } from 'react-native';
import { ReadStateBoundary, Screen } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { PATIENT_TAB_BAR_HEIGHT } from '@/shared/components/navigation/patient-tab-metrics';
import { ProfileAccountHeader } from '../components/profile-account-header';
import { ProfileAccountSummary } from '../components/profile-account-summary';
import { ProfileMenuSection } from '../components/profile-menu-section';

export function ProfileScreen() {
  const { getSurfaceState } = useMockScenario();

  return (
    <Screen contentClassName="px-0 py-0" header={<ProfileAccountHeader />}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pt-4"
        contentContainerStyle={{ paddingBottom: PATIENT_TAB_BAR_HEIGHT + 44 }}
        showsVerticalScrollIndicator={false}
      >
        <ReadStateBoundary
          state={getSurfaceState('profile')}
          emptyTitle="بيانات الحساب غير متاحة"
          permissionTitle="بيانات الحساب غير متاحة"
        >
          <ProfileAccountSummary />
          <ProfileMenuSection />
        </ReadStateBoundary>
      </ScrollView>
    </Screen>
  );
}
