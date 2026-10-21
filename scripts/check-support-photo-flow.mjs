import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const support = read('src/features/profile/screens/create-support-ticket-screen.tsx');
const dialog = read('src/shared/components/media/media-source-dialog.tsx');
const picker = read('src/shared/components/media/media-picker.ts');
const preview = read('src/features/assessment/components/assessment-image-preview.tsx');
assert.ok(support.includes('<MediaSourceDialog') && support.includes('allowFiles={false}'), 'Ticket photos must use the same camera/gallery dialog as profile media');
assert.ok(dialog.includes("key: 'camera'") && dialog.includes("key: 'gallery'"), 'Sources offer camera and gallery');
assert.ok(support.includes('pickMediaFromDevice(source') && picker.includes('launchImageLibraryAsync') && picker.includes('requestCameraPermissionsAsync'), 'Picker reuses camera permission and gallery handling');
assert.ok(support.includes('launchTimer.current = setTimeout(') && support.includes('setSourceDialogOpen(false)'), 'Dismiss modal before native picker to avoid Android/iOS overlay races');
assert.ok(support.includes('MAX_SUPPORT_IMAGES = 3') && support.includes('MAX_IMAGE_BYTES = 25 * 1024 * 1024'), 'Enforce attachment count and file size');
assert.ok(support.includes('useState<SelectedMediaFile[]>([])') && support.includes('uri: file.uri') && support.includes('key={file.uri}'), 'Maintain real local image URIs for thumbnails');
assert.ok(support.includes('<AssessmentImagePreview') && preview.includes('resizeMode="contain"'), 'Photo preview reuses shared preview');
assert.ok(support.includes('item.uri !== file.uri'), 'User can remove chosen images');
assert.ok(support.includes('evidenceNames: evidence.map((file) => file.fileName)'), 'Mock saves file names only and never claims uploads');
console.log('Support ticket photos share camera/gallery selection, preview and removal, with mock-only metadata persistence.');
