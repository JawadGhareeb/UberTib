import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import {
  DiscoveryBottomBar,
  DiscoveryHeader,
} from '@/features/discovery/components/pen-discovery-ui';
import { AppHeader } from '@/shared/components/navigation';
import { AppText, Screen, SearchField } from '@/shared/components/ui';
import { DiscoverAssessmentSuggestion } from '../components/discover-assessment-suggestion';
import { DiscoverQuickSearchTypes } from '../components/discover-quick-search-types';
import { DiscoverRecentSearches } from '../components/discover-recent-searches';
import { useUniversalSearchActions } from '../hooks/use-universal-search-actions';

export function UniversalDentalSearchScreen({ asTab = false }: { asTab?: boolean } = {}) {
  const router = useRouter();
  const { catalogQuery, setCatalogQuery, submitSearch, openQuickType, openRecent } =
    useUniversalSearchActions();
  return (
    <Screen
      contentClassName="px-0 py-0"
      header={
        asTab ? (
          <AppHeader variant="primary" title="اكتشف" />
        ) : (
          <DiscoveryHeader
            showFilterAction
            onFilterPress={() =>
              router.push({
                pathname: '/discover/providers',
                params: { serviceCode: 'root-canal' },
              })
            }
            title="البحث"
          />
        )
      }
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerClassName={
          asTab
            ? 'mx-auto w-full max-w-[430px] px-4 pb-32 pt-3'
            : 'mx-auto w-full max-w-[430px] px-4 pb-[98px] pt-1'
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppText align="right" className="font-ui-bold" variant="heading-3">
          ابحث بالطريقة التي تعرفها
        </AppText>

        <SearchField
          containerClassName="mt-3"
          onChangeText={setCatalogQuery}
          onSubmitEditing={() => submitSearch()}
          placeholder="ألم، خدمة، طبيب، أو منطقة في حلب"
          value={catalogQuery}
        />

        <DiscoverAssessmentSuggestion />
        <DiscoverQuickSearchTypes onSelect={openQuickType} />
        <DiscoverRecentSearches onSelect={openRecent} />
      </ScrollView>
      {asTab ? null : <DiscoveryBottomBar activeTab="اكتشف" />}
    </Screen>
  );
}
