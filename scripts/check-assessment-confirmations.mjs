import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const issues = [];
const ensure = (ok, detail) => { if (!ok) issues.push(detail); };

const scaffold = read('src/features/assessment/components/assessment-scaffold.tsx');
const manualReview = read('src/features/assessment/screens/assessment-manual-review-screen.tsx');
const needsMoreInfo = read('src/features/assessment/screens/assessment-needs-more-info-screen.tsx');
const assessmentSession = read('src/features/assessment/state/assessment-session-provider.tsx');
ensure(
  manualReview.includes('rowClassName') &&
    manualReview.includes("backIcon={{ ios: 'arrow.right'") &&
    manualReview.includes('مراجعة بشرية بخطوة واضحة') &&
    manualReview.includes("serviceCode: 'dental-checkup'") &&
    manualReview.includes('<ConfirmationDialog') &&
    manualReview.includes('setManualReviewDrafted(true)') &&
    assessmentSession.includes('manualReviewDrafted: boolean') &&
    !manualReview.includes("router.replace('/(tabs)/home')"),
  'Manual review screen must keep Pen RTL composition and never fake a sent clinical request',
);
ensure(
  needsMoreInfo.includes('rowClassName') &&
    needsMoreInfo.includes("backIcon={{ ios: 'arrow.right'") &&
    needsMoreInfo.includes('معلومة صغيرة تساعدنا نكمل') &&
    needsMoreInfo.includes('setRegionLocation(selected)') &&
    needsMoreInfo.includes("router.replace('/assessment/processing')") &&
    needsMoreInfo.includes("outcome: 'manual-review'") &&
    needsMoreInfo.includes("serviceCode: 'dental-checkup'") &&
    !needsMoreInfo.includes("router.replace('/assessment/result')"),
  'Missing-info screen must retain its answer and re-evaluate safely',
);

const tooth = read('src/shared/components/ui/tooth-svg.tsx');
const health = read('src/features/assessment/screens/assessment-health-screen.tsx');
const ordered = (source, first, second) =>
  source.indexOf(first) !== -1 && source.indexOf(second) !== -1 &&
  source.indexOf(first) < source.indexOf(second);
ensure(
  health.includes('rowClassName') &&
    health.includes("backIcon={{ ios: 'arrow.right'") &&
    ordered(health, "label: 'حالة صحية مهمة'", "label: 'الأدوية الحالية'") &&
    ordered(health, "label: 'الأدوية الحالية'", "label: 'الحساسيات'") &&
    ordered(health, "label: 'تاج خزفي'", "label: 'علاج جذور سابق'") &&
    ordered(health, "label: 'أشعة سابقة'", "label: 'آخر زيارة'") &&
    ordered(health, 'label="لا تغييرات"', 'label="تحديث المعلومات"') &&
    health.includes("router.push('/profile/health')") &&
    health.includes("router.push('/assessment/media')"),
  'Health confirmation must preserve reference RTL icon/card order and correct actions',
);

const arches = read('src/features/assessment/components/dental-arch-selector.tsx');
const mixed = read('src/features/assessment/components/mixed-tooth-target.tsx');
const dialog = read('src/shared/components/ui/confirmation-dialog.tsx');
const assessmentMedia = read('src/features/assessment/screens/assessment-media-screen.tsx');
const mediaSourceDialog = read('src/features/assessment/components/media-source-dialog.tsx');

ensure(assessmentMedia.includes('<MediaSourceDialog') &&
  assessmentMedia.includes('onPress={openMediaSource}') &&
  assessmentMedia.includes('onSelect={selectMediaSource}') &&
  assessmentMedia.includes("source === 'files'") &&
  assessmentMedia.includes("pickImage(source === 'camera')") &&
  assessmentMedia.includes('sourceLaunching') &&
  assessmentMedia.includes('mediaAttachments.length >= MAX_ATTACHMENTS'),
  'Assessment media must use our source dialog for camera, gallery and files while enforcing limits');
ensure(mediaSourceDialog.includes('<Modal') &&
  mediaSourceDialog.includes('onRequestClose={onClose}') &&
  mediaSourceDialog.includes("id: 'camera'") &&
  mediaSourceDialog.includes("id: 'gallery'") &&
  mediaSourceDialog.includes("id: 'files'") &&
  mediaSourceDialog.includes('accessibilityRole="button"') &&
  mediaSourceDialog.includes('colors.surface.default') &&
  mediaSourceDialog.includes('Math.max(insets.bottom, 16)'),
  'Photo selection must use a theme-aware RTL modal with all three source actions and dismissal');

const pathMirror = read('src/shared/utils/mirror-tooth-path.ts');

ensure(pathMirror.includes('export function mirrorToothPath') &&
  pathMirror.includes("if (command === 'M')") &&
  pathMirror.includes('coordinateIndex % 2'),
  'Tooth path mirror must transform both axes around the SVG center with no renderer-dependent origin');

ensure(scaffold.includes('rowReverseClassName') &&
  scaffold.includes('min-w-0 flex-1 items-end') &&
  scaffold.includes('align="right"') &&
  scaffold.includes("ios: 'arrow.left'") &&
  !scaffold.includes("ios: 'arrow.right'"),
  'Assessment steps header must keep title on Arabic right and back icon opposite');
ensure(tooth.includes('mirrorToothPath(shapes.molar)') &&
  tooth.includes('lowerPrimaryShapes') &&
  tooth.includes('lower ? lowerShapes[kind]') &&
  !tooth.includes('transform={lower ?'),
  'Lower permanent/primary tooth paths must be pre-mirrored so contours cannot be clipped by SVG transforms');
ensure(arches.includes('paddingBottom: lower ? toothOffset') &&
  arches.includes('paddingTop: !lower ? toothOffset') &&
  !arches.includes('return lower\n'),
  'Upper and lower dental arches must use one mirrored curvature profile');
ensure(mixed.includes('mirrorToothPath(mixedPaths.molar)') &&
  mixed.includes('d={lower ? mixedLowerPaths[shape] : mixedPaths[shape]}') &&
  !mixed.includes('transform={lower ?'),
  'Mixed-dentition lower silhouettes must be fully pre-mirrored instead of relying on SVG rotation');
ensure(dialog.includes('<Modal') &&
  dialog.includes('loading?: boolean') &&
  dialog.includes('onRequestClose={() => { if (!loading) onCancel(); }}') &&
  dialog.includes('variant="outline"') &&
  dialog.includes('rowClassName'),
  'Shared confirmation must be a dismissible RTL modal with loading protection');

const requiredDialogScreens = [
  'src/features/profile/screens/account-security-screen.tsx',
  'src/features/profile/screens/privacy-consents-screen.tsx',
  'src/features/profile/screens/consent-detail-screen.tsx',
  'src/features/profile/screens/grant-detail-screen.tsx',
  'src/features/profile/screens/account-closure-request-screen.tsx',
  'src/features/my-care/screens/plan-acceptance-screen.tsx',
  'src/features/my-care/screens/financial-timeline-screen.tsx',
  'src/features/my-care/screens/refund-request-screen.tsx',
  'src/features/booking/screens/cancel-booking-screen.tsx',
  'src/features/booking/screens/alternative-appointment-screen.tsx',
  'src/features/booking/screens/reschedule-booking-screen.tsx',
  'src/features/my-care/screens/report-external-payment-screen.tsx',
  'src/features/my-care/screens/report-refund-execution-screen.tsx',
  'src/features/profile/screens/create-grant-screen.tsx',
];
for (const file of requiredDialogScreens) {
  const source = read(file);
  ensure(source.includes('<ConfirmationDialog'),
    file + ' must use a real confirmation modal');
  ensure(!source.includes('<SensitiveConfirmation'),
    file + ' must not insert its confirmation panel into scrolling content');
}

const security = read(requiredDialogScreens[0]);
ensure(!security.includes('متابعة تجريبية') &&
  security.includes("setPendingAction(null)") &&
  security.includes("loading={submitting}"),
  'Security confirmations must not expand the page or allow duplicate submissions');

const payment = read('src/features/my-care/screens/financial-timeline-screen.tsx');
const refund = read('src/features/my-care/screens/refund-request-screen.tsx');
ensure(payment.includes('setConfirmingCheck(true)') &&
  payment.includes("submitFinancialEventResponse('financial-event-002'"),
  'Payment verification must confirm the same pending external payment');
ensure(refund.includes('setConfirmingReceipt(true)') &&
  refund.includes("submitFinancialEventResponse(\n              'refund-execution-case-001'"),
  'Refund confirmation must only acknowledge the matching external receipt');

if (issues.length) {
  process.stderr.write(issues.join('\n') + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('Assessment header, mirrored teeth and 14 contextual confirmation modals verified.\n');
}
