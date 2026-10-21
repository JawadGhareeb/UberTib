/**
 * Contract tests for the mock-only Discover search experience.
 * Executes the real TypeScript data/model functions (not copied fixture values).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const cache = new Map();

function load(sourcePath) {
  const target = path.resolve(sourcePath);
  if (cache.has(target)) return cache.get(target).exports;
  const module = { exports: {} };
  cache.set(target, module);
  const source = fs.readFileSync(target, 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
    fileName: target,
    reportDiagnostics: true,
  }).outputText;
  const localRequire = (specifier) => {
    const base = specifier.startsWith('@/')
      ? path.join(root, 'src', specifier.slice(2))
      : path.resolve(path.dirname(target), specifier);
    if (!specifier.startsWith('@/') && !specifier.startsWith('.')) {
      throw Error('Unexpected non-local import: ' + specifier);
    }
    for (const ending of ['.ts', '.tsx', '.js', '/index.ts']) {
      if (fs.existsSync(base + ending)) return load(base + ending);
    }
    throw Error('Missing mock dependency: ' + specifier + ' from ' + target);
  };
  new Function('require', 'module', 'exports', code)(localRequire, module, module.exports);
  return module.exports;
}

const providers = load('src/features/discovery/mocks/providers.mock.ts');
const catalog = load('src/features/discovery/presentation/pen-discovery-data.ts');
const filters = load('src/features/discovery/model/discover-filters.ts');
const search = load('src/features/discovery/model/discover-search.ts');

assert.equal(catalog.penServiceGroups.length, 4);
const families = catalog.penServiceGroups.flatMap((group) => group.families);
assert.equal(new Set(families.map((family) => family.id)).size, families.length);
assert.ok(families.length >= 20);
for (const doctor of providers.mockProviders) {
  for (const service of doctor.serviceCodes) {
    assert.ok(catalog.findPenFamily(service), 'Provider service missing from catalog: ' + service);
    assert.ok(doctor.prices[service], 'Provider price fact missing: ' + doctor.id + '/' + service);
  }
}

assert.ok(search.matchesDiscoverQuery('ليان', 'د. ليان يوسف'));
assert.ok(search.matchesDiscoverQuery('د ليان', 'د. ليان يوسف'));
assert.ok(search.matchesDiscoverQuery('الاعظمية', 'الأعظمية'));
assert.ok(search.matchesDiscoverQuery('جذور', 'علاج الجذور'));
assert.ok(!search.matchesDiscoverQuery('عمر ليان', 'د. ليان يوسف'));

assert.equal(filters.priceLimitsForService(undefined), null);
const rootLimits = filters.priceLimitsForService('root-canal');
assert.ok(rootLimits && rootLimits[0] < rootLimits[1]);
const layan = providers.mockProviders.find((doctor) => doctor.id === 'provider-layan');
assert.ok(layan);
assert.ok(
  filters.matchesDiscoveryFilters(layan, { area: 'كل المناطق', priceRange: null }, 'root-canal'),
);
assert.ok(
  !filters.matchesDiscoveryFilters(layan, { area: 'الفرقان', priceRange: null }, 'root-canal'),
);
assert.ok(
  filters.matchesDiscoveryFilters(
    layan,
    { area: 'الجميلية', priceRange: [600, 700] },
    'root-canal',
  ),
);
assert.ok(
  !filters.matchesDiscoveryFilters(
    layan,
    { area: 'الجميلية', priceRange: [1200, 1300] },
    'root-canal',
  ),
);
assert.ok(
  !filters.matchesDiscoveryFilters(layan, { area: 'كل المناطق', priceRange: null }, 'implant'),
);

// Prices requiring a plan should not be presented as numeric prices when a range is active.
for (const doctor of providers.mockProviders) {
  for (const [serviceCode, price] of Object.entries(doctor.prices)) {
    if (price.mode === 'requires-plan') {
      assert.ok(
        filters.matchesDiscoveryFilters(
          doctor,
          { area: 'كل المناطق', priceRange: null },
          serviceCode,
        ),
      );
      assert.ok(
        !filters.matchesDiscoveryFilters(
          doctor,
          { area: 'كل المناطق', priceRange: [0, 999999] },
          serviceCode,
        ),
      );
    }
  }
}

// Unified Discover screen search: no filters -> illustration; every filter acts on existing records.
const unfiltered = {
  area: 'كل المناطق',
  groupCode: null,
  serviceCode: null,
  priceRange: null,
};
const initial = search.selectDiscoverMatches('', unfiltered);
assert.equal(initial.hasCriteria, false);
assert.equal(initial.providers.length, providers.mockProviders.length);
assert.equal(initial.families.length, 0);

const areaOnly = search.selectDiscoverMatches('', { ...unfiltered, area: 'الجميلية' });
assert.equal(areaOnly.hasCriteria, true);
assert.ok(areaOnly.providers.length > 0);
assert.ok(areaOnly.providers.every((doctor) => doctor.area === 'الجميلية'));
assert.equal(areaOnly.families.length, 0);

const serviceOnly = search.selectDiscoverMatches('', {
  ...unfiltered,
  groupCode: 'G03',
  serviceCode: 'root-canal',
});
assert.equal(serviceOnly.families.length, 0); // Services are selected in filters, never search results.
assert.ok(serviceOnly.providers.length > 0);
assert.ok(serviceOnly.providers.every((doctor) => doctor.serviceCodes.includes('root-canal')));

const domainOnly = search.selectDiscoverMatches('', { ...unfiltered, groupCode: 'G03' });
const rootGroup = catalog.findPenGroup('G03');
assert.equal(domainOnly.families.length, 0);
assert.ok(
  domainOnly.providers.every((doctor) =>
    rootGroup.families.some((family) => doctor.serviceCodes.includes(family.id)),
  ),
);

const priced = search.selectDiscoverMatches('', {
  ...unfiltered,
  area: 'الجميلية',
  groupCode: 'G03',
  serviceCode: 'root-canal',
  priceRange: [600, 700],
});
assert.ok(priced.providers.some((doctor) => doctor.id === 'provider-layan'));
assert.ok(
  priced.providers.every((doctor) =>
    filters.matchesDiscoveryFilters(
      doctor,
      {
        area: 'الجميلية',
        priceRange: [600, 700],
      },
      'root-canal',
    ),
  ),
);
assert.equal(search.selectDiscoverMatches('عبارة غير موجودة', unfiltered).providers.length, 0);
assert.ok(
  search
    .selectDiscoverMatches('ليان', unfiltered)
    .providers.some((doctor) => doctor.id === 'provider-layan'),
);
assert.equal(search.selectDiscoverMatches('الاعظمية', unfiltered).providers.length, 0);
assert.deepEqual(search.selectDiscoverMatches('الاعظمية', unfiltered).areas, []);
assert.equal(search.selectDiscoverMatches('علاج الجذور', unfiltered).providers.length, 0);
assert.equal(search.selectDiscoverMatches('الفحص والوقاية', unfiltered).providers.length, 0);
assert.equal(search.selectDiscoverMatches('مركز نور الأسنان', unfiltered).providers.length, 0);
assert.equal(search.selectDiscoverMatches('الجميلية', unfiltered).providers.length, 0);
assert.equal(search.selectDiscoverMatches('ليان', unfiltered).providers.length, 1);
assert.ok(
  search
    .selectDiscoverMatches('', { ...unfiltered, serviceCode: 'root-canal' })
    .providers.every((doctor) => doctor.serviceCodes.includes('root-canal')),
);
assert.equal(
  search.selectDiscoverMatches('ليان', { ...unfiltered, serviceCode: 'teeth-whitening' }).providers
    .length,
  0,
);

// Region selection is a multi-select: regions are OR'd; All Areas clears the choice.
const selectedTwo = filters.withSelectedDiscoveryAreas(unfiltered, [
  'الجميلية',
  'الفرقان',
  'الجميلية',
]);
assert.deepEqual(filters.selectedDiscoveryAreas(selectedTwo), ['الجميلية', 'الفرقان']);
assert.equal(selectedTwo.area, 'كل المناطق');
const twoAreas = search.selectDiscoverMatches('', selectedTwo);
assert.equal(twoAreas.hasCriteria, true);
assert.ok(twoAreas.providers.length > areaOnly.providers.length);
assert.ok(twoAreas.providers.every((doctor) => selectedTwo.areas.includes(doctor.area)));
const allAreasAgain = filters.withSelectedDiscoveryAreas(selectedTwo, []);
assert.deepEqual(filters.selectedDiscoveryAreas(allAreasAgain), []);
assert.equal(allAreasAgain.area, 'كل المناطق');

const catalogPrices = filters.priceLimitsForSelection(unfiltered);
assert.ok(
  catalogPrices && catalogPrices[0] < catalogPrices[1],
  'Global price slider must always be available',
);
const priceOnlyFilters = {
  ...unfiltered,
  priceRange: [600, 700],
};
const priceOnly = search.selectDiscoverMatches('', priceOnlyFilters);
assert.ok(priceOnly.hasCriteria, 'A price filter alone must activate search');
assert.ok(priceOnly.providers.some((doctor) => doctor.id === 'provider-layan'));
assert.ok(
  priceOnly.providers.every(
    (doctor) => filters.matchingPricedServices(doctor, priceOnlyFilters).length > 0,
  ),
);
assert.ok(
  priceOnly.providers.every((doctor) =>
    filters
      .matchingPricedServices(doctor, priceOnlyFilters)
      .every((serviceCode) => Boolean(doctor.prices[serviceCode])),
  ),
);
const domainPrices = filters.priceLimitsForSelection({ ...unfiltered, groupCode: 'G03' });
assert.ok(domainPrices && domainPrices[0] < domainPrices[1]);

const rootLayout = fs.readFileSync('src/app/_layout.tsx', 'utf8');
// HeroUI's portal host must be below the direction context or AppText inside a sheet can throw.
assert.ok(
  rootLayout.indexOf('<AppProviders>') >= 0 &&
    rootLayout.indexOf('<AppProviders>') < rootLayout.indexOf('<HeroUINativeProvider'),
  'HeroUI portal host must be nested within AppProviders (RTL/theme context)',
);

console.log(
  'Discover search contract passed:',
  catalog.penServiceGroups.length,
  'groups,',
  families.length,
  'families,',
  providers.mockProviders.length,
  'providers; Arabic matching and all price/area cases OK.',
);
