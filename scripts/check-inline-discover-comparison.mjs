import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { toggleCatalogComparison } from '../src/features/discovery/model/catalog-comparison.ts';

const source = (p) => readFileSync(p, 'utf8');
const ids = ['provider-layan', 'provider-omar', 'provider-rama'];
let state = null;

// No service filter: comparison is generic and any doctor may be selected.
state = toggleCatalogComparison(state, ids[0], null, ['dental-checkup', 'root-canal']);
assert.deepEqual(state, { serviceCode: null, providerIds: [ids[0]] });
state = toggleCatalogComparison(state, 'provider-karim', null, ['root-canal']);
assert.equal(state.providerIds.length, 2);
assert.equal(state.serviceCode, null);
state = toggleCatalogComparison(state, ids[1], null, ['dental-checkup']);
assert.equal(state.providerIds.length, 3);
const full = state;
state = toggleCatalogComparison(state, 'provider-yazan', null, ['dental-checkup']);
assert.strictEqual(state, full, 'cannot add a fourth doctor');
state = toggleCatalogComparison(state, 'provider-karim', null, ['root-canal']);
assert.equal(state.providerIds.length, 2, 'selected doctor can be removed');
state = toggleCatalogComparison(state, ids[0], null, ['dental-checkup']);
state = toggleCatalogComparison(state, ids[1], null, ['dental-checkup']);
assert.equal(state, null, 'last removal hides tray');

// With a concrete service filter, only doctors offering that service are selectable.
state = toggleCatalogComparison(state, ids[0], 'dental-checkup', ['dental-checkup', 'root-canal']);
state = toggleCatalogComparison(state, 'provider-karim', 'dental-checkup', ['root-canal']);
assert.deepEqual(state.providerIds, [ids[0]], 'filter excludes other-service doctor');
state = toggleCatalogComparison(state, ids[1], 'dental-checkup', ['dental-checkup']);
assert.equal(state.providerIds.length, 2);
state = toggleCatalogComparison(state, ids[1], 'dental-checkup', ['dental-checkup']);
state = toggleCatalogComparison(state, ids[0], 'dental-checkup', ['dental-checkup']);
assert.equal(state, null);

const searchResults = source('src/features/discovery/components/discover-search-results.tsx');
const searchScreen = source('src/features/discovery/screens/universal-dental-search-screen.tsx');
const comparisonScreen = source('src/features/discovery/screens/provider-comparison-screen.tsx');
const discoverySession = source('src/features/discovery/state/discovery-session-provider.tsx');
assert.ok(
  discoverySession.includes('catalogComparison') &&
    discoverySession.includes('toggleCatalogComparisonProvider'),
  'search selection should persist in shared discovery state',
);
assert.ok(
  !searchScreen.includes('useEffect('),
  'search comparison must not depend on effect-based state copying',
);
assert.ok(
  searchResults.includes(
    'onToggle={() => onToggleComparison(doctor.id, filters.serviceCode ?? null)}',
  ),
);
assert.ok(
  !searchResults.includes('router.push('),
  'adding a doctor must never navigate to another page',
);
assert.ok(
  searchScreen.includes('<ProviderComparisonBar') &&
    searchScreen.includes("pathname: '/discover/providers/compare'"),
);
assert.ok(
  searchScreen.includes('if (comparison.providerIds.length < 2) return;'),
  'one doctor cannot open compare',
);
assert.ok(searchScreen.includes('paddingBottom: PATIENT_TAB_BAR_HEIGHT + (comparison ? 152 : 52)'));
assert.ok(
  comparisonScreen.includes('fromSearch') && comparisonScreen.includes('setCatalogComparison('),
  'edit comparison returns to search with selected doctors',
);
const model = source('src/features/discovery/model/discover-search.ts');
assert.ok(
  model.includes('matchesDiscoverQuery(term, provider.name)') &&
    !model.includes('provider.specialty,'),
  'Doctor search must match only name, not service, location or specialty',
);
assert.ok(
  !searchResults.includes('خدمة مختلفة'),
  'Generic search should never show a service-mismatch label',
);
assert.ok(
  searchScreen.includes('placeholder="ابحث باسم الطبيب..."'),
  'Search copy is doctor-name-only',
);
assert.ok(
  comparisonScreen.includes('المقارنة عامة بين الأطباء'),
  'Generic comparison does not pretend prices are comparable',
);
const tokens = JSON.parse(source('src/shared/theme/tokens.json'));
assert.equal(tokens.brand.mark, '#00977E');
for (const [palette, subtle, border, selectedBorder] of [
  [tokens.color, '#E7ECE9', '#DBE4DF', '#B5DCCF'],
  [tokens.darkColor, '#29332F', '#39463F', '#4E8678'],
]) {
  assert.equal(palette.border.subtle, subtle);
  assert.equal(palette.border.default, border);
  assert.equal(palette.state.selectedBorder, selectedBorder);
}
console.log(
  'Discover comparison stays inline: generic mode without service, service-scoped with filter; max-three and visual tokens pass.',
);
