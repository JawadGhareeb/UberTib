import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const read = (path) => readFileSync(path, 'utf8');
const doctor = read('src/features/discovery/screens/provider-decision-screen.tsx');
const branch = read('src/features/discovery/screens/provider-branch-screen.tsx');
const model = read('src/features/discovery/model/provider-branch-view.ts');
const services = read('src/features/discovery/components/provider-branch-services.tsx');
const gallery = read('src/features/discovery/components/provider-photo-gallery.tsx');

assert.ok(doctor.includes('<ProviderAvatar providerId={doctor.id} size={80} />'));
assert.ok(doctor.includes('getMockProviderPriceFact(provider, serviceCode)'));
assert.ok(doctor.includes('getPenDoctorsForService(serviceCode)'));
assert.ok(doctor.includes('service?.title') && doctor.includes('service?.description'));
assert.ok(doctor.includes("pathname: '/discover/provider/[providerId]/reviews'"));
assert.ok(doctor.includes("pathname: '/discover/provider/[providerId]/branch'"));
assert.ok(doctor.includes("fromProfile: '1'"));
assert.ok(doctor.includes("pathname: '/booking/slots'"));
assert.ok(doctor.includes('border-t border-border-subtle bg-surface-default'));
assert.ok(doctor.includes('التقييمات معروضة من بيانات تجريبية'));
assert.ok(doctor.includes('علاجي') && doctor.includes('حالة مؤهلة'));
assert.ok(!doctor.includes('معلومات مهنية موثقة'));
assert.ok(!doctor.includes('شهادة البورد السوري'));
assert.ok(!doctor.includes('علاج الجذور · فرع يوفّر'));

assert.ok(model.includes('provider.branch === current.branch && provider.area === current.area'));
assert.ok(model.includes('doctors.flatMap((provider) => provider.serviceCodes)'));
assert.ok(model.includes('findPenFamily(code)'));
assert.ok(model.includes('singleListedDoctor: doctors.length === 1'));
assert.ok(services.includes("import { Accordion, Chip } from 'heroui-native'"));
assert.ok(services.includes('<Accordion.Item') && services.includes('<Accordion.Trigger'));
assert.ok(services.includes('<Accordion.Indicator') && services.includes('<Accordion.Content'));
assert.ok(services.includes('{family.description}'));
assert.ok(services.includes('<Chip') && services.includes('<Chip.Label>'));
assert.ok(!services.includes('onPress='), 'Equipment chips must remain display-only');
assert.ok(services.includes('تأكيد المتوفر منها مع الفرع'));

assert.ok(branch.includes('getBranchView(providerId)'));
assert.ok(branch.includes('<ProviderPhotoGallery />'));
assert.ok(branch.includes('<ProviderBranchServices branch={branch} />'));
assert.ok(branch.includes('<ProviderBranchEquipment serviceCode={serviceCode} />'));
assert.ok(branch.includes('branch.singleListedDoctor ? (') && branch.includes('<ScreenCard'));
assert.ok(branch.includes('branch.doctors.map((item) =>'));
assert.ok(branch.includes('onPress={() => openDoctor(item.id, itemService)}'));
assert.ok(branch.includes('item.serviceCodes.includes(serviceCode)'));
assert.ok(branch.includes("pathname: '/booking/slots'"));
assert.ok(branch.includes('getPenDoctorsForService(serviceCode)'));
assert.ok(branch.includes('getBranchView(providerId)'));
assert.ok(branch.includes('العنوان التفصيلي والإحداثيات غير متوفرة حالياً'));
assert.ok(branch.includes('www.google.com/maps/search/?api=1'));
assert.ok(!branch.includes('شارع سعد الله الجابري'));
assert.ok(!branch.includes('9:00 ص – 8:00 م'));
assert.ok(branch.includes('border-t border-border-subtle bg-surface-default'));
assert.ok(gallery.includes('صور توضيحية للتصميم، وليست صور هذا الفرع'));
console.log(
  'Doctor and branch profile UI contracts passed: dynamic service, verified navigation, accordion/chips, fixed CTA and safe single-doctor behavior.',
);
