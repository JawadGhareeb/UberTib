import { useRouter } from 'expo-router';
import { Button as HeroButton, Card as HeroCard } from 'heroui-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import {
  getMockBookingsForScenario,
  isUpcomingMockBooking,
  type MockBooking,
} from '@/features/booking/mocks/bookings.mock';
import {
  getMockCareCaseForScenario,
  mockCareCases,
  type MockCareCase,
} from '@/features/my-care/mocks/care.mock';
import { AppHeader } from '@/shared/components/navigation';
import { CenteredActionIcon } from '@/shared/components/ui/centered-action-icon';
import { PATIENT_TAB_BAR_HEIGHT } from '@/shared/components/navigation/patient-tab-metrics';
import { AppIcon, AppText, ReadStateNotice, Screen, StatusIndicator } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import type { MockBookingRequest } from '@/shared/mock/scenario-provider';

const filters = ['الكل', 'بانتظار التأكيد', 'القادمة', 'قيد العلاج', 'مكتملة', 'ملغاة'] as const;
type CareFilter = (typeof filters)[number];
type BookingItem = MockBooking | MockBookingRequest;
type CareItem = { kind: 'booking'; record: BookingItem } | { kind: 'case'; record: MockCareCase };

function matchesFilter(item: CareItem, filter: CareFilter) {
  if (filter === 'الكل') return true;
  if (item.kind === 'case') {
    return filter === (item.record.progress >= 100 ? 'مكتملة' : 'قيد العلاج');
  }
  const status = item.record.status;
  if (filter === 'بانتظار التأكيد') return status === 'pending' || status === 'eligibility-review';
  if (filter === 'القادمة') return status === 'confirmed' && isUpcomingMockBooking(item.record);
  if (filter === 'مكتملة') return status === 'completed';
  return filter === 'ملغاة' && status === 'cancelled';
}

function BookingRow({ item, onPress }: { item: BookingItem; onPress: () => void }) {
  const tone =
    item.status === 'confirmed'
      ? 'success'
      : item.status === 'completed'
        ? 'neutral'
        : item.status === 'cancelled'
          ? 'danger'
          : 'warning';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'تفاصيل الحجز: ' + item.serviceName}
      onPress={onPress}
    >
      <HeroCard
        variant="default"
        className="gap-2 rounded-[14px] border border-border-subtle bg-surface-default p-3"
      >
        <View className="flex-row-reverse items-center gap-2">
          <CenteredActionIcon name="calendar" frameSize={40} iconSize={20} />
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" variant="caption">
              حجز موعد
            </AppText>
            <AppText align="right" variant="body-strong" numberOfLines={2}>
              {item.serviceName}
            </AppText>
          </View>
          <StatusIndicator label={item.statusLabel} tone={tone} />
        </View>
        <AppText align="right" variant="label">
          {item.providerName} · {item.branch}
        </AppText>
        <View className="flex-row-reverse items-center gap-2">
          <AppText className="min-w-0 flex-1" align="right" variant="caption">
            {item.dateLabel} · {item.timeLabel}
          </AppText>
          <AppText variant="label" className="text-content-link">
            عرض الحجز
          </AppText>
          <AppIcon
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            size={16}
            tone="action"
          />
        </View>
      </HeroCard>
    </Pressable>
  );
}

function CaseRow({ item, onPress }: { item: MockCareCase; onPress: () => void }) {
  const complete = item.progress >= 100;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'تفاصيل الحالة العلاجية: ' + item.title}
      onPress={onPress}
    >
      <HeroCard
        variant="default"
        className="gap-2 rounded-[14px] border border-border-subtle bg-surface-default p-3"
      >
        <View className="flex-row-reverse items-center gap-2">
          <CenteredActionIcon name="care" frameSize={40} iconSize={20} />
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" variant="caption">
              حالة علاجية
            </AppText>
            <AppText align="right" variant="body-strong" numberOfLines={2}>
              {item.title}
            </AppText>
          </View>
          <StatusIndicator label={item.statusLabel} tone={complete ? 'success' : 'info'} />
        </View>
        <AppText align="right" variant="label">
          {item.provider} · {item.branch}
        </AppText>
        <AppText align="right" variant="caption">
          {item.nextAction}
        </AppText>
        <View
          accessibilityLabel={'تقدم العلاج ' + item.progress + ' بالمئة'}
          accessible
          className="h-[5px] overflow-hidden rounded-full bg-surface-subtle"
        >
          <View
            className="h-full rounded-full bg-action-primary"
            style={{ width: `${Math.min(100, Math.max(0, item.progress))}%` }}
          />
        </View>
        <View className="flex-row-reverse items-center justify-between">
          <AppText variant="caption">{item.progress}% من الخطة</AppText>
          <AppText variant="label" className="text-content-link">
            عرض الحالة
          </AppText>
        </View>
      </HeroCard>
    </Pressable>
  );
}

export function MyCasesOverviewScreen() {
  const router = useRouter();
  const { scenario, bookingRequests, getSurfaceState } = useMockScenario();
  const [filter, setFilter] = useState<CareFilter>('الكل');
  const bookingState = getSurfaceState('booking');
  const careState = getSurfaceState('care');
  const visibleRead = (state: string) =>
    !['empty-no-data', 'loading-initial', 'error-fetch', 'error-permission'].includes(state);
  const bookings = visibleRead(bookingState)
    ? [...bookingRequests, ...getMockBookingsForScenario(scenario)]
    : [];
  const cases =
    visibleRead(careState) && !scenario.flags?.emptyNewPatient
      ? mockCareCases.flatMap((item) => {
          const current = getMockCareCaseForScenario(item.id, scenario);
          return current ? [current] : [];
        })
      : [];
  const records: CareItem[] = [
    ...bookings.map((record): CareItem => ({ kind: 'booking', record })),
    ...cases.map((record): CareItem => ({ kind: 'case', record })),
  ];
  const matching = records.filter((item) => matchesFilter(item, filter));

  return (
    <Screen contentClassName="px-0 py-0" header={<AppHeader title="علاجي" showNotifications />}>
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

        <ScrollView
          horizontal
          accessibilityRole="tablist"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 16,
            paddingVertical: 4,
          }}
        >
          {filters.map((value) => (
            <HeroButton
              key={value}
              size="sm"
              variant={value === filter ? 'primary' : 'outline'}
              className={
                value === filter
                  ? 'min-h-[44px] rounded-[12px] bg-action-primary px-3'
                  : 'min-h-[44px] rounded-[12px] border-border-default bg-surface-default px-3'
              }
              onPress={() => setFilter(value)}
              accessibilityLabel={'تصفية: ' + value}
              accessibilityState={{ selected: value === filter }}
            >
              <HeroButton.Label
                className={
                  value === filter
                    ? 'font-ui-semibold text-content-on-action'
                    : 'font-ui-medium text-content-primary'
                }
              >
                {value}
              </HeroButton.Label>
            </HeroButton>
          ))}
        </ScrollView>

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
      </ScrollView>
    </Screen>
  );
}
