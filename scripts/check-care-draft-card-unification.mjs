import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const read = file => readFileSync(file, 'utf8');
function loadModule(file, dependencies = {}) {
  const output = ts.transpileModule(read(file), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', 'require', output)(module, module.exports, (name) => {
    if (!(name in dependencies)) throw new Error('Unexpected module: ' + name);
    return dependencies[name];
  });
  return module.exports;
}

const demoProvider = { id: 'provider-test', name: 'د. أحمد', branch: 'عيادة الجميلية' };
const display = loadModule('src/features/my-care/model/care-draft-display.ts', {
  '@/features/discovery/mocks/providers.mock': {
    getMockProvider: id => id === demoProvider.id ? demoProvider : undefined,
  },
});
const filters = loadModule('src/features/my-care/model/care-tab-filters.ts', {
  '@/features/booking/mocks/bookings.mock': { isUpcomingMockBooking: () => false },
  './care-draft-display': display,
});
const booking = {
  id: 'booking-test', kind: 'booking', title: 'حجز فحص',
  detail: 'اختيار موعد', route: '/booking/slots', updatedAt: 9,
  booking: { providerId: demoProvider.id, serviceCode: 'dental-checkup', dateLabel: 'السبت' },
};
const assessment = {
  id: 'assessment-self', kind: 'assessment', title: 'ألم في ضرس',
  detail: 'تفاصيل الأعراض', route: '/assessment/questions', updatedAt: 15,
  assessment: { complaint: 'ألم في ضرس' },
};
const all = [booking, assessment];
const defaults = filters.defaultCaseAdvanced;
assert.deepEqual(filters.filterDraftCaseRecords(all, 'الكل', defaults).map(x => x.id),
  ['assessment-self', 'booking-test']);
assert.deepEqual(filters.filterDraftCaseRecords(all, 'مسودة', defaults).map(x => x.id),
  ['assessment-self', 'booking-test']);
assert.equal(filters.filterDraftCaseRecords(all, 'قيد العلاج', defaults).length, 0);
assert.equal(filters.filterDraftCaseRecords(all, 'مكتملة', defaults).length, 0);
assert.deepEqual(filters.filterDraftCaseRecords(all, 'مسودة', {
  ...defaults, provider: demoProvider.name,
}).map(x => x.id), ['booking-test']);
assert.deepEqual(filters.filterDraftCaseRecords(all, 'مسودة', {
  ...defaults, clinic: demoProvider.branch,
}).map(x => x.id), ['booking-test']);
assert.equal(filters.filterDraftCaseRecords(all, 'مسودة', {
  ...defaults, clinic: 'عيادة مختلفة',
}).length, 0);

const activeCase = { id: 'case-1', progress: 25, provider: 'د. أحمد',
  branch: 'عيادة الجميلية', nextAction: 'جلسة متابعة' };
const completedCase = { id: 'case-2', progress: 100, provider: 'د. أحمد',
  branch: 'عيادة الجميلية', nextAction: 'لا يوجد إجراء مطلوب' };
assert.equal(filters.filterCaseRecords([activeCase,completedCase], 'مسودة', defaults).length, 0);
assert.equal(filters.filterCaseRecords([activeCase,completedCase], 'الكل', defaults).length, 2);

assert.equal(display.getDraftCaseDisplay(booking).provider, 'د. أحمد');
assert.equal(display.getDraftCaseDisplay(booking).branch, 'عيادة الجميلية');
assert.equal(display.getDraftCaseDisplay(assessment).provider, 'لم يتم اختيار الطبيب بعد');
assert.ok(display.getDraftCaseDisplay(assessment).detail.includes('تفاصيل الأعراض'));

const card = read('src/features/my-care/components/case-overview-card.tsx');
const badge = read('src/features/my-care/components/care-case-status-badge.tsx');
const content = read('src/features/my-care/components/care-tab-content.tsx');
const screen = read('src/features/my-care/screens/my-cases-overview-screen.tsx');
assert.ok(card.includes("item: MockCareCase | LocalCareDraft"), 'Draft and real case share card component');
assert.ok(card.includes('<CenteredActionIcon name="care" frameSize={44} iconSize={20} />'),
  'Both variants use same treatment case icon');
assert.ok(card.includes('<HeroCard') && card.includes('<CareCaseStatusBadge'));
assert.ok(badge.includes("draft ? 'مسودة'"), 'Status badge declares draft state');
assert.ok(card.includes('متابعة المسودة') && card.includes('حذف المسودة'), 'Draft actions remain functional');
assert.ok(content.includes('drafts.map((draft)') && content.includes('cases.map((item)'),
  'Drafts and regular cases render in same list');
assert.ok(!screen.includes('مسوداتك ('), 'No separate drafts section');
assert.ok(screen.includes('filterDraftCaseRecords(drafts, caseQuick, caseAdvanced)'),
  'Both quick and advanced filters apply to saved drafts');
assert.ok(screen.includes('onDraftContinue={resumeDraft}') && screen.includes('onDraftRemove={deleteDraft}'),
  'Resume and delete actions remain wired');
process.stdout.write('Unified treatment case/draft card and status filtering checks passed.\n');
