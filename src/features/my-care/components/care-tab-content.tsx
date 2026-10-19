import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { ReadStateNotice } from '@/shared/components/ui';
import type { StructuralReadState } from '@/shared/types/structural-read-state';
import type { BookingItem } from '../model/overview-items';
import type { MockCareCase } from '../mocks/care.mock';
import { CaseRow } from './case-overview-card';
import { BookingRow } from './booking-overview-card';
import { CareTabEmpty } from './care-tab-empty';

const canShowRecords = (state: StructuralReadState) =>
  state === 'success' || state === 'partial' || state === 'stale';

function StateNotice({ state }: { state: StructuralReadState }) {
  return state !== 'success' ? <ReadStateNotice state={state} /> : null;
}

export function CareCasesContent({
  cases,
  state,
  filterActive,
}: {
  cases: MockCareCase[];
  state: StructuralReadState;
  filterActive: boolean;
}) {
  if (!canShowRecords(state) || cases.length === 0) {
    return (
      <View className="gap-3 px-4">
        <CareTabEmpty tab="cases" state={state} filterActive={filterActive} />
      </View>
    );
  }

  return (
    <View className="gap-3 px-4">
      <StateNotice state={state} />
      {cases.map((item) => (
        <CaseRow key={item.id} item={item} />
      ))}
    </View>
  );
}

export function CareBookingsContent({
  bookings,
  state,
  filterActive,
}: {
  bookings: BookingItem[];
  state: StructuralReadState;
  filterActive: boolean;
}) {
  const router = useRouter();
  if (!canShowRecords(state) || bookings.length === 0) {
    return (
      <View className="gap-3 px-4">
        <CareTabEmpty tab="bookings" state={state} filterActive={filterActive} />
      </View>
    );
  }
  return (
    <View className="gap-3 px-4">
      <StateNotice state={state} />
      {bookings.map((item) => (
        <BookingRow
          key={item.id}
          item={item}
          onPress={() =>
            router.push({
              pathname: '/booking/[bookingId]',
              params: { bookingId: item.id },
            })
          }
        />
      ))}
    </View>
  );
}
