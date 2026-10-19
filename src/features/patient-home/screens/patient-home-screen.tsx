import { useRouter } from 'expo-router';
import { Button as HeroButton, Card as HeroCard } from 'heroui-native';
import { Pressable, ScrollView, View } from 'react-native';

import {
  getMockBookingsForScenario,
  isUpcomingMockBooking,
  type MockBooking,
} from '@/features/booking/mocks/bookings.mock';
import { ServiceIcon } from '@/features/discovery/components/service-icon';
import { penServiceGroups } from '@/features/discovery/presentation/pen-discovery-data';
import {
  getMockCareCaseForScenario,
  mockCareCases,
  type MockCareCase,
} from '@/features/my-care/mocks/care.mock';
import { getMockNeedsAttentionForScenario } from '@/features/platform/mocks/platform.mock';
import { AppHeader } from '@/shared/components/navigation';
import { CenteredActionIcon } from '@/shared/components/ui/centered-action-icon';
import { PATIENT_TAB_BAR_HEIGHT } from '@/shared/components/navigation/patient-tab-metrics';
import { AppIcon, AppText, ReadStateBoundary, Screen } from '@/shared/components/ui';
import { useMockScenario } from '@/shared/mock';
import { mockPatientWorld } from '@/shared/mock/patient.mock';

const groupIcons = {
  G01: 'implant',
  G02: 'crowns',
  G03: 'root-canal',
  G04: 'dental-checkup',
} as const;

function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View className="flex-row-reverse items-center justify-between gap-3">
      <AppText align="right" variant="heading-4">
        {title}
      </AppText>
      {action && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={action}
          hitSlop={8}
          onPress={onAction}
        >
          <AppText variant="label" className="text-content-link">
            {action}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

function AppointmentPreview({ item, onPress }: { item: MockBooking; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'عرض موعد ' + item.serviceName}
      onPress={onPress}
    >
      <HeroCard
        variant="default"
        className="rounded-[16px] border border-border-subtle bg-surface-default px-3.5 py-3"
      >
        <View className="flex-row-reverse items-center gap-3">
          <CenteredActionIcon name="calendar" frameSize={48} iconSize={22} />
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" variant="body-strong" numberOfLines={1}>
              {item.serviceName}
              {' · '}
              <AppText variant="caption" className="text-content-secondary">
                {item.providerName}
              </AppText>
            </AppText>
            <AppText align="right" variant="caption" numberOfLines={1}>
              {item.dateLabel} · {item.timeLabel}
            </AppText>
          </View>
          <AppIcon
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            size={18}
            tone="secondary"
          />
        </View>
      </HeroCard>
    </Pressable>
  );
}

function CarePreview({ item, onPress }: { item: MockCareCase; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'عرض الحالة ' + item.title}
      onPress={onPress}
    >
      <HeroCard
        variant="default"
        className="rounded-[16px] border border-border-subtle bg-surface-default px-3.5 py-3"
      >
        <View className="flex-row-reverse items-center gap-3">
          <CenteredActionIcon name="care" frameSize={48} iconSize={22} />
          <View className="min-w-0 flex-1 items-end gap-1">
            <AppText align="right" variant="body-strong" numberOfLines={1}>
              {item.title}
            </AppText>
            <AppText align="right" variant="caption" numberOfLines={2}>
              {item.nextAction}
            </AppText>
          </View>
          <AppIcon
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            size={18}
            tone="secondary"
          />
        </View>
      </HeroCard>
    </Pressable>
  );
}

export function PatientHomeScreen() {
  const router = useRouter();
  const { scenario, bookingRequests, getSurfaceState } = useMockScenario();
  const bookingState = getSurfaceState('booking');
  const careState = getSurfaceState('care');
  const attentionState = getSurfaceState('attention');
  const isAvailable = (state: string) =>
    !['empty-no-data', 'error-permission', 'error-fetch', 'loading-initial'].includes(state);

  const bookings = isAvailable(bookingState)
    ? [...bookingRequests, ...getMockBookingsForScenario(scenario)]
    : [];
  const upcomingBookings = bookings
    .filter((item): item is MockBooking => 'dateKey' in item && isUpcomingMockBooking(item))
    .sort((a, b) => (a.dateKey ?? '').localeCompare(b.dateKey ?? ''));
  const pendingBookings = bookings.filter(
    (item) => item.status === 'pending' || item.status === 'eligibility-review',
  );
  const activeCases =
    isAvailable(careState) && !scenario.flags?.emptyNewPatient
      ? mockCareCases
          .flatMap((item) => {
            const current = getMockCareCaseForScenario(item.id, scenario);
            return current ? [current] : [];
          })
          .filter((item) => item.progress < 100)
      : [];

  const attention = isAvailable(attentionState)
    ? getMockNeedsAttentionForScenario(scenario)
        .filter(
          (item) =>
            item.id !== 'attention-booking' &&
            (item.id !== 'attention-follow-up' ||
              scenario.flags?.followUpDue ||
              scenario.flags?.followUpOverdue) &&
            (item.id !== 'attention-submission' || scenario.flags?.representationPending),
        )
        .slice(0, 2)
    : [];

  return (
    <Screen contentClassName="px-0 py-0" header={<AppHeader variant="primary" />}>
      <View style={{ flex: 1 }}>
        <ReadStateBoundary
          state={getSurfaceState('home')}
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

            <HeroCard
              variant="default"
              className="gap-3 rounded-[18px] border border-border-subtle bg-action-subtle p-4"
            >
              <View className="flex-row-reverse items-center gap-3">
                <View className="h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-surface-default">
                  <AppIcon
                    name={{
                      ios: 'stethoscope',
                      android: 'medical_information',
                      web: 'medical_information',
                    }}
                    size={24}
                    tone="action"
                  />
                </View>
                <View className="min-w-0 flex-1 items-end gap-1">
                  <AppText align="right" variant="heading-4">
                    مو متأكد من حالتك؟
                  </AppText>
                  <AppText align="right" variant="caption" numberOfLines={2}>
                    جاوب على أسئلة بسيطة لنساعدك تختار الخطوة المناسبة.
                  </AppText>
                </View>
              </View>
              <HeroButton
                variant="primary"
                className="min-h-[48px] rounded-[12px] bg-action-primary"
                onPress={() => router.push('/assessment/start')}
              >
                <HeroButton.Label className="font-ui-semibold text-content-on-action">
                  ساعدني أحدد حالتي
                </HeroButton.Label>
              </HeroButton>
            </HeroCard>

            <View className="gap-3">
              <SectionTitle
                title="استكشف خدمات الأسنان"
                action="عرض الكل"
                onAction={() => router.push('/(tabs)/discover')}
              />
              <View className="flex-row-reverse flex-wrap justify-between gap-y-2.5">
                {penServiceGroups.map((group) => (
                  <Pressable
                    key={group.code}
                    accessibilityRole="button"
                    accessibilityLabel={'استكشف ' + group.title}
                    className="w-[49%]"
                    onPress={() =>
                      router.push({
                        pathname: '/discover/group/[groupCode]',
                        params: { groupCode: group.code },
                      })
                    }
                  >
                    <HeroCard
                      variant="default"
                      className="min-h-[110px] items-center justify-center gap-2 rounded-[16px] border border-border-subtle bg-surface-default px-3 py-3"
                    >
                      <ServiceIcon serviceId={groupIcons[group.code]} size={34} />
                      <AppText
                        align="center"
                        numberOfLines={2}
                        variant="label"
                        className="font-ui-semibold"
                      >
                        {group.title}
                      </AppText>
                    </HeroCard>
                  </Pressable>
                ))}
              </View>
              <HeroButton
                variant="outline"
                className="min-h-[48px] rounded-[12px] border-action-primary"
                onPress={() => router.push('/(tabs)/discover')}
              >
                <HeroButton.Label className="font-ui-semibold text-content-link">
                  ابحث عن طبيب أو خدمة
                </HeroButton.Label>
              </HeroButton>
            </View>

            {attention.length > 0 ? (
              <View className="gap-2.5">
                <SectionTitle
                  title="يحتاج انتباهك"
                  action="عرض الكل"
                  onAction={() => router.push('/needs-attention')}
                />
                {attention.map((item) => (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={item.title}
                    onPress={() => router.push(item.href)}
                  >
                    <HeroCard
                      variant="default"
                      className="rounded-[16px] border border-tone-warning-border bg-tone-warning-fill px-3 py-3"
                    >
                      <View className="flex-row-reverse items-center gap-3">
                        <AppIcon
                          name={{
                            ios: 'exclamationmark.circle',
                            android: 'error_outline',
                            web: 'error_outline',
                          }}
                          size={22}
                          tone={item.tone}
                        />
                        <View className="min-w-0 flex-1 items-end gap-1">
                          <AppText
                            align="right"
                            variant="label"
                            className="font-ui-semibold"
                            numberOfLines={1}
                          >
                            {item.title}
                          </AppText>
                          <AppText align="right" variant="caption" numberOfLines={2}>
                            {item.detail}
                          </AppText>
                        </View>
                        <AppIcon
                          name={{
                            ios: 'chevron.left',
                            android: 'chevron_left',
                            web: 'chevron_left',
                          }}
                          size={17}
                          tone="secondary"
                        />
                      </View>
                    </HeroCard>
                  </Pressable>
                ))}
              </View>
            ) : null}

            {upcomingBookings.length > 0 ? (
              <View className="gap-2.5">
                <SectionTitle
                  title="مواعيدك القادمة"
                  action="عرض الكل"
                  onAction={() => router.push('/(tabs)/care')}
                />
                {upcomingBookings.slice(0, 3).map((item) => (
                  <AppointmentPreview
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
            ) : null}

            {pendingBookings.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="متابعة طلبات الحجز قيد التأكيد"
                onPress={() => router.push('/(tabs)/care')}
              >
                <HeroCard
                  variant="default"
                  className="rounded-[16px] border border-border-subtle bg-surface-default px-3 py-3"
                >
                  <View className="flex-row-reverse items-center gap-3">
                    <CenteredActionIcon name="clock" frameSize={44} iconSize={22} warning />
                    <View className="min-w-0 flex-1 items-end gap-1">
                      <AppText align="right" variant="label" className="font-ui-semibold">
                        بانتظار تأكيد العيادة
                      </AppText>
                      <AppText align="right" variant="caption">
                        {pendingBookings.length} طلب حجز غير مؤكّد
                      </AppText>
                    </View>
                    <AppIcon
                      name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                      size={18}
                      tone="secondary"
                    />
                  </View>
                </HeroCard>
              </Pressable>
            ) : null}

            {activeCases.length > 0 ? (
              <View className="gap-2.5">
                <SectionTitle
                  title="الحالات التي تتابعها"
                  action="عرض الكل"
                  onAction={() => router.push('/(tabs)/care')}
                />
                {activeCases.slice(0, 3).map((item) => (
                  <CarePreview
                    key={item.id}
                    item={item}
                    onPress={() =>
                      router.push({
                        pathname: '/care/[caseId]/timeline',
                        params: { caseId: item.id },
                      })
                    }
                  />
                ))}
              </View>
            ) : null}
          </ScrollView>
        </ReadStateBoundary>
      </View>
    </Screen>
  );
}
