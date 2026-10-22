import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = (path) => readFileSync(path, 'utf8');
const entry = source('src/shared/components/assessment/assessment-entry-card.tsx');
const hook = source('src/features/assessment/hooks/use-assessment-entry.ts');
const guard = source('src/features/auth/components/with-auth-required.tsx');
const access = source('src/providers/auth-access-provider.tsx');
assert.ok(
  entry.includes('<HeroCard') && entry.includes('onPress={startAssessment}'),
  'Help card remains visible; button calls auth-aware entry',
);
const complaintScreen = source('src/features/assessment/screens/assessment-complaint-screen.tsx');
assert.ok(
  hook.includes("router.push('/assessment/start')"),
  'Guest can enter the assessment intro',
);
assert.ok(
  complaintScreen.includes('requireAuth({') &&
    complaintScreen.includes("returnTo: buildReturnTo('/assessment/location'") &&
    complaintScreen.includes('primaryDisabled={!complaint}') &&
    access.includes('if (isAuthenticated) return true'),
  'Authentication dialog is shown only after choosing the complaint and continuing',
);
for (const name of ['start', 'complaint']) {
  assert.ok(
    !source(`src/app/assessment/${name}.tsx`).includes('withAuthRequired('),
    name + ' stays public for guests',
  );
}
assert.ok(
  guard.includes('if (isAuthenticated) return <Component {...props} />'),
  'Direct routes render no private content to guests',
);
for (const name of [
  'health',
  'location',
  'manual-review',
  'media',
  'needs-more-info',
  'patient',
  'processing',
  'questions',
  'result',
  'review',
]) {
  const route = source(`src/app/assessment/${name}.tsx`);
  assert.ok(
    route.includes('export default withAuthRequired('),
    name + ' must not be available through a deep link',
  );
}
for (const file of [
  'src/features/discovery/screens/service-family-detail-screen.tsx',
  'src/features/discovery/screens/service-search-results-screen.tsx',
]) {
  assert.ok(source(file).includes('onPress={startAssessment}'), file + ' uses same check');
}

const filter = source('src/features/discovery/components/discover-filter-sheet.tsx');
const choices = source('src/features/discovery/components/discover-filter-choices.tsx');
assert.ok(
  filter.includes('<FilterGroupChoices') &&
    filter.includes('selectedFamily={draft.serviceCode ?? null}'),
);
assert.ok(
  filter.includes('onSelect={chooseService}') && !filter.includes("setStep('families')"),
  'Group expands in place, no second family screen',
);
assert.ok(
  filter.includes(
    'setDraft((current) => ({ ...current, groupCode, serviceCode, priceRange: null }))',
  ),
  'Group and family selection updates filter draft',
);
assert.ok(
  choices.includes('<Accordion') &&
    choices.includes('selectionMode="single"') &&
    choices.includes('isCollapsible'),
  'Groups use an accordion',
);
assert.ok(
  choices.includes('<Accordion.Item key={group.code} value={group.code}>') &&
    choices.includes('<Accordion.Content'),
  'Family options are nested inside selected group',
);
assert.ok(
  choices.includes('<ServiceIcon serviceId={groupIcons[group.code]}') &&
    choices.includes('{group.title}'),
  'Group icon sits next to its title',
);
assert.ok(
  choices.includes('onSelect={(serviceCode) => onSelect(group.code, serviceCode)}'),
  'A chosen service remains tied to its group',
);
assert.ok(
  filter.includes('onPress={apply}') && filter.includes('handleOpenChange(false)'),
  'Apply controls sheet close',
);
console.log('Assessment auth entry/deep links and grouped service accordion contracts passed.');
