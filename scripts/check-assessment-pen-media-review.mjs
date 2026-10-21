import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const errors = [];
const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

const mediaRoute = read('src/app/assessment/media.tsx');
const reviewRoute = read('src/app/assessment/review.tsx');
const media = read('src/features/assessment/screens/assessment-media-screen.tsx');
const imagePreview = read('src/features/assessment/components/assessment-image-preview.tsx');
const review = read('src/features/assessment/screens/assessment-review-screen.tsx');
const session = read('src/features/assessment/state/assessment-session-provider.tsx');
const questions = read('src/features/assessment/screens/assessment-questions-screen.tsx');
const location = read('src/features/assessment/screens/assessment-location-screen.tsx');

assert(
  mediaRoute.includes('AssessmentMediaScreen') && reviewRoute.includes('AssessmentReviewScreen'),
  'The two steps must reuse the existing Expo Router pages',
);
assert(
  media.includes('<IntroArtwork step={0} height={115} />') &&
    media.includes('border-2 border-dashed') &&
    media.includes('أنواع ملفات نتعرّف عليها') &&
    media.includes('لا نطلب منك إجراء أشعة جديدة'),
  'Files step must follow the approved new design, retain real media guidance and safety note',
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
  media.includes('imageAttachments = mediaAttachments.filter(isImage)') &&
    media.includes('<AssessmentImagePreview') &&
    media.includes('activeUri={previewUri}') &&
    media.includes("name={{ ios: 'eye', android: 'visibility', web: 'visibility' }}") &&
    media.includes('onPress={() => setPreviewUri(file.uri)}') &&
    media.includes('removeMediaAttachment(file.uri)'),
  'Selected photo row must include an eye preview next to the existing trash action',
);
assert(
  imagePreview.includes('<Modal') &&
    imagePreview.includes('resizeMode="contain"') &&
    imagePreview.includes('onRequestClose={closePreview}') &&
    imagePreview.includes('move(-1)') &&
    imagePreview.includes('move(1)') &&
    imagePreview.includes('images.findIndex') &&
    imagePreview.includes('images.length'),
  'Photo preview must show the local image at large size and navigate only the selected images',
);
assert(
  questions.includes('<ControlField') &&
    questions.includes('<ControlField.Indicator') &&
    questions.includes('<Checkbox className="h-6 w-6" />') &&
    !questions.includes('<Checkbox\n                key={answer}'),
  'Symptom choices must render a small square HeroUI checkbox in a separate pressable field, not a full-card Checkbox',
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
  review.includes('complaint') &&
    review.includes('selectedTeeth.length') &&
    review.includes('answers.length') &&
    review.includes('healthConfirmed') &&
    review.includes('mediaAttachments.length') &&
    review.includes('who.name') &&
    !review.includes("'ألم ضرس خلفي'") &&
    !review.includes("'حساسية بنسلين'"),
  "Review summary must read actual session data instead of displaying a fixed patient\'s details",
);
assert(
  review.includes('مراجعة الخصوصية') &&
    review.includes('للتوجيه الأولي فقط') &&
    review.includes('موافقة مستقلة عند') &&
    review.includes('primaryDisabled={!complaint || !location || !healthConfirmed}'),
  'Review step must preserve clear privacy scope and prevent unreviewed health steps',
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
  console.log('Assessment files and redesigned review UI/source route checks passed.');
}
