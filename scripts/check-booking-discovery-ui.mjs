import { existsSync, readFileSync } from 'node:fs';
const checks = [
  ['src/app/booking/reason.tsx', 'BookingVisitReasonScreen'],
  ['src/app/booking/patient.tsx', 'BookingPatientSelectionScreen'],
  ['src/app/booking/[bookingId]/status.tsx', 'BookingStatusScreen'],
  ['src/features/booking/screens/booking-visit-reason-screen.tsx', "'/booking/review'"],
  ['src/features/booking/screens/booking-patient-selection-screen.tsx', "'/booking/reason'"],
  ['src/features/booking/screens/slot-selection-screen.tsx', "'/booking/patient'"],
  ['src/features/booking/screens/booking-review-screen.tsx', 'BookingProviderMiniCard'],
  ['src/features/booking/screens/booking-review-screen.tsx', 'bookingRevalidationSlotUnavailable'],
  ['src/features/booking/screens/booking-status-screen.tsx', "booking.status === 'confirmed'"],
  ['src/features/discovery/screens/provider-decision-screen.tsx', "'/booking/slots'"],
  ['src/features/discovery/screens/provider-branch-screen.tsx', 'ProviderPhotoGallery'],
  ['src/features/discovery/screens/provider-comparison-screen.tsx', 'label="اختر الطبيب"'],
  ['src/features/discovery/screens/provider-reviews-screen.tsx', 'visibleReviews'],
  ['src/features/discovery/screens/service-detail-screen.tsx', 'findPenFamily'],
  ['src/features/discovery/components/provider-photo-gallery.tsx', 'onError={() => setFailed(true)}'],
];
const failures = [];
for(const [filename, token] of checks) {
  if(!existsSync(filename) || !readFileSync(filename,'utf8').includes(token)) {
    failures.push(filename+' missing booking/discovery UI contract: '+token);
  }
}
const reasonScreen = readFileSync('src/features/booking/screens/booking-visit-reason-screen.tsx', 'utf8');
const patientScreen = readFileSync('src/features/booking/screens/booking-patient-selection-screen.tsx', 'utf8');
const slotScreen = readFileSync('src/features/booking/screens/slot-selection-screen.tsx', 'utf8');
const reviewScreen = readFileSync('src/features/booking/screens/booking-review-screen.tsx', 'utf8');
const bookingDraft = readFileSync('src/features/booking/state/booking-draft-provider.tsx', 'utf8');
const bookingLayout = readFileSync('src/app/booking/_layout.tsx', 'utf8');
const mockScenario = readFileSync('src/shared/mock/scenario-provider.tsx', 'utf8');
if (
  !bookingLayout.includes('<BookingDraftProvider>') ||
  !bookingDraft.includes('shareAttachment: boolean') ||
  !reasonScreen.includes('useBookingDraft()') ||
  !reasonScreen.includes('DocumentPicker.getDocumentAsync') ||
  !reasonScreen.includes("'/booking/review'") ||
  !reasonScreen.includes('الملفات المحددة للمشاركة')
) {
  failures.push('Booking reason must preserve local visit note / attachment with the reference RTL UI');
}
if (
  !patientScreen.includes('mockPatientWorld.family.map') ||
  !patientScreen.includes('canBookForPatient') ||
  !patientScreen.includes("'/booking/reason'") ||
  !patientScreen.includes('accessibilityRole="radio"') ||
  !patientScreen.includes('rowClassName')
) {
  failures.push('Booking patient cards must keep RTL alignment, real patient records and booking permissions');
}
if (
  !slotScreen.includes('data={provider.availability}') ||
  !slotScreen.includes('inverted={isRTL}') ||
  !slotScreen.includes('keyExtractor={(day) => day.dateKey}') ||
  !slotScreen.includes('selectedDay?.slots.map') ||
  !slotScreen.includes("'/booking/patient'") ||
  !slotScreen.includes('setSlot(\'\')') ||
  !slotScreen.includes('rowClassName') ||
  !slotScreen.includes('المواعيد المعروضة بيانات تجريبية')
) {
  failures.push('Booking calendar must show only selected provider mock slots, reset stale selection and disclose demo data');
}
if (
  !reviewScreen.includes('useBookingDraft()') ||
  !reviewScreen.includes('patientNote: note.trim()') ||
  !reviewScreen.includes('لن تُرسل الصورة') ||
  !mockScenario.includes('patientNote?: string')
) {
  failures.push('Booking review must retain optional patient note and never claim locally selected photos are uploaded');
}


// The technical journey list is intentionally hidden from all patient booking
// steps. Route guards still enforce slots -> patient -> reason -> review.
if ([slotScreen, patientScreen, reasonScreen, reviewScreen].some((source) =>
      source.includes('BookingJourneySteps') ||
      source.includes('<BookingStepPill') ||
      source.includes('مسار الرحلة'))) {
  failures.push('Booking pages must not show technical journey paths above the patient content');
}
if (
  !slotScreen.includes("pathname: '/booking/patient'") ||
  !patientScreen.includes("pathname: '/booking/reason'") ||
  !reasonScreen.includes("pathname: '/booking/review'") ||
  !reviewScreen.includes('dateKey?: string;')
) {
  failures.push('Booking flow must keep slots -> patient -> reason/attachments -> final review');
}
if (!slotScreen.includes('horizontal') ||
    !slotScreen.includes('inverted={isRTL}') ||
    !slotScreen.includes('getDayName(day.dateKey)') ||
    !slotScreen.includes('setDateKey(day.dateKey)') ||
    !slotScreen.includes("setSlot('')")) {
  failures.push('Arabic booking dates must start from the right and reset the time upon date selection');
}
for (const source of [slotScreen, patientScreen, reasonScreen, reviewScreen]) {
  if (!source.includes('dateKey')) {
    failures.push('Booking step must preserve the exact chosen appointment date');
  }
}
for (const source of [patientScreen, reasonScreen, reviewScreen]) {
  if (!source.includes('canBookForPatient')) {
    failures.push('Booking patient delegation must remain checked after slot selection');
  }
}
if (!patientScreen.includes("selectedDate?.slots.includes(timeLabel ?? '')") ||
    !reasonScreen.includes("selectedDate?.slots.includes(timeLabel ?? '')") ||
    !reviewScreen.includes('slotStillInSnapshot') ||
    !reviewScreen.includes('slotStillInSnapshot) return;') ||
    !reasonScreen.includes('prepareForService') ||
    !reasonScreen.includes('shareAttachment') ||
    !reasonScreen.includes('DocumentPicker.getDocumentAsync')) {
  failures.push('Booking context must retain chosen slot, authorization and existing optional attachments');
}
for (const file of [
  'src/features/discovery/screens/provider-decision-screen.tsx',
  'src/features/discovery/screens/provider-branch-screen.tsx',
  'src/features/discovery/screens/provider-comparison-screen.tsx',
]) {
  const src = readFileSync(file, 'utf8');
  if (!src.includes("pathname: '/booking/slots'") ||
      src.includes("pathname: '/booking/reason'")) {
    failures.push('Provider booking entry must lead to slot selection first: ' + file);
  }
}

const filterDefaults = readFileSync('src/features/discovery/utils/provider-filters.ts', 'utf8');
const doctorResults = readFileSync('src/features/discovery/screens/provider-results-screen.tsx', 'utf8');
const assessmentResult = readFileSync('src/features/assessment/screens/assessment-result-screen.tsx', 'utf8');
const penData = readFileSync('src/features/discovery/presentation/pen-discovery-data.ts', 'utf8');
const discoverySession = readFileSync('src/features/discovery/state/discovery-session-provider.tsx', 'utf8');

if (!/area:\s*false,\s*soonest:\s*false/.test(filterDefaults)) {
  failures.push('Provider discovery must not hide mock doctors by area or outdated dates by default');
}
const doctorEmptyState = readFileSync('src/features/discovery/components/provider-results-empty-state.tsx', 'utf8');
const providerSheet = readFileSync('src/features/discovery/components/discover-filter-sheet.tsx', 'utf8');
if (
  !doctorResults.includes('getPenDoctorsForService(serviceCode)') ||
  !doctorResults.includes('initialAppliedFilters(params)') ||
  !doctorResults.includes('defaultProviderFilters') ||
  !doctorResults.includes('<ProviderResultsEmptyState') ||
  !doctorResults.includes('hasServiceDoctors={!noServiceDoctors}') ||
  !doctorResults.includes('onClearFilters={resetFilters}') ||
  !doctorResults.includes('providerFilters={applied.advanced}') ||
  !doctorResults.includes('onApply={(discovery, advanced, sort) =>') ||
  !doctorResults.includes("params: { serviceCode: 'dental-checkup' }") ||
  !doctorEmptyState.includes('مسح الفلاتر وعرض الأطباء') ||
  !doctorEmptyState.includes('عرض أطباء الفحص العام') ||
  !providerSheet.includes('<ProviderAdvancedFilterOptions')
) {
  failures.push('Provider results must list doctors before filtering and distinguish filtered/no-provider empty states');
}
if (
  !assessmentResult.includes("serviceCode: 'dental-checkup'") ||
  !penData.includes('next: nextIllustrativeSlot(provider)') ||
  !penData.includes('يلزم تحديث المواعيد') ||
  !discoverySession.includes("area: 'كل المناطق'")
) {
  failures.push('Undiagnosed assessment must use checkup providers, and mock dates cannot be shown as current');
}

const bookingStatus = readFileSync('src/features/booking/screens/booking-status-screen.tsx', 'utf8');
const bookingDetail = readFileSync('src/features/booking/screens/booking-detail-screen.tsx', 'utf8');
const alternativeScreen = readFileSync('src/features/booking/screens/alternative-appointment-screen.tsx', 'utf8');

if (
  !bookingStatus.includes("booking.status === 'confirmed'") ||
  !bookingStatus.includes("booking.status === 'pending'") ||
  !bookingStatus.includes('label="قبول الموعد البديل"') ||
  !bookingStatus.includes('label="اختيار موعد آخر"') ||
  !bookingStatus.includes('<ConfirmationDialog') ||
  !bookingStatus.includes('submitBookingAlternativeDecision(booking.id, alternativeDecision)') ||
  !bookingStatus.includes('pendingDecision') ||
  !bookingStatus.includes('getMockBookingForScenario(bookingId, scenario)')
) {
  failures.push('Status page must keep confirmed/pending reference UI and authorize alternative acceptance only through pending scenario state');
}
if (
  !bookingStatus.includes('function calendarDraftUrl(') ||
  !bookingStatus.includes('start.getTime() <= Date.now()') ||
  bookingStatus.includes('20260919T103000') ||
  !bookingStatus.includes('disabled={!calendarUrl}') ||
  !bookingStatus.includes('موقع الموعد')
) {
  failures.push('Confirmed booking reference needs a real dated calendar draft, not a fixed old event or invented travel distance');
}
if (
  !bookingDetail.includes("label={isConfirmed ? 'عرض تأكيد الحجز'") ||
  !bookingDetail.includes("pathname: '/booking/[bookingId]/status'") ||
  !alternativeScreen.includes('<BookingStatusScreen />') ||
  !bookingStatus.includes("pathname: '/booking/reason'") ||
  !bookingStatus.includes('pendingDecision') ||
  !bookingStatus.includes("booking.status === 'pending'") ||
  !bookingStatus.includes('alternativeDecision')
) {
  failures.push('Booking detail must open status screens and alternate booking must not enter confirmed-only reschedule route');
}

const bookingList = readFileSync('src/features/booking/screens/my-bookings-screen.tsx', 'utf8');
const statusTabs = readFileSync('src/features/my-care/components/care-v5-ui.tsx', 'utf8');
const serviceCard = readFileSync('src/features/discovery/components/service-group-card.tsx', 'utf8');
const serviceList = readFileSync('src/features/discovery/screens/service-groups-screen.tsx', 'utf8');

for (const statusName of ['الكل', 'قادمة', 'مكتملة', 'ملغاة']) {
  if (!statusTabs.includes("'" + statusName + "': {")) {
    failures.push('Booking filter needs its own visual status icon: ' + statusName);
  }
}
if (!bookingList.includes('iconPlacement="inline"') ||
    !bookingList.includes('<CareFilterTabs') ||
    !statusTabs.includes('accessibilityRole="tab"') ||
    !statusTabs.includes('defaultCareFilterIcons')) {
  failures.push('Booking filters must use the shared accessible care tab and icon registry');
}
if (!statusTabs.includes("stacked ? 'flex-col gap-0.5' : rowClassName") ||
    !statusTabs.includes("stacked ? 'mt-[8px] min-h-[56px]' : 'mt-[10px] min-h-[44px]'") ||
    !statusTabs.includes("active ? 'border border-border-subtle bg-surface-default'")) {
  failures.push('Shared filter tabs should use the same icon row, compact height and active state');
}
if (serviceCard.includes('min-h-[228px]') ||
    serviceCard.includes('className="flex-1"') ||
    !serviceCard.includes('overflow-hidden rounded-[16px]')) {
  failures.push('Service card must size to actual content rather than leaving blank flex space');
}
if (!bookingList.includes('showBottomNav\n') || !serviceList.includes('showBack\n') ||
    !serviceList.includes('className="mt-2 gap-2"')) {
  failures.push('Use smaller service gaps and avoid invisible bottom-tab whitespace');
}

const providerList = readFileSync('src/features/discovery/screens/provider-results-screen.tsx', 'utf8');
const providerDetail = readFileSync('src/features/discovery/screens/provider-decision-screen.tsx', 'utf8');
const comparisonPage = readFileSync('src/features/discovery/screens/provider-comparison-screen.tsx', 'utf8');
const doctorCardHeader = providerList.slice(
  providerList.indexOf('function DoctorCard({'),
  providerList.indexOf('      <View className={cn(\'gap-2\', rowClassName)}>'),
);
if (
  !doctorCardHeader.includes('rowClassName') ||
  !doctorCardHeader.includes('h-[38px] w-[38px] shrink-0 rounded-full bg-action-subtle') ||
  !doctorCardHeader.includes('doctor.name') ||
  doctorCardHeader.indexOf('h-[38px] w-[38px]') > doctorCardHeader.indexOf('{doctor.name}')
) {
  failures.push('RTL doctor cards must place the illustrated avatar before the doctor name');
}
if (!providerDetail.includes('<ProviderPortrait size={72} uri={doctor.imageUrl} />')) {
  failures.push('Provider detail portrait must use the selected provider image');
}
if (
  providerList.includes('bg-tone-warning-fill p-2.5') ||
  providerList.includes('المقارنة تعرض حقائق ضمن نفس الخدمة فقط') ||
  providerList.includes('خيارات في النموذج') ||
  comparisonPage.includes('لا فائز ولا ترتيب أو توصية تلقائية')
) {
  failures.push('Remove redundant AI/system explanation cards from provider results and comparison');
}
if (
  !providerList.includes("['التقييم', doctor.rating]") ||
  !providerList.includes("['أقرب موعد', doctor.next]") ||
  !providerList.includes("['السعر', doctor.priceShort]") ||
  !providerList.includes('selected.length >= 3') ||
  !providerList.includes('disabled={selected.length < 2}') ||
  !providerList.includes('toggleComparisonProvider(serviceCode, doctor.id)')
) {
  failures.push('Keep compact doctor facts and original two-to-three doctor comparison behaviour');
}

const providerMocks = readFileSync('src/features/discovery/mocks/providers.mock.ts', 'utf8');
const providerPresentation = readFileSync('src/features/discovery/presentation/pen-discovery-data.ts', 'utf8');
const providerSession = readFileSync('src/features/discovery/state/discovery-session-provider.tsx', 'utf8');
for (const token of [
  "name: 'د. ليان يوسف'",
  "name: 'د. كريم حمدان'",
  "name: 'د. ريما الخطيب'",
  "rating: 4.8",
  "reviews: 124",
  "rating: 4.7",
  "reviews: 89",
  "rating: 4.6",
  "reviews: 57",
  "'600–900 ل.س'",
  "'750 ل.س'",
  "'700 ل.س'",
  "'اليوم 12:00'",
  "'الخميس 10:30'",
  "'السبت 09:00'",
]) {
  if (!providerMocks.includes(token)) failures.push('Root-canal reference mock data missing: ' + token);
}
if (
  !providerPresentation.includes('priceShort:') ||
  !providerList.includes('السياق نفسه:') ||
  !providerList.includes('اختر طبيبين أو ثلاثة، الحد الأقصى 3 أطباء.') ||
  !providerList.includes('أطباء محددون {selected.length}') ||
  !providerList.includes('activeTab="الرئيسية"') ||
  !providerSession.includes("comparisonProviderIds: ['provider-layan', 'provider-karim', 'provider-rima']")
) {
  failures.push('Provider shortlist visual/reference data contract missing');
}

// Every clinical service needs its own dental procedure pictogram.
const familyDefinitions = readFileSync('src/features/discovery/presentation/pen-discovery-data.ts', 'utf8');
const dentalIcons = readFileSync('src/features/discovery/components/service-icon.tsx', 'utf8');
const serviceFamilyIds = [...familyDefinitions.matchAll(/\bid:\s*'([a-z][a-z0-9-]*)'/g)]
  .map((match) => match[1]);
const iconList = dentalIcons.slice(
  dentalIcons.indexOf('export const dentalServiceIconIds:'),
  dentalIcons.indexOf('interface ServiceIconProps'),
);
const registeredIcons = [...iconList.matchAll(/'([a-z][a-z0-9-]*)'/g)]
  .map((match) => match[1]);
const serviceIconViews = [
  'src/features/discovery/components/service-family-card.tsx',
  'src/features/discovery/components/service-group-card.tsx',
  'src/features/discovery/components/service-row.tsx',
  'src/features/discovery/screens/service-family-detail-screen.tsx',
  'src/features/discovery/components/service-detail-content.tsx',
];
if (serviceFamilyIds.length !== 26 || new Set(serviceFamilyIds).size !== 26) {
  failures.push('Expected 26 unique dental service IDs across the four catalog families');
}
if (
  registeredIcons.length !== serviceFamilyIds.length ||
  new Set(registeredIcons).size !== registeredIcons.length ||
  serviceFamilyIds.some((id) => !registeredIcons.includes(id)) ||
  registeredIcons.some((id) => !serviceFamilyIds.includes(id))
) {
  failures.push('Every dental family needs exactly one dedicated SVG icon');
}
for (const id of serviceFamilyIds) {
  if (!dentalIcons.includes(`case '${id}':`)) {
    failures.push('Missing procedure-specific SVG illustration for ' + id);
  }
}
if (familyDefinitions.includes("ios: 'square.grid.2x2.fill'") ||
    familyDefinitions.includes('icon: icon(')) {
  failures.push('Do not restore the generic repeated iOS square for service families');
}
for (const filename of serviceIconViews) {
  if (!readFileSync(filename, 'utf8').includes('<ServiceIcon serviceId=')) {
    failures.push('Service UI must show the clinical SVG icon: ' + filename);
  }
}

const providerPriceFixtures = readFileSync('src/features/discovery/mocks/providers.mock.ts', 'utf8');
const catalogPriceFixtures = readFileSync('src/features/discovery/mocks/catalog.mock.ts', 'utf8');
const bookingPriceFixtures = readFileSync('src/features/booking/mocks/bookings.mock.ts', 'utf8');
for (const token of [
  "'1,250 ل.س'", "'1,900 ل.س'", "'2,250–2,600 ل.س'",
  "'600–900 ل.س'", "'750 ل.س'", "'700 ل.س'",
  "'4,750 ل.س'",
]) {
  if (!providerPriceFixtures.includes(token)) {
    failures.push('Reduced provider demo price missing: ' + token);
  }
}
for (const token of [
  "'ابتداءً من 1,150 ل.س'", "'ابتداءً من 1,750 ل.س'",
  "'ابتداءً من 2,250 ل.س'", "'ابتداءً من 600 ل.س'",
  "'ابتداءً من 4,750 ل.س'",
]) {
  if (!catalogPriceFixtures.includes(token)) {
    failures.push('Catalog demo price should match provider offers: ' + token);
  }
}
for (const token of ["priceLabel: '1,250 ل.س'", "priceLabel: '1,750 ل.س'"]) {
  if (!bookingPriceFixtures.includes(token)) {
    failures.push('Booking fixture must match the selected provider price: ' + token);
  }
}

const serviceDetail = readFileSync('src/features/discovery/screens/service-detail-screen.tsx', 'utf8');
const branchDetail = readFileSync('src/features/discovery/screens/provider-branch-screen.tsx', 'utf8');
const branchGallery = readFileSync('src/features/discovery/components/provider-photo-gallery.tsx', 'utf8');
const sharedHeader = readFileSync('src/features/discovery/components/pen-discovery-ui.tsx', 'utf8');
const mockProviders = readFileSync('src/features/discovery/mocks/providers.mock.ts', 'utf8');
const serviceDetailContent = readFileSync(
  'src/features/discovery/components/service-detail-content.tsx',
  'utf8',
);
const serviceDetailCopy = readFileSync(
  'src/features/discovery/presentation/service-detail-copy.ts',
  'utf8',
);
const assessmentEntry = readFileSync(
  'src/shared/components/assessment/assessment-entry-card.tsx',
  'utf8',
);
for (const token of [
  '<ServiceDetailContent',
  '<AssessmentEntryCard />',
  'ابحث عن طبيب مؤهّل',
  'params: { serviceCode: family.id }',
]) {
  if (!serviceDetail.includes(token)) failures.push('Unified service detail missing: ' + token);
}
for (const token of ['العلاج الأولي لقنوات الجذر', "family.id === 'root-canal'"]) {
  if (!serviceDetailCopy.includes(token)) failures.push('Service detail content missing: ' + token);
}
if (
  !serviceDetailContent.includes('<ServiceIcon') ||
  !serviceDetailContent.includes('التشخيص والخطة النهائية مسؤولية الطبيب') ||
  !assessmentEntry.includes('مو متأكد من حالتك؟') ||
  serviceDetail.includes('showFavoriteAction') ||
  serviceDetail.includes('نطاق 600–900 ل.س')
) {
  failures.push('Service details must share one template and preserve clinical caution');
}
for (const token of [
  'ProviderPhotoGallery',
  'شارع سعد الله الجابري · جانب ساحة الجميلية',
  'تصوير موضعي رقمي',
  'تجهيزات علاج الجذور',
  'تعقيم ومتابعة',
  'مصعد ومدخل',
  '021-221-4488',
  '8:00–9:00',
  "pathname: '/booking/slots'",
]) {
  if (!branchDetail.includes(token)) failures.push('Branch reference parity: ' + token);
}
if (!branchGallery.includes('compact ? 0 : 2') ||
    !branchGallery.includes('.filter((photo) => photo.index !== active)')) {
  failures.push('Branch gallery should show reception as main photo and exactly two thumbnails');
}
if (!sharedHeader.includes('showFavoriteAction')) failures.push('Service header missing favorite action');
if (!mockProviders.includes("branch: 'مركز نور الأسنان'") ||
    !mockProviders.includes("area: 'الجميلية'")) {
  failures.push('Doctor and branch pages must share the same reference mock identity');
}

const status = readFileSync('src/features/booking/screens/booking-status-screen.tsx','utf8');
const bookingReview = readFileSync('src/features/booking/screens/booking-review-screen.tsx', 'utf8');
const bookingAlternative = readFileSync('src/features/booking/screens/alternative-appointment-screen.tsx', 'utf8');
const bookingShell = readFileSync('src/features/booking/components/booking-v5-ui.tsx', 'utf8');
const bookingSession = readFileSync('src/shared/mock/scenario-provider.tsx', 'utf8');
for (const token of [
  'راجع ما سيصل إلى الطبيب',
  'تحكّم واضح بالمشاركة',
  'shareVisitSummary',
  'sharingConsent:',
  'photos: false',
  'medicalHistory: false',
  'BookingProviderMiniCard',
  'label="إرسال طلب الحجز"',
  'bookingRevalidationSlotUnavailable',
]) {
  if (!bookingReview.includes(token)) failures.push('Booking review UI/consent contract missing ' + token);
}
if (!bookingSession.includes('sharingConsent?:') ||
    !bookingSession.includes("status: 'pending'")) {
  failures.push('Review consent may only be saved as a pending session mock, not confirmed on tap');
}
if (!bookingAlternative.includes('<BookingStatusScreen />') ||
    bookingAlternative.includes('BookingHeader') ||
    bookingAlternative.includes('setDecisionToConfirm')) {
  failures.push('Alternative route must reuse the same reference booking-status screen');
}
for (const token of [
  'بانتظار رد العيادة',
  'موعد بديل مؤهل لنفس الخدمة',
  "setAlternativeDecision('accept')",
  "setAlternativeDecision('decline')",
  "pathname: '/booking/reason'",
  'submitBookingAlternativeDecision(booking.id, alternativeDecision)',
  '<ConfirmationDialog',
]) {
  if (!status.includes(token)) failures.push('Alternative decision shared status-screen parity missing ' + token);
}
for (const token of [
  'قبل الزيارة',
  'BookingChecklistItem',
  'BookingProviderMiniCard',
  'إضافة إلى التقويم',
  'Linking.openURL(calendarUrl)',
  "booking.status === 'confirmed'",
  'hasAlternative',
  'mockAlternativeAppointment.proposedDateLabel',
]) {
  if (!status.includes(token)) failures.push('Booking confirmed/pending UI missing ' + token);
}
if (!bookingShell.includes('leadingIcon') ||
    !bookingShell.includes('صورة توضيحية للعيادة')) {
  failures.push('Booking screens must use a shared header and clearly disclosed illustrative imagery');
}

if(status.includes('setSubmitted(true)') || !status.includes('getMockBookingForScenario')) {
  failures.push('Status screen must derive confirmation from booking state rather than a submit tap');
}
const theme=JSON.parse(readFileSync('src/shared/theme/tokens.json','utf8'));
if(theme.brand.mark!=='#00977E') failures.push('Do not change brand Primary from #00977E');
if(failures.length){process.stderr.write(failures.join('\n')+'\n');process.exitCode=1;}
else process.stdout.write('Booking and discovery static UI contracts found.\n');
