import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const read = (name) => readFileSync(name, 'utf8');
const screen = read('src/features/discovery/screens/provider-comparison-screen.tsx');
const grid = read('src/features/discovery/components/provider-comparison-grid.tsx');
const column = read('src/features/discovery/components/provider-comparison-column.tsx');
const model = read('src/features/discovery/model/provider-comparison.ts');
const providerData = read('src/features/discovery/presentation/pen-discovery-data.ts');

const specs = [
  ...model.matchAll(
    /key: '(rating|price|appointment|clinic|included|conditions)',\s*label: '[^']+',\s*height: (\d+)/g,
  ),
];
assert.equal(specs.length, 6, 'All six comparison criteria must have fixed heights');
assert.equal(new Set(specs.map((match) => match[1])).size, 6, 'Criterion keys must be unique');
assert.ok(model.includes('getMockProviderPriceFact(provider, serviceCode)'));
assert.ok(model.includes('provider?.reviews') && model.includes('provider.rating.toFixed(1)'));
assert.ok(
  providerData.includes('nextIllustrativeSlot(provider)'),
  'Current fixture dates must be checked',
);
assert.ok(
  grid.includes('comparisonRowDefinitions.map') && column.includes('comparisonRowDefinitions.map'),
);
assert.ok(
  grid.includes('style={{ height: row.height }}') &&
    column.includes('style={{ height: row.height }}'),
);
assert.ok(
  grid.includes('<ScrollView') && grid.includes('horizontal') && grid.includes('requiresScroll'),
);
assert.ok(grid.includes('doctorWidth * doctors.length') && grid.includes('screenWidth'));
assert.ok(
  column.includes('<HeroCard') && column.includes('getComparisonFacts(doctor, serviceCode)'),
);
assert.ok(column.includes("accessibilityLabel={'إزالة ' + doctor.name"));
assert.ok(column.includes('onPress={onViewProfile}') && column.includes('onPress={onChoose}'));
assert.ok(
  screen.includes('<ProviderSelectedServiceSummary') && screen.includes('<ProviderComparisonGrid'),
);
assert.ok(
  screen.includes("pathname: '/booking/slots'") &&
    screen.includes("pathname: '/discover/provider/[providerId]'"),
);
assert.ok(screen.includes('setComparisonProviders(serviceCode, remaining)'));
assert.ok(screen.includes('if (remaining.length < 2)'));
assert.ok(screen.includes("providerIds: remaining.join(',')"));
assert.ok(screen.includes('بيانات الأطباء تجريبية') && screen.includes('ليست حجوزات مؤكدة'));

assert.ok(
  grid.includes('headerScrollRef') &&
    grid.includes('rowsScrollRef') &&
    grid.includes('synchronizeHorizontal') &&
    grid.includes('scrollTo({ x: offset, animated: false })'),
  'Header and data rows must stay synchronized when horizontally swiped',
);
assert.ok(
  grid.includes('className="min-h-0 flex-1"') &&
    grid.includes('ProviderComparisonDoctorHeader') &&
    grid.includes('ProviderComparisonDoctorRows'),
  'Fixed doctor profiles must be separate from the vertically scrollable criteria',
);
assert.ok(
  screen.includes('<ProviderComparisonGrid') &&
    screen.includes('border-t border-border-subtle bg-surface-canvas') &&
    !screen.includes('<ScrollView'),
  'Disclaimers and change selection must remain fixed outside the internal table scroll',
);
assert.ok(
  column.includes('className="w-full flex-row items-center justify-between"') &&
    !column.includes('absolute left-1.5 top-1.5') &&
    !column.includes('items-center justify-between rounded-[15px]'),
  'Doctor remove icon must not cover the avatar, and profile content must be compact',
);
assert.ok(column.includes('عرض الملف') && column.includes('border-action-primary/55'));

assert.ok(!screen.includes('doctor[attribute.key]'), 'No untyped generic attribute string map');
console.log(
  'Doctor comparison UI: aligned 2/3 doctor grid, shared fixture facts, safe navigation and six criteria passed.',
);
