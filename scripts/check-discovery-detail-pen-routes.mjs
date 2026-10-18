import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const problems = [];
const ensure = (test, message) => { if (!test) problems.push(message); };

const group = read('src/features/discovery/screens/service-group-detail-screen.tsx');
const search = read('src/features/discovery/screens/service-search-results-screen.tsx');
const service = read('src/features/discovery/screens/service-detail-screen.tsx');
const results = read('src/features/discovery/screens/provider-results-screen.tsx');
const doctor = read('src/features/discovery/screens/provider-decision-screen.tsx');
const branch = read('src/features/discovery/screens/provider-branch-screen.tsx');
const reviews = read('src/features/discovery/screens/provider-reviews-screen.tsx');
const family = read('src/features/discovery/screens/service-family-detail-screen.tsx');
const gallery = read('src/features/discovery/components/provider-photo-gallery.tsx');
const serviceRoute = read('src/app/discover/service/[serviceCode].tsx');
const branchRoute = read('src/app/discover/provider/[providerId]/branch.tsx');
const reviewRoute = read('src/app/discover/provider/[providerId]/reviews.tsx');

for (const [name, source] of [['service group', group], ['search results', search]]) {
  ensure(source.includes("pathname: '/discover/service/[serviceCode]'") &&
    source.includes('serviceCode: family.id') &&
    !source.includes("pathname: '/discover/family/[familyCode]'"),
    name + ' should open service details directly, without an extra family step');
}
ensure(serviceRoute.includes('ServiceDetailScreen') && branchRoute.includes('ProviderBranchScreen'),
  'Both detail routes must exist');
ensure(service.includes("findPenFamily(serviceCode)") &&
  service.includes('if (!isRootCanal)') &&
  service.includes('ليش ممكن تبحث عنها؟') &&
  service.includes('ServiceIcon serviceId={family.id}') &&
  service.includes('rootCanalNotes') &&
  service.includes('serviceSteps') &&
  service.includes('showFavoriteAction'),
  'Service details should use Pen compact/general and rich/root-canal variants');
ensure(service.includes("pathname: '/discover/providers/results'") &&
  service.includes('params: { serviceCode: family.id }') &&
  service.includes('params: { serviceCode }'),
  'Service CTA must preserve the chosen service');
ensure(!results.includes('تفاصيل خدمة {serviceTitle}') &&
  !results.includes("pathname: '/discover/service/[serviceCode]'") &&
  doctor.includes("pathname: '/discover/service/[serviceCode]'") &&
  doctor.includes("pathname: '/discover/provider/[providerId]/branch'") &&
  doctor.includes('providerId: doctor.id, serviceCode'),
  'Suitable doctors must hide the extra service-details button; doctor and branch routes stay available');
ensure(branch.includes('findPenFamily(serviceCode)') &&
  branch.includes("pathname: '/discover/service/[serviceCode]'") &&
  branch.includes('params: { serviceCode }') &&
  branch.includes('تفاصيل الخدمة') &&
  branch.includes("pathname: '/booking/reason'") &&
  branch.includes('providerId: doctor.id, serviceCode'),
  'Branch must link back to the same service and forward the correct doctor to booking');
ensure(reviewRoute.includes('ProviderReviewsScreen') &&
  reviews.includes('ScoreStars rating={provider.rating}') &&
  reviews.includes('rounded-[15px]') &&
  reviews.includes('Progress compact label="الشرح"') &&
  reviews.includes('Progress compact label="الالتزام"') &&
  reviews.includes('Progress compact label="التواصل"') &&
  reviews.includes("(['الخدمة نفسها', 'مع تعليق', 'الأحدث'] as const)") &&
  reviews.includes("review.rating >= minRating") &&
  reviews.includes('onPress={() => setFilter(item)}'),
  'Provider ratings must match compact reference cards and keep useful working filters');
ensure(branch.includes('عرض موقع الفرع على الخريطة') &&
  branch.includes('فتح خريطة فرع') &&
  branch.includes('Linking.openURL') &&
  branch.includes('https://www.google.com/maps/search/?api=1&query=') &&
  branch.includes('encodeURIComponent(locationQuery)') &&
  branch.includes('موقع بحث حسب اسم الفرع') &&
  !branch.includes('lat: 0') &&
  !branch.includes('longitude: 0'),
  'Branch map actions must open the named branch search with no fabricated coordinates');
ensure(gallery.includes('ProviderPhotoGallery') &&
  gallery.includes('صور توضيحية للتصميم، وليست صور هذا الفرع') &&
  gallery.includes('setPreviewOpen(true)'),
  'The Pen photo gallery should remain interactive and clearly labeled as demo imagery');
ensure(service.includes('السعر النهائي والتفاصيل تُراجع مع الطبيب') &&
  !service.includes('نطاق 600–900 ل.س'),
  'Never describe an unverified placeholder price as a current price');

if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Service detail → doctors → branch → booking navigation contracts checked.');
}
