import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const errors = [];
const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

const mediaRoute = read('src/app/assessment/media.tsx');
const reviewRoute = read('src/app/assessment/review.tsx');
const media = read('src/features/assessment/screens/assessment-media-screen.tsx');
const review = read('src/features/assessment/screens/assessment-review-screen.tsx');
const session = read('src/features/assessment/state/assessment-session-provider.tsx');
const questions = read('src/features/assessment/screens/assessment-questions-screen.tsx');
const location = read('src/features/assessment/screens/assessment-location-screen.tsx');

assert(
  mediaRoute.includes('AssessmentMediaScreen') && reviewRoute.includes('AssessmentReviewScreen'),
  'The two steps must reuse the existing Expo Router pages',
);
assert(
  media.includes('FocusGuide') &&
    media.includes('QualityExample') &&
    media.includes('صور المنطقة المتأثرة') &&
    media.includes('أنواع ملفات نتعرّف عليها') &&
    media.includes('لا نطلب منك إجراء أشعة جديدة'),
  'Files step must preserve the Pen photo guide, quality tips, media-type grid and warning',
);
assert(
  media.includes('launchImageLibraryAsync') &&
    media.includes('launchCameraAsync') &&
    media.includes('getDocumentAsync') &&
    media.includes('multiple: true') &&
    media.includes('MAX_FILE_BYTES') &&
    media.includes('MAX_ATTACHMENTS'),
  'Files step must support real optional photo/camera/document picking and bounds',
);
assert(
  media.includes('removeMediaAttachment(file.uri)') &&
    media.includes('mediaAttachments.map') &&
    media.includes("router.push('/assessment/review')"),
  'Selected files must be previewable/removable and continue to review',
);
assert(
  session.includes('mediaAttachments: AssessmentMediaAttachment[]') &&
    session.includes('addMediaAttachments:') &&
    session.includes('removeMediaAttachment:') &&
    session.includes('setMediaAttachments([])') &&
    session.includes('mediaAttachment: mediaAttachments[0] ?? null'),
  'Assessment session must preserve multiple selected files and backwards compatibility',
);
assert(
  review.includes('issueSummary') &&
    review.includes('healthSummary') &&
    review.includes('mediaAttachments.length') &&
    review.includes('patientName') &&
    !review.includes("'ألم ضرس خلفي'") &&
    !review.includes("'حساسية بنسلين'"),
  "Review summary must read actual session data instead of displaying a fixed patient\'s details",
);
assert(
  review.includes('كل معلومة في مكانها') &&
    review.includes('ما سيُحلَّل الآن') &&
    review.includes('ما سيُشارك لاحقاً فقط') &&
    review.includes('التقييم الأولي ليس تشخيصاً نهائياً.') &&
    review.includes('primaryLabel="أوافق وأبدأ التقييم"'),
  'Review step must preserve Pen consent hierarchy and patient-safe copy',
);
assert(
  review.includes("params: { returnTo: 'review' }") &&
    media.includes("returnTo === 'review'") &&
    questions.includes("returnTo === 'review'") &&
    location.includes("returnTo === 'review'") &&
    media.includes('router.canGoBack()') &&
    questions.includes('router.canGoBack()') &&
    location.includes('router.canGoBack()'),
  'Review edit actions must return to the existing review screen without stacking duplicates',
);
assert(
  media.includes('لم تُرفع إلى الخادم'),
  'Session-only attachments must not claim successful backend upload',
);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Assessment files and review UI/source route checks passed.');
}
