import { useRouter } from 'expo-router';
import { Button as HeroButton } from 'heroui-native';
import { View } from 'react-native';
import { AppIcon, AppText, ReadStateNotice } from '@/shared/components/ui';
import type { StructuralReadState } from '@/shared/types/structural-read-state';
import { BookingRow } from './booking-overview-card';
import { CaseRow } from './case-overview-card';
import { type CareFilter, type CareItem } from '../model/overview-items';

export function CareRecordsList({
  matching,
  filter,
  bookingState,
  careState,
}: {
  matching: CareItem[];
  filter: CareFilter;
  bookingState: StructuralReadState;
  careState: StructuralReadState;
}) {
  const router = useRouter();
  return (
    <View className="gap-3 px-4">
      {bookingState === 'error-permission' || careState === 'error-permission' ? (
        <AppText variant="caption" className="text-tone-warning-text">
          بعض السجلات غير متاحة وفق الصلاحيات الحالية.
        </AppText>
      ) : null}
      {bookingState === 'error-fetch' || careState === 'error-fetch' ? (
        <AppText variant="caption" className="text-tone-warning-text">
          تعذر تحميل بعض السجلات. البيانات المتاحة ما زالت ظاهرة.
        </AppText>
      ) : null}
      <ReadStateNotice state={bookingState} />
      <ReadStateNotice state={careState} />

      {matching.length ? (
        matching.map((item) =>
          item.kind === 'booking' ? (
            <BookingRow
              key={'booking-' + item.record.id}
              item={item.record}
              onPress={() =>
                router.push({
                  pathname: '/booking/[bookingId]',
                  params: { bookingId: item.record.id },
                })
              }
            />
          ) : (
            <CaseRow
              key={'case-' + item.record.id}
              item={item.record}
              onPress={() =>
                router.push({
                  pathname: '/care/[caseId]/timeline',
                  params: { caseId: item.record.id },
                })
              }
            />
          ),
        )
      ) : (
        <View className="items-center gap-3 px-3 py-12">
          <AppIcon
            name={{ ios: 'tray', android: 'inbox', web: 'inbox' }}
            size={32}
            tone="secondary"
          />
          <AppText variant="body-strong" align="center">
            {filter === 'الكل'
              ? 'ما في حجوزات أو حالات علاجية حالياً'
              : 'ما في سجلات ضمن هذا التصنيف'}
          </AppText>
          <AppText variant="caption" align="center">
            جرّب فلتر ثاني أو استكشف الخدمات لبدء حجز جديد.
          </AppText>
          <HeroButton
            variant="outline"
            className="min-h-[44px] rounded-[12px]"
            onPress={() => router.push('/(tabs)/discover')}
          >
            <HeroButton.Label>استكشف الخدمات</HeroButton.Label>
          </HeroButton>
        </View>
      )}
    </View>
  );
}
