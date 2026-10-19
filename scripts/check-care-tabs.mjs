/** Regression tests for the two separate My Care tabs and verified mock records. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const cache = new Map();
function load(file) {
  const target = path.resolve(file);
  if (cache.has(target)) return cache.get(target).exports;
  const result = { exports: {} };
  cache.set(target, result);
  const source = fs.readFileSync(target, 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
    fileName: target,
  }).outputText;
  function requireLocal(name) {
    const basename = name.startsWith('@/')
      ? path.resolve('src', name.slice(2))
      : path.resolve(path.dirname(target), name);
    if (!name.startsWith('@/') && !name.startsWith('.'))
      throw Error('Unexpected dependency ' + name);
    for (const ext of ['.ts', '.tsx', '.js', '/index.ts'])
      if (fs.existsSync(basename + ext)) return load(basename + ext);
    throw Error('Missing ' + basename);
  }
  new Function('require', 'module', 'exports', code)(requireLocal, result, result.exports);
  return result.exports;
}

const model = load('src/features/my-care/model/care-tab-filters.ts');
const care = load('src/features/my-care/mocks/care.mock.ts');
const booking = load('src/features/booking/mocks/bookings.mock.ts');
const overview = load('src/features/my-care/model/care-overview-view.ts');
const cases = care.mockCareCases;
const bookings = booking.mockBookings;
const date = new Date(2026, 9, 19, 12);

assert.deepEqual([...model.caseQuickFilters], ['الكل', 'قيد العلاج', 'مكتملة']);
assert.deepEqual([...model.bookingQuickFilters], ['الكل', 'القادمة', 'بانتظار التأكيد']);
assert.equal(
  model.filterCaseRecords(cases, 'الكل', model.defaultCaseAdvanced).length,
  cases.length,
);
assert.ok(
  model
    .filterCaseRecords(cases, 'قيد العلاج', model.defaultCaseAdvanced)
    .every((x) => x.progress < 100),
);
assert.ok(
  model
    .filterCaseRecords(cases, 'مكتملة', model.defaultCaseAdvanced)
    .every((x) => x.progress >= 100),
);
const actionable = model.filterCaseRecords(cases, 'الكل', {
  ...model.defaultCaseAdvanced,
  actionRequired: true,
});
assert.ok(actionable.length > 0 && actionable.every(model.isCaseActionRequired));
assert.ok(!actionable.some((x) => x.id === 'case-002'));
assert.ok(
  model
    .filterCaseRecords(cases, 'الكل', { ...model.defaultCaseAdvanced, clinic: cases[0].branch })
    .every((x) => x.branch === cases[0].branch),
);
assert.ok(
  model
    .filterCaseRecords(cases, 'الكل', { ...model.defaultCaseAdvanced, provider: cases[0].provider })
    .every((x) => x.provider === cases[0].provider),
);

assert.equal(
  model.filterBookingRecords(bookings, 'الكل', model.defaultBookingAdvanced, date).length,
  bookings.length,
);
assert.ok(
  model
    .filterBookingRecords(bookings, 'بانتظار التأكيد', model.defaultBookingAdvanced, date)
    .every((x) => x.status === 'pending' || x.status === 'eligibility-review'),
);
assert.ok(
  model
    .filterBookingRecords(bookings, 'القادمة', model.defaultBookingAdvanced, date)
    .every((x) => booking.isUpcomingMockBooking(x, date)),
);
assert.ok(
  model
    .filterBookingRecords(
      bookings,
      'الكل',
      { ...model.defaultBookingAdvanced, status: 'completed' },
      date,
    )
    .every((x) => x.status === 'completed'),
);
const ranged = model.filterBookingRecords(
  bookings,
  'الكل',
  { ...model.defaultBookingAdvanced, dateFrom: '2026-10-25', dateTo: '2026-10-27' },
  date,
);
assert.ok(ranged.length > 0);
assert.ok(ranged.every((x) => x.dateKey >= '2026-10-25' && x.dateKey <= '2026-10-27'));
const mockRequest = {
  id: 'request-x',
  serviceName: 'فحص',
  providerName: 'د. اختبار',
  branch: 'مركز',
  patientName: 'مريض',
  status: 'pending',
  statusLabel: 'قيد التأكيد',
  dateLabel: 'لاحقاً',
  timeLabel: 'لاحقاً',
};
assert.equal(
  model.filterBookingRecords(
    [mockRequest],
    'الكل',
    { ...model.defaultBookingAdvanced, period: 'future' },
    date,
  ).length,
  0,
);
assert.equal(
  model.filterBookingRecords(
    [mockRequest],
    'الكل',
    { ...model.defaultBookingAdvanced, dateFrom: '2026-10-01' },
    date,
  ).length,
  0,
);
assert.equal(
  model.filterBookingRecords([mockRequest], 'بانتظار التأكيد', model.defaultBookingAdvanced, date)
    .length,
  1,
);
const records = [
  ...bookings.map((record) => ({ kind: 'booking', record })),
  ...cases.map((record) => ({ kind: 'case', record })),
];
const partition = overview.partitionCareRecords(records, date);
assert.equal(partition.cases.length, cases.length);
assert.equal(partition.bookings.length, bookings.length);
assert.ok(partition.cases.filter((x) => x.progress < 100).length > 0);
assert.ok(overview.getCareStageSummary(cases[0]).total > 0);
// Guard the requested single treatment-card design and normalized active status.
const careContent = fs.readFileSync('src/features/my-care/components/care-tab-content.tsx', 'utf8');
assert.ok(careContent.includes('cases.map((item) => ('));
assert.ok(!careContent.includes('CareFeaturedCaseCard'));
assert.ok(!cases.some((careCase) => careCase.statusLabel === 'قيد المتابعة'));
assert.ok(
  cases
    .filter((careCase) => careCase.progress < 100)
    .every((careCase) => careCase.statusLabel === 'قيد العلاج'),
);
const caseCard = fs.readFileSync('src/features/my-care/components/case-overview-card.tsx', 'utf8');
assert.ok(caseCard.includes('CareCaseStatusBadge'));
assert.ok(caseCard.includes('CareRecordTitle'));

const careTabs = fs.readFileSync('src/features/my-care/components/care-main-tabs.tsx', 'utf8');
const careSheet = fs.readFileSync(
  'src/features/my-care/components/care-advanced-filter-sheet.tsx',
  'utf8',
);
const carePage = fs.readFileSync(
  'src/features/my-care/screens/my-cases-overview-screen.tsx',
  'utf8',
);
assert.ok(careTabs.includes("active ? 'border border-border-subtle bg-surface-default'"));
assert.ok(careTabs.includes('onOpenFilters'));
assert.ok(!careTabs.includes('casesCount') && !careTabs.includes('bookingsCount'));
assert.ok(!carePage.includes('<CareQuickFilters'));
assert.ok(careSheet.includes('title="حالة العلاج"'));
assert.ok(careSheet.includes('title="عرض الحجوزات"'));
assert.ok(caseCard.includes('height: 6, borderRadius: 99'));
assert.ok(caseCard.includes('تفاصيل الحالة') && caseCard.includes('خطة العلاج'));
assert.ok(!caseCard.includes('chevron.left'));
assert.ok(!caseCard.includes('onPress={onPress}'));

// Applied filter chips must share Discover's HeroUI presentation, be dismissible,
// and keep Care's applied and draft selections independently editable.
const chipUI = fs.readFileSync('src/shared/components/filters/applied-filter-chips.tsx', 'utf8');
const careChips = fs.readFileSync(
  'src/features/my-care/components/care-applied-filter-chips.tsx',
  'utf8',
);
const discoverChips = fs.readFileSync(
  'src/features/discovery/components/discover-applied-filter-chips.tsx',
  'utf8',
);
const filterModal = fs.readFileSync(
  'src/features/my-care/components/care-advanced-filter-sheet.tsx',
  'utf8',
);
assert.ok(chipUI.includes('onPress={item.onRemove}'));
assert.ok(chipUI.includes('onPress={onClearAll}'));
assert.ok(chipUI.includes('<Chip.Label>مسح الكل</Chip.Label>'));
assert.ok(careChips.includes('<AppliedFilterChips items={items} onClearAll={onClearAll} />'));
assert.ok(discoverChips.includes('<AppliedFilterChips items={chips} />'));
assert.ok(carePage.includes('onClearAll={() => {'));
assert.ok(carePage.includes('setCaseAdvanced(defaultCaseAdvanced)'));
assert.ok(carePage.includes('setBookingAdvanced(defaultBookingAdvanced)'));
assert.ok(filterModal.includes('onCaseChange={onCaseDraft}'));
assert.ok(filterModal.includes('onBookingChange={onBookingDraft}'));
assert.ok(careChips.includes("key: 'booking-from'") && careChips.includes("key: 'booking-to'"));

console.log(
  'My Care tab regression passed:',
  cases.length,
  'care cases,',
  bookings.length,
  'bookings, independent filters, stage/booking separation and ISO date ranges.',
);
