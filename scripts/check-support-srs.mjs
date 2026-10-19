import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');
const home = read('src/features/profile/screens/help-support-screen.tsx');
const form = read('src/features/profile/screens/create-support-ticket-screen.tsx');
const list = read('src/features/profile/screens/support-ticket-list-screen.tsx');
const detail = read('src/features/profile/screens/support-ticket-detail-screen.tsx');
const policies = read('src/features/profile/screens/support-policies-screen.tsx');
const provider = read('src/features/profile/state/support-tickets-provider.tsx');
const appProviders = read('src/providers/app-providers.tsx');

assert.match(home, /import \{ Accordion \} from 'heroui-native'/);
assert.match(home, /<Accordion\.Trigger/);
assert.match(home, /<Accordion\.Content/);
assert.match(home, /<SearchField/);
assert.match(home, /router\.push\('\/support\/policies'\)/);
assert.match(home, /router\.push\('\/support\/tickets'\)/);
assert.ok(!home.includes('<Modal'), 'The main help page must not open an unexpected case modal');
assert.match(form, /<TextField\s+label="عنوان الطلب"/);
assert.match(form, /<TextField\s+label="تفاصيل الطلب"/);
assert.match(form, /saveLocalTicket\(/);
assert.match(form, /pathname: '\/care\/\[caseId\]\/claims'/);
assert.match(form, /issue: type === 'care' \? 'treatment' : type/);
assert.match(form, /disabled=\{!caseId\}/);
assert.ok(!form.includes('<Modal'), 'Treatment case selection must stay inline');
assert.match(provider, /status: 'local-only'/);
assert.match(appProviders, /<SupportTicketsProvider>/);
assert.match(list, /router\.push\(\{\s*pathname: '\/support\/tickets\/\[ticketId\]'/);
assert.match(detail, /غير محدد/);
assert.match(detail, /ما تم رفع الملفات/);
assert.match(policies, /النسخة المعتمدة من السياسة/);
assert.match(policies, /غير متاحين بالبيانات التجريبية/);
for (const route of ['new.tsx', 'tickets.tsx', 'tickets/[ticketId].tsx', 'policies.tsx']) {
  assert.ok(fs.existsSync('src/app/support/' + route), 'Missing support route: ' + route);
}
console.log(
  'SRS support regression passed: HeroUI FAQ, help search, policies, local tickets, claims routing and SLA honesty.',
);
