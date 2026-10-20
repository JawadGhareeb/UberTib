import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');
const form = read('src/shared/components/ui/text-field.tsx');
const phone = read('src/shared/components/ui/phone-number-field.tsx');
const auth = read('src/features/auth/screens/profile-setup-screen.tsx');
const back = read('src/shared/components/navigation/auth-back-button.tsx');
const bell = read('src/shared/components/navigation/header-notification-button.tsx');
const shell = read('src/features/profile/components/profile-screen-shell.tsx');
const help = read('src/features/profile/screens/help-support-screen.tsx');
const icon = read('src/shared/components/ui/app-icon.tsx');
const homeBookings = read('src/features/patient-home/components/home-bookings-section.tsx');
const homeCases = read('src/features/patient-home/components/home-cases-section.tsx');
const careScreen = read('src/features/my-care/screens/my-cases-overview-screen.tsx');
const bookingCard = read('src/features/my-care/components/booking-overview-card.tsx');
const caseCard = read('src/features/my-care/components/case-overview-card.tsx');

assert.match(form, /TextField as HeroTextField/);
assert.match(form, /<Input/);
assert.match(form, /focus:border-action-primary/);
assert.match(phone, /TextField as HeroTextField/);
assert.match(phone, /focus:border-action-primary/);
assert.match(auth, /focus:border-action-primary/);
assert.doesNotMatch(form, /<FieldSurface/);
assert.doesNotMatch(phone, /<FieldSurface/);
assert.match(back, /rounded-\[13px\]/);
assert.match(bell, /rounded-\[13px\]/);
assert.match(shell, /max-w-\[430px\] px-4 pb-12 pt-4/);
assert.ok(!help.includes('<SearchField'));
assert.ok(help.indexOf('تحتاج مساعدة إضافية؟') < help.indexOf('السياسات والمعلومات'));
assert.ok(help.indexOf('السياسات والمعلومات') < help.indexOf('الأسئلة الشائعة'));
assert.match(help, /<Accordion\.Item/);

assert.match(icon, /from 'lucide-react-native'/);
assert.match(icon, /const Icon = glyphs\[key\]/);
assert.doesNotMatch(icon, /<SymbolView\s/);

assert.match(homeBookings, /import \{ BookingRow \}/);
assert.match(homeCases, /import \{ CaseRow \}/);
assert.match(homeBookings, /tab: 'bookings'/);
assert.match(homeCases, /tab: 'cases'/);
assert.match(careScreen, /useLocalSearchParams/);
assert.match(careScreen, /requestedTab === 'cases' \|\| requestedTab === 'bookings'/);
assert.match(careScreen, /router\.setParams\(\{ tab: undefined \}\)/);
assert.match(bookingCard, /size=\{27\}/);
assert.ok(bookingCard.indexOf('<StatusIndicator') < bookingCard.indexOf('size={27}'));
assert.ok(
  caseCard.indexOf('<CareCaseStatusBadge') < caseCard.indexOf('المراحل') ||
    caseCard.includes('مراحل مكتملة'),
);
assert.match(caseCard, /المرحلة الحالية/);
assert.ok(caseCard.indexOf('المرحلة الحالية') < caseCard.indexOf('تفاصيل الحالة'));
assert.match(caseCard, /justify-between/);

console.log(
  'Nine UX updates verified: HeroUI forms, back radius, account spacing, help order, universal SVG icons, shared care cards, deep links, booking status/arrow, case badge/stage.',
);
