import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const redundantCopy = [
  ['src/features/booking/screens/my-bookings-screen.tsx', 'الخطة العلاجية وسجل الأدلة والماليات تظهر ضمن'],
  ['src/features/booking/screens/booking-detail-screen.tsx', 'الخطة العلاجية وسجل الدفع لا يُربطان بالحجز'],
  ['src/features/booking/screens/slot-selection-screen.tsx', 'اختيار الوقت لا يثبّت الموعد'],
  ['src/features/my-care/screens/case-timeline-screen.tsx', 'التقييم والخطة والدفعات والمشكلات تظهر ضمن سجل واحد'],
  ['src/features/my-care/screens/claims-screen.tsx', 'يراجعها شخص مختص، وتظهر المهلة والقرار'],
  ['src/features/discovery/screens/provider-reviews-screen.tsx', 'الأبعاد تلخّص ما ذكره المرضى للتحليل'],
  ['src/features/discovery/screens/provider-search-screen.tsx', 'لا نعرض درجات علمية داخلية'],
  ['src/features/discovery/screens/service-family-detail-screen.tsx', 'هذه عائلة خدمة للتوجيه'],
  ['src/features/discovery/screens/service-group-detail-screen.tsx', 'تُعرض العائلات المتاحة من الكتالوج'],
  ['src/features/discovery/screens/service-groups-screen.tsx', 'الخدمات المعروضة وأعدادها قابلة للتحديث'],
  ['src/features/discovery/screens/provider-branch-screen.tsx', 'الصور للتعريف بالمكان فقط'],
  ['src/features/discovery/screens/service-search-results-screen.tsx', 'نتائج من عائلات الخدمات الموجّهة'],
  ['src/features/profile/screens/data-export-request-screen.tsx', 'ستظهر حالات التحميل أو تعذّر الإنشاء'],
  ['src/features/profile/screens/active-patient-context-screen.tsx', 'التبديل لا يمنح صلاحية'],
  ['src/features/profile/screens/help-support-screen.tsx', 'الدعم عبر التذاكر داخل أوبرطب؛ لا محادثة مباشرة'],
  ['src/features/profile/screens/profile-screen.tsx', 'إدارة الحساب والأمان والموافقات وحقوق البيانات من مكان واحد'],
  ['src/features/assessment/screens/assessment-manual-review-screen.tsx', 'لا ترتيب أطباء ولا تشخيص نهائي في هذه الحالة'],
  ['src/features/assessment/screens/assessment-health-screen.tsx', 'تحديث الملف الصحي الأصلي إجراء منفصل وواضح'],
  ['src/features/assessment/screens/assessment-questions-screen.tsx', 'ليش عم نسأل؟'],
];

const errors = [];
for (const [file, phrase] of redundantCopy) {
  if (read(file).includes(phrase)) errors.push(file + ': redundant patient explanation returned');
}

// Removing decorative copy must not remove navigation, financial state,
// consent requirements, or the actions patients need.
const booking = read('src/features/booking/screens/my-bookings-screen.tsx');
const timeline = read('src/features/my-care/screens/case-timeline-screen.tsx');
const claims = read('src/features/my-care/screens/claims-screen.tsx');
const support = read('src/features/profile/screens/help-support-screen.tsx');
const patientHealth = read('src/features/assessment/screens/assessment-health-screen.tsx');
const account = read('src/features/profile/screens/data-export-request-screen.tsx');
const medicalGuidance = read('src/features/discovery/screens/service-detail-screen.tsx');

if (!booking.includes("pathname: '/booking/[bookingId]'")) errors.push('Booking details route missing');
if (!timeline.includes("pathname: '/care/[caseId]/plan'")) errors.push('Care plan route missing');
if (!claims.includes('label={type === \'refund\'')) errors.push('Complaint action missing');
if (!support.includes('إنشاء طلب دعم')) errors.push('Support action missing');
if (!patientHealth.includes("router.push('/profile/health')")) errors.push('Health edit action missing');
if (!account.includes('<ProfileReferenceNotice')) errors.push('Data-export status notice missing');
if (!medicalGuidance.includes('التشخيص والخطة النهائية مسؤولية الطبيب')) {
  errors.push('Essential clinical warning removed');
}

if (errors.length) {
  process.stderr.write(errors.join('\n') + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('19 redundant patient notes removed; essential actions and warnings preserved.\n');
}
