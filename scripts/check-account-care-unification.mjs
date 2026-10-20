import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (p) => readFileSync(p, 'utf8');
function collect(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
    const path = join(dir, item.name);
    return item.isDirectory() ? collect(path) : /\.[jt]sx?$/.test(item.name) ? [path] : [];
  });
}
const icon = read('src/shared/components/ui/app-icon.tsx');
const icons = new Set(
  [...icon.matchAll(/^\s*(?:"([^"]+)"|([a-z]\w*)): [A-Z][A-Za-z0-9]*,/gm)].map((m) => m[1] ?? m[2]),
);
const used = new Set();
for (const path of collect('src')) {
  const source = read(path);
  for (const match of source.matchAll(/\bweb:\s*['"]([^'"]+)['"]/g)) {
    // Every structured AppIcon web alias maps to one platform-independent SVG.
    if (/\.tsx$/.test(path) && path !== 'src/shared/components/ui/app-icon.tsx') {
      used.add(match[1]);
    }
  }
}
const uncovered = [...used].filter((k) => !icons.has(k));
assert.deepEqual(uncovered, [], 'Unmapped shared SVG icon aliases');
assert.ok(icon.includes("from 'lucide-react-native'"));
assert.ok(!icon.includes('Platform.OS ==='));
assert.ok(!icon.includes('<SymbolView'));
const field = read('src/shared/components/ui/text-field.tsx');
const phone = read('src/shared/components/ui/phone-number-field.tsx');
for (const f of [field, phone]) {
  assert.ok(f.includes("from 'heroui-native'"));
  assert.ok(f.includes('focus:border-action-primary'));
  assert.ok(f.includes('border-border-default'));
  assert.ok(!f.includes('FieldSurface'));
}
assert.ok(read('src/shared/components/navigation/auth-back-button.tsx').includes('rounded-[13px]'));
const support = read('src/features/profile/screens/help-support-screen.tsx');
assert.ok(!support.includes('<SearchField'));
assert.ok(support.indexOf('تحتاج مساعدة إضافية؟') < support.indexOf('الأسئلة الشائعة'));
assert.ok(support.indexOf('السياسات والمعلومات') < support.indexOf('الأسئلة الشائعة'));
const caseCard = read('src/features/my-care/components/case-overview-card.tsx');
const bookingCard = read('src/features/my-care/components/booking-overview-card.tsx');
assert.ok(caseCard.includes('items-center justify-between'));
assert.ok(caseCard.indexOf('<CareCaseStatusBadge') < caseCard.indexOf('المرحلة الحالية'));
assert.ok(caseCard.indexOf('المرحلة الحالية') < caseCard.indexOf('تفاصيل الحالة'));
assert.ok(bookingCard.includes('size={27}'));
assert.ok(bookingCard.indexOf('item.statusLabel') < bookingCard.indexOf('item.dateLabel'));
const homeBookings = read('src/features/patient-home/components/home-bookings-section.tsx');
const homeCases = read('src/features/patient-home/components/home-cases-section.tsx');
assert.ok(homeBookings.includes('<BookingRow'));
assert.ok(homeCases.includes('<CaseRow'));
assert.ok(homeBookings.includes("tab: 'bookings'"));
assert.ok(homeCases.includes("tab: 'cases'"));
const screen = read('src/features/my-care/screens/my-cases-overview-screen.tsx');
assert.ok(screen.includes('requestedTab') && screen.includes('router.setParams'));
console.log('9 requested UX consistency changes validated; all shared icon aliases use SVG.');
