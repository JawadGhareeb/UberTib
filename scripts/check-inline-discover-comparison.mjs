import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { toggleCatalogComparison } from '../src/features/discovery/model/catalog-comparison.ts';

const source = (p) => readFileSync(p, 'utf8');
const ids = ['provider-layan', 'provider-omar', 'provider-rama'];
let state = null;

state = toggleCatalogComparison(state, ids[0], 'dental-checkup', ['dental-checkup', 'root-canal']);
assert.deepEqual(state, { serviceCode: 'dental-checkup', providerIds: [ids[0]] });
state = toggleCatalogComparison(state, ids[1], 'dental-filling', [
  'dental-checkup',
  'dental-filling',
]);
assert.equal(
  state.providerIds.length,
  2,
  'second doctor is added in place even with a different card service',
);
assert.equal(state.serviceCode, 'dental-checkup', 'the comparison remains for the same service');
state = toggleCatalogComparison(state, ids[2], 'dental-checkup', ['dental-checkup']);
assert.equal(state.providerIds.length, 3);
const full = state;
state = toggleCatalogComparison(state, 'provider-yazan', 'dental-checkup', ['dental-checkup']);
assert.strictEqual(state, full, 'cannot add a fourth doctor');
state = toggleCatalogComparison(state, 'provider-karim', 'root-canal', ['root-canal']);
assert.strictEqual(state, full, 'cannot silently compare different services');
state = toggleCatalogComparison(state, ids[1], 'dental-filling', ['dental-checkup']);
assert.deepEqual(state.providerIds, [ids[0], ids[2]], 'removing a selected doctor works');
state = toggleCatalogComparison(state, ids[0], 'dental-checkup', ['dental-checkup']);
state = toggleCatalogComparison(state, ids[2], 'dental-checkup', ['dental-checkup']);
assert.equal(state, null, 'removing the last selected doctor hides the comparison tray');
state = toggleCatalogComparison(state, 'provider-karim', 'root-canal', ['root-canal']);
assert.equal(
  state.serviceCode,
  'root-canal',
  'after clearing selection a new service can be compared',
);

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
assert.ok(searchResults.includes('onToggle={() => onToggleComparison(doctor.id, serviceCode)}'));
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
  'Search comparison stays inline, uses same-service max-three selection, navigates only on compare, and card borders match palette.',
);
