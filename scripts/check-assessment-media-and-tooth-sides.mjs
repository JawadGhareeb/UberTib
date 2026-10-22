import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

function loadTs(file, modules = {}) {
  const output = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', 'require', output)(module, module.exports, (name) => {
    if (!(name in modules)) throw new Error('Unexpected module import: ' + name);
    return modules[name];
  });
  return module.exports;
}
const geo = loadTs('src/features/assessment/utils/dental-arch-geometry.ts');
const names = loadTs('src/features/assessment/state/assessment-session-provider.tsx', {
  react: {
    createContext: () => ({}),
    useContext: () => ({}),
    useMemo: () => ({}),
    useState: () => ({}),
  },
  'react/jsx-runtime': { jsx: () => ({}), jsxs: () => ({}) },
});
for (const [arch, expectedStart, expectedEnd, jaw] of [
  [geo.PERMANENT_UPPER, '28', '18', 'علوي'],
  [geo.PERMANENT_LOWER, '38', '48', 'سفلي'],
  [geo.PRIMARY_UPPER, '65', '55', 'علوي'],
  [geo.PRIMARY_LOWER, '75', '85', 'سفلي'],
]) {
  const points = geo.dentalArchPoints(arch, 340, jaw === 'سفلي');
  assert.equal(points[0].code, expectedStart);
  assert.equal(points.at(-1).code, expectedEnd);
  assert.ok(points[0].x < 170 && points.at(-1).x > 170, 'geometry is left-to-right');
  assert.ok(
    names.readableToothId(points[0].code).includes('أيسر'),
    'Left-side tooth must say left',
  );
  assert.ok(
    names.readableToothId(points.at(-1).code).includes('أيمن'),
    'Right-side tooth must say right',
  );
  assert.ok(names.readableToothId(points[0].code).includes(jaw));
}
assert.ok(names.readableToothId('mixed-lower-10').includes('الأيمن'));
assert.ok(names.readableToothId('mixed-upper-1').includes('الأيسر'));
const chart = readFileSync('src/features/assessment/components/dental-arch-selector.tsx', 'utf8');
assert.ok(chart.includes('absolute bottom-3 left-3') && chart.includes('يسارك'));
assert.ok(chart.includes('absolute bottom-3 right-3') && chart.includes('يمينك'));
const policy = loadTs('src/features/assessment/utils/assessment-media-file-policy.ts');
const valid = (category, name, mime) =>
  policy.validateAttachmentCategory({ fileName: name, mimeType: mime }, category);
assert.ok(valid('فيديو للحالة', 'recording.MOV', 'video/quicktime'));
assert.ok(valid('فيديو للحالة', 'case.mp4', 'video/mp4'));
assert.ok(valid('فيديو للحالة', 'movie.webm', 'video/webm'));
assert.equal(valid('فيديو للحالة', 'scan.pdf', 'application/pdf'), false);
assert.equal(valid('فيديو للحالة', 'photo.jpg', 'image/jpeg'), false);
assert.equal(valid('فيديو للحالة', 'movie.mp4', 'image/jpeg'), false);
assert.equal(valid('فيديو للحالة', 'movie.mp4', 'video/x-matroska'), false);
assert.equal(valid('صورة داخل الفم', 'photo.jpg', 'image/gif'), false);
assert.ok(valid('صورة داخل الفم', 'tooth.jpeg', 'image/jpeg'));
assert.equal(valid('صورة داخل الفم', 'video.mov', 'video/quicktime'), false);
assert.ok(valid('أشعة بانورامية', 'scan.dcm', 'application/dicom'));
assert.ok(valid('أشعة بانورامية', 'scan.dcm', 'application/octet-stream'));
assert.ok(valid('أشعة بانورامية', 'scan.pdf', 'application/pdf'));
assert.equal(valid('أشعة بانورامية', 'teeth.stl', 'model/stl'), false);
assert.ok(valid('تصوير ثلاثي الأبعاد CBCT', 'dicom.zip', 'application/zip'));
assert.equal(valid('تصوير ثلاثي الأبعاد CBCT', 'photo.jpg', 'image/jpeg'), false);
assert.ok(valid('مسح أسنان ثلاثي الأبعاد', 'model.stl', 'application/octet-stream'));
assert.ok(valid('مسح أسنان ثلاثي الأبعاد', 'model.ply', 'application/x-ply'));
assert.equal(
  valid(
    'مسح أسنان ثلاثي الأبعاد',
    'report.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ),
  false,
);
assert.ok(
  valid(
    'تقرير طبي',
    'record.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ),
);
assert.equal(valid('تقرير طبي', 'clip.mp4', 'video/mp4'), false);
assert.equal(valid('إحالة طبية', 'film.mp4', 'video/mp4'), false);
assert.equal(
  valid('فيديو للحالة', 'case.pdf', 'video/mp4'),
  false,
  'Reject false extension even with video MIME',
);
assert.equal(valid('فيديو للحالة', 'case.exe', 'video/mp4'), false);
assert.equal(valid('فيديو للحالة', '', undefined), false);
assert.ok(
  valid('فيديو للحالة', '', 'video/mp4'),
  'A name-less device asset can be checked by known MIME',
);
assert.equal(valid('unknown', 'scan.pdf', 'application/pdf'), false);
assert.deepEqual(policy.documentPickerMimes('فيديو للحالة'), ['video/*']);
const screen = readFileSync('src/features/assessment/screens/assessment-media-screen.tsx', 'utf8');
assert.ok(
  screen.includes("mediaTypes: video ? ['videos'] : ['images']"),
  'Picker only exposes matching gallery type',
);
assert.ok(
  screen.includes('validateAttachmentCategory(file, category)'),
  'Upload must validate selected category',
);
assert.ok(screen.includes('allowedSources='), 'Limit file sources by selected category');
assert.ok(
  !screen.includes("type: '*/*'"),
  'Picker should be restricted where format filters are reliable',
);
const session = readFileSync(
  'src/features/assessment/state/assessment-session-provider.tsx',
  'utf8',
);
assert.ok(session.includes('setSelectedMediaType(saved.selectedMediaType ?? null)'));
const restore = session.slice(
  session.indexOf('restoreSnapshot: (saved)'),
  session.indexOf('      patient,', session.indexOf('restoreSnapshot: (saved)')),
);
assert.equal(
  restore.split('setSelectedMediaType(null)').length,
  1,
  'Do not erase restored file category',
);
process.stdout.write('Assessment file category validation and tooth side mapping passed.\n');
