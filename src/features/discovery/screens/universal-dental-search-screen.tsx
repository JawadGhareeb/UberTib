import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Keyboard, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  DiscoveryBottomBar,
  DiscoveryHeader,
} from '@/features/discovery/components/pen-discovery-ui';
import { useDiscoverySession } from '@/features/discovery/state/discovery-session-provider';
import { getMockProvider } from '@/features/discovery/mocks/providers.mock';
import { ProviderComparisonBar } from '@/features/discovery/components/provider-comparison-bar';
import { AssessmentEntryCard } from '@/shared/components/assessment/assessment-entry-card';
import { AppHeader } from '@/shared/components/navigation';
import { PATIENT_TAB_BAR_HEIGHT } from '@/shared/components/navigation/patient-tab-metrics';
import { AppIcon, AppText, Screen, SearchField } from '@/shared/components/ui';
import { selectedDiscoveryAreas, type DiscoveryFilterSelection } from '../model/discover-filters';
import { DiscoverFilterSheet } from '../components/discover-filter-sheet';
import { DiscoverAppliedFilterChips } from '../components/discover-applied-filter-chips';
import { DiscoverSearchResults } from '../components/discover-search-results';

const initialDiscoverFilters: DiscoveryFilterSelection = {
  area: 'كل المناطق',
  areas: [],
  groupCode: null,
  serviceCode: null,
  priceRange: null,
};

/** One smart search entry and one progressive filter modal; no external category/back stack. */
export function UniversalDentalSearchScreen({ asTab = false }: { asTab?: boolean } = {}) {
  const router = useRouter();
  const { browseDoctors } = useLocalSearchParams<{ browseDoctors?: string }>();
  const isDoctorBrowse = !asTab && browseDoctors === '1';
  const [browseQuery, setBrowseQuery] = useState('');
  const insets = useSafeAreaInsets();
  const {
    catalogQuery,
    setCatalogQuery,
    catalogComparison,
    doctorBrowseComparison,
    toggleCatalogComparisonProvider,
    toggleDoctorBrowseComparisonProvider,
    setCatalogComparison,
    setDoctorBrowseComparison,
  } = useDiscoverySession();

  const comparison = isDoctorBrowse ? doctorBrowseComparison : catalogComparison;
  const toggleSearchComparison = (providerId: string, serviceCode: string | null) => {
    const toggle = isDoctorBrowse
      ? toggleDoctorBrowseComparisonProvider
      : toggleCatalogComparisonProvider;
    toggle(providerId, serviceCode, getMockProvider(providerId)?.serviceCodes ?? []);
  };

  const [filters, setFilters] = useState<DiscoveryFilterSelection>(initialDiscoverFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const applySearchFilters = (next: DiscoveryFilterSelection) => {
    if ((next.serviceCode ?? null) !== (filters.serviceCode ?? null)) {
      if (isDoctorBrowse) setDoctorBrowseComparison(null);
      else setCatalogComparison(null);
    }
    setFilters(next);
  };
  const activeFilters = Boolean(
    selectedDiscoveryAreas(filters).length > 0 ||
    filters.groupCode ||
    filters.serviceCode ||
    filters.priceRange,
  );

  return (
    <Screen
      contentClassName="px-0 py-0"
      header={
        asTab ? <AppHeader variant="primary" title="اكتشف" /> : <DiscoveryHeader title="البحث" />
      }
    >
      <DiscoverSearchResults
        query={isDoctorBrowse ? browseQuery : catalogQuery}
        showAllByDefault={isDoctorBrowse}
        allowGeneralComparison
        filters={filters}
        comparison={comparison}
        onToggleComparison={toggleSearchComparison}
        bottomPadding={PATIENT_TAB_BAR_HEIGHT + (comparison ? 152 : 52)}
        header={
          <>
            <View className="items-end gap-1">
              <AppText align="right" variant="heading-2">
                {isDoctorBrowse ? 'استكشف الأطباء' : 'كيف فينا نساعدك؟'}
              </AppText>
              <AppText align="right" variant="label" className="text-content-secondary">
                {isDoctorBrowse
                  ? 'تصفّح الأطباء مباشرة أو ابحث بالاسم، واستخدم الفلاتر الموجودة عند الحاجة.'
                  : 'ابحث باسم الطبيب، أو استخدم الفلاتر لتحديد الخدمة والمنطقة.'}
              </AppText>
            </View>

            <View className="flex-row-reverse items-center gap-2">
              <View className="min-w-0 flex-1">
                <SearchField
                  value={isDoctorBrowse ? browseQuery : catalogQuery}
                  onChangeText={isDoctorBrowse ? setBrowseQuery : setCatalogQuery}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  accessibilityLabel="البحث باسم الطبيب"
                  placeholder="ابحث باسم الطبيب..."
                />
              </View>
              {(isDoctorBrowse ? browseQuery : catalogQuery).length ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="مسح البحث"
                  className="h-[46px] w-[40px] items-center justify-center rounded-[12px] bg-surface-default"
                  onPress={() => {
                    if (isDoctorBrowse) setBrowseQuery('');
                    else setCatalogQuery('');
                    Keyboard.dismiss();
                  }}
                >
                  <AppIcon
                    name={{ ios: 'xmark', android: 'close', web: 'close' }}
                    size={18}
                    tone="secondary"
                  />
                </Pressable>
              ) : null}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="فلترة البحث حسب الموقع والخدمات"
                accessibilityHint="يفتح نافذة الفلاتر المتدرجة"
                className={
                  'h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px] border ' +
                  (activeFilters
                    ? 'border-action-primary bg-action-subtle'
                    : 'border-border-subtle bg-surface-default')
                }
                onPress={() => {
                  Keyboard.dismiss();
                  setFilterOpen(true);
                }}
              >
                <AppIcon
                  name={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }}
                  size={22}
                  tone="action"
                />
              </Pressable>
            </View>

            <DiscoverAppliedFilterChips selection={filters} onChange={applySearchFilters} />

            {isDoctorBrowse ? null : <AssessmentEntryCard />}
          </>
        }
      />

      {comparison?.providerIds.length ? (
        <ProviderComparisonBar
          count={comparison.providerIds.length}
          bottom={PATIENT_TAB_BAR_HEIGHT + Math.max(insets.bottom, 8)}
          onCompare={() => {
            if (comparison.providerIds.length < 2) return;
            Keyboard.dismiss();
            router.push({
              pathname: '/discover/providers/compare',
              params: {
                ...(comparison.serviceCode ? { serviceCode: comparison.serviceCode } : {}),
                providerIds: comparison.providerIds.join(','),
                fromSearch: isDoctorBrowse ? 'doctors' : asTab ? 'tab' : 'search',
              },
            });
          }}
        />
      ) : null}

      <DiscoverFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        selection={filters}
        onApply={applySearchFilters}
        serviceSelectionEnabled
      />
      {asTab ? null : <DiscoveryBottomBar activeTab="اكتشف" />}
    </Screen>
  );
}
