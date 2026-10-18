import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const issues = [];
const check = (condition, message) => { if (!condition) issues.push(message); };

const health = read('src/features/profile/screens/patient-health-information-screen.tsx');
const family = read('src/features/profile/screens/family-representation-screen.tsx');
const account = read('src/features/profile/screens/profile-screen.tsx');
const support = read('src/features/profile/screens/help-support-screen.tsx');
const settings = read('src/features/profile/screens/settings-screen.tsx');
const reference = read('src/features/profile/components/patient-reference-ui.tsx');

check(reference.includes('function ReferenceHeader') &&
  reference.includes('router.canGoBack()') &&
  reference.includes('flex-row-reverse'),
  'All four reference screens need the shared RTL header and safe back navigation');

for (const title of [
  'الحساسيات', 'الأدوية الحالية', 'الحالات الهامة والنشطة',
  'العمليات والإجراءات السابقة', 'التيجان والجسور والزراعات وعلاج الجذور والأطقم',
  'إصابات أو رضوض الأسنان', 'الصور والسجلات السابقة',
]) {
  check(health.includes(title), 'Health Pen accordion missing: ' + title);
}
check(health.includes("['allergy', 'dental', 'media']"),
  'Health must open allergy, dental and previous records from reference by default');
check(health.includes('نطاق المشاركة في الحجز القادم') &&
  health.includes('النسخة المستخدمة في التقييم'),
  'Health must show consent scope and snapshot warning');
check(health.includes('مسودة محلية') &&
  health.includes('لا تُرسل إلى طبيب أو عيادة'),
  'Health edit cannot claim a mock note was sent to a backend');

check(family.includes('getMockGrantsForScenario') &&
  family.includes('GrantFact') &&
  family.includes('عرض الدليل والنطاق') &&
  family.includes('إلغاء التفويض'),
  'Family must show scoped grant details with case-by-case revocation');
check(family.includes("router.push('/profile/grants/new')") &&
  family.includes("router.push('/profile/dependents/new')"),
  'The single family CTA must preserve both approved create routes');

for (const route of [
  '/profile/security', '/profile/privacy', '/profile/data',
  '/profile/account-closure', '/profile/settings',
]) {
  check(account.includes("router.push('" + route + "')"),
    'Account Pen card/navigation missing: ' + route);
}
check(account.includes('حسابي') && account.includes('المظهر') &&
  !account.includes('title="العائلة والتمثيل"'),
  'Account top-level UI must be compact and match the four Pen menu cards');
check(account.includes("router.push('/profile/health')") &&
  health.includes('onAction={() => setEditing(true)}') &&
  reference.includes('onPress={onAction}'),
  'Health needs a direct account entry and an actionable edit control in the header');
check(settings.includes("router.push('/profile/family')") &&
  settings.includes("router.push('/profile/health')") &&
  settings.includes("router.push('/support')"),
  'Health/family/support must remain reachable via settings');
check(account.includes('onPress={() => setAppearanceOpen(true)}') &&
  account.includes('visible={appearanceOpen}') &&
  account.includes('setScheme(option.value)') &&
  account.includes('setAppearanceOpen(false)') &&
  account.includes("scheme === option.value") &&
  account.includes('فاتح (Light)') &&
  account.includes('داكن (Dark)'),
  'Account appearance must open local Light/Dark selection, save it immediately and never navigate away');


for (const label of [
  'طلب استرداد', 'شكوى عن الرعاية', 'مطالبة عند وجود استحقاق', 'اعتراض على دفعة',
  'تذكرة نشطة', 'إضافة إيصال', 'عرض السياسة المطبقة', 'السياسات والنسخ السابقة',
  'إنشاء طلب دعم',
]) {
  check(support.includes(label), 'Support reference item missing: ' + label);
}
check(support.includes('getMockCareCaseForScenario') &&
  !support.includes("caseId: 'case-001'") &&
  support.includes('disabled={item.requiresEligibility === true}'),
  'Support must require the correct case and backend eligibility');
check(support.includes('launchImageLibraryAsync') &&
  support.includes('لم يتم الرفع إلى السيرفر') &&
  support.includes('label="إرسال الطلب" disabled'),
  'Receipt and ticket must not fake successful network submission');

check(account.includes('accessibilityLabel="المساعدة والدعم"') &&
  account.includes("router.push('/support')") &&
  account.includes('accessibilityLabel="فتح معلوماتي الصحية"') &&
  settings.includes("router.push('/support')"),
  'Support must be reachable directly from Account and remain in Settings without duplicating the health shortcut');
check(support.includes('ticketStages.map') &&
  support.includes('index < 2') &&
  support.includes('setHistoryOpen((open) => !open)') &&
  support.includes('accessibilityState={{ expanded: historyOpen }}') &&
  support.includes('مثال توضيحي · ليس تذكرة مرسلة') &&
  support.includes('لا توجد نسخ موثّقة ضمن المعاينة الحالية'),
  'Support Pen needs connected RTL ticket steps, expandable policy history and an honest local-demo state');
check(reference.includes("info ? 'bg-tone-info-fill'") &&
  support.includes("info={item.id === 'payment'}"),
  'Payment dispute should keep the blue reference icon, other support cards the approved semantic tones');

if (issues.length) {
  process.stderr.write(issues.join('\n') + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('Four Pen profile, family, health and support layout contracts checked.\n');
}
