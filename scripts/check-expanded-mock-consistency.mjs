import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const cache = new Map();
function fixture(file) {
  const absolute = path.resolve(file);
  if (cache.has(absolute)) return cache.get(absolute).exports;
  const m = { exports: {} };
  cache.set(absolute, m);
  const transpiled = ts.transpileModule(readFileSync(absolute, 'utf8'), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText;
  const resolve = (specifier) => {
    assert.ok(specifier.startsWith('@/'), 'Unexpected dependency ' + specifier);
    const source = path.resolve('src', specifier.slice(2));
    return fixture(source.endsWith('.ts') || source.endsWith('.tsx') ? source : source + '.ts');
  };
  new Function('module', 'exports', 'require', transpiled)(m, m.exports, resolve);
  return m.exports;
}
const { mockProviders, mockAreas } = fixture('src/features/discovery/mocks/providers.mock.ts');
const { penServiceGroups, penReviews } = fixture(
  'src/features/discovery/presentation/pen-discovery-data.ts',
);
const { mockBookings } = fixture('src/features/booking/mocks/bookings.mock.ts');
const { mockCareCases, getMockCareReferenceLabel } = fixture(
  'src/features/my-care/mocks/care.mock.ts',
);
const { mockClaims, getMockFinancialRecordForScenario, getMockFinancialEventsForScenario } =
  fixture('src/features/my-care/mocks/records.mock.ts');
const { mockNotifications } = fixture('src/features/platform/mocks/platform.mock.ts');
const { mockDependents, mockGrants, mockPendingSubmissions } = fixture(
  'src/features/profile/mocks/representation.mock.ts',
);
const { mockPatientWorld } = fixture('src/shared/mock/patient.mock.ts');
const { getMockServiceGroups } = fixture('src/features/discovery/mocks/catalog.mock.ts');
const { canBookForPatient } = fixture('src/features/booking/utils/patient-booking-permissions.ts');

const unique = (items, key, label) =>
  assert.equal(new Set(items.map(key)).size, items.length, label + ' duplicate IDs');
const money = (value) => Number(String(value).replace(/[^0-9]/g, ''));
const doctor = new Map(mockProviders.map((p) => [p.id, p]));
const visit = new Map(mockBookings.map((b) => [b.id, b]));
const care = new Map(mockCareCases.map((c) => [c.id, c]));
const claims = new Map(mockClaims.map((c) => [c.id, c]));
const serviceCodes = new Set(penServiceGroups.flatMap((g) => g.families.map((f) => f.id)));

assert.ok(mockProviders.length >= 20 && mockBookings.length >= 24 && mockCareCases.length >= 10);
assert.ok(mockClaims.length >= 8 && mockNotifications.length >= 15 && penReviews.length >= 20);
for (const [items, type] of [
  [mockProviders, 'doctor'],
  [mockBookings, 'booking'],
  [mockCareCases, 'case'],
  [mockClaims, 'claim'],
  [mockNotifications, 'notification'],
  [mockGrants, 'grant'],
]) {
  unique(items, (x) => x.id, type);
}
unique(penReviews, (r) => [r.providerId, r.serviceCode, r.dateKey].join(':'), 'review');

for (const p of mockProviders) {
  assert.ok(mockAreas.includes(p.area), p.id + ' unknown area');
  assert.ok(p.rating >= 1 && p.rating <= 5);
  for (const code of p.serviceCodes) {
    assert.ok(serviceCodes.has(code), p.id + ' unknown service ' + code);
    const fact = p.prices[code];
    assert.ok(fact && fact.currency === 'SYP', p.id + ' missing price fact ' + code);
    if (fact.mode === 'range') assert.ok(fact.amount_min <= fact.amount_max);
    if (fact.mode === 'fixed') assert.ok(fact.amount >= 0);
  }
  for (const date of p.availability) {
    assert.match(date.dateKey, /^20\d{2}-\d{2}-\d{2}$/);
    assert.ok(date.slots.length > 0);
  }
}
for (const code of serviceCodes) {
  assert.ok(
    mockProviders.some((p) => p.serviceCodes.includes(code)),
    'No doctor offers ' + code,
  );
}
for (const b of mockBookings) {
  const p = doctor.get(b.providerId);
  assert.ok(p, b.id + ' missing doctor');
  assert.equal(b.providerName, p.name, b.id + ' wrong doctor name');
  assert.equal(b.branch, p.branch, b.id + ' wrong clinic');
  assert.ok(p.serviceCodes.includes(b.serviceCode), b.id + ' incompatible service');
  assert.match(b.dateKey, /^20\d{2}-\d{2}-\d{2}$/);
}
for (const c of mockCareCases) {
  assert.ok(
    mockProviders.some((p) => p.name === c.provider),
    c.id + ' unknown doctor',
  );
  assert.notEqual(getMockCareReferenceLabel(c.id), '—', c.id + ' missing display number');
  assert.ok(c.progress >= 0 && c.progress <= 100);
  assert.ok(c.stages.length >= 2 && c.timeline.length && c.followUps.length);
  unique(c.stages, (x) => x.id, c.id + ' stage');
  const planTotal = c.treatmentPlan.reduce((sum, p) => sum + money(p.priceLabel), 0);
  const accepted = !c.planAcceptedAtLabel.includes('بانتظار');
  if (accepted) assert.equal(planTotal, money(c.acceptedTotalLabel), c.id + ' invalid plan total');
  for (const f of c.followUps) {
    if (!f.bookingId) continue;
    assert.ok(visit.has(f.bookingId), c.id + ' missing followup booking');
    assert.equal(visit.get(f.bookingId).providerName, c.provider, c.id + ' wrong followup doctor');
  }
  const record = getMockFinancialRecordForScenario({ flags: {} }, c.id);
  const events = getMockFinancialEventsForScenario({ flags: {} }, c.id);
  if (accepted) {
    assert.equal(record.caseId, c.id, c.id + ' ledger tied to another case');
    assert.equal(record.acceptedTerms.totalLabel, c.acceptedTotalLabel);
    assert.ok(
      events.reduce((n, e) => n + money(e.amountLabel), 0) <= planTotal,
      c.id + ' ledger exceeds plan',
    );
  } else {
    assert.notEqual(record.caseId, c.id, c.id + ' unaccepted plan has accepted terms');
    assert.equal(events.length, 0);
  }
}
for (const c of mockClaims) {
  assert.ok(care.has(c.caseId), c.id + ' orphan claim');
  assert.ok(c.evidence.length && c.history.length);
  if (c.appealEligible) assert.ok(c.decision, c.id + ' appeal without decision');
}
for (const r of penReviews) {
  const p = doctor.get(r.providerId);
  assert.ok(p && p.serviceCodes.includes(r.serviceCode), r.providerId + ' review mismatch');
}
for (const n of mockNotifications) {
  const parts = String(n.href).split('/');
  if (parts[1] === 'booking') assert.ok(visit.has(parts[2]), n.id + ' orphan booking');
  if (parts[1] === 'care') {
    assert.ok(care.has(parts[2]), n.id + ' orphan care');
    if (parts[3] === 'claims' && parts[4]) {
      assert.equal(claims.get(parts[4])?.caseId, parts[2], n.id + ' orphan claim');
    }
  }
}
const family = new Set(mockPatientWorld.family.map((m) => m.id));
const dependent = new Set(mockDependents.map((m) => m.id));
for (const g of mockGrants) {
  assert.ok(
    dependent.has(g.subjectPatientId) && family.has(g.subjectPatientId),
    g.id + ' grant refers to unknown family',
  );
}
assert.ok(
  !family.has('patient-005') && !dependent.has('patient-005'),
  'Pending child cannot be bookable',
);
assert.ok(
  mockPendingSubmissions.some((x) => x.title.includes('ريم خالد')),
  'Pending child request missing',
);
assert.equal(canBookForPatient('patient-001', { flags: {} }), true, 'Account owner can book');
assert.equal(
  canBookForPatient('patient-002', { flags: {} }),
  true,
  'Verified child is bookable under active grant',
);
assert.equal(
  canBookForPatient('patient-004', { flags: {} }),
  true,
  'Father is bookable under valid grant',
);
assert.equal(
  canBookForPatient('patient-003', { flags: {} }),
  false,
  'Pending grant does not allow booking',
);
assert.equal(
  canBookForPatient('patient-005', { flags: {} }),
  false,
  'Pending child request never allows booking',
);

const catalog = await getMockServiceGroups();
assert.equal(catalog.data.length, penServiceGroups.length);
for (const s of catalog.data.flatMap((g) => g.services)) {
  assert.equal(
    s.provider_count,
    mockProviders.filter((p) => p.serviceCodes.includes(s.code)).length,
    s.code + ' provider count wrong',
  );
}
console.log(
  'Cross-linked fixtures verified: ' +
    [
      mockProviders.length + ' doctors',
      serviceCodes.size + ' services',
      mockBookings.length + ' bookings',
      mockCareCases.length + ' cases',
      mockClaims.length + ' claims',
      penReviews.length + ' reviews',
      mockNotifications.length + ' notifications',
      mockGrants.length + ' grants',
    ].join(', '),
);
