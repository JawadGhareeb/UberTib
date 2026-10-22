import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

function load(file) {
  const input = readFileSync(file, 'utf8');
  const js = ts.transpileModule(input, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  const module = { exports };
  new Function('exports', 'module', 'require', js)(exports, module, () => {
    throw new Error('Classification mock is unexpectedly coupled to runtime imports');
  });
  return module.exports;
}

const providers = load('src/features/discovery/mocks/providers.mock.ts');
const levels = load('src/features/discovery/model/doctor-classification.ts');
const all = providers.mockProviders;
assert.ok(all.length >= 15, 'Every mock doctor should have a demonstrable classification scenario');

const grades = new Set();
const protections = new Set();
const byService = new Map();
const financialOrder = { A: 0, B: 1, C: 2, D: 3 };
for (const doctor of all) {
  assert.ok(
    doctor.serviceCodes.length,
    'Doctor has services for classification scope: ' + doctor.id,
  );
  for (const serviceCode of doctor.serviceCodes) {
    const cls = levels.getDoctorClassification(doctor, serviceCode);
    assert.equal(cls.providerId, doctor.id);
    assert.equal(cls.serviceCode, serviceCode);
    assert.equal(cls.branch, doctor.branch);
    assert.equal(cls.verified, false, 'No real-world verification should be implied');
    assert.equal(cls.rating, doctor.reviews ? doctor.rating : null);
    assert.equal(cls.priceLabel, doctor.prices[serviceCode]?.displayLabel ?? 'السعر بعد الفحص');
    grades.add(cls.scientific);
    protections.add(cls.protection);
    if (cls.scientific === 'pending') {
      assert.equal(cls.pricing, null, 'Pending classification must not have an assumed price tier');
    }
    if (cls.pricing) {
      assert.ok(
        financialOrder[cls.pricing] >= financialOrder[cls.scientific],
        'Pricing cannot exceed scientific ceiling for ' + doctor.id + '/' + serviceCode,
      );
    }
    if (cls.protection) {
      assert.equal(
        doctor.protectionActive,
        true,
        'Cannot show active protection when mock says inactive',
      );
      assert.ok(cls.pricing);
      assert.ok(
        financialOrder[cls.protection] <= financialOrder[cls.pricing],
        'Protection must be at least the chosen price tier',
      );
    }
    byService.set(doctor.id + '/' + serviceCode, cls);
  }
}
assert.ok(
  ['A', 'B', 'C', 'D', 'pending'].every((value) => grades.has(value)),
  'Demo must include all bookable scientific tiers and a pending example',
);
assert.ok(
  ['A', 'B', 'C', 'D', null].every((value) => protections.has(value)),
  'Demo must include all protection levels and no-protection examples',
);
assert.notEqual(
  byService.get('provider-majed/implant')?.scientific,
  byService.get('provider-majed/dental-checkup')?.scientific,
  'Scientific category must support different results for the same doctor by service',
);

const chips = readFileSync(
  'src/features/discovery/components/doctor-classification-chips.tsx',
  'utf8',
);
const profile = readFileSync(
  'src/features/discovery/components/doctor-classification-details.tsx',
  'utf8',
);
const card = readFileSync(
  'src/features/discovery/components/discover-doctor-result-card.tsx',
  'utf8',
);
const detail = readFileSync('src/features/discovery/screens/provider-decision-screen.tsx', 'utf8');
assert.ok(chips.includes('<Chip') && card.includes('<DoctorClassificationChips'));
assert.ok(
  profile.includes('<HeroCard') &&
    profile.includes('<PressableFeedback') &&
    profile.includes('<BottomSheet') &&
    detail.includes('<DoctorClassificationDetails'),
);
assert.ok(!chips.includes('الفئة S') && !profile.includes('مؤشر I'));
process.stdout.write(
  'Doctor classification demo: levels, service scope, financial compatibility and HeroUI surfaces passed.\n',
);
