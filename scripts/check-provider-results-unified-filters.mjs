import { readFileSync } from 'node:fs';

const read = (file) => readFileSync(file, 'utf8');
const results = read('src/features/discovery/screens/provider-results-screen.tsx');
const legacy = read('src/features/discovery/screens/provider-search-screen.tsx');
const sheet = read('src/features/discovery/components/discover-filter-sheet.tsx');
const extras = read('src/features/discovery/components/provider-advanced-filter-options.tsx');
const empty = read('src/features/discovery/components/provider-results-empty-state.tsx');
const card = read('src/features/discovery/components/discover-doctor-result-card.tsx');
const chips = read('src/features/discovery/components/discover-applied-filter-chips.tsx');
const mock = read('src/features/discovery/utils/provider-filters.ts');
const sortUI = read('src/features/discovery/components/provider-sort-options.tsx');
const sortLogic = read('src/features/discovery/utils/provider-sort.ts');
const comparison = read('src/features/discovery/components/provider-comparison-bar.tsx');
const serviceContext = read(
  'src/features/discovery/components/provider-selected-service-summary.tsx',
);

const checks = [
  [
    'Doctor list is visible without forcing filter selection',
    results.includes('initialAppliedFilters(params)') &&
      results.includes('defaultProviderFilters') &&
      results.includes('getPenDoctorsForService(serviceCode)'),
  ],
  [
    'Filtering uses existing service-scoped mock providers and only applied filters',
    results.includes('filterMockProviders(') &&
      results.includes('matchesDiscoveryFilters(') &&
      results.includes('applied.advanced'),
  ],
  [
    'Advanced options are in the same HeroUI bottom sheet',
    results.includes('<DiscoverFilterSheet') &&
      results.includes('providerFilters={applied.advanced}') &&
      sheet.includes('<ProviderAdvancedFilterOptions') &&
      sheet.includes('<BottomSheet'),
  ],
  [
    'Filter sheet keeps a draft and applies together',
    sheet.includes('draftProviderFilters') &&
      sheet.includes('onApply(') &&
      sheet.includes('providerFilters ? draftProviderFilters : undefined'),
  ],
  [
    'Legacy route opens unified results instead of duplicate filters',
    legacy.includes('<Redirect') && legacy.includes("pathname: '/discover/providers/results'"),
  ],
  [
    'Empty-state distinguishes missing providers from filters excluding all',
    results.includes('hasServiceDoctors={!noServiceDoctors}') &&
      empty.includes('ما لقينا أطباء حسب الفلاتر المختارة') &&
      empty.includes('ما في أطباء مسجلين لهالخدمة حالياً'),
  ],
  [
    'Selected filters can be removed or cleared',
    results.includes('extraItems={[...advancedChips, ...sortChips]}') &&
      results.includes('onClearAll={resetFilters}') &&
      chips.includes('onClearAll={onClearAll}'),
  ],
  [
    'Doctors link to their profile and retain comparison state',
    card.includes("pathname: '/discover/provider/[providerId]'") &&
      card.includes('onPress={onToggle}') &&
      card.includes('<HeroButton') &&
      card.includes('accessibilityState={{ selected }}') &&
      card.includes("'تم الاختيار'") &&
      card.includes('<ProviderAvatar') &&
      results.includes('serviceState.comparisonProviderIds'),
  ],
  [
    'Demo availability is identified and uses the future-safe provider data',
    card.includes('موعد تجريبي') && card.includes('{doctor.next}'),
  ],
  [
    'Advanced flags are opt-in and never active on first load',
    /area:\s*false,\s*soonest:\s*false/.test(mock) &&
      extras.includes("key: 'rating'") &&
      extras.includes("key: 'branch'") &&
      extras.includes("key: 'payment'"),
  ],
  [
    'Sorting lives in the shared provider filter BottomSheet rather than a separate results button',
    sheet.includes('<ProviderSortOptions') &&
      sheet.includes('draftSort') &&
      results.includes('providerSort={applied.sort}') &&
      !results.includes('setSortByRating'),
  ],
  [
    'Sort can select rating high-to-low and low-to-high plus price order',
    sortLogic.includes("'rating-desc'") &&
      sortLogic.includes("'rating-asc'") &&
      sortLogic.includes("'price-asc'") &&
      sortLogic.includes("'price-desc'") &&
      sortUI.includes("import { Chip } from 'heroui-native'") &&
      sortUI.includes("variant={selected ? 'primary' : 'soft'}") &&
      sortUI.includes("color={selected ? 'accent' : 'default'}") &&
      sortUI.includes('<Chip.Label>{choice.label}</Chip.Label>') &&
      sortUI.includes('onPress={() => onChange(choice.value)}'),
  ],
  [
    '4.5 rating selection is a separate accessible Switch',
    extras.includes("label: 'التقييم 4.5 فأعلى'") &&
      extras.includes('accessibilityRole="switch"') &&
      extras.includes('onValueChange={(enabled)'),
  ],
  [
    'Comparison tray animates both entering and exiting',
    results.includes('<ProviderComparisonBar') &&
      comparison.includes('FadeInUp') &&
      comparison.includes('FadeOutDown') &&
      comparison.includes('ReduceMotion.System'),
  ],
  [
    'Selected service summary is informational only',
    results.includes('<ProviderSelectedServiceSummary') &&
      serviceContext.includes('<ServiceIcon serviceId={serviceCode}') &&
      !serviceContext.includes('<Pressable') &&
      !serviceContext.includes('onPress') &&
      !serviceContext.includes('router.push'),
  ],
];

const errors = checks.filter(([, ok]) => !ok).map(([label]) => label);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Provider results UI checks passed: ' + checks.length + ' contracts.');
}
