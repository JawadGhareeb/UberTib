import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import {
  CareFilterTabs,
  CareV5Badge,
  CareV5Card,
  CareV5Header,
} from '@/features/my-care/components/care-v5-ui';
import {
  getMockCareCaseForScenario,
  getMockCareReferenceLabel,
  mockCareCases,
  type MockCareCase,
} from '@/features/my-care/mocks/care.mock';
import { AppIcon, AppText, Screen } from '@/shared/components/ui';
import { CareV5BottomNav } from '@/features/my-care/components/care-v5-ui';
import { useAppDirection } from '@/providers/app-direction-provider';
import { useMockScenario } from '@/shared/mock';
import { cn } from '@/shared/utils/cn';

const filters = ['الكل', 'قيد العلاج', 'قادمة', 'مكتملة'] as const;
type CaseFilter = (typeof filters)[number];

function statusTone(item: MockCareCase): 'primary' | 'info' | 'warning' | 'success' {
  if (item.progress >= 100) return 'success';
  if (/موعد|جلسة/.test(item.statusLabel)) return 'info';
  if (/تعديل|انتظار|مراجعة/.test(item.statusLabel)) return 'warning';
  return 'primary';
}

function caseFilter(item: MockCareCase): Exclude<CaseFilter, 'الكل'> {
  if (item.progress >= 100) return 'مكتملة';
  if (/موعد|جلسة/.test(item.statusLabel)) return 'قادمة';
  return 'قيد العلاج';
}

function CaseOverviewCard({ item, onPress }: { item: MockCareCase; onPress: () => void }) {
  const { rowClassName } = useAppDirection();
  const tone = statusTone(item);
  const bg = tone === 'info' ? 'bg-tone-info-fill' : tone === 'warning'
    ? 'bg-tone-warning-fill' : tone === 'success' ? 'bg-tone-success-fill' : 'bg-action-subtle';
  const iconTone = tone === 'primary' ? 'action' : tone;

  return (
    <Pressable
      accessibilityLabel={`فتح الحالة العلاجية: ${item.title}`}
      accessibilityRole="button"
      onPress={onPress}
    >
      <CareV5Card className="min-h-[116px] gap-2 rounded-[14px] px-[11px] py-[10px]">
        <View className={cn('items-center gap-2', rowClassName)}>
          <View className={cn('h-9 w-9 items-center justify-center rounded-[9px]', bg)}>
            <AppIcon
              name={{ ios: 'cross.case', android: 'medical_services', web: 'medical_services' }}
              size={18}
              tone={iconTone}
            />
          </View>
          <AppText
            align="right"
            className="min-w-0 flex-1 font-ui-bold text-content-primary"
            numberOfLines={1}
            variant="label"
          >
            {item.title}
          </AppText>
          <CareV5Badge label={item.statusLabel} tone={tone} />
        </View>

        <AppText align="right" className="text-content-secondary" numberOfLines={2} variant="caption">
          #{getMockCareReferenceLabel(item.id)} · {item.provider} · {item.branch} · الحالة
        </AppText>

        <View className={cn('mt-1 items-center justify-between gap-2', rowClassName)}>
          <AppText
            align="right"
            className={cn(
              'min-w-0 flex-1 font-ui-semibold',
              tone === 'warning' ? 'text-tone-warning-text' : 'text-content-link',
            )}
            numberOfLines={1}
            variant="caption"
          >
            {item.nextAction}
          </AppText>
          <AppText direction="ltr" className="shrink-0 font-ui-bold text-content-primary" variant="caption">
            {item.acceptedTotalLabel}
          </AppText>
        </View>

        <View
          accessible
          accessibilityLabel={`تقدّم الحالة: ${item.progress} بالمئة`}
          className={cn('h-[6px] gap-1', rowClassName)}
        >
          {[0, 1, 2, 3].map((step) => (
            <View
              className={cn(
                'h-full flex-1 rounded-full',
                step < Math.ceil(item.progress / 25) ? 'bg-action-primary' : 'bg-border-subtle',
              )}
              key={step}
            />
          ))}
        </View>
      </CareV5Card>
    </Pressable>
  );
}

export function MyCasesOverviewScreen({ showBottomNav = false }: { showBottomNav?: boolean }) {
  const router = useRouter();
  const { rowClassName } = useAppDirection();
  const { scenario } = useMockScenario();
  const [filter, setFilter] = useState<CaseFilter>('الكل');
  const cases = mockCareCases.flatMap((item) => {
    const current = getMockCareCaseForScenario(item.id, scenario);
    return current ? [current] : [];
  });
  const filtered = cases.filter((item) => filter === 'الكل' || caseFilter(item) === filter);
  const activeCount = cases.filter((item) => item.progress < 100).length;

  return (
    <Screen contentClassName="px-0 py-0">
      <CareV5Header leftIcon="calendar" right="bell" title="علاجي" />
      <ScrollView
        contentContainerClassName={showBottomNav
          ? 'mx-auto w-full max-w-[430px] px-4 pb-[96px] pt-3'
          : 'mx-auto w-full max-w-[430px] px-4 pb-[80px] pt-3'}
        showsVerticalScrollIndicator={false}
      >
        <View className={cn('items-center justify-between gap-3', rowClassName)}>
          <View className="min-w-0 flex-1 items-end">
            <AppText align="right" className="font-ui-bold text-content-primary" variant="heading-4">
              حالاتي العلاجية
            </AppText>
            <AppText align="right" className="text-content-secondary" variant="caption">
              كل حجز ينتج سجلاً موحداً للحالة
            </AppText>
          </View>
          <CareV5Badge label={`${activeCount} حالات نشطة`} />
        </View>

        <CareFilterTabs
          items={filters}
          onChange={(value) => setFilter(value as CaseFilter)}
          selected={filter}
        />

        <View className="mt-3 gap-2">
          {filtered.map((item) => (
            <CaseOverviewCard
              item={item}
              key={item.id}
              onPress={() => router.push({
                pathname: '/care/[caseId]/timeline',
                params: { caseId: item.id },
              })}
            />
          ))}
          {filtered.length === 0 ? (
            <CareV5Card className="items-center gap-2 p-5">
              <AppText align="center" className="font-ui-semibold" variant="label">
                ما في حالات ضمن هذا التصنيف
              </AppText>
              <AppText align="center" className="text-content-secondary" variant="caption">
                جرّب اختيار الكل لعرض بقية الحالات
              </AppText>
            </CareV5Card>
          ) : null}
        </View>

        <View className={cn('mt-2 items-center gap-2 rounded-[11px] bg-tone-info-fill px-3 py-2', rowClassName)}>
          <AppIcon
            name={{ ios: 'info.circle', android: 'info_outline', web: 'info_outline' }}
            size={17}
            tone="info"
          />
          <AppText className="min-w-0 flex-1 text-tone-info-text" variant="caption">
            التقييم والتشخيص والخطة والدفعات والمشكلات ضمن حالة واحدة
          </AppText>
        </View>
      </ScrollView>
      {showBottomNav ? <CareV5BottomNav active="care" /> : null}
    </Screen>
  );
}
