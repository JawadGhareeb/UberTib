import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  DiscoveryBottomBar,
  DiscoveryHeader,
} from '@/features/discovery/components/pen-discovery-ui';
import { DiscoverAppliedFilterChips } from '@/features/discovery/components/discover-applied-filter-chips';
import { DiscoverDoctorResultCard } from '@/features/discovery/components/discover-doctor-result-card';
import { DoctorGradeTabs } from '@/features/discovery/components/doctor-grade-tabs';
import {
  matchesDoctorGrade,
  type DoctorGradeTab,
} from '@/features/discovery/model/doctor-classification';
import { DiscoverFilterSheet } from '@/features/discovery/components/discover-filter-sheet';
import { ProviderComparisonBar } from '@/features/discovery/components/provider-comparison-bar';
import { ProviderSelectedServiceSummary } from '@/features/discovery/components/provider-selected-service-summary';
import { providerAdvancedOptions } from '@/features/discovery/components/provider-advanced-filter-options';
import { ProviderResultsEmptyState } from '@/features/discovery/components/provider-results-empty-state';
import { useCareDrafts } from '@/features/my-care/state/care-draft-provider';
import { getMockProvider, getMockProviders } from '@/features/discovery/mocks/providers.mock';
import {
  getPenDoctorsForService,
  findPenFamily,
} from '@/features/discovery/presentation/pen-discovery-data';
import {
  matchesDiscoveryFilters,
  priceLimitsForService,
  selectedDiscoveryAreas,
  type DiscoveryFilterSelection,
  type PriceRange,
} from '@/features/discovery/model/discover-filters';
import { useDiscoverySession } from '@/features/discovery/state/discovery-session-provider';
import {
  filterMockProviders,
  defaultProviderFilters,
  type ProviderFilterFlags,
} from '@/features/discovery/utils/provider-filters';
import { AppIcon, AppText, Button, Screen } from '@/shared/components/ui';
import type { AppliedFilterItem } from '@/shared/components/filters/applied-filter-chips';
import {
  providerSortChoices,
  sortServiceDoctors,
  type ProviderResultSort,
} from '@/features/discovery/utils/provider-sort';

type AppliedProviderFilters = {
  discovery: DiscoveryFilterSelection;
  advanced: ProviderFilterFlags;
  sort: ProviderResultSort;
};

const emptySelection: DiscoveryFilterSelection = {
  area: 'كل المناطق',
  areas: [],
  priceRange: null,
};

type ProviderResultParams = {
  serviceCode?: string;
  patientId?: string;
  origin?: string;
  assessmentDraftId?: string;
  area?: string;
  areas?: string;
  minPrice?: string;
  maxPrice?: string;
};

function initialAppliedFilters(params: ProviderResultParams): AppliedProviderFilters {
  const min = params.minPrice === undefined ? NaN : Number(params.minPrice);
  const max = params.maxPrice === undefined ? NaN : Number(params.maxPrice);
  const priceRange: PriceRange | null =
    Number.isFinite(min) && Number.isFinite(max) && min >= 0 && max >= min ? [min, max] : null;
  return {
    discovery: {
      area: params.area ?? 'كل المناطق',
      ...(params.areas !== undefined ? { areas: params.areas.split('|').filter(Boolean) } : {}),
      priceRange,
    },
    advanced: { ...defaultProviderFilters },
    sort: 'default',
  };
}

/** The list is always unfiltered on first entry unless explicit route filters were supplied. */
export function ProviderResultsScreen() {
  const params = useLocalSearchParams<ProviderResultParams>();
  const serviceCode = params.serviceCode?.trim() || 'dental-checkup';
  return <ProviderResultsContent key={serviceCode} serviceCode={serviceCode} params={params} />;
}

function ProviderResultsContent({
  serviceCode,
  params,
}: {
  serviceCode: string;
  params: ProviderResultParams;
}) {
  const router = useRouter();
  const { saveDraft, hydrated } = useCareDrafts();
  const insets = useSafeAreaInsets();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  const [gradeTab, setGradeTab] = useState<DoctorGradeTab>('all');
  const [applied, setApplied] = useState<AppliedProviderFilters>(() =>
    initialAppliedFilters(params),
  );
  const { getServiceState, toggleComparisonProvider } = useDiscoverySession();
  const serviceState = getServiceState(serviceCode);

  const allDoctors = getPenDoctorsForService(serviceCode);
  const doctorById = new Map(allDoctors.map((doctor) => [doctor.id, doctor]));
  const eligibleProviders = filterMockProviders(
    getMockProviders(serviceCode),
    serviceCode,
    'كل المناطق',
    applied.advanced,
  ).filter((provider) => matchesDiscoveryFilters(provider, applied.discovery, serviceCode));
  const matchingDoctors = eligibleProviders.flatMap((provider) => {
    const doctor = doctorById.get(provider.id);
    return doctor ? [doctor] : [];
  });
  const doctors = sortServiceDoctors(matchingDoctors, applied.sort, serviceCode);
  const activeTab = gradeTab;
  const visibleDoctors =
    activeTab === 'all'
      ? doctors
      : doctors.filter((doctor) => {
          const provider = getMockProvider(doctor.id);
          return Boolean(provider && matchesDoctorGrade(provider, activeTab));
        });
  const noServiceDoctors = allDoctors.length === 0;
  const areas = selectedDiscoveryAreas(applied.discovery);
  const activeAdvancedOptions = providerAdvancedOptions.filter(
    (option) => applied.advanced[option.key],
  );
  const filtersActive = Boolean(
    areas.length || applied.discovery.priceRange || activeAdvancedOptions.length,
  );
  const hasSort = applied.sort !== 'default';
  const selectionActive = filtersActive || hasSort;
  // Keep previously chosen doctors in the comparison even when filters hide their cards.
  const selection = serviceState.comparisonProviderIds;
  const maxReached = selection.length >= 3;
  const serviceTitle = findPenFamily(serviceCode)?.title ?? 'الخدمة المطلوبة';
  useEffect(() => {
    if (hydrated && params.origin === 'assessment' && params.assessmentDraftId) {
      void saveDraft({
        id: params.assessmentDraftId,
        kind: 'assessment',
        title: 'اختيار طبيب للفحص الأولي',
        detail: 'باقي تختار الطبيب والموعد المناسب',
        route: '/discover/providers/results',
        params: {
          serviceCode,
          origin: 'assessment',
          assessmentDraftId: params.assessmentDraftId,
          ...(params.patientId ? { patientId: params.patientId } : {}),
        },
      });
    }
  }, [hydrated, params.origin, params.assessmentDraftId, params.patientId, serviceCode, saveDraft]);

  const resetFilters = () => {
    setApplied({
      discovery: { ...emptySelection },
      advanced: { ...defaultProviderFilters },
      sort: 'default',
    });
  };
  const advancedChips: AppliedFilterItem[] = activeAdvancedOptions.map((option) => ({
    key: option.key,
    label: option.label,
    onRemove: () =>
      setApplied((previous) => ({
        ...previous,
        advanced: { ...previous.advanced, [option.key]: false },
      })),
  }));
  const sortChips: AppliedFilterItem[] = hasSort
    ? [
        {
          key: 'sort',
          label:
            providerSortChoices.find((choice) => choice.value === applied.sort)?.label ?? 'الترتيب',
          onRemove: () => setApplied((previous) => ({ ...previous, sort: 'default' })),
        },
      ]
    : [];

  return (
    <Screen contentClassName="px-0 py-0">
      <DiscoveryHeader title="الأطباء المناسبون" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerClassName="mx-auto w-full max-w-[430px] gap-4 px-4 pt-3"
        contentContainerStyle={{ paddingBottom: selection.length ? 154 : 94 }}
        showsVerticalScrollIndicator={false}
      >
        <ProviderSelectedServiceSummary serviceCode={serviceCode} title={serviceTitle} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="تصفية الأطباء وترتيب النتائج"
          className={
            'min-h-[48px] flex-row-reverse items-center justify-center gap-2 rounded-[13px] border px-3 ' +
            (selectionActive
              ? 'border-action-primary bg-action-subtle'
              : 'border-border-subtle bg-surface-default')
          }
          onPress={() => setFiltersOpen(true)}
        >
          <AppIcon
            name={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }}
            size={20}
            tone="action"
          />
          <AppText variant="label" className="font-ui-semibold">
            تصفية وترتيب النتائج
          </AppText>
          {selectionActive ? <View className="h-2 w-2 rounded-full bg-action-primary" /> : null}
        </Pressable>

        <DiscoverAppliedFilterChips
          selection={applied.discovery}
          onChange={(discovery) => setApplied((previous) => ({ ...previous, discovery }))}
          extraItems={[...advancedChips, ...sortChips]}
          onClearAll={resetFilters}
        />

        {params.origin === 'assessment' && params.assessmentDraftId ? (
          <View className="px-1">
            <Button
              label="إكمال اختيار الطبيب لاحقاً"
              variant="outline"
              onPress={async () => {
                const saved = await saveDraft({
                  id: params.assessmentDraftId!,
                  kind: 'assessment',
                  title: 'اختيار طبيب للفحص الأولي',
                  detail: 'بانتظار اختيار الطبيب والموعد',
                  route: '/discover/providers/results',
                  params: {
                    serviceCode,
                    origin: 'assessment',
                    assessmentDraftId: params.assessmentDraftId!,
                    ...(params.patientId ? { patientId: params.patientId } : {}),
                  },
                });
                if (saved) router.replace({ pathname: '/(tabs)/care', params: { tab: 'cases' } });
              }}
            />
          </View>
        ) : null}
        <DoctorGradeTabs value={activeTab} onChange={setGradeTab} />
        <View className="flex-row-reverse items-center justify-between gap-2">
          <AppText align="right" variant="heading-4" className="font-ui-bold">
            النتائج ({visibleDoctors.length})
          </AppText>
        </View>
        {visibleDoctors.length ? (
          <View className="gap-3">
            {(showAllDoctors || selectionActive ? visibleDoctors : visibleDoctors.slice(0, 4)).map(
              (doctor) => (
                <DiscoverDoctorResultCard
                  key={doctor.id}
                  doctor={doctor}
                  serviceCode={serviceCode}
                  patientId={params.patientId}
                  origin={params.origin}
                  assessmentDraftId={params.assessmentDraftId}
                  selected={selection.includes(doctor.id)}
                  disabled={maxReached && !selection.includes(doctor.id)}
                  onToggle={() => toggleComparisonProvider(serviceCode, doctor.id)}
                />
              ),
            )}
            {visibleDoctors.length > 4 && !showAllDoctors && !selectionActive ? (
              <Pressable
                accessibilityRole="button"
                className="min-h-[52px] items-center justify-center rounded-[13px] border border-action-primary bg-action-subtle px-3"
                onPress={() => setShowAllDoctors(true)}
              >
                <AppText variant="label" className="font-ui-bold text-content-link">
                  إظهار المزيد من الأطباء
                </AppText>
                <AppText variant="caption" className="text-content-secondary">
                  لنتائج أنسب إلك، فيك تستخدم التصفية حسب المنطقة والسعر.
                </AppText>
              </Pressable>
            ) : null}
          </View>
        ) : activeTab !== 'all' ? (
          <AppText align="center" variant="label" className="py-7 text-content-secondary">
            لا يوجد أطباء ضمن هذا التصنيف في النتائج الحالية.
          </AppText>
        ) : (
          <ProviderResultsEmptyState
            hasServiceDoctors={!noServiceDoctors}
            hasFilters={filtersActive}
            onClearFilters={resetFilters}
            isCheckup={serviceCode === 'dental-checkup'}
            onExploreCheckup={() =>
              router.push({
                pathname: '/discover/providers/results',
                params: { serviceCode: 'dental-checkup' },
              })
            }
            onExploreServices={() => router.push('/discover')}
          />
        )}
      </ScrollView>

      {selection.length > 0 ? (
        <ProviderComparisonBar
          count={selection.length}
          bottom={68 + Math.max(insets.bottom, 8)}
          onCompare={() =>
            router.push({
              pathname: '/discover/providers/compare',
              params: {
                providerIds: selection.join(','),
                serviceCode,
                ...(params.patientId ? { patientId: params.patientId } : {}),
                ...(params.origin === 'assessment'
                  ? { origin: params.origin, assessmentDraftId: params.assessmentDraftId }
                  : {}),
              },
            })
          }
        />
      ) : null}

      <DiscoverFilterSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        selection={applied.discovery}
        providerFilters={applied.advanced}
        providerSort={applied.sort}
        onApply={(discovery, advanced, sort) => {
          setApplied({
            discovery,
            advanced: advanced ?? { ...defaultProviderFilters },
            sort: sort ?? 'default',
          });
        }}
        limits={priceLimitsForService(serviceCode)}
      />
      <DiscoveryBottomBar activeTab="اكتشف" />
    </Screen>
  );
}
