import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const read = (path) => readFileSync(path, 'utf8');
const palette = JSON.parse(read('src/shared/theme/tokens.json'));
assert.equal(palette.brand.mark, '#00977E');
for (const [mode, scheme, tint] of [
  ['light', palette.color, '#E5F3EE'],
  ['dark', palette.darkColor, '#173B35'],
]) {
  assert.equal(scheme.action.primary, '#00977E', mode + ' primary');
  assert.equal(scheme.action.primaryActive, '#00836E', mode + ' pressed');
  assert.equal(scheme.action.subtle, tint, mode + ' icon/card background');
  assert.equal(scheme.state.selected, tint, mode + ' selected surface');
  assert.equal(scheme.text.onAction, '#FFFFFF', mode + ' action label');
}
const css = read('src/shared/theme/uniwind-theme.css');
assert.ok(css.includes('--action-subtle: #E5F3EE;') && css.includes('--action-subtle: #173B35;'));

function allFiles(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    return entry.isDirectory() ? allFiles(path) : /\.tsx$/.test(entry.name) ? [path] : [];
  });
}
for (const path of allFiles('src/features')) {
  const source = read(path);
  assert.ok(!/تجريبي|تجريبية|نسخة Mock/.test(source), path + ' exposes demo-only wording');
}

const privacy = read('src/features/profile/state/profile-privacy-provider.tsx');
const exportScreen = read('src/features/profile/screens/data-export-request-screen.tsx');
assert.ok(privacy.includes("requestDataExport: () => setDataExportStatus('ready')"), 'Export request must not hang indefinitely');
assert.ok(exportScreen.includes('Share.share(') && exportScreen.includes('onPress={() => void shareSnapshot()}'), 'Local data export must offer a functional native share sheet');
assert.ok(exportScreen.includes('البيانات المتاحة داخل التطبيق'), 'Do not claim a full server-side export');
assert.ok(exportScreen.includes('supportRequests: tickets.map('), 'Include actual support state rather than a dummy download');
const support = read('src/features/profile/screens/create-support-ticket-screen.tsx');
assert.ok(support.includes('saveLocalTicket(') && support.includes('evidenceNames: evidence.map('), 'Existing local support flow must remain actionable');
const booking = read('src/features/booking/screens/booking-review-screen.tsx');
assert.ok(booking.includes('submitBookingRequest('), 'Existing booking request flow must remain wired');
console.log('UberTib palette, user-facing copy, data sharing and existing local actions pass.');
