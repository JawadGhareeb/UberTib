import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { AppHeader } from '@/shared/components/navigation';
import { PATIENT_TAB_BAR_HEIGHT } from '@/shared/components/navigation/patient-tab-metrics';
import { AppText, Screen } from '@/shared/components/ui';
import { CareFilterStrip } from '../components/care-filter-strip';
import { CareRecordsList } from '../components/care-records-list';
import { useCareOverviewRecords } from '../hooks/use-care-overview-records';
import { matchesFilter, type CareFilter } from '../model/overview-items';

export function MyCasesOverviewScreen() {
  const [filter, setFilter] = useState<CareFilter>('الكل');
  const { records, bookingState, careState } = useCareOverviewRecords();
  const matching = records.filter((item) => matchesFilter(item, filter));

  return (
    <Screen contentClassName="px-0 py-0" header={<AppHeader variant="primary" title="علاجي" />}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerClassName="mx-auto w-full max-w-[430px] gap-3 pt-4"
        contentContainerStyle={{ paddingBottom: PATIENT_TAB_BAR_HEIGHT + 28 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1 px-4">
          <AppText align="right" variant="heading-2">
            حجوزاتي وحالاتي العلاجية
          </AppText>
          <AppText align="right" variant="label" className="text-content-secondary">
            تابع حجوزاتك وخطط علاجك، وكل سجل بيفتح تفاصيله الخاصة.
          </AppText>
        </View>
        <CareFilterStrip filter={filter} onChange={setFilter} />
        <CareRecordsList
          matching={matching}
          filter={filter}
          bookingState={bookingState}
          careState={careState}
        />
      </ScrollView>
    </Screen>
  );
}
