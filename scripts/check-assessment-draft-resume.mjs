import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const read = (p) => readFileSync(p, 'utf8');
const js = ts.transpileModule(read('src/features/assessment/utils/assessment-draft.ts'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const mod = { exports: {} };
new Function('module', 'exports', 'require', js)(mod, mod.exports, () => {
  throw new Error('Unexpected runtime dependency');
});
const { buildAssessmentDraft, isAssessmentDraftRoute } = mod.exports;
const steps = [
  'start',
  'patient',
  'complaint',
  'location',
  'questions',
  'health',
  'media',
  'review',
  'needs-more-info',
  'manual-review',
];
const sample = {
  patient: 'adam',
  complaint: 'ألم في سن أو ضرس',
  details: 'مع المضغ',
  location: 'علوي أيمن',
  selectedTeeth: ['11', '12'],
  dentitionMode: 'permanent',
  answers: ['مع الساخن'],
  healthConfirmed: true,
  manualReviewDrafted: false,
  attachmentNames: ['scan.dcm'],
  selectedMediaType: 'أشعة بانورامية',
  needsMoreInfoChoice: 'يمين علوي',
  healthNotes: [{ id: 'note-1', type: 'allergy', description: 'حساسية من البروفين' }],
};
for (const step of steps) {
  const route = '/assessment/' + step;
  assert.ok(isAssessmentDraftRoute(route), 'Recognize ' + route);
  const draft = buildAssessmentDraft(route, sample);
  assert.equal(draft.route, route, 'Exact resume path preserved');
  assert.equal(draft.id, 'assessment-adam');
  assert.deepEqual(draft.assessment, sample, 'All step inputs preserved');
  assert.ok(draft.title && draft.detail);
}
assert.equal(isAssessmentDraftRoute('/assessment/processing'), false);
assert.equal(isAssessmentDraftRoute('/assessment/result'), false);
const layout = read('src/app/assessment/_layout.tsx');
const bridge = read('src/features/assessment/components/assessment-draft-bridge.tsx');
const scaffold = read('src/features/assessment/components/assessment-scaffold.tsx');
const button = read('src/features/assessment/components/assessment-save-later-action.tsx');
const store = read('src/features/my-care/state/care-draft-provider.tsx');
const care = read('src/features/my-care/screens/my-cases-overview-screen.tsx');
const session = read('src/features/assessment/state/assessment-session-provider.tsx');
const media = read('src/features/assessment/screens/assessment-media-screen.tsx');
const health = read('src/features/profile/state/health-notes-provider.tsx');
assert.ok(layout.includes('<AssessmentDraftBridge>'), 'Stack wrapped by restore gate');
assert.ok(
  bridge.includes('resumeDraftId') && bridge.includes('restoreSnapshot(saved.assessment)'),
  'Restoration before rendering',
);
assert.ok(
  bridge.includes('void saveDraft(buildAssessmentDraft(pathname'),
  'Automatic per-step persistence',
);
assert.ok(bridge.includes('saveNote(saved.assessment!.patient, note)'), 'Health notes restoration');
assert.ok(scaffold.includes('<AssessmentSaveLaterAction'), 'Shared footer on assessment steps');
assert.ok(
  button.includes('await saveDraft') && button.includes('إكمال الحجز لاحقاً'),
  'Save for later action',
);
assert.ok(
  store.includes('assessment?: AssessmentSavedFields') && care.includes('resumeDraftId: draft.id'),
  'Draft record and resume route',
);
assert.ok(
  session.includes('setMediaAttachments([])') && session.includes('attachmentNames:'),
  'No temporary file URIs are restored',
);
assert.ok(media.includes('unavailableAttachmentNames.join'), 'Show reselect notification');
assert.ok(health.includes('EMPTY_NOTES'), 'Stable empty list avoids resave render loops');
process.stdout.write('Assisted assessment 10-step saving/resume contract passed.\n');
