import { ScrollView, View } from 'react-native';
import { AppHeader } from '@/shared/components/navigation';
import { PATIENT_TAB_BAR_HEIGHT } from '@/shared/components/navigation/patient-tab-metrics';
import { AppText, ReadStateBoundary, Screen } from '@/shared/components/ui';
import { mockPatientWorld } from '@/shared/mock/patient.mock';
import { HomeAssessmentCard } from '../components/home-assessment-card';
import { HomeAttentionSection } from '../components/home-attention-section';
import { HomeCasesSection } from '../components/home-cases-section';
import { HomePendingRequests, HomeUpcomingBookings } from '../components/home-bookings-section';
import { HomeServicesSection } from '../components/home-services-section';
import { usePatientHomeData } from '../hooks/use-patient-home-data';

export function PatientHomeScreen() {
  const { attention, upcomingBookings, pendingCount, activeCases, homeState } =
    usePatientHomeData();
  return (
    <Screen contentClassName="px-0 py-0" header={<AppHeader variant="primary" title="الرئيسية" />}>
      <View style={{ flex: 1 }}>
        <ReadStateBoundary
          state={homeState}
          emptyTitle="لا توجد بيانات متاحة حالياً"
          errorTitle="تعذر تحميل الرئيسية"
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerClassName="mx-auto w-full max-w-[430px] gap-5 px-4 pt-4"
            contentContainerStyle={{ paddingBottom: PATIENT_TAB_BAR_HEIGHT + 48 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="items-end gap-1">
              <AppText align="right" variant="heading-2">
                أهلاً، {mockPatientWorld.account.activePatientName}
              </AppText>
              <AppText align="right" variant="label" className="text-content-secondary">
                من هون بتبدأ رحلتك للعناية بأسنانك
              </AppText>
            </View>
            <HomeAssessmentCard />
            <HomeServicesSection />
            <HomeAttentionSection attention={attention} />
            <HomeUpcomingBookings upcomingBookings={upcomingBookings} />
            <HomePendingRequests pendingCount={pendingCount} />
            <HomeCasesSection activeCases={activeCases} />
          </ScrollView>
        </ReadStateBoundary>
      </View>
    </Screen>
  );
}
