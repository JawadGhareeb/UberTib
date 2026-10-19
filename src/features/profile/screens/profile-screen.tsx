import { ReadStateBoundary, Screen, AppText } from '@/shared/components/ui';
import { ScrollView, View } from 'react-native';
import { useMockScenario } from '@/shared/mock';
import { PATIENT_TAB_BAR_HEIGHT } from '@/shared/components/navigation/patient-tab-metrics';
import { ProfileAccountHeader } from '../components/profile-account-header';
import { ProfileShortcuts } from '../components/profile-shortcuts';
import { ProfileMenuSection } from '../components/profile-menu-section';
import { EditableProfileAvatar } from '@/shared/components/media/editable-profile-avatar';
import { useProfilePhoto } from '../state/profile-photo-provider';
import { useAccountDetails } from '../state/account-details-provider';

export function ProfileScreen() {
  const { getSurfaceState } = useMockScenario();
  const { photo, setPhoto } = useProfilePhoto();
  const { name } = useAccountDetails();

  return (
    <Screen contentClassName="px-0 py-0" header={<ProfileAccountHeader />}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerClassName="mx-auto w-full max-w-[430px] gap-2 px-4 pt-5"
        contentContainerStyle={{ paddingBottom: PATIENT_TAB_BAR_HEIGHT + 44 }}
        showsVerticalScrollIndicator={false}
      >
        <ReadStateBoundary
          state={getSurfaceState('profile')}
          emptyTitle="بيانات الحساب غير متاحة"
          permissionTitle="بيانات الحساب غير متاحة"
        >
          <View className="items-center gap-2 pb-3">
            <EditableProfileAvatar value={photo} onChange={setPhoto} />
            <AppText align="center" variant="heading-4" className="font-ui-bold">
              {name}
            </AppText>
          </View>
          <ProfileShortcuts />
          <ProfileMenuSection />
        </ReadStateBoundary>
      </ScrollView>
    </Screen>
  );
}
