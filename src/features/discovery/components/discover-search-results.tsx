import { useMemo, useState, type ReactNode } from 'react';
import { FlatList, View } from 'react-native';

import { DiscoverDoctorResultCard } from '@/features/discovery/components/discover-doctor-result-card';
import { DoctorGradeTabs } from '@/features/discovery/components/doctor-grade-tabs';
import {
  matchesDoctorGrade,
  type DoctorGradeTab,
} from '@/features/discovery/model/doctor-classification';
import { getMockProvider, type MockProvider } from '@/features/discovery/mocks/providers.mock';
import { getPenDoctorsForService } from '@/features/discovery/presentation/pen-discovery-data';
import { AppText, EmptyState } from '@/shared/components/ui';
import { matchingPricedServices, type DiscoveryFilterSelection } from '../model/discover-filters';
import { selectDiscoverMatches } from '../model/discover-search';
import { DiscoverSearchIllustration } from './discover-search-illustration';

function matchingService(provider: MockProvider, filters: DiscoveryFilterSelection) {
  return matchingPricedServices(provider, filters)[0] ?? provider.serviceCodes[0];
}

/** Same doctor card as service results, with windowed rendering for large browse lists. */
export function DiscoverSearchResults({
  query,
  filters,
  comparison,
  onToggleComparison,
  showAllByDefault = false,
  allowGeneralComparison = true,
  header,
  bottomPadding = 100,
}: {
  query: string;
  filters: DiscoveryFilterSelection;
  comparison: { serviceCode: string | null; providerIds: string[] } | null;
  onToggleComparison: (providerId: string, serviceCode: string | null) => void;
  showAllByDefault?: boolean;
  allowGeneralComparison?: boolean;
  header?: ReactNode;
  bottomPadding?: number;
}) {
  const [gradeTab, setGradeTab] = useState<DoctorGradeTab>('all');
  const matches = useMemo(() => selectDiscoverMatches(query, filters), [query, filters]);
  const hasResultsScope = matches.hasCriteria || showAllByDefault;
  const doctors = useMemo(() => {
    if (!hasResultsScope) return [];
    const byService = new Map<string, ReturnType<typeof getPenDoctorsForService>>();
    return matches.providers.flatMap((provider) => {
      const lookupService = matchingService(provider, filters);
      if (!lookupService) return [];
      let candidates = byService.get(lookupService);
      if (!candidates) {
        candidates = getPenDoctorsForService(lookupService);
        byService.set(lookupService, candidates);
      }
      const doctor = candidates.find((item) => item.id === provider.id);
      return doctor ? [{ doctor, serviceCode: filters.serviceCode ?? null }] : [];
    });
  }, [matches.providers, filters, hasResultsScope]);

  const activeTab = gradeTab;
  const visibleDoctors = useMemo(
    () =>
      activeTab === 'all'
        ? doctors
        : doctors.filter(({ doctor }) => {
            const provider = getMockProvider(doctor.id);
            return Boolean(provider && matchesDoctorGrade(provider, activeTab));
          }),
    [doctors, activeTab],
  );
  const selection = comparison?.providerIds ?? [];
  return (
    <FlatList
      className="min-h-0 flex-1"
      data={visibleDoctors}
      keyExtractor={(item) => item.doctor.id}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      contentContainerClassName="mx-auto w-full max-w-[430px] gap-3 px-4 pt-4"
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      ListHeaderComponent={
        <View className="gap-4 pb-1">
          {header}
          {hasResultsScope ? (
            <>
              <DoctorGradeTabs value={activeTab} onChange={setGradeTab} />
              <AppText align="right" variant="heading-4" className="font-ui-bold">
                النتائج ({visibleDoctors.length})
              </AppText>
              {selection.length ? (
                <AppText align="right" variant="caption" className="text-content-secondary">
                  {comparison?.serviceCode
                    ? 'المقارنة بحسب الخدمة المختارة من الفلاتر، وبحد أقصى 3 أطباء.'
                    : 'المقارنة بين معلومات الأطباء، وبحد أقصى 3 أطباء.'}
                </AppText>
              ) : null}
            </>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        hasResultsScope && activeTab !== 'all' ? (
          <EmptyState
            title="لا يوجد أطباء ضمن هذا التصنيف"
            description="جرّب تصنيفاً آخر أو اعرض جميع الأطباء المتاحين."
            actionLabel="عرض جميع التصنيفات"
            onAction={() => setGradeTab('all')}
            icon={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          />
        ) : hasResultsScope ? (
          <EmptyState
            title="ما لقينا أطباء مطابقين"
            description="جرّب كلمة بحث مختلفة أو خفف الفلاتر المختارة."
            icon={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          />
        ) : (
          <DiscoverSearchIllustration />
        )
      }
      renderItem={({ item: { doctor, serviceCode } }) => {
        const selected = selection.includes(doctor.id);
        return (
          <DiscoverDoctorResultCard
            doctor={doctor}
            serviceCode={serviceCode}
            selected={selected}
            disabled={!selected && selection.length >= 3}
            showServicePrice={Boolean(filters.serviceCode)}
            showComparison={allowGeneralComparison || Boolean(filters.serviceCode)}
            onToggle={() => onToggleComparison(doctor.id, filters.serviceCode ?? null)}
          />
        );
      }}
    />
  );
}
